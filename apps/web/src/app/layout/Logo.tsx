import { cn } from '@/lib/cn';

export interface LogoProps {
  className?: string;
  /** Masque le libellé textuel sur les surfaces contraintes. */
  compact?: boolean;
}

/**
 * Signature de marque.
 *
 * Le glyphe reprend le motif d'onde propagée : trois arcs concentriques
 * émis depuis un point — le signal qui part du citoyen vers l'institution.
 */
export function Logo({ className, compact }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid size-9 place-items-center">
        <svg viewBox="0 0 36 36" className="size-9" aria-hidden>
          <defs>
            <linearGradient id="logo-arc" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-signal-500)" />
              <stop offset="60%" stopColor="var(--color-signal-300)" />
              <stop offset="100%" stopColor="var(--color-pulse-300)" />
            </linearGradient>
          </defs>
          <circle cx="18" cy="26" r="3.6" fill="url(#logo-arc)" />
          <path d="M9.5 21a11 11 0 0 1 17 0" fill="none" stroke="url(#logo-arc)" strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
          <path d="M4.5 15.5a18 18 0 0 1 27 0" fill="none" stroke="url(#logo-arc)" strokeWidth="2.6" strokeLinecap="round" opacity="0.5" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-bold tracking-tight text-primary">
            Signal<span className="text-signal-400">242</span>
          </span>
          <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
            Civic Response OS
          </span>
        </span>
      )}
    </span>
  );
}
