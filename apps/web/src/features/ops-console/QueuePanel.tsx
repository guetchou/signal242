import { useMemo } from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import { Panel } from '@/design-system';
import { prioritizedQueue } from '@/domain/ops/metrics';
import type { Report } from '@/domain/report/types';
import { ReportRow } from './ReportRow';

export interface QueuePanelProps {
  reports: readonly Report[];
  now: Date;
  loading: boolean;
  selectedId: string | null;
  onSelect: (report: Report) => void;
}

/**
 * File de traitement.
 *
 * Ordonnée par score de priorité, pas par date : l'agent traite ce qui coûte
 * le plus cher à ne pas traiter. Les trois états — chargement, vide, garni —
 * sont rendus explicitement.
 */
export function QueuePanel({ reports, now, loading, selectedId, onSelect }: QueuePanelProps) {
  const queue = useMemo(() => prioritizedQueue(reports, now), [reports, now]);

  if (loading) {
    return (
      <Panel elevation="raised" className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="size-6 animate-spin text-muted" aria-hidden />
        <p className="text-[13px] text-muted">Chargement de la file…</p>
      </Panel>
    );
  }

  if (queue.length === 0) {
    return (
      <Panel elevation="raised" className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full surface-sunken">
          <Inbox className="size-5 text-muted" aria-hidden />
        </span>
        <div>
          <p className="text-[15px] font-semibold text-primary">Aucun dossier ouvert</p>
          <p className="mt-1 text-[13px] text-muted">
            La file est vide pour ces critères. Élargissez les filtres ou consultez l’historique.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {queue.map((report) => (
        <ReportRow
          key={report.id}
          report={report}
          now={now}
          selected={report.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
