import { AudioWaveform, Camera, Clock, MapPin, Users } from 'lucide-react';
import { Badge, resolveIcon, SEVERITY_TONE, SLA_TONE, STATUS_TONE, TONES } from '@/design-system';
import { getCategory } from '@/domain/report/categories';
import { hoursRemaining, priorityScore, SEVERITY_LABELS, slaProgress, slaState } from '@/domain/report/sla';
import { STATUS_LABELS } from '@/domain/report/status';
import type { Report } from '@/domain/report/types';
import { formatDuration, formatRelative } from '@/lib/format';
import { cn } from '@/lib/cn';

export interface ReportRowProps {
  report: Report;
  now: Date;
  selected: boolean;
  onSelect: (report: Report) => void;
}

/**
 * Ligne de la file de traitement.
 *
 * Densité assumée : un agent doit lire en un coup d'œil la priorité, le reste
 * à courir sur l'échéance et la nature de l'incident. La jauge de délai est la
 * seule information colorée par l'état, jamais le fond de la ligne entière.
 */
export function ReportRow({ report, now, selected, onSelect }: ReportRowProps) {
  const category = getCategory(report.categoryId);
  const Icon = resolveIcon(category.icon);
  const tone = TONES[category.tone];
  const state = slaState(report, now);
  const progress = slaProgress(report, now);
  const remaining = hoursRemaining(report, now);
  const score = priorityScore(report, now);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(report)}
        aria-current={selected ? 'true' : undefined}
        className={cn(
          'w-full rounded-[var(--radius-md)] border p-3.5 text-left transition-all duration-[var(--duration-fast)]',
          selected
            ? 'border-strong surface-raised'
            : 'border-subtle hover:border-default hover:surface-raised',
        )}
      >
        <div className="flex items-start gap-3">
          <span className={cn('mt-0.5 grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)]', tone.bg)}>
            <Icon className={cn('size-4', tone.text)} aria-hidden />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="truncate text-[14px] font-semibold text-primary">{report.title}</span>
              <Badge tone={SEVERITY_TONE[report.severity]}>{SEVERITY_LABELS[report.severity]}</Badge>
              <Badge tone={STATUS_TONE[report.status]} dot pulse={report.status === 'in_progress'}>
                {STATUS_LABELS[report.status]}
              </Badge>
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-faint">
              <span className="numeric">{report.reference}</span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3" aria-hidden />
                {report.address.district}
              </span>
              <span>{formatRelative(report.createdAt, now)}</span>
              {report.confirmations > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="size-3" aria-hidden />
                  {report.confirmations}
                </span>
              )}
              {report.attachments.length > 0 && (
                <span className="flex items-center gap-1">
                  <Camera className="size-3" aria-hidden />
                  {report.attachments.length}
                </span>
              )}
              {report.noise && (
                <span className="numeric flex items-center gap-1 text-[var(--tone-cortex-text)]">
                  <AudioWaveform className="size-3" aria-hidden />
                  {report.noise.laeq.toFixed(0)} dB
                </span>
              )}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="numeric block text-[15px] font-bold text-primary">{score}</span>
            <span className="block text-[9px] uppercase tracking-[0.12em] text-faint">priorité</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full surface-sunken">
            <span
              className={cn('block h-full rounded-full transition-[width]', TONES[SLA_TONE[state]].dot)}
              style={{ width: `${Math.max(progress * 100, 2)}%` }}
            />
          </span>
          <span className={cn('flex items-center gap-1 text-[11px] font-medium', TONES[SLA_TONE[state]].text)}>
            <Clock className="size-3" aria-hidden />
            {state === 'breached'
              ? `En retard de ${formatDuration(remaining)}`
              : `${formatDuration(remaining)} restantes`}
          </span>
        </div>
      </button>
    </li>
  );
}
