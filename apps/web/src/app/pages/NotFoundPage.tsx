import { Link } from 'react-router-dom';
import { Button } from '@/design-system';

export function NotFoundPage() {
  return (
    <section className="relative mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="numeric text-7xl font-bold text-[var(--tone-signal-text)]">404</p>
      <h1 className="text-3xl font-bold">Cette page n’existe pas</h1>
      <p className="text-muted">
        Le lien est peut-être obsolète. Revenez à l’accueil ou consultez la carte publique.
      </p>
      <Link to="/">
        <Button>Retour à l’accueil</Button>
      </Link>
    </section>
  );
}
