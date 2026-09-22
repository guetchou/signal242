/**
 * Catalogue métier des familles de signalement.
 *
 * C'est la table de référence qui pilote simultanément : le parcours citoyen
 * (choix guidé), le routage vers les services, les délais contractuels et la
 * légende cartographique. Toute nouvelle famille s'ajoute ici et se propage
 * dans l'application sans modification d'un composant d'interface.
 */

import type { CategoryId, Severity } from './types';

/** Rôle chromatique utilisé par la carte, les badges et les graphiques. */
export type CategoryTone = 'signal' | 'ember' | 'alert' | 'cortex' | 'pulse';

export interface ReportSubtype {
  readonly id: string;
  readonly label: string;
  /** Gravité proposée par défaut, ajustable par le citoyen puis par l'agent. */
  readonly baseSeverity: Severity;
  /** Exemple concret affiché en aide à la saisie. */
  readonly hint?: string;
}

export interface ReportCategory {
  readonly id: CategoryId;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
  /** Nom d'icône lucide-react, résolu dans la couche présentation. */
  readonly icon: string;
  readonly tone: CategoryTone;
  /** Service destinataire par défaut à la qualification. */
  readonly defaultTeam: string;
  /** Délai contractuel de traitement en heures, par niveau de gravité. */
  readonly slaHours: Readonly<Record<Severity, number>>;
  /** Le parcours propose une capture sonore mesurée. */
  readonly requiresAcoustics?: boolean;
  /** Le dépôt anonyme est proposé par défaut (protection du déclarant). */
  readonly anonymousByDefault?: boolean;
  readonly subtypes: readonly ReportSubtype[];
}

