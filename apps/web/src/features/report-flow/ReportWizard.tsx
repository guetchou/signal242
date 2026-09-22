import { useCallback, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Send, TriangleAlert } from 'lucide-react';
import { Button, Panel } from '@/design-system';
import { useServices } from '@/app/providers/ServicesProvider';
import type { CategoryId, Report } from '@/domain/report/types';
import { ReportSuccess } from './ReportSuccess';
import { StepIndicator } from './StepIndicator';
import { StepCategory } from './steps/StepCategory';
import { StepEvidence } from './steps/StepEvidence';
import { StepLocation } from './steps/StepLocation';
import { StepReview } from './steps/StepReview';
import { STEPS, STEP_META, useReportDraft, type StepId } from './useReportDraft';

export interface ReportWizardProps {
  initialCategory?: CategoryId;
}

/**
 * Orchestrateur du parcours de signalement.
 *
 * Ne contient ni règle métier ni calcul : il coordonne l'état du brouillon,
 * la navigation entre étapes et l'appel au dépôt. Chaque étape reste une vue
 * autonome, testable et remplaçable.
 */
export function ReportWizard({ initialCategory }: ReportWizardProps) {
  const { reports } = useServices();
  const { draft, errors, setCategory, setSubtype, patch } = useReportDraft(initialCategory);

  const [step, setStep] = useState<StepId>('category');
  const [visited, setVisited] = useState<StepId[]>(['category']);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Report | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const index = STEPS.indexOf(step);
  const blocking = errors[step];
  const isLast = index === STEPS.length - 1;

  const completed = useMemo(
    () => visited.filter((visitedStep) => errors[visitedStep] === null),
    [visited, errors],
  );

  const goTo = useCallback((next: StepId) => {
    setStep(next);
    setVisited((current) => (current.includes(next) ? current : [...current, next]));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goNext = useCallback(() => {
    const next = STEPS[index + 1];
    if (next) goTo(next);
  }, [goTo, index]);

  const goBack = useCallback(() => {
    const previous = STEPS[index - 1];
    if (previous) goTo(previous);
  }, [goTo, index]);

  const submit = useCallback(async () => {
    setSubmitting(true);
    setFailure(null);
    try {
      setSubmitted(await reports.create(draft));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : 'La transmission a échoué. Votre saisie est conservée : réessayez.',
      );
    } finally {
      setSubmitting(false);
    }
  }, [draft, reports]);

  if (submitted) {
    return <ReportSuccess report={submitted} onRestart={() => window.location.reload()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator current={step} completed={completed} onNavigate={goTo} />

      <Panel elevation="raised" className="flex flex-col gap-7">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            Étape {index + 1} sur {STEPS.length}
          </p>
          <h2 className="mt-1.5 text-2xl font-bold text-primary">{STEP_META[step].caption}</h2>
        </header>

        {step === 'category' && (
          <StepCategory
            draft={draft}
            onCategory={setCategory}
            onSubtype={setSubtype}
            onSeverity={(severity) => patch({ severity })}
          />
        )}
        {step === 'location' && <StepLocation draft={draft} onPatch={patch} />}
        {step === 'evidence' && <StepEvidence draft={draft} error={errors.evidence} onPatch={patch} />}
        {step === 'review' && <StepReview draft={draft} />}

        {failure && (
          <p
            role="alert"
            className="flex items-start gap-2.5 rounded-[var(--radius-md)] bg-alert-400/10 px-4 py-3 text-[13px] text-alert-300"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {failure}
          </p>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-subtle pt-5">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={index === 0}
            iconLeft={<ArrowLeft className="size-4" />}
          >
            Retour
          </Button>

          <div className="flex items-center gap-3">
            {blocking && step !== 'evidence' && (
              <span className="text-[12px] text-ember-300">{blocking}</span>
            )}
            {isLast ? (
              <Button
                onClick={() => void submit()}
                loading={submitting}
                iconRight={<Send className="size-4" />}
              >
                Transmettre le signalement
              </Button>
            ) : (
              <Button
                onClick={goNext}
                disabled={blocking !== null}
                iconRight={<ArrowRight className="size-4" />}
              >
                Continuer
              </Button>
            )}
          </div>
        </footer>
      </Panel>
    </div>
  );
}
