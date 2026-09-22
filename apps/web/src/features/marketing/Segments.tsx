import { Link } from 'react-router-dom';
import { ArrowRight, Building, Factory, ShieldCheck } from 'lucide-react';
import { Badge, Button, Panel, Reveal, SectionHeading } from '@/design-system';
import { cn } from '@/lib/cn';

const SEGMENTS = [
  {
    id: 'collectivites',
    icon: Building,
    tone: 'signal',
    label: 'Collectivités locales',
    claim: 'Rendre compte, chiffres à l’appui',
    pain: 'Les doléances arrivent par téléphone, cahier et réseaux sociaux. Rien n’est consolidé, rien n’est opposable, et le mandat se juge sur une perception.',
    answer:
      'Guichet unique multicanal, routage vers les services techniques, tableau de bord par arrondissement et rapport public mensuel généré automatiquement.',
    proof: [
      { metric: '−42 %', detail: 'de délai moyen de traitement constaté sur la chaîne outillée' },
      { metric: '1 seul', detail: 'référentiel pour la voirie, l’éclairage, les déchets et l’eau' },
      { metric: '100 %', detail: 'des dossiers horodatés et auditables' },
    ],
    buyers: 'Maire, secrétaire général, directeur des services techniques',
  },
  {
    id: 'securite',
    icon: ShieldCheck,
    tone: 'alert',
    label: 'Autorités de sécurité',
    claim: 'Voir venir plutôt que constater',
    pain: 'Les remontées citoyennes sur le banditisme sont tardives, orales et non exploitables. Aucune cartographie des zones de tension n’existe en temps réel.',
    answer:
      'Dépôt confidentiel protégeant le déclarant, canal séparé du flux public, carte de chaleur des tensions, priorisation automatique et escalade au centre de commandement.',
    proof: [
      { metric: 'Anonymat', detail: 'par défaut, sans exposition sur la carte publique' },
      { metric: '< 1 h', detail: 'de délai contractuel sur les alertes critiques' },
      { metric: 'Cloisonné', detail: 'du canal de voirie : deux publics, deux confidentialités' },
    ],
    buyers: 'Commandement de police, préfecture, direction de la sécurité urbaine',
  },
  {
    id: 'entreprises',
    icon: Factory,
    tone: 'cortex',
    label: 'Entreprises et sites',
    claim: 'Votre patrimoine signale ses propres pannes',
    pain: 'Sur un campus, un site industriel ou un parc immobilier, la panne est vue par un salarié qui ne sait pas à qui la dire, et remontée trois semaines plus tard.',
    answer:
      'Espace privé, périmètre géographique dédié, arborescence calquée sur vos bâtiments, engagements de service internes et export vers votre GMAO.',
    proof: [
      { metric: 'Privé', detail: 'aucune donnée exposée hors de votre organisation' },
      { metric: 'QR code', detail: 'apposé sur l’équipement, signalement en deux gestes' },
      { metric: 'API', detail: 'de synchronisation avec la GMAO et le ticketing existants' },
    ],
    buyers: 'Direction des moyens généraux, QHSE, facility management',
  },
] as const;

/**
 * Segmentation commerciale.
 *
 * Trois marchés, trois douleurs distinctes, une même plateforme. La structure
 * problème / réponse / preuve / acheteur est reprise telle quelle dans les
 * supports de vente.
 */
export function Segments() {
  return (
    <section id="segments" className="relative mx-auto max-w-[84rem] px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Marchés adressés"
          title={
            <>
              Une plateforme, <span className="text-[var(--tone-signal-text)]">trois modèles d’achat</span>
            </>
          }
          description="Le socle technique est commun ; le paramétrage, le vocabulaire et les engagements de service diffèrent par segment. C’est ce qui permet de vendre au même coût marginal à une mairie, à une préfecture et à un site industriel."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {SEGMENTS.map((segment, index) => (
          <Reveal key={segment.id} delay={index * 100}>
            <Panel
              elevation="raised"
              bezel
              className="flex h-full flex-col gap-5 transition-transform duration-[var(--duration-base)] hover:-translate-y-1.5"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'grid size-11 place-items-center rounded-[var(--radius-md)]',
                    segment.tone === 'signal' && 'bg-signal-400/12',
                    segment.tone === 'alert' && 'bg-alert-400/12',
                    segment.tone === 'cortex' && 'bg-cortex-400/12',
                  )}
                >
                  <segment.icon
                    className={cn(
                      'size-5',
                      segment.tone === 'signal' && 'text-[var(--tone-signal-text)]',
                      segment.tone === 'alert' && 'text-[var(--tone-alert-text)]',
                      segment.tone === 'cortex' && 'text-[var(--tone-cortex-text)]',
                    )}
                    aria-hidden
                  />
                </span>
                <Badge tone={segment.tone}>{segment.label}</Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary">{segment.claim}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">
                  <span className="font-semibold text-secondary">Le problème. </span>
                  {segment.pain}
                </p>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
                  <span className="font-semibold text-secondary">La réponse. </span>
                  {segment.answer}
                </p>
              </div>

              <dl className="mt-auto grid gap-3 border-t border-subtle pt-5">
                {segment.proof.map((item) => (
                  <div key={item.metric} className="flex items-baseline gap-3">
                    <dt
                      className={cn(
                        'numeric shrink-0 text-sm font-bold',
                        segment.tone === 'signal' && 'text-[var(--tone-signal-text)]',
                        segment.tone === 'alert' && 'text-[var(--tone-alert-text)]',
                        segment.tone === 'cortex' && 'text-[var(--tone-cortex-text)]',
                      )}
                    >
                      {item.metric}
                    </dt>
                    <dd className="text-[12px] leading-snug text-muted">{item.detail}</dd>
                  </div>
                ))}
              </dl>

              <p className="rounded-[var(--radius-sm)] surface-sunken px-3 py-2 text-[11px] text-faint">
                <span className="font-semibold uppercase tracking-[0.12em]">Décideurs </span>
                · {segment.buyers}
              </p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <div className="mt-8 flex justify-center">
          <Link to="/console">
            <Button variant="secondary" size="lg" iconRight={<ArrowRight className="size-4" />}>
              Explorer la console d’exploitation
            </Button>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
