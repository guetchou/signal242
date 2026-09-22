import { Link } from 'react-router-dom';
import { Check, Copy, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Panel } from '@/design-system';
import { STATUS_CITIZEN_COPY } from '@/domain/report/status';
import type { Report } from '@/domain/report/types';
import { formatDateTime } from '@/lib/format';

export interface ReportSuccessProps {
  report: Report;
  onRestart: () => void;
}

/**
 * Confirmation de dépôt.
 *
 * La référence est l'unique élément à retenir : elle est donc typographiée en
 * grand, copiable en un geste, et rappelée dans le message de suivi.
 */
export function ReportSuccess({ report, onRestart }: ReportSuccessProps) {
  const [copied, setCopied] = useState(false);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(report.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Presse-papiers refusé : la référence reste lisible et sélectionnable.
    }
  };

  return (
    <Panel elevation="floating" bezel className="relative grain overflow-hidden text-center">
      <div className="aurora" aria-hidden />

      <div className="relative mx-auto flex max-w-lg flex-col items-center gap-5 py-6">
        <span className="grid size-16 place-items-center rounded-full bg-signal-400/15 glow-accent">
          <Check className="size-8 text-[var(--tone-signal-text)]" aria-hidden />
        </span>

        <div>
          <h2 className="text-2xl font-bold text-primary">Signalement transmis</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            {STATUS_CITIZEN_COPY[report.status]}
          </p>
        </div>

        <div className="w-full rounded-[var(--radius-md)] surface-sunken p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-faint">Votre référence de suivi</p>
          <div className="mt-2 flex items-center justify-center gap-2.5">
            <p className="numeric text-2xl font-bold text-[var(--tone-signal-text)]">{report.reference}</p>
            <button
              type="button"
              onClick={() => void copyReference()}
              className="grid size-8 place-items-center rounded-[var(--radius-sm)] border border-subtle text-muted transition-colors hover:border-strong hover:text-primary"
              aria-label="Copier la référence"
            >
              {copied ? <Check className="size-3.5 text-[var(--tone-signal-text)]" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-faint">
            Conservez-la : elle donne accès au suivi sans création de compte.
          </p>
        </div>

        <dl className="grid w-full gap-3 text-left sm:grid-cols-2">
          <div className="rounded-[var(--radius-sm)] surface-raised px-3.5 py-2.5">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-faint">Échéance de traitement</dt>
            <dd className="mt-1 text-[13px] font-medium text-primary">{formatDateTime(report.dueAt)}</dd>
          </div>
          <div className="rounded-[var(--radius-sm)] surface-raised px-3.5 py-2.5">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-faint">Lieu enregistré</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-primary">
              <MapPin className="size-3.5 text-muted" aria-hidden />
              {report.address.district}
            </dd>
          </div>
        </dl>

        {report.noise && (
          <Badge tone="cortex" size="md">
            Mesure acoustique jointe : {report.noise.laeq.toFixed(1)} dB(A)
          </Badge>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/suivi" state={{ reference: report.reference }}>
            <Button iconLeft={<Search className="size-4" />}>Suivre ce dossier</Button>
          </Link>
          <Button variant="secondary" onClick={onRestart}>
            Déposer un autre signalement
          </Button>
        </div>
      </div>
    </Panel>
  );
}
