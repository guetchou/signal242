import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Radio, X } from 'lucide-react';
import { Button } from '@/design-system';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { to: '/', label: 'Plateforme', end: true },
  { to: '/carte', label: 'Carte publique' },
  { to: '/suivi', label: 'Suivre un dossier' },
  { to: '/console', label: 'Console agent' },
];

/** En-tête public : navigation, bascule de thème et appel à l'action principal. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-[var(--duration-base)]',
        scrolled ? 'glass shadow-depth' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[84rem] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Signal 242, accueil">
          <Logo />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-[var(--radius-sm)] px-3 py-2 text-[13px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted hover:text-primary',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-subtle px-3 py-1.5 md:inline-flex">
            <Radio className="size-3 text-[var(--tone-signal-text)]" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Brazzaville · en service
            </span>
          </span>
          <ThemeToggle />
          <Link to="/signaler" className="hidden sm:inline-flex">
            <Button size="sm">Signaler</Button>
          </Link>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-[var(--radius-sm)] border border-subtle text-muted lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="glass border-t border-subtle px-4 py-3 lg:hidden" aria-label="Navigation mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'block rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium',
                  isActive ? 'surface-raised text-primary' : 'text-muted',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/signaler"
            className="mt-2 block rounded-[var(--radius-sm)] bg-[var(--accent)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--accent-contrast)]"
          >
            Déposer un signalement
          </Link>
        </nav>
      )}
    </header>
  );
}
