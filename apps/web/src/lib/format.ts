/** Formatage localisé — centralisé pour garantir une cohérence d'affichage. */

const NUMBER = new Intl.NumberFormat('fr-FR');
const DECIMAL = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
const PERCENT = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 1 });
const DATE_TIME = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
const DATE_SHORT = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' });

export const formatNumber = (value: number): string => NUMBER.format(value);
export const formatDecimal = (value: number): string => DECIMAL.format(value);
export const formatPercent = (ratio: number): string => PERCENT.format(ratio);
export const formatDateTime = (iso: string): string => DATE_TIME.format(new Date(iso));
export const formatDateShort = (iso: string): string => DATE_SHORT.format(new Date(iso));

/** Durée lisible à partir d'un nombre d'heures, signé pour les retards. */
export function formatDuration(hours: number): string {
  const abs = Math.abs(hours);
  if (abs < 1) return `${Math.round(abs * 60)} min`;
  if (abs < 48) return `${DECIMAL.format(abs)} h`;
  return `${Math.round(abs / 24)} j`;
}

/** Ancienneté relative exprimée du point de vue de l'utilisateur. */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'à l’instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 31) return `il y a ${days} j`;
  return formatDateShort(iso);
}
