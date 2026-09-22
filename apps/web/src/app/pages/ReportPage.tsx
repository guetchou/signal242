import { useLocation } from 'react-router-dom';
import { SectionHeading } from '@/design-system';
import type { CategoryId } from '@/domain/report/types';
import { ReportWizard } from '@/features/report-flow/ReportWizard';
import type { PrefilledPlace } from '@/features/report-flow/useReportDraft';

interface LocationState {
  categoryId?: CategoryId;
  /** Lieu déjà résolu sur l'accueil : l'étape de localisation part pré-remplie. */
  place?: PrefilledPlace;
}

/** Page du parcours citoyen de dépôt de signalement. */
export function ReportPage() {
  const { state } = useLocation() as { state: LocationState | null };

  return (
    <section className="pb-24 pt-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          title="Déposer un signalement"
          description="Quatre étapes, moins de deux minutes. Aucun compte n’est requis : une référence de suivi vous est remise à la fin."
          className="mb-10"
        />
        <ReportWizard initialCategory={state?.categoryId} initialPlace={state?.place} />
      </div>
    </section>
  );
}
