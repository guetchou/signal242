import { useMemo } from 'react';
import { Panel, RankedBars, Stat, StatusBar, TimeSeries } from '@/design-system';
import {
  byCategory,
  byDistrict,
  bySlaState,
  dailyActivity,
  summarize,
} from '@/domain/ops/metrics';
import type { Report } from '@/domain/report/types';
import { formatDecimal, formatNumber, formatPercent } from '@/lib/format';

export interface OverviewPanelProps {
  reports: readonly Report[];
  now: Date;
}

const DAY_LABEL = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' });

/**
 * Tableau de bord de supervision.
 *
 * Quatre indicateurs en tête — ce qu'un directeur des services techniques
 * regarde en premier — puis les répartitions qui expliquent ces chiffres.
 * Aucun graphique n'est décoratif : chacun répond à une question posée.
 */
export function OverviewPanel({ reports, now }: OverviewPanelProps) {
  const summary = useMemo(() => summarize(reports, now), [reports, now]);
  const daily = useMemo(() => dailyActivity(reports, now, 30), [reports, now]);
  const sla = useMemo(() => bySlaState(reports, now), [reports, now]);

  // Comparaison de magnitudes nommées : une seule teinte. Colorer chaque
  // famille laisserait croire à un codage sémantique inexistant, et deux
  // familles partageant une teinte de marque deviendraient indiscernables.
  const categoryBuckets = useMemo(
    () => byCategory(reports).filter((bucket) => bucket.value > 0),
    [reports],
  );

  const districtBuckets = useMemo(() => byDistrict(reports), [reports]);

  const series = useMemo(
    () => daily.map((point) => ({ label: DAY_LABEL.format(new Date(point.date)), value: point.created })),
    [daily],
  );

  // Fenêtres courtes alimentant les micro-courbes des tuiles d'indicateur :
  // chaque tuile porte la tendance de sa propre mesure, jamais une autre.
  const trends = useMemo(() => {
    const window = daily.slice(-14);
    return {
      created: window.map((point) => point.created),
      breached: window.map((point) => point.breached),
      closed: window.map((point) => point.closed),
      // Taux journalier d'engagements tenus ; un jour sans clôture est neutre.
      metRate: window.map((point) =>
        point.closed === 0 ? 0 : Math.round((point.closedOnTime / point.closed) * 100),
      ),
    };
  }, [daily]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panel elevation="raised">
          <Stat
            label="Dossiers ouverts"
            value={formatNumber(summary.open)}
            hint={`sur ${formatNumber(summary.total)} au total`}
            trend={trends.created}
            trendColor="var(--series-1)"
          />
        </Panel>
        <Panel elevation="raised">
          <Stat
            label="Hors délai"
            value={formatNumber(summary.breached)}
            hint={
              summary.atRisk > 1
                ? `${formatNumber(summary.atRisk)} approchent l’échéance`
                : `${formatNumber(summary.atRisk)} approche l’échéance`
            }
            deltaPolarity="lower-is-better"
            trend={trends.breached}
            trendColor="var(--series-5)"
          />
        </Panel>
        <Panel elevation="raised">
          <Stat
            label="Délai médian de clôture"
            value={formatDecimal(summary.medianResolutionHours)}
            unit="h"
            deltaPolarity="lower-is-better"
            hint="sur les dossiers clos"
            trend={trends.closed}
            trendColor="var(--series-4)"
          />
        </Panel>
        <Panel elevation="raised">
          <Stat
            label="Engagements tenus"
            value={formatPercent(summary.resolutionRate)}
            hint={`${formatNumber(summary.confirmationsTotal)} confirmations citoyennes`}
            trend={trends.metRate}
            trendColor="var(--series-2)"
          />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel elevation="raised" className="flex flex-col gap-4">
          <header>
            <h3 className="text-[15px] font-semibold text-primary">Dépôts quotidiens</h3>
            <p className="text-[12px] text-muted">Volume reçu sur les trente derniers jours, tous canaux confondus.</p>
          </header>
          <TimeSeries
            points={series}
            title="Dépôts quotidiens"
            unit="dossiers"
            color="var(--series-1)"
            height={210}
          />
        </Panel>

        <Panel elevation="raised" className="flex flex-col gap-4">
          <header>
            <h3 className="text-[15px] font-semibold text-primary">Tenue des engagements</h3>
            <p className="text-[12px] text-muted">Répartition du portefeuille au regard des délais contractuels.</p>
          </header>
          <StatusBar
            segments={[
              { id: 'met', label: 'Délai tenu', value: sla.met, level: 'good' },
              { id: 'on_track', label: 'Dans les temps', value: sla.on_track, level: 'good' },
              { id: 'at_risk', label: 'Échéance proche', value: sla.at_risk, level: 'warning' },
              { id: 'breached', label: 'Hors délai', value: sla.breached, level: 'critical' },
            ]}
          />
          <p className="rounded-[var(--radius-sm)] surface-sunken px-3.5 py-2.5 text-[12px] leading-relaxed text-muted">
            Les dossiers « échéance proche » ont consommé plus de 75 % de leur délai. Ils
            constituent le gisement d’action prioritaire du jour.
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel elevation="raised" className="flex flex-col gap-4">
          <header>
            <h3 className="text-[15px] font-semibold text-primary">Volume par famille</h3>
            <p className="text-[12px] text-muted">Où se concentre la charge des services.</p>
          </header>
          <RankedBars items={categoryBuckets} limit={7} />
        </Panel>

        <Panel elevation="raised" className="flex flex-col gap-4">
          <header>
            <h3 className="text-[15px] font-semibold text-primary">Volume par quartier</h3>
            <p className="text-[12px] text-muted">Base du dialogue avec les élus d’arrondissement.</p>
          </header>
          <RankedBars items={districtBuckets} limit={7} />
        </Panel>
      </div>
    </div>
  );
}
