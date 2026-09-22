import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { GeolocationPort, NoiseMeterPort, ReportRepository } from '@/domain/ports';
import { InMemoryReportRepository } from '@/infrastructure/mock/InMemoryReportRepository';
import { BrowserGeolocation } from '@/infrastructure/geo/browserGeolocation';
import { SimulatedNoiseMeter } from '@/infrastructure/noise/simulatedMeter';
import { WebAudioNoiseMeter } from '@/infrastructure/noise/webAudioMeter';

/**
 * Conteneur d'injection de dépendances.
 *
 * Les vues consomment des *ports*, jamais des implémentations. Basculer la
 * démonstration vers l'API de production revient à substituer un adaptateur
 * ici, sans toucher un composant.
 */
export interface Services {
  readonly reports: ReportRepository;
  readonly geolocation: GeolocationPort;
  /** Fabrique : chaque session de mesure dispose d'un sonomètre neuf. */
  readonly createNoiseMeter: (mode: 'live' | 'simulated') => NoiseMeterPort;
}

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const services = useMemo<Services>(
    () => ({
      reports: new InMemoryReportRepository(new Date()),
      geolocation: new BrowserGeolocation(),
      createNoiseMeter: (mode) =>
        mode === 'live' ? new WebAudioNoiseMeter() : new SimulatedNoiseMeter(),
    }),
    [],
  );

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('useServices doit être utilisé dans un ServicesProvider.');
  return services;
}
