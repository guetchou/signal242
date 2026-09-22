/**
 * Adaptateur de capture sonore fondé sur le Web Audio API.
 *
 * Responsabilité unique : obtenir le flux microphone, en extraire des trames
 * analysables et déléguer *tout* le calcul acoustique au domaine. Aucune
 * formule de décibel ne doit apparaître ici.
 */

import {
  aWeightedLevelDb,
  dbfsToSpl,
  equivalentLevel,
  percentileLevel,
  rmsToDbfs,
  rootMeanSquare,
} from '@/domain/noise/acoustics';
import type { NoiseFrame, NoiseMeterPort } from '@/domain/ports';

const FFT_SIZE = 4096;
const FRAME_INTERVAL_MS = 100;
const SPECTRUM_BANDS = 32;
const CALIBRATION_STORAGE_KEY = 'signal242.noise.calibration';

/** Réduit le spectre brut en bandes logarithmiques prêtes à visualiser. */
function reduceSpectrum(magnitudes: Float32Array, bands: number): number[] {
  const output: number[] = [];
  const binCount = magnitudes.length;
  for (let band = 0; band < bands; band += 1) {
    // Répartition logarithmique : reflète la perception, pas le tableau FFT.
    const start = Math.floor(binCount ** (band / bands)) - 1;
    const end = Math.max(Math.floor(binCount ** ((band + 1) / bands)), start + 1);
    let peak = 0;
    for (let bin = Math.max(start, 0); bin < Math.min(end, binCount); bin += 1) {
      peak = Math.max(peak, magnitudes[bin] ?? 0);
    }
    output.push(Math.min(peak, 1));
  }
  return output;
}

export class WebAudioNoiseMeter implements NoiseMeterPort {
  private context: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private levels: number[] = [];
  private startedAt = 0;
  private offsetDb: number;

  constructor() {
    this.offsetDb = readStoredOffset();
  }

  isCalibrated(): boolean {
    return this.offsetDb !== 0;
  }

  setCalibrationOffset(offsetDb: number): void {
    this.offsetDb = offsetDb;
    try {
      localStorage.setItem(CALIBRATION_STORAGE_KEY, String(offsetDb));
    } catch {
      // Stockage indisponible (navigation privée) : l'étalonnage reste en session.
    }
  }

  async start(onFrame: (frame: NoiseFrame) => void): Promise<void> {
    this.stop();

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        // Tout traitement automatique fausserait la mesure : on le désactive.
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    const context = new AudioContext();
    this.context = context;
    const source = context.createMediaStreamSource(this.stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.2;
    source.connect(analyser);

    const timeDomain = new Float32Array(analyser.fftSize);
    const frequencyDb = new Float32Array(analyser.frequencyBinCount);
    const magnitudes = new Float32Array(analyser.frequencyBinCount);

    this.levels = [];
    this.startedAt = performance.now();

    this.timer = setInterval(() => {
      analyser.getFloatTimeDomainData(timeDomain);
      analyser.getFloatFrequencyData(frequencyDb);

      for (let bin = 0; bin < frequencyDb.length; bin += 1) {
        magnitudes[bin] = 10 ** ((frequencyDb[bin] ?? -120) / 20);
      }

      // Le niveau large bande sert de référence énergétique ; la pondération A
      // corrige ensuite la répartition spectrale.
      const broadband = rmsToDbfs(rootMeanSquare(timeDomain));
      const weighted = aWeightedLevelDb(magnitudes, context.sampleRate);
      const instantDb = dbfsToSpl(broadband + (weighted - broadband) * 0.85, this.offsetDb);

      this.levels.push(instantDb);
      if (this.levels.length > 6000) this.levels.shift();

      onFrame({
        instantDb,
        laeq: equivalentLevel(this.levels),
        lmax: Math.max(...this.levels),
        l90: percentileLevel(this.levels, 90),
        elapsedS: (performance.now() - this.startedAt) / 1000,
        spectrum: reduceSpectrum(magnitudes, SPECTRUM_BANDS),
      });
    }, FRAME_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    void this.context?.close();
    this.context = null;
  }
}

function readStoredOffset(): number {
  try {
    const raw = localStorage.getItem(CALIBRATION_STORAGE_KEY);
    const parsed = raw === null ? Number.NaN : Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}
