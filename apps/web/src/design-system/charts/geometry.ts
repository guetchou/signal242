/**
 * Géométrie partagée des graphiques.
 *
 * Isolée de React : les projections d'échelle et la construction de chemins
 * sont des fonctions pures, testables et réutilisables par toutes les formes.
 */

export interface Extent {
  readonly min: number;
  readonly max: number;
}

export function extentOf(values: readonly number[], padRatio = 0.08): Extent {
  if (values.length === 0) return { min: 0, max: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return { min: min - 1, max: max + 1 };
  const pad = (max - min) * padRatio;
  // Le zéro reste l'origine sur les volumes : tronquer la base exagère l'écart.
  return { min: min >= 0 ? 0 : min - pad, max: max + pad };
}

/** Projette une valeur dans l'espace de tracé vertical (SVG, origine en haut). */
export function projectY(value: number, extent: Extent, height: number, padTop = 0): number {
  const span = Math.max(extent.max - extent.min, 1e-9);
  const ratio = (value - extent.min) / span;
  return padTop + (1 - ratio) * (height - padTop);
}

export function projectX(index: number, count: number, width: number): number {
  if (count <= 1) return width / 2;
  return (index / (count - 1)) * width;
}

/** Chemin polylinéaire lissé par des courbes cubiques (tension modérée). */
export function smoothPath(points: readonly { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length < 3) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  }

  let path = `M${points[0]!.x.toFixed(2)},${points[0]!.y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i]!;
    const next = points[i + 1]!;
    const controlX = (current.x + next.x) / 2;
    path += ` C${controlX.toFixed(2)},${current.y.toFixed(2)} ${controlX.toFixed(2)},${next.y.toFixed(2)} ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
  }
  return path;
}

/** Repères d'axe « ronds », plus lisibles qu'une division arithmétique brute. */
export function niceTicks(extent: Extent, count = 4): number[] {
  const span = extent.max - extent.min;
  if (span <= 0) return [extent.min];
  const rawStep = span / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep) ?? magnitude * 10;
  const ticks: number[] = [];
  for (let value = Math.ceil(extent.min / step) * step; value <= extent.max; value += step) {
    ticks.push(Math.round(value * 100) / 100);
  }
  return ticks;
}
