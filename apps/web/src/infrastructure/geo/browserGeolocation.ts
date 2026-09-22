/**
 * Adaptateur de géolocalisation navigateur.
 *
 * Le géocodage inverse est ici approximé par la grille de quartiers de
 * référence : il évite toute dépendance à un service tiers pendant la phase de
 * démonstration et se remplace par un appel Nominatim ou un référentiel
 * cadastral local sans impact sur les appelants.
 */

import type { GeolocationPort, ResolvedPlace } from '@/domain/ports';
import { CITY, DISTRICTS, streetAt } from '@/infrastructure/mock/districts';

/** Position de repli : centre administratif de Brazzaville. */
const FALLBACK = { lat: -4.2691, lng: 15.2823, accuracyM: 1500 };

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export class BrowserGeolocation implements GeolocationPort {
  async current(): Promise<{ lat: number; lng: number; accuracyM?: number }> {
    if (!('geolocation' in navigator)) return FALLBACK;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracyM: Math.round(position.coords.accuracy),
          }),
        () => resolve(FALLBACK),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
      );
    });
  }

  async reverse(lat: number, lng: number): Promise<ResolvedPlace> {
    const nearest = DISTRICTS.reduce((best, district) => {
      const distance = haversineKm(lat, lng, district.lat, district.lng);
      const bestDistance = haversineKm(lat, lng, best.lat, best.lng);
      return distance < bestDistance ? district : best;
    }, DISTRICTS[0]!);

    const streetIndex = Math.abs(Math.round((lat + lng) * 10_000));
    return { label: streetAt(streetIndex), district: nearest.name, city: CITY };
  }
}
