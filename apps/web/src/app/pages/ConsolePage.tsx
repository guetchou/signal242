import { Badge, SectionHeading } from '@/design-system';
import { ConsoleWorkspace } from '@/features/ops-console/ConsoleWorkspace';

/** Console d'exploitation destinée aux agents et aux responsables de service. */
export function ConsolePage() {
  return (
    <section className="relative pb-20 pt-10">
      <div className="absolute inset-x-0 top-0 h-80 grid-tech opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
          as="h1"
            eyebrow="Console agent"
            title="Supervision territoriale"
            description="Vue unique sur le portefeuille de signalements : charge par service, tenue des engagements et file de traitement priorisée."
          />
          <Badge tone="signal" dot pulse size="md">
            Brazzaville · toutes familles
          </Badge>
        </div>

        <ConsoleWorkspace />
      </div>
    </section>
  );
}
