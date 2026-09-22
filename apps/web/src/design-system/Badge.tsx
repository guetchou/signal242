import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { TONES, type Tone } from './tones';

export interface BadgeProps {
  tone?: Tone;
  /** Affiche une pastille colorée, avec halo animé pour les états vivants. */
  dot?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', dot, pulse, size = 'sm', className, children }: BadgeProps) {
  const style = TONES[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
        style.bg,
        style.border,
        style.text,
        className,
      )}
    >
      {dot && (
        <span className="relative flex size-1.5">
          {pulse && (
            <span
              className={cn('absolute inline-flex size-full rounded-full opacity-70', style.dot)}
              style={{ animation: 'pulse-ring 1.8s var(--ease-out-expo) infinite' }}
              aria-hidden
            />
          )}
          <span className={cn('relative inline-flex size-1.5 rounded-full', style.dot)} />
        </span>
      )}
      {children}
    </span>
  );
}
