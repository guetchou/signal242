import { useState } from 'react';
import { ChevronDown, TriangleAlert } from 'lucide-react';
import { EMERGENCY_CONTACTS, IS_DEMO } from '@/config/demo';
import { cn } from '@/lib/cn';

const STORAGE_KEY = 'signal242.demo-banner.collapsed';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Avertissement de démonstration.
 *
 * Réductible, jamais supprimable. Un visiteur qui le ferme définitivement
 * pourrait ensuite déposer un signalement en croyant alerter sa mairie ; la
 * version réduite reste donc visible sur tous les écrans, en permanence.
 *
 * Ce bandeau disparaît de lui-même lorsque `VITE_DEMO_MODE=false`, c'est-à-dire
 * lorsque les signalements sont réellement reçus. Aucune intervention manuelle
 * n'est requise le jour de la mise en service, et aucun oubli n'est possible
 * dans l'autre sens.
 */
export function DemoBanner() {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  if (!IS_DEMO) return null;

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Préférence non persistée : le bandeau reste affiché, ce qui est le
      // comportement sûr.
    }
  };

  return (
    <aside
      role="note"
      aria-label="Avertissement : version de démonstration"
      className="relative z-[60] border-b border-[var(--tone-ember-border)] bg-[var(--tone-ember-bg)]"
    >
      <div className="mx-auto flex max-w-[84rem] items-start gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <TriangleAlert
          className="mt-0.5 size-4 shrink-0 text-[var(--tone-ember-text)]"
          aria-hidden
        />

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[var(--tone-ember-text)]">
            Version de démonstration — vos signalements ne sont transmis à personne.
          </p>

          {!collapsed && (
            <div className="mt-1.5 flex flex-col gap-1.5 text-[12px] leading-relaxed text-secondary">
              <p>
                Ce site présente le fonctionnement de Signal 242. Les dossiers affichés sont
                fictifs et générés localement ; un signalement déposé ici reste dans votre
                navigateur, n’est reçu par aucun service et disparaît au rechargement de la page.
              </p>
              <p className="font-medium text-primary">
                Pour un problème réel, contactez directement votre mairie ou votre commissariat.
                En cas d’urgence mettant en jeu la sécurité d’une personne,{' '}
                {EMERGENCY_CONTACTS.length > 0 ? (
                  <>
                    composez le{' '}
                    {EMERGENCY_CONTACTS.map((contact, index) => (
                      <span key={contact.number}>
                        {index > 0 && ' ou le '}
                        <a href={`tel:${contact.number}`} className="underline">
                          {contact.number}
                        </a>{' '}
                        ({contact.label})
                      </span>
                    ))}
                    .
                  </>
                ) : (
                  'composez le numéro d’urgence de votre localité.'
                )}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          className="shrink-0 rounded-[var(--radius-xs)] px-2 py-1 text-[11px] font-medium text-[var(--tone-ember-text)] transition-colors hover:bg-[var(--state-hover)]"
        >
          <span className="flex items-center gap-1">
            {collapsed ? 'En savoir plus' : 'Réduire'}
            <ChevronDown className={cn('size-3 transition-transform', !collapsed && 'rotate-180')} aria-hidden />
          </span>
        </button>
      </div>
    </aside>
  );
}
