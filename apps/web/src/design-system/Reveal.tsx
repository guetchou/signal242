import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReveal } from '@/lib/useReveal';

export interface RevealProps {
  delay?: number;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Enveloppe d'apparition au défilement ; neutralisée si l'utilisateur le demande. */
export function Reveal({ delay = 0, as: Tag = 'div', className, children }: RevealProps) {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <Tag ref={ref} className={cn('reveal', className)}>
      {children}
    </Tag>
  );
}
