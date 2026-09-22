import { useId } from 'react';
import { extentOf, projectX, projectY, smoothPath } from './geometry';

export interface SparklineProps {
  values: readonly number[];
  /** Jeton de couleur de série, ex. 'var(--series-1)'. */
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  /** Description textuelle : le graphique reste un élément d'image accessible. */
  label: string;
}

/**
 * Micro-courbe de tendance accompagnant un indicateur chiffré.
 *
 * Aucune échelle affichée par construction : la valeur exacte est portée par
 * le KPI voisin, la courbe ne sert qu'à montrer la direction.
 */
export function Sparkline({
  values,
  color = 'var(--series-1)',
  width = 120,
  height = 34,
  className,
  label,
}: SparklineProps) {
  const gradientId = useId();
  if (values.length === 0) return null;

  const extent = extentOf(values, 0.15);
  const points = values.map((value, index) => ({
    x: projectX(index, values.length, width),
    y: projectY(value, extent, height - 3, 3),
  }));
  const line = smoothPath(points);
  const last = points[points.length - 1]!;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Anneau de surface : détache le point de tête du remplissage. */}
      <circle cx={last.x} cy={last.y} r="3.5" fill={color} stroke="var(--chart-surface)" strokeWidth="2" />
    </svg>
  );
}
