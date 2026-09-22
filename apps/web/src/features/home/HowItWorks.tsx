const STEPS = [
  'Indiquez le lieu, par géolocalisation ou par quartier',
  'Vérifiez si le problème est déjà signalé et confirmez-le, ou continuez',
  'Précisez la nature du problème et joignez une photo',
  'Recevez une référence de suivi et le délai de traitement engagé',
] as const;

/**
 * Attente explicitée avant l'engagement.
 *
 * Un usager renonce moins souvent quand il sait combien d'étapes l'attendent.
 * Quatre lignes suffisent : ce bloc informe, il ne vend pas.
 */
export function HowItWorks() {
  return (
    <section aria-labelledby="titre-etapes">
      <h2
        id="titre-etapes"
        className="text-[12px] font-medium uppercase tracking-[0.1em] text-faint"
      >
        Comment ça se passe
      </h2>
      <ol className="mt-3.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="numeric grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-surface)] text-[11px] font-bold text-[var(--accent)]">
              {index + 1}
            </span>
            <span className="text-[13px] leading-snug text-secondary">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
