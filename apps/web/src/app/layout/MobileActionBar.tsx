import { Link, useLocation } from 'react-router-dom';
import { Camera } from 'lucide-react';

/**
 * Action de dépôt persistante sur mobile.
 *
 * Sur un téléphone, l'en-tête disparaît au défilement et le bouton principal
 * avec lui. Cette barre maintient le geste attendu accessible au pouce, quelle
 * que soit la position dans la page. Elle s'efface sur le parcours de dépôt,
 * où elle ferait doublon avec le formulaire lui-même.
 */
export function MobileActionBar() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/signaler')) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:hidden">
      <Link
        to="/signaler"
        className="pointer-events-auto flex h-14 items-center justify-center gap-2.5 rounded-[var(--radius-lg)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--accent-contrast)] shadow-depth"
      >
        <Camera className="size-5" aria-hidden />
        Signaler avec une photo
      </Link>
    </div>
  );
}
