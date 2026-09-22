import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Sparkline } from './charts';

export interface StatProps {
  label: string;
  value: string;
  unit?: string;
  /** Variation relative sur la période, ex. -0.12 pour -12 %. */
  delta?: number;
  /** Sens de lecture : une baisse des délais est une bonne nouvelle. */
  deltaPolarity?: 'higher-is-better' | 'lower-is-better';
  trend?: readonly number[];
  trendColor?: string;
  hint?: string;
  className?: string;
}

/**
 * Tuile d'indicateur.
 *
 * La valeur est le héros : typographie chiffrée large et tabulaire. La courbe
 * n'est qu'un indice de direction, jamais une source de lecture précise.
 */
export function Stat({
  label,
  value,
  unit,
  delta,
  deltaPolarity = 'higher-is-better',
  trend,
  trendColor = 'var(--series-1)',
  hint,
  className,
}: StatProps) {
  const improving =
    delta === undefined || delta === 0
      ? null
      : deltaPolarity === 'higher-is-better'
        ? delta > 0
        : delta < 0;

  const DeltaIcon = delta === undefined || delta === 0 ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{label}</p>

      <div className="flex items-end justify-between gap-3">
        <p className="flex items-baseline gap-1.5">
          <span className="numeric text-[2rem] font-bold leading-none text-primary sm:text-[2.35rem]">
            {value}
          </span>
          {unit && <span className="text-sm font-medium text-muted">{unit}</span>}
        </p>
        {trend && trend.length > 1 && (
          <Sparkline
            values={trend}
            color={trendColor}
            className="h-8 w-24 shrink-0"
            label={`Tendance de ${label}`}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
              improving === null && 'surface-raised text-muted',
              improving === true && 'bg-signal-400/12 text-[var(--tone-signal-text)]',
              improving === false && 'bg-alert-400/12 text-[var(--tone-alert-text)]',
            )}
          >
            <DeltaIcon className="size-3" aria-hidden />
            {new Intl.NumberFormat('fr-FR', {
              style: 'percent',
              maximumFractionDigits: 1,
              signDisplay: 'exceptZero',
            }).format(delta)}
          </span>
        )}
        {hint && <span className="truncate text-[11px] text-faint">{hint}</span>}
      </div>
    </div>
  );
}
