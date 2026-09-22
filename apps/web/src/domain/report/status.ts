/** Présentation métier des statuts : libellés, ordre et regroupements. */

import type { ReportStatus } from './types';

export const STATUS_ORDER: readonly ReportStatus[] = [
  'submitted',
  'triaged',
  'in_progress',
  'resolved',
  'closed',
  'rejected',
];

export const STATUS_LABELS: Readonly<Record<ReportStatus, string>> = {
  submitted: 'Déposé',
  triaged: 'Qualifié',
  in_progress: 'En intervention',
  resolved: 'Résolu',
  closed: 'Clos',
  rejected: 'Non retenu',
};

/** Description orientée citoyen, affichée dans le suivi public. */
export const STATUS_CITIZEN_COPY: Readonly<Record<ReportStatus, string>> = {
  submitted: 'Votre signalement est enregistré et attend sa qualification.',
  triaged: 'Un service a été désigné pour traiter votre signalement.',
  in_progress: 'Une équipe est mobilisée sur le terrain.',
  resolved: 'L’intervention est terminée. Votre confirmation est attendue.',
  closed: 'Le dossier est clos. Merci pour votre contribution.',
  rejected: 'Le signalement n’a pas été retenu. Le motif est indiqué ci-dessous.',
};

const OPEN_STATUSES = new Set<ReportStatus>(['submitted', 'triaged', 'in_progress']);

export function isOpen(status: ReportStatus): boolean {
  return OPEN_STATUSES.has(status);
}

/** Étape atteinte dans le parcours linéaire, pour l'affichage d'un fil. */
export function statusStep(status: ReportStatus): number {
  if (status === 'rejected') return 1;
  return Math.max(STATUS_ORDER.indexOf(status), 0);
}
