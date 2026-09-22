import { DISTRICTS } from '@/infrastructure/mock/districts';
import type { GeoPoint } from '@/domain/report/types';
import { cn } from '@/lib/cn';

export interface SchematicPoint {
  readonly id: string;
  readonly position: GeoPoint;
  readonly color: string;
  readonly label: string;
  readonly emphasis?: boolean;
}

export interface SchematicMapProps {
  points: readonly SchematicPoint[];
  onPick?: (position: GeoPoint) => void;
  selected?: GeoPoint | null;
  className?: string;
}

/** Emprise couvrant l'agglomération, calculée une fois sur le référentiel. */
const BOUNDS = {
  minLat: Math.min(...DISTRICTS.map((d) => d.lat)) - 0.04,
  maxLat: Math.max(...DISTRICTS.map((d) => d.lat)) + 0.04,
  minLng: Math.min(...DISTRICTS.map((d) => d.lng)) - 0.04,
  maxLng: Math.max(...DISTRICTS.map((d) => d.lng)) + 0.04,
};

const toPercent = (position: GeoPoint) => ({
  left: ((position.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100,
  top: ((BOUNDS.maxLat - position.lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100,
});

/**
 * Vue schématique de repli.
 *
 * Affichée lorsque le fond cartographique est inaccessible — réseau restreint,
 * tuiles bloquées, poste hors ligne. Elle conserve la lecture spatiale
 * relative : quartiers positionnés et incidents à leur place, sans fond de plan.
 * Un outil d'exploitation ne doit jamais rendre un écran vide.
 */
export function SchematicMap({ points, onPick, selected, className }: SchematicMapProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onPick) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratioX = (event.clientX - rect.left) / rect.width;
    const ratioY = (event.clientY - rect.top) / rect.height;
    onPick({
      lat: BOUNDS.maxLat - ratioY * (BOUNDS.maxLat - BOUNDS.minLat),
      lng: BOUNDS.minLng + ratioX * (BOUNDS.maxLng - BOUNDS.minLng),
      accuracyM: 60,
    });
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] surface-sunken grid-tech',
        onPick && 'cursor-crosshair',
        className,
      )}
      onClick={handleClick}
      role={onPick ? 'button' : 'img'}
      tabIndex={onPick ? 0 : undefined}
      aria-label={
        onPick
          ? 'Vue schématique : cliquez pour positionner le signalement'
          : `Vue schématique de ${points.length} signalements`
      }
    >
      {/* Le fleuve Congo : repère d'orientation immédiat pour Brazzaville. */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path
          d="M-5,78 C18,70 30,86 48,88 C66,90 80,98 105,96"
          fill="none"
          stroke="var(--color-pulse-500)"
          strokeWidth="2.2"
          opacity="0.28"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {DISTRICTS.map((district) => {
        const { left, top } = toPercent(district);
        return (
          <span
            key={district.name}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {district.name}
          </span>
        );
      })}

      {points.map((point) => {
        const { left, top } = toPercent(point.position);
        return (
          <span
            key={point.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}
            title={point.label}
          >
            {point.emphasis && (
              <span
                className="absolute -inset-2 rounded-full"
                style={{ backgroundColor: point.color, opacity: 0.22, animation: 'pulse-ring 2.4s ease-out infinite' }}
              />
            )}
            <span
              className="block size-2.5 rounded-full ring-2"
              style={{ backgroundColor: point.color, boxShadow: `0 0 12px ${point.color}` }}
            />
          </span>
        );
      })}

      {selected && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={toPercent(selected) && { left: `${toPercent(selected).left}%`, top: `${toPercent(selected).top}%` }}
        >
          <svg width="26" height="34" viewBox="0 0 26 34" aria-hidden>
            <path
              d="M13 33C13 33 25 20.5 25 13A12 12 0 1 0 1 13c0 7.5 12 20 12 20Z"
              fill="var(--color-signal-400)"
              stroke="var(--surface-base)"
              strokeWidth="2"
            />
            <circle cx="13" cy="13" r="4.5" fill="var(--color-night-950)" />
          </svg>
        </span>
      )}
    </div>
  );
}
