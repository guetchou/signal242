import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';

export type StatusLevel = 'good' | 'warning' | 'critical' | 'neutral';

export interface StatusSegment {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly level: StatusLevel;
}

/**
 * Palette d'état, réservée.
 *
 * Ces teintes ne sont jamais réutilisées comme couleurs de série : leur
 * signification est fixe. Chaque segment est systématiquement accompagné d'un
 * libellé et d'une valeur, l'état n'étant jamais porté par la couleur seule.
 */
const LEVEL_COLOR: Record<StatusLevel, string> = {
  good: 'var(--color-signal-500)',
  warning: 'var(--color-ember-500)',
  critical: 'var(--color-alert-500)',
  neutral: 'var(--color-night-500)',
};

const LEVEL_GLYPH: Record<StatusLevel, string> = {
  good: '●',
  warning: '▲',
  critical: '■',
  neutral: '◆',
};

export interface StatusBarProps {
  segments: readonly StatusSegment[];
  className?: string;
}

/** Répartition d'états en barre empilée, avec légende obligatoire. */
export function StatusBar({ segments, className }: StatusBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  return (
    <div className={cn('flex flex-col gap-3.5', className)}>
      {/* Écart de 2 px entre segments : évite la fusion visuelle de deux états. */}
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full surface-sunken p-[1px]">
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment) => (
            <span
              key={segment.id}
              className="h-full rounded-full transition-[flex-grow] duration-[var(--duration-slow)]"
              style={{ flexGrow: segment.value, backgroundColor: LEVEL_COLOR[segment.level] }}
              title={`${segment.label} : ${segment.value}`}
            />
          ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
        {segments.map((segment) => (
          <li key={segment.id} className="flex items-baseline gap-2">
            <span
              aria-hidden
              className="text-[9px] leading-none"
              style={{ color: LEVEL_COLOR[segment.level] }}
            >
              {LEVEL_GLYPH[segment.level]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] text-muted">{segment.label}</span>
              <span className="numeric text-sm font-semibold text-primary">
                {segment.value}
                <span className="ml-1.5 text-[11px] font-normal text-faint">
                  {formatPercent(segment.value / total)}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
