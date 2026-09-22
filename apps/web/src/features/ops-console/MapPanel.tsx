import { useMemo } from 'react';
import { Panel, TONES } from '@/design-system';
import { getCategory } from '@/domain/report/categories';
import { slaState } from '@/domain/report/sla';
import { isOpen } from '@/domain/report/status';
import type { Report } from '@/domain/report/types';
import { IncidentMap } from '@/features/map/IncidentMap';
import { CATEGORIES } from '@/domain/report/categories';
import { cn } from '@/lib/cn';

export interface MapPanelProps {
  reports: readonly Report[];
  now: Date;
  onSelect: (report: Report) => void;
}

/**
 * Carte opérationnelle.
 *
 * Les marqueurs sont colorés par famille d'incident — l'identité de l'entité —
 * et non par état, qui varierait au fil de la journée et rendrait la carte
 * illisible d'un jour sur l'autre. Les dossiers hors délai pulsent.
 */
export function MapPanel({ reports, now, onSelect }: MapPanelProps) {
  const points = useMemo(
    () =>
      reports.map((report) => ({
        id: report.id,
        position: report.position,
        color: TONES[getCategory(report.categoryId).tone].hex,
        label: `${report.title} — ${report.address.district}`,
        emphasis: isOpen(report.status) && slaState(report, now) === 'breached',
      })),
    [reports, now],
  );

  const activeCategories = useMemo(() => {
    const present = new Set(reports.map((report) => report.categoryId));
    return CATEGORIES.filter((category) => present.has(category.id));
  }, [reports]);

  return (
    <div className="flex flex-col gap-4">
      <Panel elevation="raised" padded={false} className="overflow-hidden">
        <IncidentMap points={points} className="h-[34rem] w-full" />
      </Panel>

      <Panel elevation="raised" className="flex flex-col gap-3">
        <h3 className="text-[13px] font-semibold text-secondary">Légende</h3>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {activeCategories.map((category) => (
            <li key={category.id} className="flex items-center gap-2 text-[12px] text-muted">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: TONES[category.tone].hex }}
                aria-hidden
              />
              {category.shortLabel}
            </li>
          ))}
          <li className="flex items-center gap-2 text-[12px] text-muted">
            <span className="relative flex size-2.5">
              <span
                className={cn('absolute inline-flex size-full rounded-full bg-[var(--tone-alert-mark)] opacity-60')}
                style={{ animation: 'pulse-ring 2s ease-out infinite' }}
                aria-hidden
              />
              <span className="relative inline-flex size-2.5 rounded-full bg-[var(--tone-alert-mark)]" />
            </span>
            Halo pulsant : dossier hors délai
          </li>
        </ul>
        <p className="text-[11px] text-faint">
          Cliquez un marqueur pour ouvrir la fiche. {points.length} dossiers positionnés.
        </p>
        {/* Sélection au clavier : la carte reste secondaire, la file est la voie
            principale d'accès aux dossiers. */}
        <button type="button" className="sr-only" onClick={() => reports[0] && onSelect(reports[0])}>
          Ouvrir le premier dossier de la carte
        </button>
      </Panel>
    </div>
  );
}
