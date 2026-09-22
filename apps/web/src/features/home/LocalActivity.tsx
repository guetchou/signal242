import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Panel, resolveIcon, STATUS_TONE, Badge, TONES } from '@/design-system';
import { getCategory } from '@/domain/report/categories';
import { STATUS_LABELS } from '@/domain/report/status';
import { summarize } from '@/domain/ops/metrics';
import { useReportsQuery } from '@/features/ops-console/useReportsQuery';
import { formatDecimal, formatNumber, formatPercent, formatRelative } from '@/lib/format';
import { cn } from '@/lib/cn';

/**
 * Activité récente du territoire.
 *
 * Sert deux fins à la fois : la redevabilité — ce que la collectivité traite
 * est public — et la preuve que le service est vivant. Les chiffres sont
 * factuels et bornés à trois : un tableau de bord complet relève de la console
 * agent, pas de l'accueil citoyen.
 */
export function LocalActivity() {
  const { items, loading } = useReportsQuery();
  const now = useMemo(() => new Date(), []);

  const summary = useMemo(() => summarize(items, now), [items, now]);
  const recent = useMemo(
    () => items.filter((report) => report.categoryId !== 'security').slice(0, 5),
    [items],
  );

  return (
    <Panel elevation="raised" className="flex flex-col gap-5">
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-primary">Activité du territoire</h2>
        <Link
          to="/carte"
          className="inline-flex items-center gap-0.5 text-[12px] font-medium text-[var(--accent)] hover:underline"
        >
          Carte publique
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </header>

      <dl className="grid grid-cols-3 gap-3">
        {[
          { label: 'Traités (30 j)', value: formatNumber(summary.total - summary.open) },
          { label: 'Délai médian', value: `${formatDecimal(summary.medianResolutionHours)} h` },
          { label: 'Délais tenus', value: formatPercent(summary.resolutionRate) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--radius-sm)] surface-sunken px-3 py-2.5">
            <dt className="text-[10px] uppercase tracking-[0.1em] text-faint">{stat.label}</dt>
            <dd className="numeric mt-1 text-lg font-bold text-primary">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2.5">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.1em] text-faint">
          Derniers signalements publics
        </h3>

        {loading ? (
          <div className="flex items-center gap-2 py-6 text-[13px] text-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Chargement…
          </div>
        ) : recent.length === 0 ? (
          <p className="py-6 text-[13px] text-muted">Aucun signalement public pour le moment.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {recent.map((report) => {
              const category = getCategory(report.categoryId);
              const Icon = resolveIcon(category.icon);
              const tone = TONES[category.tone];
              return (
                <li key={report.id} className="flex items-center gap-2.5 py-1.5">
                  <span className={cn('grid size-7 shrink-0 place-items-center rounded-[var(--radius-xs)]', tone.bg)}>
                    <Icon className={cn('size-3.5', tone.text)} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-primary">{report.title}</span>
                    <span className="block truncate text-[11px] text-faint">
                      {report.address.district} · {formatRelative(report.createdAt, now)}
                    </span>
                  </span>
                  <Badge tone={STATUS_TONE[report.status]}>{STATUS_LABELS[report.status]}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Panel>
  );
}
