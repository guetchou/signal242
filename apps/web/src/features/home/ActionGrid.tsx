import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { resolveIcon, TONES } from '@/design-system';
import { CATEGORIES } from '@/domain/report/categories';
import type { CategoryId } from '@/domain/report/types';
import { formatDuration } from '@/lib/format';
import { cn } from '@/lib/cn';

/**
 * Ambiances de famille.
 *
 * Trois familles seulement en portent une, et chacune dit quelque chose du
 * terrain : la pluie sur l'eau et l'assainissement, dont les signalements
 * suivent la saison ; le feuillage sur les espaces verts ; la houle sur rien
 * d'autre que le littoral. Ailleurs, aucune animation — un effet sans motif
 * n'est que du bruit.
 */
const CATEGORY_AMBIENCE: Partial<Record<CategoryId, string>> = {
  water: 'ambient-rain',
  greenery: 'ambient-foliage',
};

/**
 * Point d'entrée principal de l'application.
 *
 * Chaque tuile n'est pas une description de fonctionnalité mais un départ de
 * parcours : elle ouvre le formulaire déjà positionné sur la bonne famille.
 * L'utilisateur qui arrive a un problème sous les yeux ; il doit agir au
 * premier clic, pas lire une brochure.
 */
export function ActionGrid() {
  return (
    <nav aria-label="Choisir le type de problème à signaler">
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category) => {
          const Icon = resolveIcon(category.icon);
          const tone = TONES[category.tone];
          return (
            <li key={category.id}>
              <Link
                to="/signaler"
                state={{ categoryId: category.id }}
                className={cn(
                  'group relative isolate flex h-full flex-col gap-3 overflow-hidden rounded-[var(--radius-md)]',
                  'border border-subtle surface-base p-4',
                  'transition-[border-color,box-shadow,transform] duration-[var(--duration-fast)]',
                  'hover:-translate-y-0.5 hover:border-strong hover:shadow-[var(--shadow-md)]',
                )}
              >
                {CATEGORY_AMBIENCE[category.id] && (
                  <span
                    className={cn(
                      'ambient -z-10 opacity-0 transition-opacity duration-[var(--duration-base)]',
                      'group-hover:opacity-100',
                      CATEGORY_AMBIENCE[category.id],
                    )}
                    aria-hidden
                  />
                )}
                <span className={cn('grid size-10 place-items-center rounded-[var(--radius-sm)]', tone.bg)}>
                  <Icon className={cn('size-5', tone.text)} aria-hidden />
                </span>

                <span className="flex-1">
                  <span className="block text-[14px] font-semibold text-primary">
                    {category.shortLabel}
                  </span>
                  <span className="mt-1 block text-[12px] leading-snug text-muted">
                    {category.subtypes
                      .slice(0, 2)
                      .map((subtype) => subtype.label)
                      .join(', ')}
                  </span>
                </span>

                <span className="flex items-center justify-between border-t border-subtle pt-2.5">
                  <span className="text-[11px] text-faint">
                    urgent : {formatDuration(category.slaHours.critical)}
                  </span>
                  <ChevronRight
                    className="size-3.5 text-faint transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
