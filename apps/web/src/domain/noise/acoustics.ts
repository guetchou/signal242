/**
 * Traitement acoustique — cœur métier de la mesure de nuisance sonore.
 *
 * Ce module ne connaît ni le navigateur ni le Web Audio API : il reçoit des
 * échantillons numériques et produit des indicateurs normalisés. L'adaptateur
 * `infrastructure/noise/webAudioMeter.ts` se charge de la capture.
 *
 * Limites assumées et documentées dans l'interface utilisateur : un micro de
 * téléphone non calibré ne constitue pas un sonomètre de classe 1 ou 2 au sens
 * de la CEI 61672. Sans étalonnage, la mesure est présentée comme « indicative »
 * et ne peut servir de preuve opposable ; après étalonnage sur source de
 * référence, l'écart type observé sur l'état de l'art est de l'ordre de
 * ±2 dB(A), suffisant pour objectiver une gêne et déclencher un contrôle.
 */

/** Plancher numérique évitant les logarithmes de zéro sur le silence absolu. */
const EPSILON = 1e-12;

/** Niveau de pression acoustique associé à un signal numérique à pleine échelle. */
export const DEFAULT_FULL_SCALE_DB = 94;

/** Valeur efficace (RMS) d'une trame temporelle normalisée [-1, 1]. */
export function rootMeanSquare(samples: Float32Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const sample = samples[i] ?? 0;
    sum += sample * sample;
  }
  return Math.sqrt(sum / samples.length);
}

/** Niveau numérique en dBFS (toujours négatif ou nul). */
export function rmsToDbfs(rms: number): number {
  return 20 * Math.log10(Math.max(rms, EPSILON));
}

/**
 * Conversion dBFS -> dB SPL.
 * `calibrationOffsetDb` corrige la sensibilité propre du terminal, déterminée
 * lors de l'étalonnage utilisateur contre une source ou un sonomètre de référence.
 */
export function dbfsToSpl(dbfs: number, calibrationOffsetDb = 0): number {
  return dbfs + DEFAULT_FULL_SCALE_DB + calibrationOffsetDb;
}

/**
 * Gain de pondération A à une fréquence donnée (CEI 61672-1).
 * La pondération A modélise la sensibilité de l'oreille humaine : elle atténue
 * fortement les très basses fréquences, que le micro capte pourtant largement.
 */
export function aWeightingGainDb(frequencyHz: number): number {
  const f = Math.max(frequencyHz, 1);
  const f2 = f * f;
  const numerator = 12194 ** 2 * f2 * f2;
  const denominator =
    (f2 + 20.6 ** 2) *
    Math.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2)) *
    (f2 + 12194 ** 2);
  return 20 * Math.log10(numerator / denominator) + 2.0;
}

/**
 * Niveau pondéré A calculé à partir d'un spectre de puissance.
 * @param magnitudes amplitudes linéaires par bande
 * @param sampleRate fréquence d'échantillonnage en Hz
 */
export function aWeightedLevelDb(magnitudes: Float32Array, sampleRate: number): number {
  const binCount = magnitudes.length;
  if (binCount === 0) return -Infinity;
  const binWidth = sampleRate / 2 / binCount;

  let energy = 0;
  for (let bin = 0; bin < binCount; bin += 1) {
    const magnitude = magnitudes[bin] ?? 0;
    const gain = 10 ** (aWeightingGainDb((bin + 0.5) * binWidth) / 20);
    const weighted = magnitude * gain;
    energy += weighted * weighted;
  }
  return 20 * Math.log10(Math.max(Math.sqrt(energy / binCount), EPSILON));
}

/**
 * Niveau continu équivalent LAeq : moyenne **énergétique** des niveaux.
 * Une moyenne arithmétique de décibels serait acoustiquement fausse — deux
 * sources de 60 dB produisent 63 dB, pas 60.
 */
export function equivalentLevel(levelsDb: readonly number[]): number {
  const finite = levelsDb.filter((level) => Number.isFinite(level));
  if (finite.length === 0) return 0;
  const energy = finite.reduce((sum, level) => sum + 10 ** (level / 10), 0);
  return 10 * Math.log10(energy / finite.length);
}

/**
 * Niveau dépassé pendant `percent` % du temps de mesure.
 * L90 approxime le bruit de fond, L10 les émergences.
 */
export function percentileLevel(levelsDb: readonly number[], percent: number): number {
  const finite = levelsDb.filter((level) => Number.isFinite(level)).sort((a, b) => a - b);
  if (finite.length === 0) return 0;
  const index = Math.min(
    finite.length - 1,
    Math.max(0, Math.round(((100 - percent) / 100) * (finite.length - 1))),
  );
  return finite[index] ?? 0;
}

/** Période réglementaire, déterminante pour le seuil applicable. */
export type NoisePeriod = 'day' | 'evening' | 'night';

export function periodAt(date: Date): NoisePeriod {
  const hour = date.getHours();
  if (hour >= 7 && hour < 19) return 'day';
  if (hour >= 19 && hour < 22) return 'evening';
  return 'night';
}

export const PERIOD_LABELS: Readonly<Record<NoisePeriod, string>> = {
  day: 'Jour (7h-19h)',
  evening: 'Soirée (19h-22h)',
  night: 'Nuit (22h-7h)',
};

/**
 * Seuils de gêne en zone résidentielle, en dB(A).
 * Alignés sur les recommandations OMS pour le bruit environnemental et sur la
 * pratique réglementaire française d'émergence en zone d'habitation. Paramétrables
 * par collectivité : chaque territoire peut substituer son propre arrêté.
 */
export const PERIOD_THRESHOLDS: Readonly<Record<NoisePeriod, number>> = {
  day: 55,
  evening: 50,
  night: 40,
};

export type NoiseVerdict = 'calm' | 'moderate' | 'disturbing' | 'harmful';

export const VERDICT_LABELS: Readonly<Record<NoiseVerdict, string>> = {
  calm: 'Ambiance calme',
  moderate: 'Niveau courant',
  disturbing: 'Gêne caractérisée',
  harmful: 'Niveau nocif',
};

/** Qualification du niveau mesuré au regard du seuil de la période. */
export function classifyLevel(laeq: number, period: NoisePeriod): NoiseVerdict {
  const threshold = PERIOD_THRESHOLDS[period];
  if (laeq >= 85) return 'harmful';
  if (laeq >= threshold + 5) return 'disturbing';
  if (laeq >= threshold - 5) return 'moderate';
  return 'calm';
}

/**
 * Émergence : écart entre le niveau ambiant mesuré et le bruit de fond.
 * C'est l'indicateur retenu par la réglementation pour caractériser un trouble,
 * plus pertinent qu'un niveau absolu en milieu déjà bruyant.
 */
export function emergence(laeq: number, backgroundL90: number): number {
  return Math.round((laeq - backgroundL90) * 10) / 10;
}

/** Repère sonore familier associé à un niveau, pour rendre la mesure lisible. */
export function levelReference(laeq: number): string {
  if (laeq < 35) return 'Chambre la nuit';
  if (laeq < 50) return 'Bibliothèque';
  if (laeq < 60) return 'Conversation à 1 m';
  if (laeq < 70) return 'Rue passante';
  if (laeq < 80) return 'Trafic dense';
  if (laeq < 90) return 'Groupe électrogène proche';
  if (laeq < 100) return 'Sonorisation de concert';
  return 'Seuil de douleur approché';
}
