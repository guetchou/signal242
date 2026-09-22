import { useState } from 'react';
import { Check, ChevronDown, MapPinned } from 'lucide-react';
import { useTerritory } from '@/app/providers/TerritoryProvider';
import { TERRITORIES } from '@/domain/territory/territories';
import { cn } from '@/lib/cn';

/**
 * Sélecteur de territoire.
 *
 * En déploiement réel, le territoire est déterminé par l'instance servie et ce
 * sélecteur n'existe pas. Il est conservé ici pour montrer que la plateforme
 * n'est pas peinte aux couleurs d'une ville mais qu'elle adopte celles de
 * chacune — ce qui distingue une offre mutualisée d'un produit générique.
 */
export function TerritorySwitcher({ className }: { className?: string }) {
  const { territory, setTerritory } = useTerritory();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-2 rounded-full border border-subtle px-3 py-1.5 text-[12px] text-muted transition-colors hover:border-strong hover:text-primary"
      >
        <MapPinned className="size-3.5 text-[var(--accent)]" aria-hidden />
        {territory.name}
        <ChevronDown
          className={cn('size-3 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <ul
            role="listbox"
            aria-label="Choisir un territoire"
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-[var(--radius-md)] glass shadow-depth"
          >
            {TERRITORIES.map((item) => {
              const active = item.id === territory.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setTerritory(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                      active ? 'bg-[var(--accent-surface)]' : 'hover:bg-[var(--state-hover)]',
                    )}
                  >
                    <span className="mt-1 flex size-3.5 shrink-0 items-center justify-center">
                      {active ? (
                        <Check className="size-3.5 text-[var(--accent)]" aria-hidden />
                      ) : (
                        <span
                          className="size-2.5 rounded-full border border-strong"
                          aria-hidden
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-primary">
                        {item.name}
                      </span>
                      <span className="block text-[11px] text-muted">{item.nickname}</span>
                      <span className="mt-0.5 block text-[11px] text-faint">
                        {item.paletteLabel}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
