import { Check, Minus, X } from 'lucide-react';
import { Panel, Reveal, SectionHeading } from '@/design-system';
import { cn } from '@/lib/cn';

type Support = 'yes' | 'partial' | 'no';

interface Criterion {
  readonly label: string;
  readonly detail: string;
  readonly values: readonly [Support, Support, Support, Support];
}

const COMPETITORS = ['Signal 242', 'FixMyStreet', 'SeeClickFix / CivicPlus', 'TellMyCity'] as const;

/**
 * Comparatif fonctionnel.
 *
 * Établi à partir de la documentation publique des éditeurs (septembre 2026).
 * Les trois références retenues couvrent les trois modèles du marché :
 * l'open source britannique, la suite municipale nord-américaine et l'offre
 * francophone de proximité.
 */
const CRITERIA: readonly Criterion[] = [
  {
    label: 'Mesure acoustique intégrée',
    detail: 'LAeq pondéré A, émergence, seuil horaire',
    values: ['yes', 'no', 'no', 'no'],
  },
  {
    label: 'Canal USSD sans données mobiles',
    detail: 'Couverture des téléphones non connectés',
    values: ['yes', 'no', 'no', 'no'],
  },
  {
    label: 'Capture hors ligne et resynchronisation',
    detail: 'Zones blanches et réseau intermittent',
    values: ['yes', 'partial', 'partial', 'partial'],
  },
  {
    label: 'Canal sécurité cloisonné et anonyme',
    detail: 'Remontée de banditisme hors carte publique',
    values: ['yes', 'no', 'partial', 'no'],
  },
  {
    label: 'Délais contractuels par gravité',
    detail: 'Échéance armée et escalade automatique',
    values: ['yes', 'partial', 'yes', 'partial'],
  },
  {
    label: 'Fusion automatique des doublons',
    detail: 'Regroupement géographique et sémantique',
    values: ['yes', 'partial', 'yes', 'no'],
  },
  {
    label: 'Interopérabilité Open311 GeoReport v2',
    detail: 'Exposition et consommation standardisées',
    values: ['yes', 'yes', 'yes', 'no'],
  },
  {
    label: 'Espace privé entreprise ou site',
    detail: 'Périmètre fermé, arborescence patrimoniale',
    values: ['yes', 'no', 'no', 'no'],
  },
  {
    label: 'Rapport public de redevabilité',
    detail: 'Publication automatique des résultats',
    values: ['yes', 'yes', 'yes', 'partial'],
  },
  {
    label: 'Hébergement souverain sur le continent',
    detail: 'Localisation des données et réversibilité',
    values: ['yes', 'partial', 'no', 'no'],
  },
];

const SUPPORT_META: Record<Support, { icon: typeof Check; className: string; label: string }> = {
  yes: { icon: Check, className: 'text-[var(--tone-signal-text)]', label: 'Couvert' },
  partial: { icon: Minus, className: 'text-[var(--tone-ember-text)]', label: 'Partiel' },
  no: { icon: X, className: 'text-[var(--tone-alert-text)]', label: 'Absent' },
};

export function Benchmark() {
  return (
    <section id="benchmark" className="relative mx-auto max-w-[84rem] px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Analyse concurrentielle"
          tone="ember"
          title={
            <>
              Ce que le marché ne fait <span className="text-[var(--tone-ember-text)]">pas encore</span>
            </>
          }
          description="Le signalement citoyen est un marché mature sur la collecte et immature sur la preuve. Les écarts ci-dessous constituent le positionnement défendable de Signal 242."
        />
      </Reveal>

      <Reveal delay={120}>
        <Panel elevation="raised" padded={false} className="mt-12 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <caption className="sr-only">
                Comparatif des fonctionnalités de Signal 242 et de trois plateformes de référence.
              </caption>
              <thead>
                <tr className="border-b border-default">
                  <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                    Critère
                  </th>
                  {COMPETITORS.map((name, index) => (
                    <th
                      key={name}
                      scope="col"
                      className={cn(
                        'px-4 py-4 text-center text-[12px] font-semibold',
                        index === 0 ? 'text-[var(--tone-signal-text)]' : 'text-muted',
                      )}
                    >
                      {index === 0 && (
                        <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--tone-signal-text)]">
                          Notre offre
                        </span>
                      )}
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CRITERIA.map((criterion) => (
                  <tr key={criterion.label} className="border-b border-subtle last:border-0 hover:bg-[var(--state-hover)]">
                    <th scope="row" className="px-5 py-3.5 font-normal">
                      <span className="block text-[13px] font-medium text-primary">{criterion.label}</span>
                      <span className="mt-0.5 block text-[11px] text-faint">{criterion.detail}</span>
                    </th>
                    {criterion.values.map((support, index) => {
                      const meta = SUPPORT_META[support];
                      return (
                        <td
                          key={`${criterion.label}-${index}`}
                          className={cn('px-4 py-3.5 text-center', index === 0 && 'bg-signal-400/[0.045]')}
                        >
                          <span className="inline-flex flex-col items-center gap-1">
                            <meta.icon className={cn('size-4', meta.className)} aria-hidden />
                            <span className="text-[10px] text-faint">{meta.label}</span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-4 text-[11px] leading-relaxed text-faint">
          Sources : documentation publique des éditeurs et spécification Open311 GeoReport v2,
          consultées en septembre 2026. Comparatif à visée de positionnement, revu à chaque
          évolution majeure des offres citées.
        </p>
      </Reveal>
    </section>
  );
}
