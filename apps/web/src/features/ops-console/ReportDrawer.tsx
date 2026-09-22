import { AudioWaveform, Clock, MapPin, ShieldCheck, Users, X } from 'lucide-react';
import { Badge, Button, resolveIcon, SEVERITY_TONE, SLA_TONE, STATUS_TONE, TONES } from '@/design-system';
import { getCategory } from '@/domain/report/categories';
import { classifyLevel, emergence, periodAt, VERDICT_LABELS } from '@/domain/noise/acoustics';
import { hoursRemaining, SEVERITY_LABELS, SLA_LABELS, slaState } from '@/domain/report/sla';
import { STATUS_LABELS } from '@/domain/report/status';
import type { Report, ReportStatus } from '@/domain/report/types';
import { formatDateTime, formatDuration, formatRelative } from '@/lib/format';
import { cn } from '@/lib/cn';

export interface ReportDrawerProps {
  report: Report;
  now: Date;
  onClose: () => void;
  onStatusChange: (status: ReportStatus) => void;
  busy?: boolean;
}

/** Transitions autorisées depuis l'état courant : empêche les sauts incohérents. */
const NEXT_STATUSES: Record<ReportStatus, readonly ReportStatus[]> = {
  submitted: ['triaged', 'rejected'],
  triaged: ['in_progress', 'rejected'],
  in_progress: ['resolved'],
  resolved: ['closed'],
  closed: [],
  rejected: [],
};

/**
 * Fiche détaillée d'un signalement.
 *
 * Réunit sur un seul écran ce qu'un agent doit voir pour décider : nature,
 * preuves, engagement de délai et historique complet. Les actions disponibles
 * sont dérivées de l'état, non affichées puis désactivées.
 */
export function ReportDrawer({ report, now, onClose, onStatusChange, busy }: ReportDrawerProps) {
  const category = getCategory(report.categoryId);
  const Icon = resolveIcon(category.icon);
  const tone = TONES[category.tone];
  const state = slaState(report, now);
  const remaining = hoursRemaining(report, now);
  const transitions = NEXT_STATUSES[report.status];

  const noisePeriod = report.noise ? periodAt(new Date(report.noise.measuredAt)) : null;

  return (
    <aside className="flex h-full flex-col gap-5 overflow-y-auto">
      <header className="flex items-start gap-3">
        <span className={cn('grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)]', tone.bg)}>
          <Icon className={cn('size-5', tone.text)} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-tight text-primary">{report.title}</h2>
          <p className="numeric mt-0.5 text-[11px] text-faint">{report.reference}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-subtle text-muted transition-colors hover:border-strong hover:text-primary"
          aria-label="Fermer la fiche"
        >
          <X className="size-4" aria-hidden />
        </button>
      </header>

      <div className="flex flex-wrap gap-1.5">
        <Badge tone={STATUS_TONE[report.status]} dot size="md">
          {STATUS_LABELS[report.status]}
        </Badge>
        <Badge tone={SEVERITY_TONE[report.severity]} size="md">
          Gravité {SEVERITY_LABELS[report.severity].toLowerCase()}
        </Badge>
        <Badge tone={SLA_TONE[state]} size="md">
          {SLA_LABELS[state]}
        </Badge>
        {report.anonymous && <Badge tone="neutral" size="md">Déclarant protégé</Badge>}
      </div>

      <p className="rounded-[var(--radius-md)] surface-sunken px-4 py-3 text-[13px] leading-relaxed text-secondary">
        {report.description}
      </p>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-sm)] surface-raised px-3.5 py-2.5">
          <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-faint">
            <MapPin className="size-3" aria-hidden />
            Localisation
          </dt>
          <dd className="mt-1 text-[13px] text-primary">
            {report.address.label}
            <span className="block text-muted">{report.address.district}</span>
          </dd>
        </div>

        <div className="rounded-[var(--radius-sm)] surface-raised px-3.5 py-2.5">
          <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-faint">
            <Clock className="size-3" aria-hidden />
            Échéance
          </dt>
          <dd className={cn('mt-1 text-[13px]', TONES[SLA_TONE[state]].text)}>
            {remaining < 0 ? `Dépassée de ${formatDuration(remaining)}` : `${formatDuration(remaining)} restantes`}
            <span className="block text-muted">{formatDateTime(report.dueAt)}</span>
          </dd>
        </div>

        <div className="rounded-[var(--radius-sm)] surface-raised px-3.5 py-2.5">
          <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-faint">
            <ShieldCheck className="size-3" aria-hidden />
            Service affecté
          </dt>
          <dd className="mt-1 text-[13px] text-primary">{report.assignedTeam ?? 'À qualifier'}</dd>
        </div>

        <div className="rounded-[var(--radius-sm)] surface-raised px-3.5 py-2.5">
          <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-faint">
            <Users className="size-3" aria-hidden />
            Confirmations
          </dt>
          <dd className="numeric mt-1 text-[13px] text-primary">
            {report.confirmations}
            <span className="ml-1.5 font-sans text-muted">riverains</span>
          </dd>
        </div>
      </dl>

      {report.noise && noisePeriod && (
        <section className="rounded-[var(--radius-md)] border border-cortex-400/25 bg-cortex-400/[0.07] p-4">
          <h3 className="flex items-center gap-2 text-[13px] font-semibold text-[var(--tone-cortex-text)]">
            <AudioWaveform className="size-4" aria-hidden />
            Relevé acoustique
          </h3>
          <dl className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label: 'LAeq', value: report.noise.laeq.toFixed(1) },
              { label: 'LAmax', value: report.noise.lmax.toFixed(1) },
              { label: 'Fond L90', value: report.noise.l90.toFixed(1) },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] uppercase tracking-[0.1em] text-faint">{item.label}</dt>
                <dd className="numeric text-base font-bold text-primary">
                  {item.value}
                  <span className="ml-1 text-[10px] font-normal text-faint">dB(A)</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[12px] leading-relaxed text-secondary">
            {VERDICT_LABELS[classifyLevel(report.noise.laeq, noisePeriod)]} · émergence de{' '}
            {emergence(report.noise.laeq, report.noise.l90).toFixed(1)} dB sur{' '}
            {report.noise.durationS} s.{' '}
            {report.noise.calibrated
              ? 'Terminal étalonné : relevé opposable.'
              : 'Terminal non étalonné : valeur indicative, à confirmer par un contrôle.'}
          </p>
        </section>
      )}

      <section>
        <h3 className="text-[13px] font-semibold text-secondary">Journal du dossier</h3>
        <ol className="mt-3 flex flex-col gap-0">
          {report.timeline.map((event, index) => (
            <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {index < report.timeline.length - 1 && (
                <span className="absolute left-[5px] top-3 h-full w-px bg-[var(--border-default)]" aria-hidden />
              )}
              <span className="relative mt-1.5 size-[11px] shrink-0 rounded-full border-2 border-[var(--surface-base)] bg-[var(--tone-signal-mark)]" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-primary">{event.label}</p>
                <p className="text-[11px] text-faint">
                  {event.actor} · {formatRelative(event.at, now)}
                </p>
                {event.detail && <p className="mt-1 text-[12px] text-muted">{event.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {transitions.length > 0 && (
        <footer className="mt-auto flex flex-wrap gap-2 border-t border-subtle pt-4">
          {transitions.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={status === 'rejected' ? 'outline' : 'primary'}
              loading={busy}
              onClick={() => onStatusChange(status)}
            >
              {STATUS_LABELS[status]}
            </Button>
          ))}
        </footer>
      )}
    </aside>
  );
}
