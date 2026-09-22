import { resolveIcon, TONES } from '@/design-system';
import { CATEGORIES } from '@/domain/report/categories';
import { cn } from '@/lib/cn';

const FEED = [
  { categoryId: 'roads', text: 'Nid-de-poule confirmé par 12 riverains', place: 'Moungali' },
  { categoryId: 'noise', text: '81 dB(A) relevés à 00 h 12', place: 'Poto-Poto' },
  { categoryId: 'lighting', text: 'Lampadaire rétabli en 6 h', place: 'Talangaï' },
  { categoryId: 'waste', text: 'Dépôt sauvage évacué, 3,2 t', place: 'Ouenzé' },
  { categoryId: 'security', text: 'Alerte transmise au centre de commandement', place: 'Makélékélé' },
  { categoryId: 'water', text: 'Fuite colmatée, coupure évitée', place: 'Bacongo' },
  { categoryId: 'energy', text: 'Poteau instable sécurisé', place: 'Djiri' },
  { categoryId: 'greenery', text: 'Arbre menaçant abattu', place: 'Mfilou' },
] as const;

/**
 * Bandeau d'activité défilant.
 *
 * Preuve de vitalité de la plateforme : un produit d'exploitation se juge à son
 * flux. Purement décoratif pour l'accessibilité, il est masqué aux technologies
 * d'assistance et figé si l'utilisateur limite les animations.
 */
export function LiveTicker() {
  const items = [...FEED, ...FEED];

  return (
    <div
      className="relative overflow-hidden border-y border-subtle surface-raised py-3"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--surface-canvas)] to-transparent"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--surface-canvas)] to-transparent"
      />

      <div
        className="flex w-max items-center gap-10"
        style={{ animation: 'ticker 46s linear infinite' }}
      >
        {items.map((item, index) => {
          const category = CATEGORIES.find((entry) => entry.id === item.categoryId)!;
          const Icon = resolveIcon(category.icon);
          const tone = TONES[category.tone];
          return (
            <span key={`${item.text}-${index}`} className="flex shrink-0 items-center gap-2.5">
              <Icon className={cn('size-4', tone.text)} />
              <span className="text-[13px] text-secondary">{item.text}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {item.place}
              </span>
              <span className="h-3 w-px bg-[var(--border-default)]" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
