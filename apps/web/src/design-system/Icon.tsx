import {
  AudioWaveform,
  Building2,
  CircleHelp,
  Droplets,
  Lightbulb,
  ShieldAlert,
  TrafficCone,
  Trash2,
  TreePine,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Résolution nom -> composant d'icône.
 *
 * Le domaine ne référence qu'une chaîne ; cette table est le seul point de
 * couplage entre le catalogue métier et la bibliothèque d'icônes. Changer de
 * bibliothèque revient à réécrire ce fichier seul.
 */
const REGISTRY: Record<string, LucideIcon> = {
  TrafficCone,
  Lightbulb,
  Trash2,
  AudioWaveform,
  ShieldAlert,
  Droplets,
  Zap,
  Building2,
  TreePine,
  CircleHelp,
};

export function resolveIcon(name: string): LucideIcon {
  return REGISTRY[name] ?? CircleHelp;
}
