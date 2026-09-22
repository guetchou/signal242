import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_TERRITORY,
  getTerritory,
  type Territory,
  type TerritoryId,
} from '@/domain/territory/territories';

const STORAGE_KEY = 'signal242.territory';

interface TerritoryContextValue {
  territory: Territory;
  setTerritory: (id: TerritoryId) => void;
}

const TerritoryContext = createContext<TerritoryContextValue | null>(null);

function readInitial(): TerritoryId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'brazzaville' || stored === 'pointe-noire' || stored === 'dolisie') return stored;
  } catch {
    // Stockage indisponible : le territoire par défaut s'applique.
  }
  return DEFAULT_TERRITORY;
}

/**
 * Territoire courant.
 *
 * Pose `data-territory` sur la racine du document, ce qui bascule l'accent et
 * l'ambiance par simple cascade CSS. En déploiement réel, ce choix viendra du
 * domaine servi par l'instance, non d'un sélecteur : celui-ci n'existe que
 * pour la démonstration multi-territoires.
 */
export function TerritoryProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<TerritoryId>(readInitial);

  useEffect(() => {
    document.documentElement.setAttribute('data-territory', id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Préférence non persistée : sans conséquence fonctionnelle.
    }
  }, [id]);

  const setTerritory = useCallback((next: TerritoryId) => setId(next), []);

  return (
    <TerritoryContext.Provider value={{ territory: getTerritory(id), setTerritory }}>
      {children}
    </TerritoryContext.Provider>
  );
}

export function useTerritory(): TerritoryContextValue {
  const context = useContext(TerritoryContext);
  if (!context) throw new Error('useTerritory doit être utilisé dans un TerritoryProvider.');
  return context;
}
