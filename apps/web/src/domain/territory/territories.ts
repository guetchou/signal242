/**
 * Identités territoriales.
 *
 * Signal 242 se pare des couleurs du territoire qu'il sert. Ce n'est pas un
 * habillage : une collectivité reconnaît son identité dans l'outil qu'elle
 * déploie, et un agent qui travaille sur plusieurs territoires sait d'un coup
 * d'œil lequel il consulte. C'est aussi l'argument de personnalisation qui
 * distingue une plateforme mutualisée d'un produit générique.
 *
 * Chaque territoire déclare son surnom d'usage, son registre chromatique et
 * son motif d'ambiance. Les couleurs de série des graphiques ne sont pas
 * concernées : elles restent validées globalement pour l'accessibilité.
 */

export type TerritoryId = 'brazzaville' | 'pointe-noire' | 'dolisie';

/** Motif d'arrière-plan animé, choisi pour ce qu'il dit du territoire. */
export type AmbientMotif = 'foliage' | 'waves' | 'crossroads';

export interface Territory {
  readonly id: TerritoryId;
  readonly name: string;
  /** Surnom d'usage, porté par les habitants. */
  readonly nickname: string;
  /** Une phrase sur ce que le territoire est, pas sur ce que le produit fait. */
  readonly identity: string;
  readonly motif: AmbientMotif;
  readonly center: readonly [number, number];
  readonly population: number;
  /** Libellé du registre chromatique, affiché dans le sélecteur. */
  readonly paletteLabel: string;
}

export const TERRITORIES: readonly Territory[] = [
  {
    id: 'brazzaville',
    name: 'Brazzaville',
    nickname: 'Brazza la Verte',
    identity:
      'Capitale posée sur le fleuve, connue pour ses avenues plantées et ses parcs. Le vert y est une identité revendiquée avant d’être une couleur.',
    motif: 'foliage',
    center: [15.2823, -4.2691],
    population: 2_100_000,
    paletteLabel: 'Vert fleuve et feuillage',
  },
  {
    id: 'pointe-noire',
    name: 'Pointe-Noire',
    nickname: 'La ville océane',
    identity:
      'Capitale économique ouverte sur l’Atlantique, rythmée par le port, la côte sauvage et le va-et-vient du large.',
    motif: 'waves',
    center: [11.8635, -4.7889],
    population: 1_400_000,
    paletteLabel: 'Bleu océan et turquoise',
  },
  {
    id: 'dolisie',
    name: 'Dolisie',
    nickname: 'La ville carrefour',
    identity:
      'Porte du Niari, à la croisée du rail et de la route, adossée aux forêts et aux terres ocre du plateau.',
    motif: 'crossroads',
    center: [12.6666, -4.1989],
    population: 128_000,
    paletteLabel: 'Ocre de latérite et forêt',
  },
];

const INDEX = new Map(TERRITORIES.map((territory) => [territory.id, territory]));

export function getTerritory(id: TerritoryId): Territory {
  const territory = INDEX.get(id);
  if (!territory) throw new Error(`Territoire inconnu : ${id}`);
  return territory;
}

export const DEFAULT_TERRITORY: TerritoryId = 'brazzaville';
