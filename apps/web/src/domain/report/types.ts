/**
 * Modèle de domaine « signalement ».
 *
 * Ce module est volontairement dépourvu de toute dépendance React, réseau ou
 * navigateur : il décrit le vocabulaire métier partagé par le portail citoyen,
 * la console d'exploitation et, à terme, l'API. Les adaptateurs
 * (infrastructure/) traduisent ce modèle vers/depuis le transport.
 *
 * Compatibilité : les statuts et champs sont alignés sur Open311 GeoReport v2
 * (open / closed / in_progress ...) afin de permettre l'exposition d'une API
 * conforme sans refonte du modèle interne.
 */

/** Cycle de vie d'un signalement, du dépôt à la clôture. */
export type ReportStatus =
  | 'submitted' // déposé par le citoyen, non encore qualifié
  | 'triaged' // qualifié et affecté à un service
  | 'in_progress' // intervention engagée
  | 'resolved' // résolu, en attente de confirmation
  | 'closed' // clos et confirmé
  | 'rejected'; // hors périmètre, doublon ou non fondé

/** Niveau d'urgence, issu du croisement gravité x exposition x récurrence. */
export type Severity = 'low' | 'moderate' | 'high' | 'critical';

/** Canal de dépôt : conditionne la richesse des preuves disponibles. */
export type ReportChannel = 'mobile' | 'web' | 'ussd' | 'whatsapp' | 'call_center' | 'sensor';

/** Identifiants stables des familles de signalement. */
export type CategoryId =
  | 'roads'
  | 'lighting'
  | 'waste'
  | 'noise'
  | 'security'
  | 'water'
  | 'energy'
  | 'buildings'
  | 'greenery'
  | 'other';

export interface GeoPoint {
  readonly lat: number;
  readonly lng: number;
  /** Précision horizontale en mètres remontée par le GPS. */
  readonly accuracyM?: number;
}

export interface Address {
  readonly label: string;
  readonly district: string;
  readonly city: string;
}

export type AttachmentKind = 'photo' | 'audio' | 'video';

export interface Attachment {
  readonly id: string;
  readonly kind: AttachmentKind;
  readonly url: string;
  readonly capturedAt: string;
  /** Empreinte utilisée pour la détection de doublons et la preuve d'intégrité. */
  readonly hash?: string;
}

/**
 * Mesure acoustique attachée à un signalement de nuisance sonore.
 * Les indicateurs suivent la terminologie normalisée (NF S 31-010 / IEC 61672).
 */
export interface NoiseMeasurement {
  /** Niveau continu équivalent pondéré A sur la durée de mesure, en dB(A). */
  readonly laeq: number;
  /** Niveau crête observé, en dB(A). */
  readonly lmax: number;
  /** Niveau de bruit de fond (percentile 90), en dB(A). */
  readonly l90: number;
  readonly durationS: number;
  /** Décalage de calibration appliqué au micro, en dB. */
  readonly calibrationOffsetDb: number;
  /** Faux si le terminal n'a pas été calibré : la mesure reste indicative. */
  readonly calibrated: boolean;
  readonly measuredAt: string;
}

/** Événement horodaté du journal d'audit, non modifiable. */
export interface TimelineEvent {
  readonly id: string;
  readonly at: string;
  readonly kind: 'created' | 'status' | 'assignment' | 'comment' | 'evidence' | 'sla';
  readonly label: string;
  readonly actor: string;
  readonly detail?: string;
}

export interface Report {
  readonly id: string;
  /** Référence publique communiquée au citoyen (ex. SIG-2K5F-42). */
  readonly reference: string;
  readonly categoryId: CategoryId;
  readonly subtypeId: string;
  readonly title: string;
  readonly description: string;
  readonly status: ReportStatus;
  readonly severity: Severity;
  readonly channel: ReportChannel;
  readonly position: GeoPoint;
  readonly address: Address;
  readonly createdAt: string;
  readonly updatedAt: string;
  /** Échéance contractuelle de traitement, calculée au dépôt. */
  readonly dueAt: string;
  readonly anonymous: boolean;
  readonly reporterAlias: string;
  readonly assignedTeam?: string;
  /** Nombre de citoyens ayant confirmé le même problème (signal de priorité). */
  readonly confirmations: number;
  readonly attachments: readonly Attachment[];
  readonly noise?: NoiseMeasurement;
  readonly timeline: readonly TimelineEvent[];
}

/** Charge utile de création, avant enrichissement serveur. */
export interface ReportDraft {
  categoryId: CategoryId;
  subtypeId: string;
  title: string;
  description: string;
  position: GeoPoint | null;
  address: Address | null;
  severity: Severity;
  anonymous: boolean;
  attachments: Attachment[];
  noise?: NoiseMeasurement;
  channel: ReportChannel;
}
