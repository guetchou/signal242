import { useState } from 'react';
import { AudioWaveform, Clock, MapPin, ThumbsUp } from 'lucide-react';
import { Badge, Button, Panel, resolveIcon, SEVERITY_TONE, SLA_TONE, STATUS_TONE, TONES } from '@/design-system';
import { getCategory } from '@/domain/report/categories';
import { hoursRemaining, SEVERITY_LABELS, SLA_LABELS, slaState } from '@/domain/report/sla';
import { STATUS_CITIZEN_COPY, STATUS_LABELS } from '@/domain/report/status';
import type { Report } from '@/domain/report/types';
import { formatDateTime, formatDuration, formatRelative } from '@/lib/format';
import { cn } from '@/lib/cn';
import { TrackingTimeline } from './TrackingTimeline';

export interface TrackingResultProps {
  report: Report;
  now: Date;
  onConfirm: () => Promise<void>;
}

/**
 * Fiche de suivi publique.
 *
 * Expose l'engagement de délai et l'avancement, jamais l'organisation interne
 * ni l'identité des agents. La confirmation citoyenne y est proposée : c'est
 * le signal qui alimente la priorisation et atteste de la résolution.
 */
export function TrackingResult({ report, now, onConfirm }: TrackingResultProps) {
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const category = getCategory(report.categoryId);
  const Icon = resolveIcon(category.icon);
  const tone = TONES[category.tone];
  const state = slaState(report, now);
  const remaining = hoursRemaining(report, now);

  const confirm = async () => {
    setConfirming(true);
    try {
      await onConfirm();
      setConfirmed(true);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel elevation="floating" bezel className="flex flex-col gap-6">
        <header className="flex flex-wrap items-start gap-4">
          <span className={cn('grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)]', tone.bg)}>
            <Icon className={cn('size-6', tone.text)} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-primary">{report.title}</h2>
            <p className="numeric mt-0.5 text-[12px] text-faint">
              {report.reference} · déposé {formatRelative(report.createdAt, now)}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={STATUS_TONE[report.status]} dot pulse={report.status === 'in_progress'} size="md">
              {STATUS_LABELS[report.status]}
            </Badge>
            <Badge tone={SEVERITY_TONE[report.severity]} size="md">
              {SEVERITY_LABELS[report.severity]}
            </Badge>
          </div>
        </header>

        <p className="text-[14px] leading-relaxed text-secondary">
          {STATUS_CITIZEN_COPY[report.status]}
        </p>

        <TrackingTimeline status={report.status} />

        <dl className="grid gap-3 border-t border-subtle pt-5 sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-faint">
              <MapPin className="size-3" aria-hidden />
              Lieu
            </dt>
            <dd className="mt-1 text-[13px] text-primary">
              {report.address.label}
              <span className="block text-muted">{report.address.district}</span>
            </dd>
          </div>

          <div>
            <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-faint">
              <Clock className="size-3" aria-hidden />
              Engagement
            </dt>
            <dd className={cn('mt-1 text-[13px]', TONES[SLA_TONE[state]].text)}>
              {SLA_LABELS[state]}
              <span className="block text-muted">
                {remaining > 0
                  ? `${formatDuration(remaining)} restantes`
                  : formatDateTime(report.dueAt)}
              </span>
            </dd>
          </div>

          {report.noise && (
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-faint">
                <AudioWaveform className="size-3" aria-hidden />
                Mesure jointe
              </dt>
              <dd className="numeric mt-1 text-[13px] text-[var(--tone-cortex-text)]">
                {report.noise.laeq.toFixed(1)} dB(A)
                <span className="block font-sans text-muted">sur {report.noise.durationS} s</span>
              </dd>
            </div>
          )}
        </dl>
      </Panel>

      <Panel elevation="raised" className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[14px] font-semibold text-primary">
            {report.confirmations} riverain{report.confirmations > 1 ? 's ont' : ' a'} confirmé ce
            signalement
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted">
            Chaque confirmation relève la priorité du dossier et peut déclencher une remontée
            automatique de gravité.
          </p>
        </div>
        <Button
          variant={confirmed ? 'outline' : 'secondary'}
          loading={confirming}
          disabled={confirmed}
          iconLeft={<ThumbsUp className="size-4" />}
          onClick={() => void confirm()}
        >
          {confirmed ? 'Confirmation enregistrée' : 'Je constate la même chose'}
        </Button>
      </Panel>

      <Panel elevation="raised">
        <h3 className="text-[13px] font-semibold text-secondary">Journal public</h3>
        <ol className="mt-4 flex flex-col gap-0">
          {report.timeline.map((event, index) => (
            <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {index < report.timeline.length - 1 && (
                <span className="absolute left-[5px] top-3 h-full w-px bg-[var(--border-default)]" aria-hidden />
              )}
              <span className="relative mt-1.5 size-[11px] shrink-0 rounded-full border-2 border-[var(--surface-base)] bg-[var(--tone-signal-mark)]" />
              <div>
                <p className="text-[13px] font-medium text-primary">{event.label}</p>
                <p className="text-[11px] text-faint">{formatDateTime(event.at)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
