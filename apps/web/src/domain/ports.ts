/**
 * Ports du domaine — frontières d'inversion de dépendance.
 *
 * L'interface utilisateur ne dépend que de ces contrats. Une implémentation
 * `mock` alimente la démonstration ; une implémentation `http` branchée sur
 * l'API Signal 242 la remplacera sans toucher une seule vue.
 */

import type {
  Report,
  ReportDraft,
  CategoryId,
  GeoPoint,
  ReportStatus,
  Severity,
} from './report/types';

export interface ReportQuery {
  /** Restreint aux signalements situés dans un rayon autour d'un point. */
  readonly near?: { readonly point: GeoPoint; readonly radiusM: number };
  readonly categoryIds?: readonly CategoryId[];
  readonly statuses?: readonly ReportStatus[];
  readonly severities?: readonly Severity[];
  readonly districts?: readonly string[];
  readonly search?: string;
}

export interface ReportRepository {
  list(query?: ReportQuery): Promise<readonly Report[]>;
  getByReference(reference: string): Promise<Report | null>;
  create(draft: ReportDraft): Promise<Report>;
  updateStatus(id: string, status: ReportStatus, note?: string): Promise<Report>;
  confirm(id: string): Promise<Report>;
}

/** Résultat d'une résolution de position en adresse lisible. */
export interface ResolvedPlace {
  readonly label: string;
  readonly district: string;
  readonly city: string;
}

export interface GeolocationPort {
  current(): Promise<{ lat: number; lng: number; accuracyM?: number }>;
  reverse(lat: number, lng: number): Promise<ResolvedPlace>;
}

/** Trame d'analyse émise par le sonomètre, environ 10 fois par seconde. */
export interface NoiseFrame {
  readonly instantDb: number;
  readonly laeq: number;
  readonly lmax: number;
  readonly l90: number;
  readonly elapsedS: number;
  /** Spectre réduit pour la visualisation, valeurs normalisées [0, 1]. */
  readonly spectrum: readonly number[];
}

export interface NoiseMeterPort {
  start(onFrame: (frame: NoiseFrame) => void): Promise<void>;
  stop(): void;
  /** Décalage d'étalonnage en dB, persisté entre deux sessions. */
  setCalibrationOffset(offsetDb: number): void;
  isCalibrated(): boolean;
}
