import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Elevation = 'flat' | 'raised' | 'floating';

const ELEVATIONS: Record<Elevation, string> = {
  flat: 'surface-raised border border-subtle',
  raised: 'surface-raised border border-subtle shadow-panel',
  floating: 'glass shadow-depth',
};

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  /** Cadre lumineux dégradé — réservé aux panneaux de premier plan. */
  bezel?: boolean;
  padded?: boolean;
  children: ReactNode;
}

/** Conteneur de surface : brique de mise en page de toute l'application. */
export function Panel({
  elevation = 'raised',
  bezel = false,
  padded = true,
  className,
  children,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)]',
        ELEVATIONS[elevation],
        bezel && 'bezel',
        padded && 'p-5 sm:p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
