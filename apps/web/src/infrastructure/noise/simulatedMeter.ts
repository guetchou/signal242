/**
 * Sonomètre simulé.
 *
 * Utilisé lorsque le microphone est indisponible ou refusé : la démonstration
 * commerciale reste opérante et l'interface conserve un comportement complet.
 * Le signal produit imite une scène urbaine nocturne (fond stable, émergences
 * musicales périodiques).
 */

import { equivalentLevel, percentileLevel } from '@/domain/noise/acoustics';
import type { NoiseFrame, NoiseMeterPort } from '@/domain/ports';

const FRAME_INTERVAL_MS = 100;
const SPECTRUM_BANDS = 32;

export class SimulatedNoiseMeter implements NoiseMeterPort {
  private timer: ReturnType<typeof setInterval> | null = null;
  private levels: number[] = [];
  private tick = 0;
  private offsetDb = 0;

  isCalibrated(): boolean {
    return false;
  }

  setCalibrationOffset(offsetDb: number): void {
    this.offsetDb = offsetDb;
  }

  async start(onFrame: (frame: NoiseFrame) => void): Promise<void> {
    this.stop();
    this.levels = [];
    this.tick = 0;

    this.timer = setInterval(() => {
      this.tick += 1;
      const t = this.tick / 10;
      const background = 47;
      const musicalPulse = 14 * Math.abs(Math.sin(t * 1.9)) ** 1.5;
      const crowd = 6 * Math.sin(t * 0.37);
      const jitter = (Math.random() - 0.5) * 3.5;
      const instantDb = background + musicalPulse + crowd + jitter + this.offsetDb;

      this.levels.push(instantDb);
      if (this.levels.length > 6000) this.levels.shift();

      const spectrum = Array.from({ length: SPECTRUM_BANDS }, (_, band) => {
        const lowEnd = Math.exp(-band / 7);
        const beat = 0.55 + 0.45 * Math.sin(t * 2.1 + band / 3);
        return Math.min(lowEnd * beat + Math.random() * 0.12, 1);
      });

      onFrame({
        instantDb,
        laeq: equivalentLevel(this.levels),
        lmax: Math.max(...this.levels),
        l90: percentileLevel(this.levels, 90),
        elapsedS: this.tick / 10,
        spectrum,
      });
    }, FRAME_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
