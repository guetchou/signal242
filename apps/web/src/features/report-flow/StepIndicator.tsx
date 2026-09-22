import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { STEP_META, STEPS, type StepId } from './useReportDraft';

export interface StepIndicatorProps {
  current: StepId;
  onNavigate: (step: StepId) => void;
  /** Étapes déjà validées, seules à être cliquables en arrière. */
  completed: readonly StepId[];
}

/** Fil de progression du parcours, navigable vers les étapes déjà franchies. */
export function StepIndicator({ current, onNavigate, completed }: StepIndicatorProps) {
  const currentIndex = STEPS.indexOf(current);

  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="Progression du signalement">
      {STEPS.map((step, index) => {
        const done = completed.includes(step) && index < currentIndex;
        const active = step === current;
        const reachable = done || active;

        return (
          <li key={step} className="flex flex-1 items-center gap-1 sm:gap-2">
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onNavigate(step)}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'group flex min-w-0 flex-1 items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-left transition-colors',
                active && 'surface-raised',
                reachable ? 'cursor-pointer' : 'cursor-default',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-colors',
                  done && 'border-signal-400/50 bg-signal-400/15 text-[var(--tone-signal-text)]',
                  active && !done && 'border-[var(--tone-signal-border)] bg-[var(--accent)] text-[var(--accent-contrast)]',
                  !done && !active && 'border-subtle text-faint',
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
              </span>
              <span className="hidden min-w-0 flex-col sm:flex">
                <span
                  className={cn(
                    'truncate text-[13px] font-medium',
                    active ? 'text-primary' : done ? 'text-secondary' : 'text-faint',
                  )}
                >
                  {STEP_META[step].title}
                </span>
                <span className="truncate text-[10px] text-faint">{STEP_META[step].caption}</span>
              </span>
            </button>

            {index < STEPS.length - 1 && (
              <span
                className={cn(
                  'h-px w-3 shrink-0 sm:w-6',
                  index < currentIndex ? 'bg-signal-400/50' : 'bg-[var(--border-subtle)]',
                )}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
