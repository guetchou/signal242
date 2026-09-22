import { Badge, SectionHeading } from '@/design-system';
import { ConsoleWorkspace } from '@/features/ops-console/ConsoleWorkspace';

/** Console d'exploitation destinée aux agents et aux responsables de service. */
export function ConsolePage() {
  return (
    <section className="pb-20 pt-10">
      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
          as="h1"
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
