/**
 * Adaptateur de persistance en mémoire.
 *
 * Implémente le port `ReportRepository` pour la démonstration hors ligne.
 * La latence simulée est volontaire : elle force l'interface à traiter
 * correctement les états de chargement dès la phase de conception.
 */

import { getCategory } from '@/domain/report/categories';
import { computeDueDate } from '@/domain/report/sla';
import type { Report, ReportDraft, ReportStatus } from '@/domain/report/types';
import type { ReportQuery, ReportRepository } from '@/domain/ports';
import { buildSeedReports } from './seed';

const LATENCY_MS = 260;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function matches(report: Report, query: ReportQuery): boolean {
  if (query.categoryIds?.length && !query.categoryIds.includes(report.categoryId)) return false;
  if (query.statuses?.length && !query.statuses.includes(report.status)) return false;
  if (query.severities?.length && !query.severities.includes(report.severity)) return false;
  if (query.districts?.length && !query.districts.includes(report.address.district)) return false;

  if (query.search) {
    const needle = normalize(query.search);
    const haystack = normalize(
      `${report.reference} ${report.title} ${report.description} ${report.address.label} ${report.address.district}`,
    );
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export class InMemoryReportRepository implements ReportRepository {
  private reports: Report[];
  private sequence: number;

  constructor(now: Date = new Date(), size = 64) {
    this.reports = buildSeedReports(size, now);
    this.sequence = size;
  }

  async list(query: ReportQuery = {}): Promise<readonly Report[]> {
    await delay(LATENCY_MS);
    return this.reports.filter((report) => matches(report, query));
  }

  async getByReference(reference: string): Promise<Report | null> {
    await delay(LATENCY_MS);
    const needle = reference.trim().toUpperCase();
    return this.reports.find((report) => report.reference.toUpperCase() === needle) ?? null;
  }

  async create(draft: ReportDraft): Promise<Report> {
    await delay(LATENCY_MS);
    if (!draft.position || !draft.address) {
      throw new Error('Un signalement exige une position et une adresse résolues.');
    }

    const now = new Date();
    const category = getCategory(draft.categoryId);
    this.sequence += 1;

    const report: Report = {
      id: `rep_${this.sequence}`,
      reference: `SIG-${now.getTime().toString(36).toUpperCase().slice(-4)}-${this.sequence}`,
      categoryId: draft.categoryId,
      subtypeId: draft.subtypeId,
      title: draft.title,
      description: draft.description,
      status: 'submitted',
      severity: draft.severity,
      channel: draft.channel,
      position: draft.position,
      address: draft.address,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dueAt: computeDueDate(draft.categoryId, draft.severity, now).toISOString(),
      anonymous: draft.anonymous,
      reporterAlias: draft.anonymous ? 'Déclarant protégé' : 'Vous',
      confirmations: 0,
      attachments: draft.attachments,
      noise: draft.noise,
      timeline: [
        {
          id: 'e0',
          at: now.toISOString(),
          kind: 'created',
          label: 'Signalement déposé',
          actor: draft.anonymous ? 'Déclarant protégé' : 'Vous',
          detail: `Routage prévisionnel : ${category.defaultTeam}.`,
        },
      ],
    };

    this.reports = [report, ...this.reports];
    return report;
  }

  async updateStatus(id: string, status: ReportStatus, note?: string): Promise<Report> {
    await delay(LATENCY_MS / 2);
    return this.mutate(id, (report) => {
      const at = new Date().toISOString();
      const settling = status === 'resolved' || status === 'closed';
      return {
        ...report,
        status,
        updatedAt: at,
        // La résolution est horodatée une seule fois : une clôture ultérieure
        // ne réécrit pas la date qui atteste du respect de l'engagement.
        resolvedAt: settling ? (report.resolvedAt ?? at) : report.resolvedAt,
        timeline: [
          ...report.timeline,
          {
            id: `e_${report.timeline.length}`,
            at,
            kind: 'status' as const,
            label: `Statut mis à jour : ${status}`,
            actor: 'Agent de permanence',
            detail: note,
          },
        ],
      };
    });
  }

  async confirm(id: string): Promise<Report> {
    await delay(LATENCY_MS / 3);
    return this.mutate(id, (report) => ({
      ...report,
      confirmations: report.confirmations + 1,
      updatedAt: new Date().toISOString(),
    }));
  }

  private mutate(id: string, transform: (report: Report) => Report): Report {
    const index = this.reports.findIndex((report) => report.id === id);
    if (index === -1) throw new Error(`Signalement introuvable : ${id}`);
    const next = transform(this.reports[index]!);
    this.reports = [...this.reports.slice(0, index), next, ...this.reports.slice(index + 1)];
    return next;
  }
}
