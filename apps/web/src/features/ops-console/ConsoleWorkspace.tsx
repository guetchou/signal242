import { useCallback, useMemo, useState } from 'react';
import { LayoutDashboard, ListChecks, Map as MapIcon, TriangleAlert } from 'lucide-react';
import { Badge, Panel } from '@/design-system';
import type { Report, ReportStatus } from '@/domain/report/types';
import { cn } from '@/lib/cn';
import { FilterBar } from './FilterBar';
import { MapPanel } from './MapPanel';
import { OverviewPanel } from './OverviewPanel';
import { QueuePanel } from './QueuePanel';
import { ReportDrawer } from './ReportDrawer';
import { useReportsQuery } from './useReportsQuery';

const VIEWS = [
  { id: 'overview', label: 'Supervision', icon: LayoutDashboard },
  { id: 'queue', label: 'File de traitement', icon: ListChecks },
  { id: 'map', label: 'Carte opérationnelle', icon: MapIcon },
] as const;

type ViewId = (typeof VIEWS)[number]['id'];

/**
 * Espace de travail de la console.
 *
 * Coordonne trois vues sur un même jeu de données filtré et une fiche latérale
 * partagée. La logique de données vit dans `useReportsQuery`, les agrégats dans
 * le domaine : ce composant n'orchestre que la navigation et la sélection.
 */
export function ConsoleWorkspace() {
  const { items, loading, error, query, patchQuery, resetQuery, isFiltered, updateStatus } =
    useReportsQuery();

  const [view, setView] = useState<ViewId>('overview');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Instant de référence figé par rendu : évite que deux composants calculent
  // des délais à des millisecondes différentes.
  const now = useMemo(() => new Date(), []);

  const selected = useMemo(
    () => items.find((report) => report.id === selectedId) ?? null,
    [items, selectedId],
  );

  const handleStatusChange = useCallback(
    async (status: ReportStatus) => {
      if (!selected) return;
      setBusy(true);
      try {
        await updateStatus(selected.id, status);
      } finally {
        setBusy(false);
      }
    },
    [selected, updateStatus],
  );

  const select = useCallback((report: Report) => setSelectedId(report.id), []);

  return (
    <div className="flex flex-col gap-5">
      <nav className="flex flex-wrap gap-1.5" aria-label="Vues de la console">
        {VIEWS.map((item) => {
          const active = item.id === view;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-[13px] font-medium transition-all',
                active
                  ? 'surface-raised border border-default text-primary shadow-panel'
                  : 'border border-transparent text-muted hover:text-primary',
              )}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </button>
          );
        })}
      </nav>

      {view !== 'overview' && (
        <Panel elevation="flat">
          <FilterBar
            query={query}
            onPatch={patchQuery}
            onReset={resetQuery}
            isFiltered={isFiltered}
            resultCount={items.length}
          />
        </Panel>
      )}

      {error && (
        <Panel elevation="flat" className="flex items-start gap-2.5 text-[13px] text-[var(--tone-alert-text)]">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </Panel>
      )}

      <div
        className={cn(
          'grid gap-5',
          selected && view !== 'overview' ? 'xl:grid-cols-[minmax(0,1fr)_24rem]' : 'grid-cols-1',
        )}
      >
        <div className="min-w-0">
          {view === 'overview' && <OverviewPanel reports={items} now={now} />}
          {view === 'queue' && (
            <QueuePanel
              reports={items}
              now={now}
              loading={loading}
              selectedId={selectedId}
              onSelect={select}
            />
          )}
          {view === 'map' && <MapPanel reports={items} now={now} onSelect={select} />}
        </div>

        {selected && view !== 'overview' && (
          <Panel
            elevation="floating"
            className="h-fit max-h-[calc(100vh-8rem)] xl:sticky xl:top-20"
          >
            <ReportDrawer
              report={selected}
              now={now}
              busy={busy}
              onClose={() => setSelectedId(null)}
              onStatusChange={(status) => void handleStatusChange(status)}
            />
          </Panel>
        )}
      </div>

      {view === 'overview' && (
        <Badge tone="neutral" size="md" className="w-fit">
          Jeu de démonstration : {items.length} signalements générés sur trente jours.
        </Badge>
      )}
    </div>
  );
}
