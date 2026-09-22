import { Check } from 'lucide-react';
import { STATUS_LABELS, STATUS_ORDER, statusStep } from '@/domain/report/status';
import type { ReportStatus } from '@/domain/report/types';
import { cn } from '@/lib/cn';

export interface TrackingTimelineProps {
  status: ReportStatus;
}

/** Étapes publiques du parcours, hors états terminaux administratifs. */
const PUBLIC_STEPS = STATUS_ORDER.filter((status) => status !== 'rejected' && status !== 'closed');

/**
 * Fil d'avancement destiné au citoyen.
 *
 * Volontairement plus simple que le journal d'audit de la console : quatre
 * jalons compréhensibles sans connaissance de l'organisation interne.
 */
export function TrackingTimeline({ status }: TrackingTimelineProps) {
  if (status === 'rejected') {
    return (
      <p className="rounded-[var(--radius-md)] bg-alert-400/10 px-4 py-3 text-[13px] text-[var(--tone-alert-text)]">
        Ce signalement n’a pas été retenu. Le motif est précisé dans le journal ci-dessous.
      </p>
    );
  }

  const current = statusStep(status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
      {PUBLIC_STEPS.map((step, index) => {
        const stepIndex = statusStep(step);
        const done = current > stepIndex || status === 'closed';
        const active = current === stepIndex;

        return (
          <li key={step} className="relative flex flex-1 gap-3 pb-6 sm:flex-col sm:pb-0">
            <div className="flex flex-col items-center sm:w-full sm:flex-row">
              <span
                className={cn(
                  'z-10 grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-colors',
                  done && 'border-signal-400/50 bg-signal-400/15 text-[var(--tone-signal-text)]',
                  active && 'border-[var(--tone-signal-border)] bg-[var(--accent)] text-[var(--accent-contrast)]',
                  !done && !active && 'border-subtle surface-base text-faint',
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
              </span>

              {index < PUBLIC_STEPS.length - 1 && (
                <span
                  className={cn(
                    'sm:mx-2 sm:h-px sm:w-full',
                    'absolute left-[13px] top-7 h-full w-px sm:static sm:h-px',
                    done ? 'bg-signal-400/50' : 'bg-[var(--border-subtle)]',
                  )}
                  aria-hidden
                />
              )}
            </div>

            <span className="sm:mt-3">
              <span
                className={cn(
                  'block text-[13px] font-medium',
                  active ? 'text-primary' : done ? 'text-secondary' : 'text-faint',
                )}
              >
                {STATUS_LABELS[step]}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
