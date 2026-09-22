import { describe, expect, it } from 'vitest';
import { distanceM } from './geo';

describe('distanceM', () => {
  it('renvoie zéro pour un point et lui-même', () => {
    expect(distanceM({ lat: -4.2691, lng: 15.2823 }, { lat: -4.2691, lng: 15.2823 })).toBe(0);
  });

  it('mesure une centaine de mètres à l’échelle d’un pâté de maisons', () => {
    // 0,001° de latitude ≈ 111 m.
    const d = distanceM({ lat: -4.2691, lng: 15.2823 }, { lat: -4.2701, lng: 15.2823 });
    expect(d).toBeGreaterThan(105);
    expect(d).toBeLessThan(118);
  });

  it('est symétrique', () => {
    const a = { lat: -4.26, lng: 15.28 };
    const b = { lat: -4.29, lng: 15.25 };
    expect(distanceM(a, b)).toBeCloseTo(distanceM(b, a), 6);
  });
});
