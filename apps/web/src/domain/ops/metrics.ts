/**
 * Agrégats d'exploitation.
 *
 * Fonctions pures prenant le corpus et l'instant de référence en paramètre.
 * Aucune dépendance à React : les mêmes calculs alimenteront le rapport
 * mensuel côté serveur sans duplication de règle.
 */

import { CATEGORIES } from '../report/categories';
import { hoursRemaining, priorityScore, slaState, type SlaState } from '../report/sla';
import { isOpen } from '../report/status';
import type { CategoryId, Report, Severity } from '../report/types';

export interface OpsSummary {
  readonly total: number;
  readonly open: number;
  readonly breached: number;
  readonly atRisk: number;
  /** Part des dossiers clos dans les délais, sur les dossiers clos uniquement. */
  readonly resolutionRate: number;
  /** Délai médian de traitement effectif, en heures. */
  readonly medianResolutionHours: number;
  readonly confirmationsTotal: number;
}

const HOUR_MS = 3_600_000;

function median(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
    : (sorted[middle] ?? 0);
}

export function summarize(reports: readonly Report[], now: Date): OpsSummary {
  const closed = reports.filter(
    (report) => report.status === 'resolved' || report.status === 'closed',
  );
  const states = reports.map((report) => slaState(report, now));

  const durations = closed.map(
    (report) =>
      (new Date(report.resolvedAt ?? report.updatedAt).getTime() -
        new Date(report.createdAt).getTime()) /
      HOUR_MS,
  );

  return {
    total: reports.length,
    open: reports.filter((report) => isOpen(report.status)).length,
    breached: states.filter((state) => state === 'breached').length,
    atRisk: states.filter((state) => state === 'at_risk').length,
    resolutionRate: closed.length === 0 ? 0 : closed.filter((report) => slaState(report, now) === 'met').length / closed.length,
    medianResolutionHours: Math.round(median(durations) * 10) / 10,
    confirmationsTotal: reports.reduce((sum, report) => sum + report.confirmations, 0),
  };
}

export interface Bucket {
  readonly id: string;
  readonly label: string;
  readonly value: number;
}

/** Volume par famille d'incident, familles vides comprises pour la stabilité de l'axe. */
export function byCategory(reports: readonly Report[]): Bucket[] {
  const counts = new Map<CategoryId, number>();
  for (const report of reports) {
    counts.set(report.categoryId, (counts.get(report.categoryId) ?? 0) + 1);
  }
  return CATEGORIES.map((category) => ({
    id: category.id,
    label: category.shortLabel,
    value: counts.get(category.id) ?? 0,
  }));
}

export function byDistrict(reports: readonly Report[]): Bucket[] {
  const counts = new Map<string, number>();
  for (const report of reports) {
    const key = report.address.district;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([label, value]) => ({ id: label, label, value }));
}

export function bySlaState(reports: readonly Report[], now: Date): Record<SlaState, number> {
  const counts: Record<SlaState, number> = { met: 0, on_track: 0, at_risk: 0, breached: 0 };
  for (const report of reports) {
    counts[slaState(report, now)] += 1;
  }
  return counts;
}

export interface DailyPoint {
  readonly date: string;
  readonly value: number;
}

/** Volume quotidien de dépôts sur une fenêtre glissante. */
export function dailyVolume(reports: readonly Report[], now: Date, days = 30): DailyPoint[] {
  const buckets = new Map<string, number>();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(now.getTime() - offset * 24 * HOUR_MS);
    buckets.set(day.toISOString().slice(0, 10), 0);
  }
  for (const report of reports) {
    const key = report.createdAt.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()].map(([date, value]) => ({ date, value }));
}

export interface ActivityPoint {
  readonly date: string;
  /** Dossiers déposés ce jour-là. */
  readonly created: number;
  /** Dossiers clos ou résolus ce jour-là. */
  readonly closed: number;
  /** Dossiers clos ce jour-là dans le délai contractuel. */
  readonly closedOnTime: number;
  /** Dossiers dont l'échéance est tombée ce jour-là sans clôture préalable. */
  readonly breached: number;
}

/**
 * Activité quotidienne consolidée sur une fenêtre glissante.
 *
 * Un dossier est compté en dépassement au jour de son échéance, et seulement
 * si sa clôture est postérieure ou absente : la série reflète le moment où
 * l'engagement a été rompu, non celui où on l'a constaté.
 */
export function dailyActivity(reports: readonly Report[], now: Date, days = 30): ActivityPoint[] {
  const index = new Map<string, { created: number; closed: number; closedOnTime: number; breached: number }>();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(now.getTime() - offset * 24 * HOUR_MS);
    index.set(day.toISOString().slice(0, 10), { created: 0, closed: 0, closedOnTime: 0, breached: 0 });
  }

  const bump = (iso: string, key: 'created' | 'closed' | 'closedOnTime' | 'breached') => {
    const bucket = index.get(iso.slice(0, 10));
    if (bucket) bucket[key] += 1;
  };

  for (const report of reports) {
    bump(report.createdAt, 'created');
    const settled = report.status === 'resolved' || report.status === 'closed';
    const settledAt = report.resolvedAt ?? report.updatedAt;
    const due = new Date(report.dueAt);
    const closedLate = settled && new Date(settledAt).getTime() > due.getTime();
    if (settled) {
      bump(settledAt, 'closed');
      if (!closedLate) bump(settledAt, 'closedOnTime');
    }

    if (due.getTime() <= now.getTime() && (closedLate || isOpen(report.status))) {
      bump(report.dueAt, 'breached');
    }
  }

  return [...index.entries()].map(([date, counts]) => ({ date, ...counts }));
}

/** File de traitement ordonnée par score de priorité décroissant. */
export function prioritizedQueue(reports: readonly Report[], now: Date): Report[] {
  return reports
    .filter((report) => isOpen(report.status))
    .map((report) => ({ report, score: priorityScore(report, now) }))
    .sort((a, b) => b.score - a.score || hoursRemaining(a.report, now) - hoursRemaining(b.report, now))
    .map((entry) => entry.report);
}

/** Répartition par gravité, utile au dimensionnement des équipes. */
export function bySeverity(reports: readonly Report[]): Record<Severity, number> {
  const counts: Record<Severity, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
  for (const report of reports) counts[report.severity] += 1;
  return counts;
}
