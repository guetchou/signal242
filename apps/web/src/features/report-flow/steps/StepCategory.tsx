import { Badge, resolveIcon, TONES } from '@/design-system';
import { CATEGORIES, getCategory } from '@/domain/report/categories';
import { SEVERITY_LABELS, SEVERITY_ORDER } from '@/domain/report/sla';
import type { CategoryId, ReportDraft, Severity } from '@/domain/report/types';
import { formatDuration } from '@/lib/format';
import { cn } from '@/lib/cn';

export interface StepCategoryProps {
  draft: ReportDraft;
  onCategory: (id: CategoryId) => void;
  onSubtype: (subtypeId: string, severity: Severity) => void;
  onSeverity: (severity: Severity) => void;
}

/** Étape 1 — qualification : famille, situation précise, gravité ressentie. */
export function StepCategory({ draft, onCategory, onSubtype, onSeverity }: StepCategoryProps) {
  const category = getCategory(draft.categoryId);
  const tone = TONES[category.tone];

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-secondary">
          1. Quelle est la famille d’incident ?
        </legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((item) => {
            const Icon = resolveIcon(item.icon);
            const selected = item.id === draft.categoryId;
            const itemTone = TONES[item.tone];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCategory(item.id)}
                aria-pressed={selected}
                className={cn(
                  'group flex flex-col items-start gap-2.5 rounded-[var(--radius-md)] border p-3.5 text-left',
                  'transition-all duration-[var(--duration-fast)]',
                  selected
                    ? cn('border-strong surface-raised', itemTone.glow)
                    : 'border-subtle hover:border-default hover:surface-raised',
                )}
              >
                <span className={cn('grid size-9 place-items-center rounded-[var(--radius-sm)]', itemTone.bg)}>
                  <Icon className={cn('size-4', itemTone.text)} aria-hidden />
                </span>
                <span
                  className={cn(
                    'text-[13px] font-medium leading-tight',
                    selected ? 'text-primary' : 'text-secondary',
                  )}
                >
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-secondary">
          2. Quelle situation précisément ?
        </legend>
        <div className="flex flex-wrap gap-2">
          {category.subtypes.map((subtype) => {
            const selected = subtype.id === draft.subtypeId;
            return (
              <button
                key={subtype.id}
                type="button"
                onClick={() => onSubtype(subtype.id, subtype.baseSeverity)}
                aria-pressed={selected}
                className={cn(
                  'rounded-full border px-4 py-2 text-[13px] font-medium transition-colors',
                  selected
                    ? cn(tone.bg, tone.border, tone.text)
                    : 'border-subtle text-muted hover:border-default hover:text-primary',
                )}
              >
                {subtype.label}
              </button>
            );
          })}
        </div>
        {category.subtypes.find((subtype) => subtype.id === draft.subtypeId)?.hint && (
          <p className="text-[12px] text-faint">
            {category.subtypes.find((subtype) => subtype.id === draft.subtypeId)?.hint}
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-secondary">3. Quelle gravité estimez-vous ?</legend>
        <div className="grid gap-2.5 sm:grid-cols-4">
          {SEVERITY_ORDER.map((severity) => {
            const selected = severity === draft.severity;
            return (
              <button
                key={severity}
                type="button"
                onClick={() => onSeverity(severity)}
                aria-pressed={selected}
                className={cn(
                  'flex flex-col gap-1.5 rounded-[var(--radius-md)] border p-3.5 text-left transition-all',
                  selected ? 'border-strong surface-raised' : 'border-subtle hover:border-default',
                )}
              >
                <span className={cn('text-[13px] font-semibold', selected ? 'text-primary' : 'text-secondary')}>
                  {SEVERITY_LABELS[severity]}
                </span>
                <span className="numeric text-[11px] text-faint">
                  Délai : {formatDuration(category.slaHours[severity])}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[12px] leading-relaxed text-faint">
          Votre estimation arme le délai contractuel. Elle sera confirmée ou corrigée par l’agent à
          la qualification, et peut être relevée automatiquement si d’autres riverains confirment le
          même incident.
        </p>
      </fieldset>

      {category.anonymousByDefault && (
        <Badge tone="alert" size="md" className="w-fit">
          Cette famille est traitée en canal confidentiel : votre identité n’apparaît ni sur la
          carte publique, ni dans le dossier transmis au service.
        </Badge>
      )}
    </div>
  );
}
