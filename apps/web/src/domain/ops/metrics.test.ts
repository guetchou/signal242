import { describe, expect, it } from 'vitest';
import { buildSeedReports } from '@/infrastructure/mock/seed';
import { bySlaState, byCategory, byDistrict, dailyVolume, prioritizedQueue, summarize } from './metrics';
import { priorityScore } from '../report/sla';

const NOW = new Date('2026-06-15T12:00:00.000Z');
const REPORTS = buildSeedReports(80, NOW);

describe('summarize', () => {
  it('compte l’intégralité du corpus', () => {
    expect(summarize(REPORTS, NOW).total).toBe(80);
  });

  it('exprime le taux de résolution comme un ratio borné', () => {
    const rate = summarize(REPORTS, NOW).resolutionRate;
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThanOrEqual(1);
  });

  it('renvoie des compteurs nuls sur un corpus vide sans lever', () => {
    const empty = summarize([], NOW);
    expect(empty.total).toBe(0);
    expect(empty.resolutionRate).toBe(0);
    expect(empty.medianResolutionHours).toBe(0);
  });
});

describe('byCategory', () => {
  it('expose toutes les familles, y compris celles sans signalement', () => {
    expect(byCategory([])).toHaveLength(10);
    expect(byCategory([]).every((bucket) => bucket.value === 0)).toBe(true);
  });

  it('conserve le volume total', () => {
    const total = byCategory(REPORTS).reduce((sum, bucket) => sum + bucket.value, 0);
    expect(total).toBe(REPORTS.length);
  });
});

describe('byDistrict', () => {
  it('conserve le volume total', () => {
    const total = byDistrict(REPORTS).reduce((sum, bucket) => sum + bucket.value, 0);
    expect(total).toBe(REPORTS.length);
  });
});

describe('bySlaState', () => {
  it('répartit chaque dossier dans exactement un état', () => {
    const counts = bySlaState(REPORTS, NOW);
    const total = counts.met + counts.on_track + counts.at_risk + counts.breached;
    expect(total).toBe(REPORTS.length);
  });
});

describe('dailyVolume', () => {
  it('produit une série continue de la longueur demandée', () => {
    expect(dailyVolume(REPORTS, NOW, 30)).toHaveLength(30);
  });

  it('est ordonnée chronologiquement', () => {
    const series = dailyVolume(REPORTS, NOW, 14).map((point) => point.date);
    expect([...series].sort()).toEqual(series);
  });
});

describe('prioritizedQueue', () => {
  const queue = prioritizedQueue(REPORTS, NOW);

  it('ne retient que les dossiers ouverts', () => {
    expect(queue.every((report) => ['submitted', 'triaged', 'in_progress'].includes(report.status))).toBe(true);
  });

  it('classe par score de priorité décroissant', () => {
    const scores = queue.map((report) => priorityScore(report, NOW));
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });
});
