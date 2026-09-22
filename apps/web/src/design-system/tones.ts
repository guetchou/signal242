/**
 * Rôles chromatiques du design system.
 *
 * Chaque rôle est résolu par une variable de thème, non par un palier de
 * palette figé : une teinte lisible sur fond sombre ne l'est pas sur fond
 * clair. Changer l'identité visuelle se fait dans `styles/tokens.css`, pas
 * dans quarante composants.
 */

export type Tone = 'signal' | 'ember' | 'alert' | 'cortex' | 'pulse' | 'neutral';

interface ToneStyle {
  readonly text: string;
  readonly bg: string;
  readonly border: string;
  readonly dot: string;
  readonly glow: string;
  /**
   * Couleur brute pour le canevas SVG et la cartographie, où seule une valeur
   * littérale est acceptée. Identique dans les deux thèmes : ces marques sont
   * toujours posées sur un fond sombre ou coloré, jamais sur du texte.
   */
  readonly hex: string;
}

export const TONES: Readonly<Record<Tone, ToneStyle>> = {
  signal: {
    text: 'text-[var(--tone-signal-text)]',
    bg: 'bg-[var(--tone-signal-bg)]',
    border: 'border-[var(--tone-signal-border)]',
    dot: 'bg-[var(--tone-signal-mark)]',
    glow: 'shadow-[0_0_20px_-4px_rgb(16_217_163_/_0.45)]',
    hex: '#10d9a3',
  },
  ember: {
    text: 'text-[var(--tone-ember-text)]',
    bg: 'bg-[var(--tone-ember-bg)]',
    border: 'border-[var(--tone-ember-border)]',
    dot: 'bg-[var(--tone-ember-mark)]',
    glow: 'shadow-[0_0_20px_-4px_rgb(255_182_39_/_0.45)]',
    hex: '#ffb627',
  },
  alert: {
    text: 'text-[var(--tone-alert-text)]',
    bg: 'bg-[var(--tone-alert-bg)]',
    border: 'border-[var(--tone-alert-border)]',
    dot: 'bg-[var(--tone-alert-mark)]',
    glow: 'shadow-[0_0_20px_-4px_rgb(255_77_94_/_0.45)]',
    hex: '#ff4d5e',
  },
  cortex: {
    text: 'text-[var(--tone-cortex-text)]',
    bg: 'bg-[var(--tone-cortex-bg)]',
    border: 'border-[var(--tone-cortex-border)]',
    dot: 'bg-[var(--tone-cortex-mark)]',
    glow: 'shadow-[0_0_20px_-4px_rgb(124_92_255_/_0.45)]',
    hex: '#7c5cff',
  },
  pulse: {
    text: 'text-[var(--tone-pulse-text)]',
    bg: 'bg-[var(--tone-pulse-bg)]',
    border: 'border-[var(--tone-pulse-border)]',
    dot: 'bg-[var(--tone-pulse-mark)]',
    glow: 'shadow-[0_0_20px_-4px_rgb(34_195_240_/_0.45)]',
    hex: '#22c3f0',
  },
  neutral: {
    text: 'text-[var(--tone-neutral-text)]',
    bg: 'bg-[var(--tone-neutral-bg)]',
    border: 'border-[var(--tone-neutral-border)]',
    dot: 'bg-[var(--tone-neutral-mark)]',
    glow: '',
    hex: '#8996ac',
  },
};

/** Correspondance gravité -> rôle chromatique, utilisée partout. */
export const SEVERITY_TONE = {
  low: 'pulse',
  moderate: 'ember',
  high: 'ember',
  critical: 'alert',
} as const satisfies Record<string, Tone>;

/** Correspondance statut -> rôle chromatique. */
export const STATUS_TONE = {
  submitted: 'pulse',
  triaged: 'cortex',
  in_progress: 'ember',
  resolved: 'signal',
  closed: 'neutral',
  rejected: 'neutral',
} as const satisfies Record<string, Tone>;

/** Correspondance état de délai -> rôle chromatique. */
export const SLA_TONE = {
  met: 'signal',
  on_track: 'signal',
  at_risk: 'ember',
  breached: 'alert',
} as const satisfies Record<string, Tone>;
