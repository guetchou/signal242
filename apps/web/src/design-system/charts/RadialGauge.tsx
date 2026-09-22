import { useId } from 'react';
import { cn } from '@/lib/cn';

export interface RadialGaugeProps {
  /** Valeur mesurée, exprimée dans l'unité affichée. */
  value: number;
  min: number;
  max: number;
  /** Seuil de déclenchement, matérialisé par un repère sur l'arc. */
  threshold?: number;
  unit: string;
  caption: string;
  color?: string;
  className?: string;
}

const START_ANGLE = 135;
const SWEEP = 270;

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, radius: number, fromDeg: number, toDeg: number): string {
  const start = polar(cx, cy, radius, fromDeg);
  const end = polar(cx, cy, radius, toDeg);
  const largeArc = toDeg - fromDeg > 180 ? 1 : 0;
  return `M${start.x.toFixed(2)},${start.y.toFixed(2)} A${radius},${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
}

/**
 * Cadran radial pour une mesure unique en temps réel.
 *
 * Forme réservée au cas « une valeur, une échelle bornée, un seuil » : le
 * sonomètre. Pour une comparaison entre entités, une barre reste supérieure.
 */
export function RadialGauge({
  value,
  min,
  max,
  threshold,
  unit,
  caption,
  color = 'var(--series-1)',
  className,
}: RadialGaugeProps) {
  const gradientId = useId();
  const size = 220;
  const center = size / 2;
  const radius = 88;

  const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const valueAngle = START_ANGLE + ratio * SWEEP;
  // À valeur nulle, l'arc dégénère en pastille colorée flottante : on n'affiche
  // rien plutôt qu'une marque que l'utilisateur prendrait pour une mesure.
  const hasValue = ratio > 0.001;

  return (
    <div className={cn('relative', className)}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label={`${caption} : ${value.toFixed(1)} ${unit}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--series-4)" />
            <stop offset="55%" stopColor={color} />
            <stop offset="100%" stopColor="var(--series-5)" />
          </linearGradient>
        </defs>

        <path
          d={arcPath(center, center, radius, START_ANGLE, START_ANGLE + SWEEP)}
          fill="none"
          stroke="var(--chart-grid)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {hasValue && (
          <path
            d={arcPath(center, center, radius, START_ANGLE, valueAngle)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="14"
            strokeLinecap="round"
            className="transition-[d] duration-200"
          />
        )}

        {threshold !== undefined && (
          <g>
            {(() => {
              const thresholdRatio = Math.min(Math.max((threshold - min) / (max - min), 0), 1);
              const angle = START_ANGLE + thresholdRatio * SWEEP;
              const inner = polar(center, center, radius - 13, angle);
              const outer = polar(center, center, radius + 13, angle);
              return (
                <line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="var(--chart-axis)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              );
            })()}
          </g>
        )}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'numeric text-5xl font-bold tracking-tighter',
            hasValue ? 'text-primary' : 'text-faint',
          )}
        >
          {value.toFixed(1)}
        </span>
        <span className="mt-0.5 font-mono text-xs uppercase tracking-[0.2em] text-muted">{unit}</span>
        <span className="mt-2 max-w-[8rem] text-center text-[11px] leading-tight text-faint">{caption}</span>
      </div>
    </div>
  );
}
