import { cn } from '@/lib/cn';

export interface RankedItem {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  /** Couleur explicite si l'entité porte une identité propre (famille métier). */
  readonly color?: string;
}

export interface RankedBarsProps {
  items: readonly RankedItem[];
  unit?: string;
  max?: number;
  className?: string;
  /** Limite d'affichage ; le reste est agrégé en « Autres ». */
  limit?: number;
}

/**
 * Classement horizontal — forme de référence pour comparer des magnitudes
 * nommées. Les libellés sont lus horizontalement, sans rotation, et chaque
 * barre porte sa valeur : aucune identification par la couleur seule.
 */
export function RankedBars({ items, unit = '', max, className, limit }: RankedBarsProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const visible = limit ? sorted.slice(0, limit) : sorted;
  const rest = limit ? sorted.slice(limit) : [];
  const rows =
    rest.length > 0
      ? [
          ...visible,
          {
            id: '__other',
            label: `Autres (${rest.length})`,
            value: rest.reduce((sum, item) => sum + item.value, 0),
          },
        ]
      : visible;

  const ceiling = max ?? Math.max(...rows.map((row) => row.value), 1);

  return (
    <ul className={cn('flex flex-col gap-2.5', className)}>
      {rows.map((row) => {
        const ratio = row.value / ceiling;
        return (
          <li key={row.id} className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3">
            <span className="truncate text-[13px] text-secondary" title={row.label}>
              {row.label}
            </span>
            <span className="h-2.5 overflow-hidden rounded-full surface-sunken">
              <span
                className="block h-full rounded-full transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]"
                style={{
                  width: `${Math.max(ratio * 100, 1.5)}%`,
                  backgroundColor: row.color ?? 'var(--series-1)',
                }}
              />
            </span>
            <span className="numeric text-[13px] font-semibold text-primary">
              {row.value}
              {unit && <span className="ml-0.5 text-[11px] font-normal text-muted">{unit}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
