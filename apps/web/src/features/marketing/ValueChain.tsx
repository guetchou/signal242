import { BadgeCheck, Brain, Radar, Route } from 'lucide-react';
import { Panel, Reveal, SectionHeading } from '@/design-system';
import { cn } from '@/lib/cn';

const STEPS = [
  {
    icon: Radar,
    tone: 'text-pulse-300',
    ring: 'bg-pulse-400/12',
    step: '01',
    title: 'Capter',
    lead: 'Cinq canaux, zéro exclusion',
    body:
      'Application mobile, web, WhatsApp, code USSD pour les téléphones simples et centre d’appel. La capture fonctionne hors ligne et se synchronise au retour du réseau.',
    metrics: ['Photo, audio et position GPS horodatés', 'USSD sans données mobiles', 'File hors ligne persistante'],
  },
  {
    icon: Brain,
    tone: 'text-cortex-300',
    ring: 'bg-cortex-400/12',
    step: '02',
    title: 'Qualifier',
    lead: 'Le tri ne mobilise plus un agent',
    body:
      'Détection de doublons par proximité géographique et similarité, fusion automatique des confirmations, remontée de gravité sous pression citoyenne, filtrage des dépôts abusifs.',
    metrics: ['Fusion des doublons dans un rayon paramétrable', 'Score de priorité gravité × foule × délai', 'Détection des signalements non fondés'],
  },
  {
    icon: Route,
    tone: 'text-ember-300',
    ring: 'bg-ember-400/12',
    step: '03',
    title: 'Acheminer',
    lead: 'Le bon service, du premier coup',
    body:
      'Routage selon la famille d’incident, le territoire et l’astreinte en cours. Bon de travaux généré, équipe notifiée, délai contractuel armé dès la qualification.',
    metrics: ['Règles de routage par quartier et par astreinte', 'Escalade automatique avant échéance', 'Passerelle vers les outils métier existants'],
  },
  {
    icon: BadgeCheck,
    tone: 'text-signal-300',
    ring: 'bg-signal-400/12',
    step: '04',
    title: 'Prouver',
    lead: 'La clôture se démontre',
    body:
      'Photo de fin de chantier géolocalisée, journal d’audit immuable, confirmation du déclarant et publication du résultat. Le citoyen constate, l’élu rend compte.',
    metrics: ['Journal horodaté non modifiable', 'Confirmation citoyenne de clôture', 'Rapport mensuel exportable'],
  },
] as const;

/** Chaîne de valeur en quatre temps : le récit opérationnel du produit. */
export function ValueChain() {
  return (
    <section id="chaine" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 grid-tech opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Chaîne opérationnelle"
            tone="cortex"
            title={
              <>
                Du signal brut à la <span className="text-cortex-300">preuve de résolution</span>
              </>
            }
            description="Les plateformes de signalement échouent rarement sur la collecte : elles échouent sur ce qui suit. Signal 242 industrialise les trois maillons que les concurrents laissent au tableur."
          />
        </Reveal>

        <ol className="mt-14 grid gap-5 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.step} delay={index * 90}>
              <Panel
                elevation="raised"
                className="relative h-full overflow-hidden transition-transform duration-[var(--duration-base)] hover:-translate-y-1"
              >
                <span
                  className="numeric pointer-events-none absolute -right-2 -top-4 text-[5rem] font-bold leading-none text-[var(--text-primary)] opacity-[0.045]"
                  aria-hidden
                >
                  {step.step}
                </span>

                <span className={cn('grid size-11 place-items-center rounded-[var(--radius-md)]', step.ring)}>
                  <step.icon className={cn('size-5', step.tone)} aria-hidden />
                </span>

                <h3 className="mt-5 text-xl font-bold text-primary">{step.title}</h3>
                <p className={cn('mt-1 text-[13px] font-semibold', step.tone)}>{step.lead}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">{step.body}</p>

                <ul className="mt-5 flex flex-col gap-2 border-t border-subtle pt-4">
                  {step.metrics.map((metric) => (
                    <li key={metric} className="flex items-start gap-2 text-[12px] text-secondary">
                      <span className={cn('mt-1.5 size-1 shrink-0 rounded-full', step.tone.replace('text-', 'bg-'))} aria-hidden />
                      {metric}
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
