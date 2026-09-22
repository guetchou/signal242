import { FileCheck2, Gavel, Ruler, Timer } from 'lucide-react';
import { Reveal, SectionHeading } from '@/design-system';
import { NoiseMeterPanel } from '@/features/noise-meter/NoiseMeterPanel';

const ARGUMENTS = [
  {
    icon: Ruler,
    title: 'Une mesure, pas une impression',
    body: 'LAeq, LAmax, L90 et émergence calculés avec pondération A selon la CEI 61672. La plainte cesse d’être une appréciation subjective.',
  },
  {
    icon: Timer,
    title: 'Le seuil dépend de l’heure',
    body: 'Jour, soirée, nuit : le même niveau n’a pas la même portée. Le verdict applique automatiquement le seuil de la période et le barème local.',
  },
  {
    icon: FileCheck2,
    title: 'Horodatée et géolocalisée',
    body: 'La mesure est scellée avec sa position, son heure et son état d’étalonnage. Elle constitue une pièce versable au dossier de contrôle.',
  },
  {
    icon: Gavel,
    title: 'Elle déclenche une action',
    body: 'Au-delà du seuil, le signalement est routé vers la police municipale avec un délai contractuel d’une à deux heures selon la gravité.',
  },
] as const;

/**
 * Démonstration du différenciateur acoustique.
 *
 * Aucun concurrent du panel ne mesure le bruit : tous se contentent d'un champ
 * de texte. Placer le sonomètre en fonctionnement sur la page d'accueil est
 * l'argument commercial le plus court.
 */
export function NoiseShowcase() {
  return (
    <section id="acoustique" className="relative overflow-hidden py-24">
      <div className="aurora opacity-60" aria-hidden />

      <div className="relative mx-auto grid max-w-[84rem] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Différenciateur"
              tone="cortex"
              title={
                <>
                  La nuisance sonore, enfin <span className="text-[var(--tone-cortex-text)]">chiffrée</span>
                </>
              }
              description="Partout ailleurs, une plainte pour bruit est une phrase dans un formulaire. Ici, le téléphone du déclarant devient un instrument de mesure et la plainte devient un dossier instruit."
            />
          </Reveal>

          <dl className="mt-9 grid gap-5 sm:grid-cols-2">
            {ARGUMENTS.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <div className="flex flex-col gap-2.5">
                  <span className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-cortex-400/12">
                    <item.icon className="size-4 text-[var(--tone-cortex-text)]" aria-hidden />
                  </span>
                  <dt className="text-sm font-semibold text-primary">{item.title}</dt>
                  <dd className="text-[13px] leading-relaxed text-muted">{item.body}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal delay={120}>
          {/* Mode simulé en vitrine : aucune demande de permission microphone
              n'est déclenchée à l'arrivée sur la page d'accueil. */}
          <NoiseMeterPanel mode="simulated" durationS={20} />
        </Reveal>
      </div>
    </section>
  );
}
