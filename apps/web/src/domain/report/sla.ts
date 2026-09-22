/**
 * Règles de priorisation et d'engagement de service.
 *
 * Fonctions pures, sans horloge implicite : `now` est toujours injecté afin de
 * garantir des tests déterministes et un rendu serveur reproductible.
 */

import { getCategory } from './categories';
import type { Report, Severity } from './types';

export const SEVERITY_ORDER: readonly Severity[] = ['low', 'moderate', 'high', 'critical'];

export const SEVERITY_LABELS: Readonly<Record<Severity, string>> = {
  low: 'Faible',
  moderate: 'Modérée',
  high: 'Élevée',
  critical: 'Critique',
};

const HOUR_MS = 3_600_000;

/** Échéance contractuelle calculée au dépôt, figée ensuite pour l'audit. */
export function computeDueDate(
  categoryId: Report['categoryId'],
  severity: Severity,
  createdAt: Date,
): Date {
  const hours = getCategory(categoryId).slaHours[severity];
  return new Date(createdAt.getTime() + hours * HOUR_MS);
}

export type SlaState = 'met' | 'on_track' | 'at_risk' | 'breached';

/** Seuil à partir duquel un dossier encore ouvert est signalé « à risque ». */
const AT_RISK_RATIO = 0.75;

export function slaState(report: Report, now: Date): SlaState {
  const due = new Date(report.dueAt).getTime();
  const created = new Date(report.createdAt).getTime();
  const isClosed = report.status === 'resolved' || report.status === 'closed';

  if (isClosed) {
    return new Date(report.updatedAt).getTime() <= due ? 'met' : 'breached';
  }
  if (now.getTime() > due) return 'breached';

  const window = Math.max(due - created, 1);
  const elapsedRatio = (now.getTime() - created) / window;
  return elapsedRatio >= AT_RISK_RATIO ? 'at_risk' : 'on_track';
}

export const SLA_LABELS: Readonly<Record<SlaState, string>> = {
  met: 'Délai tenu',
  on_track: 'Dans les temps',
  at_risk: 'Échéance proche',
  breached: 'Hors délai',
};

/** Part du délai déjà consommée, bornée à [0, 1] pour l'affichage d'une jauge. */
export function slaProgress(report: Report, now: Date): number {
  const created = new Date(report.createdAt).getTime();
  const due = new Date(report.dueAt).getTime();
  const window = Math.max(due - created, 1);
  return Math.min(Math.max((now.getTime() - created) / window, 0), 1);
}

/** Temps restant en heures ; négatif si l'échéance est dépassée. */
export function hoursRemaining(report: Report, now: Date): number {
  return (new Date(report.dueAt).getTime() - now.getTime()) / HOUR_MS;
}

const SEVERITY_WEIGHT: Readonly<Record<Severity, number>> = {
  low: 10,
  moderate: 25,
  high: 55,
  critical: 100,
};

/**
 * Score de priorisation de la file d'attente (0-200).
 *
 * Trois forces se cumulent : la gravité déclarée, la pression citoyenne
 * (confirmations indépendantes du même incident) et l'urgence temporelle.
 * Un dossier hors délai est propulsé en tête quel que soit son type.
 */
export function priorityScore(report: Report, now: Date): number {
  const severity = SEVERITY_WEIGHT[report.severity];
  // Rendement décroissant : la 20e confirmation pèse moins que la 2e.
  const crowd = Math.min(Math.log2(report.confirmations + 1) * 12, 45);
  const remaining = hoursRemaining(report, now);
  const urgency = remaining <= 0 ? 55 : Math.max(0, 40 - remaining);
  return Math.round(Math.min(severity + crowd + urgency, 200));
}

/**
 * Remontée automatique de gravité sous pression citoyenne.
 * Un incident massivement confirmé cesse d'être un cas isolé.
 */
export function escalatedSeverity(report: Report): Severity {
  const index = SEVERITY_ORDER.indexOf(report.severity);
  const steps = report.confirmations >= 25 ? 2 : report.confirmations >= 8 ? 1 : 0;
  const target = Math.min(index + steps, SEVERITY_ORDER.length - 1);
  return SEVERITY_ORDER[target] ?? report.severity;
}
