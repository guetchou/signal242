import { describe, expect, it } from 'vitest';
import { computeDueDate, escalatedSeverity, priorityScore, slaProgress, slaState } from './sla';
import type { Report } from './types';

const BASE: Report = {
  id: 'r1',
  reference: 'SIG-TEST-01',
  categoryId: 'roads',
  subtypeId: 'pothole',
  title: 'Nid-de-poule',
  description: '',
  status: 'triaged',
  severity: 'moderate',
  channel: 'mobile',
  position: { lat: -4.26, lng: 15.28 },
  address: { label: 'Avenue de la Paix', district: 'Bacongo', city: 'Brazzaville' },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  dueAt: '2026-01-11T00:00:00.000Z',
  anonymous: false,
  reporterAlias: 'Citoyen',
  confirmations: 0,
  attachments: [],
  timeline: [],
};

const at = (iso: string) => new Date(iso);

describe('computeDueDate', () => {
  it('applique le délai contractuel de la catégorie et de la gravité', () => {
    // Voirie / critique = 12 heures.
    const due = computeDueDate('roads', 'critical', at('2026-01-01T00:00:00.000Z'));
    expect(due.toISOString()).toBe('2026-01-01T12:00:00.000Z');
  });

  it('accorde un délai plus long à une gravité faible', () => {
    const low = computeDueDate('roads', 'low', at('2026-01-01T00:00:00.000Z'));
    const high = computeDueDate('roads', 'high', at('2026-01-01T00:00:00.000Z'));
    expect(low.getTime()).toBeGreaterThan(high.getTime());
  });
});

describe('slaState', () => {
  it('reste « dans les temps » en début de fenêtre', () => {
    expect(slaState(BASE, at('2026-01-02T00:00:00.000Z'))).toBe('on_track');
  });

  it('bascule « échéance proche » au-delà de 75 % du délai', () => {
    expect(slaState(BASE, at('2026-01-09T00:00:00.000Z'))).toBe('at_risk');
  });

  it('bascule « hors délai » après l’échéance', () => {
    expect(slaState(BASE, at('2026-01-12T00:00:00.000Z'))).toBe('breached');
  });

  it('juge un dossier clos sur sa date de clôture, pas sur l’heure courante', () => {
    const closed: Report = { ...BASE, status: 'closed', updatedAt: '2026-01-05T00:00:00.000Z' };
    expect(slaState(closed, at('2030-01-01T00:00:00.000Z'))).toBe('met');
  });

  it('constate un dépassement sur un dossier clos trop tard', () => {
    const closed: Report = { ...BASE, status: 'closed', updatedAt: '2026-01-20T00:00:00.000Z' };
    expect(slaState(closed, at('2026-01-21T00:00:00.000Z'))).toBe('breached');
  });
});

describe('slaProgress', () => {
  it('reste borné à 1 après dépassement', () => {
    expect(slaProgress(BASE, at('2027-01-01T00:00:00.000Z'))).toBe(1);
  });

  it('reste borné à 0 avant le dépôt', () => {
    expect(slaProgress(BASE, at('2025-01-01T00:00:00.000Z'))).toBe(0);
  });
});

describe('priorityScore', () => {
  it('classe un dossier critique au-dessus d’un dossier faible', () => {
    const critical: Report = { ...BASE, severity: 'critical' };
    const low: Report = { ...BASE, severity: 'low' };
    const now = at('2026-01-02T00:00:00.000Z');
    expect(priorityScore(critical, now)).toBeGreaterThan(priorityScore(low, now));
  });

  it('tient compte de la pression citoyenne', () => {
    const confirmed: Report = { ...BASE, confirmations: 30 };
    const now = at('2026-01-02T00:00:00.000Z');
    expect(priorityScore(confirmed, now)).toBeGreaterThan(priorityScore(BASE, now));
  });

  it('propulse un dossier hors délai', () => {
    expect(priorityScore(BASE, at('2026-01-20T00:00:00.000Z'))).toBeGreaterThan(
      priorityScore(BASE, at('2026-01-02T00:00:00.000Z')),
    );
  });
});

describe('escalatedSeverity', () => {
  it('ne remonte pas un signalement isolé', () => {
    expect(escalatedSeverity(BASE)).toBe('moderate');
  });

  it('remonte d’un cran au-delà de 8 confirmations', () => {
    expect(escalatedSeverity({ ...BASE, confirmations: 10 })).toBe('high');
  });

  it('plafonne à « critique »', () => {
    expect(escalatedSeverity({ ...BASE, severity: 'high', confirmations: 40 })).toBe('critical');
  });
});

describe('slaState et date de résolution', () => {
  it('juge sur la fin d’intervention, pas sur une confirmation tardive', () => {
    const closed: Report = {
      ...BASE,
      status: 'closed',
      // Intervention achevée dans les temps…
      resolvedAt: '2026-01-05T00:00:00.000Z',
      // …mais confirmée par le citoyen bien après l’échéance.
      updatedAt: '2026-01-30T00:00:00.000Z',
    };
    expect(slaState(closed, at('2026-02-01T00:00:00.000Z'))).toBe('met');
  });

  it('constate le dépassement quand l’intervention elle-même est tardive', () => {
    const closed: Report = {
      ...BASE,
      status: 'closed',
      resolvedAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
    };
    expect(slaState(closed, at('2026-02-01T00:00:00.000Z'))).toBe('breached');
  });
});
