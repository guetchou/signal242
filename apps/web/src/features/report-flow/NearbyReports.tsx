import { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, Users } from 'lucide-react';
import { Badge, Button, resolveIcon, STATUS_TONE, TONES } from '@/design-system';
import { useServices } from '@/app/providers/ServicesProvider';
import { getCategory } from '@/domain/report/categories';
import { distanceM, DUPLICATE_RADIUS_M, REAPPEARANCE_WINDOW_H } from '@/domain/report/geo';
import { isOpen, STATUS_LABELS } from '@/domain/report/status';
import type { GeoPoint, Report } from '@/domain/report/types';
import { formatRelative } from '@/lib/format';
import { cn } from '@/lib/cn';

export interface NearbyReportsProps {
  position: GeoPoint;
}

/**
 * Signalements déjà déposés autour du point choisi.
 *
 * Premier service rendu aux agents : un riverain qui confirme un dossier
 * existant vaut mieux qu'un doublon à fusionner. La confirmation renforce la
 * priorité du dossier au lieu de gonfler le volume à traiter.
 *
 * Cet écran n'existe que parce que le lieu est demandé avant la nature du
 * problème : dans l'ordre inverse, le rapprochement serait impossible.
 */
export function NearbyReports({ position }: NearbyReportsProps) {
  const { reports } = useServices();
  const [candidates, setCandidates] = useState<readonly Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    reports
      .list({ near: { point: position, radiusM: DUPLICATE_RADIUS_M } })
      .then((found) => {
        if (cancelled) return;
        const reappearanceCutoff = now.getTime() - REAPPEARANCE_WINDOW_H * 3_600_000;
        setCandidates(
          found
            .filter((report) => {
              // Tout dossier ouvert, quel que soit son âge : il décrit peut-être
              // exactement ce que l'usager s'apprête à signaler.
              if (isOpen(report.status)) return true;
              // Et les clôtures récentes : au même endroit, c'est le signe d'une
              // réapparition, information utile au service qui est intervenu.
              const settledAt = report.resolvedAt ?? report.updatedAt;
              return new Date(settledAt).getTime() >= reappearanceCutoff;
            })
            .sort((a, b) => distanceM(a.position, position) - distanceM(b.position, position))
            .slice(0, 3),
        );
      })
      .catch(() => {
        if (!cancelled) setCandidates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reports, position, now]);

  const confirm = async (report: Report) => {
    setPending(report.id);
    try {
      await reports.confirm(report.id);
      setConfirmed(report.id);
    } finally {
      setPending(null);
    }
  };

  if (loading) {
    return (
      <p className="flex items-center gap-2 rounded-[var(--radius-md)] surface-sunken px-4 py-3 text-[13px] text-muted">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Recherche de signalements déjà déposés à cet endroit…
      </p>
    );
  }

  if (candidates.length === 0) return null;

  return (
    <section
      aria-labelledby="titre-proximite"
      className="rounded-[var(--radius-md)] border border-[var(--tone-ember-border)] bg-[var(--tone-ember-bg)] p-4"
    >
      <h3 id="titre-proximite" className="text-[13px] font-semibold text-[var(--tone-ember-text)]">
        {candidates.length === 1
          ? 'Un signalement existe déjà à cet endroit'
          : `${candidates.length} signalements existent déjà à cet endroit`}
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-secondary">
        S’il s’agit du même problème, signalez-le ici plutôt que d’ouvrir un nouveau dossier :
        votre confirmation relève sa priorité auprès du service, et lui évite un doublon à
        fusionner.
      </p>

      <ul className="mt-3.5 flex flex-col gap-2">
        {candidates.map((report) => {
          const category = getCategory(report.categoryId);
          const Icon = resolveIcon(category.icon);
          const tone = TONES[category.tone];
          const isConfirmed = confirmed === report.id;

          return (
            <li
              key={report.id}
              className="flex flex-wrap items-center gap-3 rounded-[var(--radius-sm)] surface-base p-3"
            >
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-[var(--radius-xs)]', tone.bg)}>
                <Icon className={cn('size-4', tone.text)} aria-hidden />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-primary">
                  {report.title}
                </span>
                <span className="flex flex-wrap items-center gap-x-2.5 text-[11px] text-faint">
                  <span>à {Math.round(distanceM(report.position, position))} m</span>
                  <span>{formatRelative(report.createdAt, now)}</span>
                  {report.confirmations > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="size-3" aria-hidden />
                      {report.confirmations}
                    </span>
                  )}
                </span>
              </span>

              <Badge tone={STATUS_TONE[report.status]}>{STATUS_LABELS[report.status]}</Badge>

              <Button
                size="sm"
                variant={isConfirmed ? 'outline' : 'secondary'}
                disabled={isConfirmed}
                loading={pending === report.id}
                iconLeft={isConfirmed ? <Check className="size-3.5" /> : undefined}
                onClick={() => void confirm(report)}
              >
                {isConfirmed
                  ? 'Confirmé'
                  : isOpen(report.status)
                    ? 'C’est le même'
                    : 'Le problème est revenu'}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
