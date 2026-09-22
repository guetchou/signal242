import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as MapLibreMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { GeoPoint } from '@/domain/report/types';
import { cn } from '@/lib/cn';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLE_URL, OSM_RASTER_STYLE } from './mapStyle';
import { SchematicMap, type SchematicPoint } from './SchematicMap';

export interface IncidentMapProps {
  points: readonly SchematicPoint[];
  onPick?: (position: GeoPoint) => void;
  selected?: GeoPoint | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

/** Délai au-delà duquel le fond cartographique est considéré inaccessible. */
const LOAD_TIMEOUT_MS = 6000;

function buildMarkerElement(point: SchematicPoint): HTMLElement {
  const element = document.createElement('span');
  element.style.cssText = `display:block;width:12px;height:12px;border-radius:9999px;background:${point.color};box-shadow:0 0 14px ${point.color};border:2px solid rgba(255,255,255,0.75);cursor:pointer`;
  element.title = point.label;
  return element;
}

/**
 * Carte des incidents.
 *
 * Encapsule MapLibre derrière une interface déclarative et bascule vers la vue
 * schématique si le fond de plan ne se charge pas. L'appelant ignore lequel des
 * deux rendus est actif : il fournit des points, il reçoit des clics.
 */
export function IncidentMap({
  points,
  onPick,
  selected,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className,
}: IncidentMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const pickMarkerRef = useRef<Marker | null>(null);
  const [degraded, setDegraded] = useState(false);

  // Instanciation unique de la carte ; les données sont poussées ensuite.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let timeout: ReturnType<typeof setTimeout>;
    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE_URL ?? OSM_RASTER_STYLE,
        center,
        zoom,
        attributionControl: { compact: true },
      });
      mapRef.current = map;

      timeout = setTimeout(() => {
        if (!map.loaded()) setDegraded(true);
      }, LOAD_TIMEOUT_MS);

      map.on('load', () => clearTimeout(timeout));
      map.on('error', () => setDegraded(true));
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    } catch {
      setDegraded(true);
    }

    return () => {
      clearTimeout(timeout);
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Le centre initial ne doit pas réinstancier la carte : volontairement omis.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Passage en mode dégradé : la carte est détruite explicitement. Conserver
  // un contexte WebGL inutilisable fuirait de la mémoire et laisserait ses
  // contrôles superposés à la vue de repli.
  useEffect(() => {
    if (!degraded) return;
    mapRef.current?.remove();
    mapRef.current = null;
    markersRef.current = [];
    pickMarkerRef.current = null;
  }, [degraded]);

  // Sélection de position au clic.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onPick) return;
    const handler = (event: maplibregl.MapMouseEvent) => {
      onPick({ lat: event.lngLat.lat, lng: event.lngLat.lng, accuracyM: 25 });
    };
    map.on('click', handler);
    map.getCanvas().style.cursor = 'crosshair';
    return () => {
      map.off('click', handler);
    };
  }, [onPick]);

  // Synchronisation des marqueurs d'incidents.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || degraded) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = points.map((point) =>
      new maplibregl.Marker({ element: buildMarkerElement(point) })
        .setLngLat([point.position.lng, point.position.lat])
        .addTo(map),
    );
  }, [points, degraded]);

  // Marqueur de la position choisie.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || degraded) return;
    pickMarkerRef.current?.remove();
    pickMarkerRef.current = null;
    if (!selected) return;
    pickMarkerRef.current = new maplibregl.Marker({ color: '#10d9a3' })
      .setLngLat([selected.lng, selected.lat])
      .addTo(map);
    map.easeTo({ center: [selected.lng, selected.lat], duration: 600 });
  }, [selected, degraded]);

  if (degraded) {
    return (
      <div className={cn('relative', className)}>
        <SchematicMap points={points} onPick={onPick} selected={selected} className="size-full" />
        <p className="absolute left-3 top-3 rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted">
          Fond cartographique indisponible · vue schématique
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden rounded-[var(--radius-lg)] surface-sunken', className)}
      aria-label={`Carte de ${points.length} signalements`}
      role="application"
    />
  );
}
