import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import { Button, Panel, Reveal } from '@/design-system';

const MILESTONES = [
  { step: 'Semaine 1', label: 'Cadrage et référentiel des services' },
  { step: 'Semaine 2', label: 'Paramétrage des familles et des délais' },
  { step: 'Semaine 3', label: 'Formation des agents et campagne citoyenne' },
  { step: 'Semaine 4', label: 'Mise en service et premier rapport' },
];

/** Appel à l'action de clôture, adossé à un plan de déploiement crédible. */
export function FinalCta() {
  return (
    <section className="relative mx-auto max-w-[84rem] px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <Panel elevation="floating" bezel className="relative grain overflow-hidden px-6 py-14 sm:px-12">
          <div className="aurora" aria-hidden />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold sm:text-[2.6rem]">
              <span className="text-gradient">Votre territoire est déjà</span>
              <br />
              en train de vous signaler quelque chose.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              Un mois sépare la décision de la mise en service. Commencez par une famille
              d’incidents et un arrondissement pilote, puis étendez sur la base des résultats.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signaler">
                <Button size="lg" iconRight={<ArrowRight className="size-4" />}>
                  Essayer le parcours citoyen
                </Button>
              </Link>
              <Link to="/console">
                <Button size="lg" variant="secondary" iconLeft={<CalendarCheck className="size-4" />}>
                  Ouvrir la console agent
                </Button>
              </Link>
            </div>
          </div>

          <ol className="relative mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-4">
            {MILESTONES.map((milestone, index) => (
              <li key={milestone.step} className="relative flex flex-col gap-2 text-center">
                <span className="mx-auto grid size-8 place-items-center rounded-full border border-signal-400/40 bg-signal-400/10">
                  <span className="numeric text-[11px] font-bold text-signal-300">{index + 1}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  {milestone.step}
                </span>
                <span className="text-[12px] leading-snug text-secondary">{milestone.label}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </Reveal>
    </section>
  );
}
