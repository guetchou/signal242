import { AudioWaveform, Clock, MapPin, ShieldCheck, Users } from 'lucide-react';
import { Badge, Panel, resolveIcon, SEVERITY_TONE, TONES } from '@/design-system';
import { getCategory, getSubtype } from '@/domain/report/categories';
import { computeDueDate, SEVERITY_LABELS } from '@/domain/report/sla';
import type { ReportDraft } from '@/domain/report/types';
import { formatDateTime, formatDuration } from '@/lib/format';
import { cn } from '@/lib/cn';

export interface StepReviewProps {
  draft: ReportDraft;
}

/**
 * Étape 4 — récapitulatif.
 *
 * Le citoyen voit avant d'envoyer ce que l'administration verra : catégorie,
 * service destinataire, délai armé. La transparence sur l'engagement est le
 * principal levier de confiance et de réutilisation du service.
 */
export function StepReview({ draft }: StepReviewProps) {
  const category = getCategory(draft.categoryId);
  const subtype = getSubtype(draft.categoryId, draft.subtypeId);
  const tone = TONES[category.tone];
  const Icon = resolveIcon(category.icon);
  const slaHours = category.slaHours[draft.severity];
  const dueAt = computeDueDate(draft.categoryId, draft.severity, new Date());

  return (
    <div className="flex flex-col gap-5">
      <Panel elevation="raised" bezel className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <span className={cn('grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)]', tone.bg)}>
            <Icon className={cn('size-6', tone.text)} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-primary">{subtype?.label ?? draft.title}</h3>
              <Badge tone={SEVERITY_TONE[draft.severity]}>{SEVERITY_LABELS[draft.severity]}</Badge>
              {draft.anonymous && <Badge tone="neutral">Anonyme</Badge>}
            </div>
            <p className="mt-1 text-[13px] text-muted">{category.label}</p>
          </div>
        </div>

        {draft.description && (
          <p className="rounded-[var(--radius-md)] surface-sunken px-4 py-3 text-[13px] leading-relaxed text-secondary">
            {draft.description}
          </p>
        )}

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-faint">Lieu</dt>
              <dd className="text-[13px] text-primary">
                {draft.address?.label}
                <span className="block text-muted">
                  {draft.address?.district}, {draft.address?.city}
                </span>
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Users className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-faint">Service destinataire</dt>
              <dd className="text-[13px] text-primary">{category.defaultTeam}</dd>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-faint">Délai contractuel</dt>
              <dd className="text-[13px] text-primary">
                {formatDuration(slaHours)}
                <span className="block text-muted">échéance au {formatDateTime(dueAt.toISOString())}</span>
              </dd>
            </div>
          </div>

          {draft.noise && (
            <div className="flex items-start gap-2.5">
              <AudioWaveform className="mt-0.5 size-4 shrink-0 text-[var(--tone-cortex-text)]" aria-hidden />
              <div>
                <dt className="text-[11px] uppercase tracking-[0.12em] text-faint">Mesure acoustique</dt>
                <dd className="numeric text-[13px] text-primary">
                  {draft.noise.laeq.toFixed(1)} dB(A)
                  <span className="block font-sans text-muted">
                    crête {draft.noise.lmax.toFixed(1)} · fond {draft.noise.l90.toFixed(1)} · {draft.noise.durationS} s
                  </span>
                </dd>
              </div>
            </div>
          )}
        </dl>

        {draft.attachments.length > 0 && (
          <div className="flex gap-2.5">
            {draft.attachments.map((attachment) => (
              <img
                key={attachment.id}
                src={attachment.url}
                alt=""
                className="size-16 rounded-[var(--radius-sm)] object-cover"
              />
            ))}
          </div>
        )}
      </Panel>

      <p className="flex items-start gap-2.5 rounded-[var(--radius-md)] bg-[var(--accent-soft)] px-4 py-3 text-[12px] leading-relaxed text-secondary">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--tone-signal-text)]" aria-hidden />
        À la transmission, une référence de suivi vous est remise. Elle permet de consulter
        l’avancement du dossier sans créer de compte, et de confirmer la résolution une fois
        l’intervention réalisée.
      </p>
    </div>
  );
}
