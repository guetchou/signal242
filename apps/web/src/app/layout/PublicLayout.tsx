import { Outlet, ScrollRestoration } from 'react-router-dom';
import { MobileActionBar } from './MobileActionBar';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

/** Gabarit des pages publiques : en-tête persistant, contenu, pied de page. */
export function PublicLayout() {
  return (
    <div className="relative min-h-screen">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--accent-contrast)]"
      >
        Aller au contenu principal
      </a>
      <SiteHeader />
      <main id="contenu">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileActionBar />
      {/* Réserve d'espace sous le pied de page : la barre flottante ne doit
          jamais recouvrir le dernier lien de la page. */}
      <div className="h-20 sm:hidden" aria-hidden />
      <ScrollRestoration />
    </div>
  );
}
