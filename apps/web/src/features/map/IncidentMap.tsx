import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { GeoPoint } from '@/domain/report/types';
import { cn } from '@/lib/cn';
import type { SchematicPoint } from './SchematicMap';

/**
 * Frontière de chargement différé de la cartographie.
 *
 * MapLibre et sa feuille de styles représentent l'essentiel du poids de
 * l'application. Les isoler derrière un import dynamique évite de les imposer
 * aux écrans qui n'affichent aucune carte — décision cohérente avec un
 * produit destiné à des réseaux contraints.
 */
const MapCanvas = lazy(() =>
  import('./MapCanvas').then((module) => ({ default: module.MapCanvas })),
);

export interface IncidentMapProps {
  points: readonly SchematicPoint[];
  onPick?: (position: GeoPoint) => void;
  selected?: GeoPoint | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function IncidentMap(props: IncidentMapProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'grid place-items-center rounded-[var(--radius-lg)] surface-sunken grid-tech',
            props.className,
          )}
        >
          <span className="flex items-center gap-2 text-[13px] text-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Chargement de la carte…
          </span>
        </div>
      }
    >
      <MapCanvas {...props} />
    </Suspense>
  );
}
