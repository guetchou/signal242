import { useMemo, useState } from 'react';
import { EyeOff, Loader2 } from 'lucide-react';
import { Badge, Panel, resolveIcon, SectionHeading, STATUS_TONE, TONES } from '@/design-system';
import { CATEGORIES, getCategory } from '@/domain/report/categories';
import { STATUS_LABELS } from '@/domain/report/status';
import type { CategoryId, Report } from '@/domain/report/types';
import { IncidentMap } from '@/features/map/IncidentMap';
import { useReportsQuery } from '@/features/ops-console/useReportsQuery';
import { formatRelative } from '@/lib/format';
import { cn } from '@/lib/cn';

/**
 * Familles exclues de la carte publique.
 *
 * Le canal sécurité est cloisonné : publier la position d'un acte de
 * banditisme exposerait le déclarant et cartographierait les zones de tension
 * pour quiconque. Ces dossiers restent visibles des seules autorités.
 */
const PRIVATE_CATEGORIES: readonly CategoryId[] = ['security'];

const PUBLIC_CATEGORIES = CATEGORIES.filter((category) => !PRIVATE_CATEGORIES.includes(category.id));

/** Carte publique : transparence sur l'action, protection des personnes. */
export function MapPage() {
  const { items, loading } = useReportsQuery();
  const [active, setActive] = useState<CategoryId | null>(null);

  const now = useMemo(() => new Date(), []);

  const visible = useMemo(
    () =>
      items.filter(
        (report) =>
          !PRIVATE_CATEGORIES.includes(report.categoryId) &&
          (active === null || report.categoryId === active),
      ),
    [items, active],
  );

  const points = useMemo(
    () =>
      visible.map((report) => ({
        id: report.id,
        position: report.position,
        color: TONES[getCategory(report.categoryId).tone].hex,
        label: `${report.title} — ${report.address.district}`,
      })),
    [visible],
  );

  const recent = useMemo(() => visible.slice(0, 12), [visible]);

  return (
    <section className="pb-24 pt-10">
      <div className="mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          title="Carte publique des signalements"
          description="Tout ce que la collectivité reçoit et traite, à l’exception du canal sécurité, cloisonné pour protéger les déclarants."
          className="mb-8"
        />

        <div className="mb-5 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-[12px] transition-colors',
              active === null
                ? 'border-signal-400/40 bg-signal-400/12 text-[var(--tone-signal-text)]'
                : 'border-subtle text-muted hover:border-default hover:text-primary',
            )}
          >
            Toutes les familles
          </button>
          {PUBLIC_CATEGORIES.map((category) => {
            const selected = active === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActive(selected ? null : category.id)}
                aria-pressed={selected}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] transition-colors',
                  selected
                    ? cn(TONES[category.tone].bg, TONES[category.tone].border, TONES[category.tone].text)
                    : 'border-subtle text-muted hover:border-default hover:text-primary',
                )}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: TONES[category.tone].hex }}
                  aria-hidden
                />
                {category.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Panel elevation="raised" padded={false} className="overflow-hidden">
            <IncidentMap points={points} className="h-[32rem] w-full lg:h-[40rem]" />
          </Panel>

          <div className="flex flex-col gap-4">
            <Panel elevation="raised" className="flex items-start gap-3">
              <EyeOff className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
              <p className="text-[12px] leading-relaxed text-muted">
                Les signalements de sécurité ne figurent pas sur cette carte. Ils sont transmis
                directement aux autorités compétentes, sans exposition publique de la position ni
                du déclarant.
              </p>
            </Panel>

            <Panel elevation="raised" className="flex min-h-0 flex-col gap-3">
              <header className="flex items-baseline justify-between gap-2">
                <h2 className="text-[15px] font-semibold text-primary">Derniers signalements</h2>
                <Badge tone="neutral">{visible.length}</Badge>
              </header>

              {loading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-[13px] text-muted">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Chargement…
                </div>
              ) : recent.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-muted">
                  Aucun signalement public pour cette famille.
                </p>
              ) : (
                <ul className="flex flex-col gap-2.5 overflow-y-auto">
                  {recent.map((report: Report) => {
                    const category = getCategory(report.categoryId);
                    const Icon = resolveIcon(category.icon);
                    const tone = TONES[category.tone];
                    return (
                      <li key={report.id} className="flex items-start gap-2.5 rounded-[var(--radius-sm)] surface-sunken p-3">
                        <span className={cn('grid size-7 shrink-0 place-items-center rounded-[var(--radius-xs)]', tone.bg)}>
                          <Icon className={cn('size-3.5', tone.text)} aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-primary">{report.title}</p>
                          <p className="truncate text-[11px] text-faint">
                            {report.address.district} · {formatRelative(report.createdAt, now)}
                          </p>
                        </div>
                        <Badge tone={STATUS_TONE[report.status]}>{STATUS_LABELS[report.status]}</Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}
