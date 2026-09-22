import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { TONES, type Tone } from './tones';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  align?: 'left' | 'center';
  /**
   * Niveau de titre.
   *
   * Une page porte exactement un `h1` : le titre principal de l'écran. Les
   * sections qui la composent restent en `h2`, niveau par défaut. Ce réglage
   * relève de la structure du document, non de la taille du texte, qui reste
   * identique dans les deux cas.
   */
  as?: Extract<ElementType, 'h1' | 'h2'>;
  className?: string;
}

/** En-tête de section éditoriale, avec surtitre typé et filet lumineux. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = 'signal',
  align = 'left',
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  const style = TONES[tone];
  return (
    <header
      className={cn('flex flex-col gap-4', align === 'center' && 'items-center text-center', className)}
    >
      {eyebrow && (
        <div className={cn('flex items-center gap-2.5', align === 'center' && 'justify-center')}>
          <span className={cn('h-px w-8 bg-gradient-to-r from-transparent', style.dot)} aria-hidden />
          <span
            className={cn(
              'font-mono text-[11px] font-semibold uppercase tracking-[0.22em]',
              style.text,
            )}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <Heading className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">{title}</Heading>
      {description && (
        <p className={cn('max-w-2xl text-base leading-relaxed text-muted', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </header>
  );
}
