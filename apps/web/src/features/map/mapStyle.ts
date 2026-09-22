import type { StyleSpecification } from 'maplibre-gl';

/**
 * Style cartographique.
 *
 * Fond raster OpenStreetMap par défaut : aucune clé d'API, aucune dépendance
 * commerciale, couverture correcte de l'Afrique centrale. En production, la
 * variable `VITE_MAP_STYLE_URL` permet de pointer vers un fond vectoriel
 * hébergé par le client, exigence fréquente des marchés publics.
 */
export const MAP_STYLE_URL: string | undefined = import.meta.env['VITE_MAP_STYLE_URL'];

export const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© Contributeurs OpenStreetMap',
    },
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#0b0f1a' } },
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      paint: {
        // Assombrit et désature le fond : les marqueurs colorés doivent dominer.
        'raster-brightness-max': 0.72,
        'raster-saturation': -0.45,
        'raster-contrast': 0.08,
        'raster-opacity': 0.9,
      },
    },
  ],
};

/** Centre par défaut : Brazzaville. */
export const DEFAULT_CENTER: [number, number] = [15.2823, -4.2691];
export const DEFAULT_ZOOM = 12;
