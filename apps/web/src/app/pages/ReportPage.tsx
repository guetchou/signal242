import { useLocation } from 'react-router-dom';
import { SectionHeading } from '@/design-system';
import type { CategoryId } from '@/domain/report/types';
import { ReportWizard } from '@/features/report-flow/ReportWizard';

interface LocationState {
  categoryId?: CategoryId;
}

/** Page du parcours citoyen de dépôt de signalement. */
export function ReportPage() {
  const { state } = useLocation() as { state: LocationState | null };

  return (
    <section className="relative overflow-hidden pb-24 pt-12">
      <div className="aurora opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          eyebrow="Parcours citoyen"
          title="Déposer un signalement"
          description="Quatre étapes, moins de deux minutes. Aucun compte n’est requis : une référence de suivi vous est remise à la fin."
          className="mb-10"
        />
        <ReportWizard initialCategory={state?.categoryId} />
      </div>
    </section>
  );
}
