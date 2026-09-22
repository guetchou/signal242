import { describe, expect, it } from 'vitest';
import { distanceM } from '@/domain/report/geo';
import { InMemoryReportRepository } from './InMemoryReportRepository';

const NOW = new Date('2026-06-15T12:00:00.000Z');
const CENTRE = { lat: -4.2688, lng: 15.2799 };

describe('filtre de proximité', () => {
  it('ne retient que les signalements dans le rayon demandé', async () => {
    const repository = new InMemoryReportRepository(NOW, 64);
    const found = await repository.list({ near: { point: CENTRE, radiusM: 500 } });
    expect(found.every((report) => distanceM(report.position, CENTRE) <= 500)).toBe(true);
  });

  it('élargir le rayon ne retire jamais de résultat', async () => {
    const repository = new InMemoryReportRepository(NOW, 64);
    const tight = await repository.list({ near: { point: CENTRE, radiusM: 300 } });
    const wide = await repository.list({ near: { point: CENTRE, radiusM: 3000 } });
    expect(wide.length).toBeGreaterThanOrEqual(tight.length);
  });

  it('se combine aux autres critères sans les annuler', async () => {
    const repository = new InMemoryReportRepository(NOW, 64);
    const found = await repository.list({
      near: { point: CENTRE, radiusM: 5000 },
      categoryIds: ['noise'],
    });
    expect(found.every((report) => report.categoryId === 'noise')).toBe(true);
  });
});

describe('concentration du jeu de démonstration', () => {
  it('produit des grappes exploitables pour le rapprochement de doublons', async () => {
    const repository = new InMemoryReportRepository(NOW, 64);
    const all = await repository.list();

    // Au moins un signalement doit avoir un voisin dans le rayon de doublon :
    // sans grappe, la fonction de rapprochement ne serait jamais sollicitée.
    const withNeighbour = all.filter((report) =>
      all.some(
        (other) => other.id !== report.id && distanceM(other.position, report.position) < 120,
      ),
    );
    expect(withNeighbour.length).toBeGreaterThan(5);
  });
});
