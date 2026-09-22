import { describe, expect, it } from 'vitest';
import {
  aWeightingGainDb,
  classifyLevel,
  emergence,
  equivalentLevel,
  percentileLevel,
  periodAt,
  rmsToDbfs,
  rootMeanSquare,
} from './acoustics';

describe('rootMeanSquare', () => {
  it('renvoie 0 sur une trame vide', () => {
    expect(rootMeanSquare(new Float32Array())).toBe(0);
  });

  it('renvoie l’amplitude d’un signal constant', () => {
    expect(rootMeanSquare(new Float32Array([0.5, -0.5, 0.5, -0.5]))).toBeCloseTo(0.5, 6);
  });
});

describe('rmsToDbfs', () => {
  it('place la pleine échelle à 0 dBFS', () => {
    expect(rmsToDbfs(1)).toBeCloseTo(0, 6);
  });

  it('reste fini sur un silence numérique', () => {
    expect(Number.isFinite(rmsToDbfs(0))).toBe(true);
  });
});

describe('aWeightingGainDb', () => {
  it('est neutre à 1 kHz, point de référence de la pondération A', () => {
    expect(aWeightingGainDb(1000)).toBeCloseTo(0, 1);
  });

  it('atténue fortement les basses fréquences', () => {
    expect(aWeightingGainDb(50)).toBeLessThan(-25);
  });

  it('atténue les très hautes fréquences', () => {
    expect(aWeightingGainDb(16000)).toBeLessThan(-5);
  });
});

describe('equivalentLevel', () => {
  it('conserve le niveau si tous les échantillons sont identiques', () => {
    expect(equivalentLevel([60, 60, 60])).toBeCloseTo(60, 6);
  });

  it('effectue une moyenne énergétique, non arithmétique', () => {
    // 40 dB et 60 dB : l’énergie est dominée par le niveau haut (~57 dB, pas 50).
    expect(equivalentLevel([40, 60])).toBeCloseTo(57.0, 1);
  });

  it('renvoie 0 sans échantillon exploitable', () => {
    expect(equivalentLevel([])).toBe(0);
  });
});

describe('percentileLevel', () => {
  const levels = [30, 40, 50, 60, 70, 80, 90, 100];

  it('L90 approxime le bruit de fond', () => {
    expect(percentileLevel(levels, 90)).toBeLessThan(percentileLevel(levels, 50));
  });

  it('L10 approxime les émergences', () => {
    expect(percentileLevel(levels, 10)).toBeGreaterThan(percentileLevel(levels, 50));
  });
});

describe('periodAt', () => {
  it('classe 14h en journée', () => {
    expect(periodAt(new Date(2026, 0, 15, 14))).toBe('day');
  });

  it('classe 20h en soirée', () => {
    expect(periodAt(new Date(2026, 0, 15, 20))).toBe('evening');
  });

  it('classe 2h du matin en période nocturne', () => {
    expect(periodAt(new Date(2026, 0, 15, 2))).toBe('night');
  });
});

describe('classifyLevel', () => {
  it('qualifie 45 dB(A) de gêne caractérisée la nuit', () => {
    expect(classifyLevel(45, 'night')).toBe('disturbing');
  });

  it('considère le même niveau comme courant en journée', () => {
    expect(classifyLevel(45, 'day')).toBe('calm');
  });

  it('signale un niveau nocif au-delà de 85 dB(A)', () => {
    expect(classifyLevel(92, 'day')).toBe('harmful');
  });
});

describe('emergence', () => {
  it('mesure l’écart au bruit de fond', () => {
    expect(emergence(68.4, 52.1)).toBeCloseTo(16.3, 1);
  });
});
