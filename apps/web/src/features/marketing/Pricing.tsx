import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { Badge, Button, Panel, Reveal, SectionHeading } from '@/design-system';
import { cn } from '@/lib/cn';

interface Plan {
  readonly id: string;
  readonly name: string;
  readonly audience: string;
  readonly price: string;
  readonly unit: string;
  readonly setup: string;
  readonly featured?: boolean;
  readonly features: readonly string[];
}

/**
 * Modèle tarifaire.
 *
 * Abonnement annuel indexé sur la population desservie pour le secteur public,
 * sur le nombre de sites pour le privé. Les montants sont des ordres de
 * grandeur de positionnement, à confirmer par étude de coût complet.
 */
const PLANS: readonly Plan[] = [
  {
    id: 'commune',
    name: 'Commune',
    audience: 'Collectivités jusqu’à 100 000 habitants',
    price: '1 200 000',
    unit: 'FCFA / mois',
    setup: 'Mise en service : 15 jours, paramétrage inclus',
    features: [
      'Canaux mobile, web et WhatsApp',
      'Les dix familles d’incidents',
      'Console agent, 10 utilisateurs',
      'Carte publique et suivi citoyen',
      'Rapport mensuel de redevabilité',
      'Support ouvré, réponse sous 8 h',
    ],
  },
  {
    id: 'agglomeration',
    name: 'Agglomération',
    audience: 'Villes et intercommunalités, multi-arrondissements',
    price: '3 800 000',
    unit: 'FCFA / mois',
    setup: 'Mise en service : 30 jours, reprise de l’historique',
    featured: true,
    features: [
      'Tout le plan Commune',
      'Canal USSD et centre d’appel',
      'Sonomètre certifiable et étalonnage terrain',
      'Canal sécurité cloisonné et anonyme',
      'Délais contractuels et escalade par service',
      'API Open311 et connecteurs GMAO',
      'Utilisateurs illimités, pilotage par arrondissement',
      'Support prioritaire, astreinte 24/7',
    ],
  },
  {
    id: 'organisation',
    name: 'Organisation',
    audience: 'Entreprises, sites industriels, opérateurs de réseaux',
    price: 'Sur devis',
    unit: 'selon le nombre de sites',
    setup: 'Déploiement piloté, intégration au système d’information',
    features: [
      'Espace privé et périmètre fermé',
      'Arborescence calquée sur votre patrimoine',
      'QR codes par équipement',
      'Engagements de service internes',
      'Authentification d’entreprise (SSO)',
      'Hébergement dédié ou sur site',
      'Réversibilité contractuelle des données',
    ],
  },
];

export function Pricing() {
  return (
    <section id="tarifs" className="relative mx-auto max-w-[84rem] px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Modèle économique"
          title={
            <>
              Un abonnement, <span className="text-[var(--tone-signal-text)]">pas un projet informatique</span>
            </>
          }
          description="Pas de développement spécifique facturé au forfait, pas de dépendance à un prestataire unique. Un abonnement annuel, une mise en service courte et une clause de réversibilité des données."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-start">
        {PLANS.map((plan, index) => (
          <Reveal key={plan.id} delay={index * 100}>
            <Panel
              elevation={plan.featured ? 'floating' : 'raised'}
              bezel={plan.featured}
              className={cn(
                'relative flex h-full flex-col gap-6',
                plan.featured && 'lg:-mt-5 lg:pb-9 glow-accent',
              )}
            >
              {plan.featured && (
                <Badge tone="signal" size="md" className="absolute -top-3 left-6">
                  <Sparkles className="size-3" aria-hidden />
                  Le plus déployé
                </Badge>
              )}

              <div>
                <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
                <p className="mt-1 text-[12px] leading-snug text-muted">{plan.audience}</p>
              </div>

              <div>
                <p className="flex items-baseline gap-1.5">
                  <span className="numeric text-[2.1rem] font-bold leading-none text-primary">
                    {plan.price}
                  </span>
                </p>
                <p className="mt-1.5 text-[12px] text-muted">{plan.unit}</p>
                <p className="mt-2 text-[11px] text-faint">{plan.setup}</p>
              </div>

              <ul className="flex flex-1 flex-col gap-2.5 border-t border-subtle pt-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[13px] text-secondary">
                    <Check
                      className={cn('mt-0.5 size-4 shrink-0', plan.featured ? 'text-[var(--tone-signal-text)]' : 'text-muted')}
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/console" className="w-full">
                <Button variant={plan.featured ? 'primary' : 'outline'} className="w-full">
                  {plan.id === 'organisation' ? 'Demander une étude' : 'Planifier une démonstration'}
                </Button>
              </Link>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={250}>
        <p className="mt-6 text-center text-[11px] text-faint">
          Montants indicatifs de positionnement, hors taxes, engagement annuel. Tarification
          dégressive au-delà de trois collectivités d’un même département.
        </p>
      </Reveal>
    </section>
  );
}
