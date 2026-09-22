import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const COLUMNS = [
  {
    title: 'Produit',
    links: [
      { label: 'Signaler un incident', to: '/signaler' },
      { label: 'Carte publique', to: '/carte' },
      { label: 'Suivre un dossier', to: '/suivi' },
      { label: 'Console agent', to: '/console' },
      { label: 'L’offre Signal 242', to: '/solution' },
    ],
  },
  {
    title: 'Segments',
    links: [
      { label: 'Collectivités locales', to: '/solution#segments' },
      { label: 'Autorités de sécurité', to: '/solution#segments' },
      { label: 'Entreprises et sites', to: '/solution#segments' },
      { label: 'Opérateurs de réseaux', to: '/solution#segments' },
    ],
  },
  {
    title: 'Conformité',
    links: [
      { label: 'Protection des données', to: '/solution#confiance' },
      { label: 'Interopérabilité Open311', to: '/solution#confiance' },
      { label: 'Hébergement et souveraineté', to: '/solution#confiance' },
      { label: 'Accessibilité', to: '/solution#confiance' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-subtle">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Service public de signalement des incidents urbains. Dépôt sans compte, délai
            de traitement engagé, suivi par référence.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            Brazzaville · Pointe-Noire · Dolisie
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3.5">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
              {column.title}
            </h3>
            {column.links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="border-t border-subtle">
        <div className="mx-auto flex max-w-[84rem] flex-col gap-2 px-4 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Signal 242. Tous droits réservés.</p>
          <p className="font-mono uppercase tracking-[0.14em]">
            Démonstration fonctionnelle · données fictives
          </p>
        </div>
      </div>
    </footer>
  );
}
