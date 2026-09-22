/** Découpage territorial de référence pour la démonstration (Brazzaville). */

export interface District {
  readonly name: string;
  readonly lat: number;
  readonly lng: number;
  /** Population estimée, utilisée pour normaliser les taux de signalement. */
  readonly population: number;
}

export const CITY = 'Brazzaville';

export const DISTRICTS: readonly District[] = [
  { name: 'Makélékélé', lat: -4.3012, lng: 15.2261, population: 302_000 },
  { name: 'Bacongo', lat: -4.2897, lng: 15.2543, population: 118_000 },
  { name: 'Poto-Poto', lat: -4.2688, lng: 15.2799, population: 76_000 },
  { name: 'Moungali', lat: -4.2536, lng: 15.2679, population: 157_000 },
  { name: 'Ouenzé', lat: -4.2411, lng: 15.2861, population: 182_000 },
  { name: 'Talangaï', lat: -4.2117, lng: 15.3092, population: 264_000 },
  { name: 'Mfilou', lat: -4.2679, lng: 15.2075, population: 119_000 },
  { name: 'Madibou', lat: -4.3391, lng: 15.1938, population: 74_000 },
  { name: 'Djiri', lat: -4.1702, lng: 15.3304, population: 103_000 },
  { name: 'Centre-ville', lat: -4.2691, lng: 15.2823, population: 41_000 },
];

const STREETS = [
  'Avenue de la Paix',
  'Boulevard Denis-Sassou-Nguesso',
  'Rue Mbochis',
  'Avenue Matsoua',
  'Rue Fourneau',
  'Avenue des Trois-Martyrs',
  'Rue Bayardelle',
  'Avenue Marien-Ngouabi',
  'Rue de la Tsiémé',
  'Avenue de l’OUA',
  'Rue Loutassi',
  'Boulevard Alfred-Raoul',
];

export function streetAt(index: number): string {
  return STREETS[index % STREETS.length] ?? STREETS[0]!;
}
