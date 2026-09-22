import { useState } from 'react';
import { cn } from '@/lib/cn';
import { GeneratedScene } from './GeneratedScene';
import { MEDIA, type MediaKey, type MediaShape } from './registry';

const SHAPES: Record<MediaShape, string> = {
  wide: 'aspect-[21/9]',
  landscape: 'aspect-[16/10]',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  circle: 'aspect-square rounded-full',
};

export interface MediaFrameProps {
  media: MediaKey;
  /** Forme imposée, si elle diffère de celle déclarée au registre. */
  shape?: MediaShape;
  /** Voile dégradé par-dessus le visuel, pour poser du texte en surimpression. */
  overlay?: 'none' | 'bottom' | 'left' | 'full';
  /** Effet de balayage lumineux au survol. */
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const OVERLAYS: Record<NonNullable<MediaFrameProps['overlay']>, string> = {
  none: '',
  bottom: 'bg-gradient-to-t from-black/72 via-black/22 to-transparent',
  left: 'bg-gradient-to-r from-black/74 via-black/28 to-transparent',
  full: 'bg-black/42',
};

/**
 * Emplacement média.
 *
 * Affiche la photographie déclarée au registre si le fichier est présent, et
 * bascule sur une composition générée sinon. Les deux partagent le même texte
 * alternatif : le sens de l'image ne dépend pas de sa disponibilité.
 *
 * Conséquence pratique : la mise en page se conçoit et se valide avant que la
 * moindre photographie ait été commandée, et la livraison des visuels ne
 * demande aucune reprise de code.
 */
export function MediaFrame({
  media,
  shape,
  overlay = 'none',
  interactive = false,
  className,
  children,
}: MediaFrameProps) {
  const slot = MEDIA[media];
  const [failed, setFailed] = useState(false);
  const resolvedShape = shape ?? slot.shape;

  return (
    <figure
      className={cn(
        'relative m-0 overflow-hidden bg-[var(--surface-sunken)]',
        SHAPES[resolvedShape],
        resolvedShape !== 'circle' && 'rounded-[var(--radius-lg)]',
        interactive && 'sheen',
        className,
      )}
    >
      {failed ? (
        <GeneratedScene subject={slot.subject} className="size-full object-cover" />
      ) : (
        <img
          src={slot.src}
          alt={slot.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      )}

      {/* Le texte alternatif reste porté par la figure lorsque le repli est actif. */}
      {failed && <span className="sr-only">{slot.alt}</span>}

      {overlay !== 'none' && (
        <span className={cn('pointer-events-none absolute inset-0', OVERLAYS[overlay])} aria-hidden />
      )}

      {children && <div className="absolute inset-0">{children}</div>}
    </figure>
  );
}
