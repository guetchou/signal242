import { cn } from '@/lib/cn';

export interface SpectrumBarsProps {
  /** Amplitudes normalisées [0, 1], des graves vers les aigus. */
  spectrum: readonly number[];
  active: boolean;
  className?: string;
}

/**
 * Analyseur spectral.
 *
 * Visualisation d'état, non de mesure : elle atteste que le micro capte
 * réellement quelque chose. Les valeurs chiffrées sont portées par le cadran
 * et les indicateurs voisins, jamais lues sur ces barres.
 */
export function SpectrumBars({ spectrum, active, className }: SpectrumBarsProps) {
  return (
    <div
      className={cn('flex h-full items-end gap-[3px]', className)}
      role="img"
      aria-label={active ? 'Analyse spectrale en cours' : 'Analyse spectrale à l’arrêt'}
    >
      {spectrum.map((amplitude, index) => {
        const height = Math.max(amplitude * 100, 2);
        // Dégradé grave -> aigu : repère de lecture, non un codage de valeur.
        const ratio = index / Math.max(spectrum.length - 1, 1);
        return (
          <span
            key={index}
            className="flex-1 rounded-t-[3px] transition-[height] duration-100 ease-out"
            style={{
              height: `${height}%`,
              background: active
                ? `linear-gradient(to top, var(--series-4), ${ratio > 0.62 ? 'var(--series-5)' : 'var(--series-1)'})`
                : 'var(--chart-grid)',
              opacity: active ? 0.55 + amplitude * 0.45 : 1,
            }}
          />
        );
      })}
    </div>
  );
}
