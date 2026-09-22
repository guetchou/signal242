import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Badge, Button, TextInput } from '@/design-system';
import { CATEGORIES } from '@/domain/report/categories';
import { STATUS_LABELS, STATUS_ORDER } from '@/domain/report/status';
import type { CategoryId, ReportStatus } from '@/domain/report/types';
import { cn } from '@/lib/cn';
import type { QueryState } from './useReportsQuery';

export interface FilterBarProps {
  query: QueryState;
  onPatch: (patch: Partial<QueryState>) => void;
  onReset: () => void;
  isFiltered: boolean;
  resultCount: number;
}

/** Bascule d'appartenance à une liste de filtres, sans muter l'existant. */
function toggle<T>(list: readonly T[] | undefined, value: T): T[] {
  const current = list ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

/**
 * Barre de filtres de la console.
 *
 * Disposée sur une seule ligne au-dessus des données : les filtres se lisent
 * avant les résultats qu'ils conditionnent, et l'état actif reste visible.
 */
export function FilterBar({ query, onPatch, onReset, isFiltered, resultCount }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <span className="sr-only">Rechercher un signalement</span>
          <TextInput
            value={query.search ?? ''}
            onChange={(event) => onPatch({ search: event.target.value || undefined })}
            placeholder="Référence, rue, mot-clé…"
            className="pl-10"
          />
        </label>

        <span className="flex items-center gap-1.5 text-[12px] text-faint">
          <SlidersHorizontal className="size-3.5" aria-hidden />
          <span className="numeric font-semibold text-secondary">{resultCount}</span>
          dossier{resultCount > 1 ? 's' : ''}
        </span>

        {isFiltered && (
          <Button variant="ghost" size="sm" iconLeft={<X className="size-3.5" />} onClick={onReset}>
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS_ORDER.map((status: ReportStatus) => {
          const active = query.statuses?.includes(status) ?? false;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={active}
              onClick={() => onPatch({ statuses: toggle(query.statuses, status) })}
              className={cn(
                'rounded-full border px-3 py-1 text-[12px] transition-colors',
                active
                  ? 'border-signal-400/40 bg-signal-400/12 text-signal-300'
                  : 'border-subtle text-muted hover:border-default hover:text-primary',
              )}
            >
              {STATUS_LABELS[status]}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((category) => {
          const active = query.categoryIds?.includes(category.id as CategoryId) ?? false;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => onPatch({ categoryIds: toggle(query.categoryIds, category.id) })}
              className={cn(
                'rounded-full border px-3 py-1 text-[12px] transition-colors',
                active
                  ? 'border-cortex-400/40 bg-cortex-400/12 text-cortex-300'
                  : 'border-subtle text-muted hover:border-default hover:text-primary',
              )}
            >
              {category.shortLabel}
            </button>
          );
        })}
      </div>

      {isFiltered && resultCount === 0 && (
        <Badge tone="ember" size="md" className="w-fit">
          Aucun dossier ne correspond à ces filtres.
        </Badge>
      )}
    </div>
  );
}
