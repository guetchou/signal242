import { Accessibility, DatabaseZap, Lock, Plug, ServerCog, WifiOff } from 'lucide-react';
import { Panel, Reveal, SectionHeading } from '@/design-system';

const PILLARS = [
  {
    icon: Lock,
    title: 'Protection du déclarant',
    body: 'Anonymat par défaut sur le canal sécurité, pseudonymisation des auteurs sur la carte publique, chiffrement en transit et au repos, journal d’accès nominatif côté agent.',
  },
  {
    icon: ServerCog,
    title: 'Souveraineté des données',
    body: 'Hébergement sur le territoire ou sur le continent au choix du client, sauvegarde chiffrée quotidienne, clause contractuelle de réversibilité intégrale au format ouvert.',
  },
  {
    icon: Plug,
    title: 'Interopérabilité',
    body: 'API conforme Open311 GeoReport v2, exports GeoJSON et CSV, webhooks sortants, connecteurs vers les outils de gestion de maintenance et de ticketing existants.',
  },
  {
    icon: WifiOff,
    title: 'Résilience réseau',
    body: 'Capture et file d’attente locales, synchronisation différée, canal USSD pour les terminaux sans données. La zone blanche n’est pas une zone aveugle.',
  },
  {
    icon: Accessibility,
    title: 'Accessibilité',
    body: 'Contrastes conformes AA, navigation clavier intégrale, libellés explicites, respect des préférences de mouvement réduit, thème clair et sombre validés séparément.',
  },
  {
    icon: DatabaseZap,
    title: 'Auditabilité',
    body: 'Chaque changement d’état est horodaté, attribué et non modifiable. Le dossier se relit intégralement des mois plus tard, y compris en contentieux.',
  },
] as const;

/** Socle de confiance : les objections récurrentes d'un acheteur public. */
export function TrustSection() {
  return (
    <section id="confiance" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 grid-tech opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Socle de confiance"
            tone="pulse"
            title={
              <>
                Les six questions que pose <span className="text-[var(--tone-pulse-text)]">tout acheteur public</span>
              </>
            }
            description="Aucune de ces réponses n’est une option payante : elles constituent le socle livré avec chaque déploiement."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 70}>
              <Panel elevation="raised" className="h-full">
                <span className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-pulse-400/12">
                  <pillar.icon className="size-5 text-[var(--tone-pulse-text)]" aria-hidden />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-primary">{pillar.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{pillar.body}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
