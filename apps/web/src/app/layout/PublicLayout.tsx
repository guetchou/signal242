import { Outlet, ScrollRestoration } from 'react-router-dom';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

/** Gabarit des pages publiques : en-tête persistant, contenu, pied de page. */
export function PublicLayout() {
  return (
    <div className="relative min-h-screen">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-signal-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-night-950"
      >
        Aller au contenu principal
      </a>
      <SiteHeader />
      <main id="contenu">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  );
}
