import { useEffect, useRef } from 'react';

/**
 * Révélation progressive au défilement.
 *
 * Une seule fois par élément, puis l'observateur se détache : aucune charge
 * résiduelle sur les pages longues. Respecte `prefers-reduced-motion` via la
 * feuille de styles, qui neutralise la transition.
 */
export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        window.setTimeout(() => element.setAttribute('data-visible', 'true'), delayMs);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delayMs]);

  return ref;
}
