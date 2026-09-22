import { useCallback, useEffect, useRef, useState } from 'react';
import { useServices } from '@/app/providers/ServicesProvider';
import type { NoiseFrame, NoiseMeterPort } from '@/domain/ports';

export type MeterStatus = 'idle' | 'requesting' | 'running' | 'denied' | 'stopped';

export interface UseNoiseMeterOptions {
  /** 'simulated' force la démonstration ; 'live' tente le microphone réel. */
  mode: 'live' | 'simulated';
  /** Arrêt automatique après cette durée, en secondes. */
  maxDurationS?: number;
}

const EMPTY_FRAME: NoiseFrame = {
  instantDb: 0,
  laeq: 0,
  lmax: 0,
  l90: 0,
  elapsedS: 0,
  spectrum: Array.from({ length: 32 }, () => 0),
};

/**
 * Pilotage du cycle de vie d'une mesure acoustique.
 *
 * Seul point de contact entre React et le port sonomètre : les composants
 * n'ont ni à gérer la permission microphone, ni à nettoyer le flux audio.
 * En cas de refus, la mesure bascule automatiquement en mode simulé afin que
 * le parcours ne se bloque jamais sur une permission.
 */
export function useNoiseMeter({ mode, maxDurationS }: UseNoiseMeterOptions) {
  const { createNoiseMeter } = useServices();
  const meterRef = useRef<NoiseMeterPort | null>(null);
  const [status, setStatus] = useState<MeterStatus>('idle');
  const [frame, setFrame] = useState<NoiseFrame>(EMPTY_FRAME);
  const [fallback, setFallback] = useState(false);

  const stop = useCallback(() => {
    meterRef.current?.stop();
    meterRef.current = null;
    setStatus((current) => (current === 'running' ? 'stopped' : current));
  }, []);

  const start = useCallback(async () => {
    stop();
    setFrame(EMPTY_FRAME);
    setFallback(false);
    setStatus('requesting');

    const attach = async (target: 'live' | 'simulated') => {
      const meter = createNoiseMeter(target);
      meterRef.current = meter;
      await meter.start(setFrame);
      setStatus('running');
    };

    try {
      await attach(mode);
    } catch {
      // Permission refusée ou microphone indisponible : la démonstration continue.
      setFallback(true);
      try {
        await attach('simulated');
      } catch {
        setStatus('denied');
      }
    }
  }, [createNoiseMeter, mode, stop]);

  // Arrêt automatique en fin de fenêtre de mesure.
  useEffect(() => {
    if (status !== 'running' || !maxDurationS) return;
    if (frame.elapsedS >= maxDurationS) stop();
  }, [frame.elapsedS, maxDurationS, status, stop]);

  // Libération du microphone au démontage : une fuite laisserait la LED allumée.
  useEffect(() => () => meterRef.current?.stop(), []);

  const calibrate = useCallback((offsetDb: number) => {
    meterRef.current?.setCalibrationOffset(offsetDb);
  }, []);

  return { status, frame, fallback, start, stop, calibrate };
}
