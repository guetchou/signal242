import { Link } from 'react-router-dom';
import { ArrowRight, Building2, LayoutDashboard } from 'lucide-react';
import { Panel } from '@/design-system';
import { ActionGrid } from '@/features/home/ActionGrid';
import { HowItWorks } from '@/features/home/HowItWorks';
import { LocalActivity } from '@/features/home/LocalActivity';
import { QuickTrack } from '@/features/home/QuickTrack';
import { TerritoryHero } from '@/features/home/TerritoryHero';

/**
 * Accueil de l'application.
 *
 * Écran d'action portant l'identité du territoire. Le bandeau d'ouverture
 * contient le geste attendu plutôt que de le repousser : l'usager voit sa
 * ville et trouve la localisation dans le même écran. Le discours destiné aux
 * acheteurs vit sur `/solution`, atteint par un lien.
 */
export function HomePage() {
  return (
    <div className="pb-20">
      <TerritoryHero />

      <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
        <div className="mt-10">
          <HowItWorks />
        </div>

        <section className="mt-10" aria-labelledby="titre-familles">
          <h2
            id="titre-familles"
            className="text-[12px] font-medium uppercase tracking-[0.1em] text-faint"
          >
            Ou partez directement du type de problème
          </h2>
          <div className="mt-3.5">
            <ActionGrid />
          </div>
        </section>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <QuickTrack />
          <LocalActivity />
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Autres accès">
          <Panel elevation="flat" className="lift flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] surface-sunken">
              <LayoutDashboard className="size-4 text-muted" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-primary">Vous êtes agent</span>
              <span className="block text-[12px] text-muted">
                File de traitement et supervision territoriale
              </span>
            </span>
            <Link
              to="/console"
              className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-[var(--accent)] hover:underline"
            >
              Console
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Panel>

          <Panel elevation="flat" className="lift flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] surface-sunken">
              <Building2 className="size-4 text-muted" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-primary">
                Collectivité ou entreprise
              </span>
              <span className="block text-[12px] text-muted">
                Déployer Signal 242 sur votre territoire ou vos sites
              </span>
            </span>
            <Link
              to="/solution"
              className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-[var(--accent)] hover:underline"
            >
              L’offre
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Panel>
        </section>
      </div>
    </div>
  );
}
