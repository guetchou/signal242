/**
 * Rôles chromatiques du design system.
 *
 * Une seule table associe chaque rôle à ses classes utilitaires. Les composants
 * consomment cette table : changer l'identité visuelle se fait ici, pas dans
 * quarante fichiers.
 */

export type Tone = 'signal' | 'ember' | 'alert' | 'cortex' | 'pulse' | 'neutral';

interface ToneStyle {
  readonly text: string;
  readonly bg: string;
  readonly border: string;
  readonly dot: string;
  readonly glow: string;
  /** Couleur brute, pour le canevas SVG et la cartographie. */
  readonly hex: string;
}

export const TONES: Readonly<Record<Tone, ToneStyle>> = {
  signal: {
    text: 'text-signal-300',
    bg: 'bg-signal-400/12',
    border: 'border-signal-400/30',
    dot: 'bg-signal-400',
    glow: 'shadow-[0_0_20px_-4px_rgb(16_217_163_/_0.55)]',
    hex: '#10d9a3',
  },
  ember: {
    text: 'text-ember-300',
    bg: 'bg-ember-400/12',
    border: 'border-ember-400/30',
    dot: 'bg-ember-400',
    glow: 'shadow-[0_0_20px_-4px_rgb(255_182_39_/_0.55)]',
    hex: '#ffb627',
  },
  alert: {
    text: 'text-alert-300',
    bg: 'bg-alert-400/12',
    border: 'border-alert-400/30',
    dot: 'bg-alert-400',
    glow: 'shadow-[0_0_20px_-4px_rgb(255_77_94_/_0.55)]',
    hex: '#ff4d5e',
  },
  cortex: {
    text: 'text-cortex-300',
    bg: 'bg-cortex-400/12',
    border: 'border-cortex-400/30',
    dot: 'bg-cortex-400',
    glow: 'shadow-[0_0_20px_-4px_rgb(124_92_255_/_0.55)]',
    hex: '#7c5cff',
  },
  pulse: {
    text: 'text-pulse-300',
    bg: 'bg-pulse-400/12',
    border: 'border-pulse-400/30',
    dot: 'bg-pulse-400',
    glow: 'shadow-[0_0_20px_-4px_rgb(34_195_240_/_0.55)]',
    hex: '#22c3f0',
  },
  neutral: {
    text: 'text-secondary',
    bg: 'surface-raised',
    border: 'border-default',
    dot: 'bg-night-400',
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
