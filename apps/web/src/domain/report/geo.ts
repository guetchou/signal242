/** Calculs géographiques du domaine. Fonctions pures, sans dépendance. */

import type { GeoPoint } from './types';

const EARTH_RADIUS_M = 6_371_000;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/** Distance orthodromique entre deux points, en mètres. */
export function distanceM(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * Rayon de recherche de doublons, en mètres.
 *
 * Fixé à 120 m : au-delà, deux nids-de-poule d'une même avenue deviennent des
 * incidents distincts ; en deçà, une imprécision GPS courante en milieu urbain
 * suffirait à manquer le rapprochement.
 */
export const DUPLICATE_RADIUS_M = 120;

/**
 * Fenêtre de réapparition, en heures.
 *
 * Ne borne pas les dossiers *ouverts* proposés à la confirmation : un
 * nid-de-poule signalé il y a trois semaines et toujours en intervention reste
 * le même problème, et une limite de date le masquerait à tort. Cette fenêtre
 * ne sert qu'au cas inverse — un dossier récemment clos au même endroit, que
 * l'usager signale de nouveau : le problème est probablement réapparu, et
 * l'agent doit le savoir.
 */
export const REAPPEARANCE_WINDOW_H = 168;