export const CATEGORIES: readonly ReportCategory[] = [
  {
    id: 'roads',
    label: 'Voirie et mobilité',
    shortLabel: 'Voirie',
    description: 'Nids-de-poule, chaussée effondrée, signalisation absente, caniveau obstrué.',
    icon: 'TrafficCone',
    tone: 'ember',
    defaultTeam: 'Direction de la voirie',
    slaHours: { low: 720, moderate: 336, high: 72, critical: 12 },
    subtypes: [
      { id: 'pothole', label: 'Nid-de-poule', baseSeverity: 'moderate', hint: 'Précisez le diamètre approximatif.' },
      { id: 'collapsed', label: 'Chaussée effondrée', baseSeverity: 'critical' },
      { id: 'drain', label: 'Caniveau obstrué', baseSeverity: 'high' },
      { id: 'signage', label: 'Signalisation manquante', baseSeverity: 'moderate' },
      { id: 'flood-road', label: 'Route impraticable', baseSeverity: 'high' },
    ],
  },
  {
    id: 'lighting',
    label: 'Éclairage public',
    shortLabel: 'Éclairage',
    description: 'Lampadaire éteint ou clignotant, armoire ouverte, câble apparent.',
    icon: 'Lightbulb',
    tone: 'ember',
    defaultTeam: 'Régie éclairage',
    slaHours: { low: 336, moderate: 168, high: 48, critical: 6 },
    subtypes: [
      { id: 'lamp-off', label: 'Lampadaire éteint', baseSeverity: 'moderate' },
      { id: 'lamp-flicker', label: 'Éclairage intermittent', baseSeverity: 'low' },
      { id: 'cable', label: 'Câble dénudé ou pendant', baseSeverity: 'critical' },
      { id: 'cabinet', label: 'Armoire électrique ouverte', baseSeverity: 'critical' },
    ],
  },
  {
    id: 'waste',
    label: 'Propreté et déchets',
    shortLabel: 'Déchets',
    description: 'Dépôt sauvage, bac débordant, encombrant abandonné, épave.',
    icon: 'Trash2',
    tone: 'signal',
    defaultTeam: 'Service hygiène et salubrité',
    slaHours: { low: 336, moderate: 120, high: 48, critical: 12 },
    subtypes: [
      { id: 'illegal-dump', label: 'Dépôt sauvage', baseSeverity: 'high' },
      { id: 'overflow', label: 'Bac débordant', baseSeverity: 'moderate' },
      { id: 'bulky', label: 'Encombrant abandonné', baseSeverity: 'low' },
      { id: 'wreck', label: 'Épave de véhicule', baseSeverity: 'moderate' },
      { id: 'medical', label: 'Déchet dangereux ou médical', baseSeverity: 'critical' },
    ],
  },
  {
    id: 'noise',
    label: 'Nuisances sonores',
    shortLabel: 'Bruit',
    description: 'Mesure acoustique horodatée et géolocalisée, exploitable en preuve.',
    icon: 'AudioWaveform',
    tone: 'cortex',
    defaultTeam: 'Police municipale',
    slaHours: { low: 168, moderate: 72, high: 24, critical: 2 },
    requiresAcoustics: true,
    subtypes: [
      { id: 'bar', label: 'Établissement de nuit', baseSeverity: 'high' },
      { id: 'construction', label: 'Chantier hors horaires', baseSeverity: 'moderate' },
      { id: 'worship', label: 'Sonorisation de plein air', baseSeverity: 'moderate' },
      { id: 'generator', label: 'Groupe électrogène', baseSeverity: 'moderate' },
      { id: 'neighbour', label: 'Voisinage', baseSeverity: 'low' },
    ],
  },
  {
    id: 'security',
    label: 'Sécurité et incivilités',
    shortLabel: 'Sécurité',
    description: 'Remontée confidentielle vers les autorités compétentes, sans exposition publique.',
    icon: 'ShieldAlert',
    tone: 'alert',
    defaultTeam: 'Centre de commandement',
    slaHours: { low: 72, moderate: 24, high: 4, critical: 1 },
    anonymousByDefault: true,
    subtypes: [
      { id: 'banditry', label: 'Acte de banditisme', baseSeverity: 'critical' },
      { id: 'theft', label: 'Vol ou cambriolage', baseSeverity: 'high' },
      { id: 'gathering', label: 'Attroupement hostile', baseSeverity: 'high' },
      { id: 'vandalism', label: 'Vandalisme', baseSeverity: 'moderate' },
      { id: 'suspicious', label: 'Comportement suspect', baseSeverity: 'moderate' },
    ],
  },
  {
    id: 'water',
    label: 'Eau et assainissement',
    shortLabel: 'Eau',
    description: 'Fuite sur conduite, débordement, inondation, réseau à ciel ouvert.',
    icon: 'Droplets',
    tone: 'pulse',
    defaultTeam: 'Régie des eaux',
    slaHours: { low: 336, moderate: 96, high: 24, critical: 4 },
    subtypes: [
      { id: 'leak', label: 'Fuite sur conduite', baseSeverity: 'high' },
      { id: 'sewer', label: 'Débordement d’égout', baseSeverity: 'high' },
      { id: 'flood', label: 'Inondation de quartier', baseSeverity: 'critical' },
      { id: 'no-water', label: 'Coupure prolongée', baseSeverity: 'moderate' },
    ],
  },
  {
    id: 'energy',
    label: 'Énergie et réseaux',
    shortLabel: 'Énergie',
    description: 'Poteau penché, transformateur bruyant, coupure récurrente, ligne à terre.',
    icon: 'Zap',
    tone: 'ember',
    defaultTeam: 'Opérateur de distribution',
    slaHours: { low: 336, moderate: 120, high: 24, critical: 2 },
    subtypes: [
      { id: 'line-down', label: 'Ligne à terre', baseSeverity: 'critical' },
      { id: 'pole', label: 'Poteau instable', baseSeverity: 'high' },
      { id: 'transformer', label: 'Transformateur anormal', baseSeverity: 'high' },
      { id: 'outage', label: 'Coupure récurrente', baseSeverity: 'low' },
    ],
  },
  {
    id: 'buildings',
    label: 'Bâti et patrimoine',
    shortLabel: 'Bâti',
    description: 'Mur fissuré, bâtiment menaçant ruine, tags, mobilier urbain cassé.',
    icon: 'Building2',
    tone: 'cortex',
    defaultTeam: 'Service du patrimoine',
    slaHours: { low: 720, moderate: 336, high: 72, critical: 8 },
    subtypes: [
      { id: 'ruin', label: 'Bâtiment menaçant ruine', baseSeverity: 'critical' },
      { id: 'crack', label: 'Mur fissuré', baseSeverity: 'high' },
      { id: 'graffiti', label: 'Tag ou affichage sauvage', baseSeverity: 'low' },
      { id: 'furniture', label: 'Mobilier urbain dégradé', baseSeverity: 'moderate' },
    ],
  },
  {
    id: 'greenery',
    label: 'Espaces verts',
    shortLabel: 'Espaces verts',
    description: 'Arbre menaçant, végétation envahissante, espace public dégradé.',
    icon: 'TreePine',
    tone: 'signal',
    defaultTeam: 'Espaces verts',
    slaHours: { low: 720, moderate: 336, high: 96, critical: 12 },
    subtypes: [
      { id: 'tree-risk', label: 'Arbre menaçant de tomber', baseSeverity: 'critical' },
      { id: 'overgrowth', label: 'Végétation envahissante', baseSeverity: 'low' },
      { id: 'playground', label: 'Aire de jeux dégradée', baseSeverity: 'moderate' },
    ],
  },
  {
    id: 'other',
    label: 'Autre situation',
    shortLabel: 'Autre',
    description: 'Une situation qui n’entre dans aucune famille : décrivez-la, un agent la qualifie.',
    icon: 'CircleHelp',
    tone: 'pulse',
    defaultTeam: 'Guichet unique',
    slaHours: { low: 720, moderate: 336, high: 96, critical: 24 },
    subtypes: [{ id: 'misc', label: 'Situation non répertoriée', baseSeverity: 'low' }],
  },
];

const CATEGORY_INDEX = new Map(CATEGORIES.map((category) => [category.id, category]));

export function getCategory(id: CategoryId): ReportCategory {
  const category = CATEGORY_INDEX.get(id);
  if (!category) throw new Error(`Catégorie inconnue : ${id}`);
  return category;
}

export function getSubtype(categoryId: CategoryId, subtypeId: string): ReportSubtype | undefined {
  return getCategory(categoryId).subtypes.find((subtype) => subtype.id === subtypeId);
}
