import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Panel, SectionHeading } from '@/design-system';
import { useServices } from '@/app/providers/ServicesProvider';
import type { Report } from '@/domain/report/types';
import { TrackingResult } from '@/features/tracking/TrackingResult';
import { TrackingSearch } from '@/features/tracking/TrackingSearch';

interface LocationState {
  reference?: string;
}

/** Suivi d'un dossier par sa référence, sans authentification. */
export function TrackingPage() {
  const { reports } = useServices();
  const { state } = useLocation() as { state: LocationState | null };

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);

  const now = useMemo(() => new Date(), []);

  const search = useCallback(
    async (reference: string) => {
      setLoading(true);
      setNotFound(null);
      try {
        const found = await reports.getByReference(reference);
        setReport(found);
        if (!found) setNotFound(reference);
      } finally {
        setLoading(false);
      }
    },
    [reports],
  );

  const confirm = useCallback(async () => {
    if (!report) return;
    setReport(await reports.confirm(report.id));
  }, [report, reports]);

  return (
    <section className="pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          title="Où en est mon signalement ?"
          description="Saisissez la référence remise au dépôt. Aucun compte n’est nécessaire : la référence seule donne accès à l’avancement du dossier et à son engagement de délai."
          className="mb-8"
        />

        <Panel elevation="raised" className="mb-6">
          <TrackingSearch initial={state?.reference ?? ''} loading={loading} onSearch={(reference) => void search(reference)} />
          <p className="mt-3 text-[12px] text-faint">
            Exemple de format : <span className="numeric">SIG-A4K9-12</span>. La référence figure
            dans l’écran de confirmation et dans l’accusé de réception.
          </p>
        </Panel>

        {notFound && (
          <Panel elevation="raised" className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="grid size-12 place-items-center rounded-full surface-sunken">
              <FileQuestion className="size-5 text-muted" aria-hidden />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-primary">Référence introuvable</p>
              <p className="mt-1 text-[13px] text-muted">
                Aucun dossier ne correspond à <span className="numeric">{notFound}</span>. Vérifiez
                la saisie : la référence comporte douze caractères, tirets compris.
              </p>
            </div>
          </Panel>
        )}

        {report && <TrackingResult report={report} now={now} onConfirm={confirm} />}
      </div>
    </section>
  );
}
