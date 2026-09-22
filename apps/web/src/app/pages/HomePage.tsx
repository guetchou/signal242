import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Clock, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Panel } from '@/design-system';
import { ActionGrid } from '@/features/home/ActionGrid';
import { HowItWorks } from '@/features/home/HowItWorks';
import { LocateAction } from '@/features/home/LocateAction';
import { LocalActivity } from '@/features/home/LocalActivity';
import { QuickTrack } from '@/features/home/QuickTrack';

const REASSURANCE = [
  { icon: Clock, text: 'Délai de traitement annoncé avant l’envoi' },
  { icon: ShieldCheck, text: 'Dépôt anonyme possible, sans création de compte' },
] as const;

/**
 * Accueil de l'application.
 *
 * Écran d'action, non page de présentation. L'utilisateur qui arrive veut
 * signaler, ou consulter un dossier en cours : ces deux intentions occupent
 * l'espace principal. Le discours destiné aux acheteurs publics et privés est
 * relégué sur `/solution`, atteint par un lien — il concerne quelques dizaines
 * de visiteurs par an, contre plusieurs milliers d'usagers.
 */
export function HomePage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-[2rem] font-bold leading-[1.1] sm:text-[2.5rem]">
          Signaler un problème dans votre quartier
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Voirie dégradée, éclairage éteint, dépôt sauvage, nuisance sonore, incivilité.
          Indiquez le lieu : le signalement part au service compétent avec un délai de traitement
          engagé.
        </p>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          {REASSURANCE.map((item) => (
            <li key={item.text} className="flex items-center gap-2 text-[13px] text-secondary">
              <item.icon className="size-4 shrink-0 text-[var(--accent)]" aria-hidden />
              {item.text}
            </li>
          ))}
        </ul>
      </header>

      <LocateAction className="mt-8" />

      <div className="mt-8">
        <HowItWorks />
      </div>

      <section className="mt-10" aria-labelledby="titre-familles">
        <h2 id="titre-familles" className="text-[12px] font-medium uppercase tracking-[0.1em] text-faint">
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
        <Panel elevation="flat" className="flex items-center gap-3.5">
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

        <Panel elevation="flat" className="flex items-center gap-3.5">
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
  );
}
