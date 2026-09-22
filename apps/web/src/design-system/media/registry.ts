/**
 * Registre des médias du site.
 *
 * Chaque emplacement visuel est déclaré ici avec son sujet et son cadrage
 * attendu. Tant qu'aucun fichier n'est fourni, l'emplacement rend une
 * composition graphique générée ; déposer l'image au chemin indiqué dans
 * `public/media/` la substitue sans modification de code.
 *
 * Cette indirection sert aussi la production : un intégrateur photo sait
 * exactement quelles prises de vue commander, dans quel format et pour quel
 * message, sans lire le code des composants.
 */

/** Sujet de la composition de repli, qui détermine ce qui est dessiné. */
export type SceneSubject =
  | 'skyline' // silhouette urbaine
  | 'river' // fleuve, berge
  | 'ocean' // littoral, large
  | 'street' // rue, voirie
  | 'people' // présence humaine, silhouettes
  | 'night' // scène nocturne, éclairage
  | 'crew'; // équipe d'intervention

export type MediaShape = 'wide' | 'landscape' | 'portrait' | 'circle' | 'square';

export interface MediaSlot {
  readonly id: string;
  /** Chemin attendu sous `public/`, sans extension imposée. */
  readonly src: string;
  readonly shape: MediaShape;
  readonly subject: SceneSubject;
  /** Texte alternatif définitif, valable pour la photo comme pour le repli. */
  readonly alt: string;
  /** Brief de prise de vue, à l'usage du photographe ou de l'iconographe. */
  readonly brief: string;
}

export const MEDIA = {
  heroCity: {
    id: 'heroCity',
    src: '/media/hero-ville.jpg',
    shape: 'wide',
    subject: 'skyline',
    alt: 'Vue de la ville en fin de journée, avenues plantées et circulation',
    brief:
      'Plan large horizontal, 2400 × 1200. Ville vue de haut ou depuis la corniche, lumière de fin de journée, végétation visible. Aucun visage identifiable au premier plan.',
  },
  citizenPortrait: {
    id: 'citizenPortrait',
    src: '/media/citoyenne-portrait.jpg',
    shape: 'portrait',
    subject: 'people',
    alt: 'Habitante signalant un problème depuis son téléphone dans la rue',
    brief:
      'Portrait vertical, 900 × 1200. Une personne debout dans la rue, téléphone en main, regard vers l’écran. Lumière naturelle, arrière-plan urbain flou. Accord écrit de la personne requis.',
  },
  agentCrew: {
    id: 'agentCrew',
    src: '/media/equipe-intervention.jpg',
    shape: 'landscape',
    subject: 'crew',
    alt: 'Équipe technique municipale en intervention sur la voirie',
    brief:
      'Paysage 1600 × 1000. Deux à trois agents en tenue de service sur un chantier de voirie, matériel visible. Montrer l’action, pas la pose.',
  },
  nightStreet: {
    id: 'nightStreet',
    src: '/media/rue-nuit.jpg',
    shape: 'landscape',
    subject: 'night',
    alt: 'Rue de quartier la nuit, éclairage public partiellement éteint',
    brief:
      'Paysage 1600 × 1000, prise de nuit. Rue résidentielle, contraste entre lampadaires allumés et éteints. Sert la démonstration acoustique et l’éclairage.',
  },
  riverBank: {
    id: 'riverBank',
    src: '/media/berge-fleuve.jpg',
    shape: 'landscape',
    subject: 'river',
    alt: 'Berge du fleuve après la saison des pluies',
    brief:
      'Paysage 1600 × 1000. Berge, eau, végétation. Illustre la section eau et assainissement et la saison des pluies.',
  },
  districtFace: {
    id: 'districtFace',
    src: '/media/visage-quartier.jpg',
    shape: 'circle',
    subject: 'people',
    alt: 'Habitant d’un quartier de la ville',
    brief:
      'Carré 800 × 800, cadrage serré sur le visage, recadrable en cercle. Regard caméra, lumière douce. Accord écrit requis.',
  },
  marketStreet: {
    id: 'marketStreet',
    src: '/media/rue-marche.jpg',
    shape: 'square',
    subject: 'street',
    alt: 'Rue commerçante animée en journée',
    brief:
      'Carré 1000 × 1000. Rue passante, étals, mouvement. Illustre la propreté et les nuisances sonores.',
  },
} satisfies Readonly<Record<string, MediaSlot>>;

export type MediaKey = keyof typeof MEDIA;
