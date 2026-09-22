import { useId, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { extentOf, niceTicks, projectX, projectY, smoothPath } from './geometry';

export interface TimePoint {
  readonly label: string;
  readonly value: number;
}

export interface TimeSeriesProps {
  points: readonly TimePoint[];
  color?: string;
  /** Unité affichée dans l'infobulle et le tableau de repli. */
  unit?: string;
  title: string;
  height?: number;
  className?: string;
}

const PAD_LEFT = 38;
const PAD_BOTTOM = 22;
const PAD_TOP = 10;

/**
 * Courbe d'évolution à série unique, avec réticule et infobulle.
 *
 * Série unique = pas de légende : le titre du panneau nomme la mesure. Le
 * survol est fourni par défaut, une visualisation HTML étant interactive par
 * nature. Un tableau de repli reste accessible pour la lecture non visuelle.
 */
export function TimeSeries({
  points,
  color = 'var(--series-1)',
  unit = '',
  title,
  height = 200,
  className,
}: TimeSeriesProps) {
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const width = 640;
  const plotWidth = width - PAD_LEFT;
  const plotHeight = height - PAD_BOTTOM;

  const { extent, coords, line, ticks } = useMemo(() => {
    const values = points.map((point) => point.value);
    const computed = extentOf(values);
    const mapped = points.map((point, index) => ({
      x: PAD_LEFT + projectX(index, points.length, plotWidth),
      y: projectY(point.value, computed, plotHeight, PAD_TOP),
    }));
    return {
      extent: computed,
      coords: mapped,
      line: smoothPath(mapped),
      ticks: niceTicks(computed, 4),
    };
  }, [points, plotWidth, plotHeight]);

  if (points.length === 0) return null;

  const active = hover === null ? null : points[hover];
  const activeCoord = hover === null ? null : coords[hover];

  const handleMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(((ratio * width - PAD_LEFT) / plotWidth) * (points.length - 1));
    setHover(Math.min(Math.max(index, 0), points.length - 1));
  };

  return (
    <figure className={cn('relative m-0', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none"
        role="img"
        aria-label={`${title}. ${points.length} points, de ${points[0]?.label} à ${points[points.length - 1]?.label}.`}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grille horizontale seule : les repères verticaux alourdissent sans aider. */}
        {ticks.map((tick) => {
          const y = projectY(tick, extent, plotHeight, PAD_TOP);
          return (
            <g key={tick}>
              <line x1={PAD_LEFT} y1={y} x2={width} y2={y} stroke="var(--chart-grid)" strokeWidth="1" />
              <text
                x={PAD_LEFT - 8}
                y={y + 3.5}
                textAnchor="end"
                className="fill-[var(--text-faint)] font-mono text-[10px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <path d={`${line} L${width},${plotHeight} L${PAD_LEFT},${plotHeight} Z`} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {activeCoord && (
          <g>
            <line
              x1={activeCoord.x}
              y1={PAD_TOP}
              x2={activeCoord.x}
              y2={plotHeight}
              stroke="var(--chart-axis)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={activeCoord.x}
              cy={activeCoord.y}
              r="5"
              fill={color}
              stroke="var(--chart-surface)"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Repères temporels : premier, milieu, dernier — jamais tous. */}
        {[0, Math.floor(points.length / 2), points.length - 1].map((index) => (
          <text
            key={index}
            x={coords[index]?.x ?? 0}
            y={height - 5}
            textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
            className="fill-[var(--text-faint)] font-mono text-[10px]"
          >
            {points[index]?.label}
          </text>
        ))}
      </svg>

      {active && activeCoord && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-[var(--radius-sm)] glass px-3 py-2 shadow-depth"
          style={{ left: `${(activeCoord.x / width) * 100}%`, top: `${(activeCoord.y / height) * 100}%` }}
        >
          <p className="text-[10px] uppercase tracking-wider text-faint">{active.label}</p>
          <p className="numeric text-sm font-semibold text-primary">
            {active.value}
            {unit && <span className="ml-1 text-xs font-normal text-muted">{unit}</span>}
          </p>
        </div>
      )}
    </figure>
  );
}
