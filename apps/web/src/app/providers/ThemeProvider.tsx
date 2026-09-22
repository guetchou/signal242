import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'signal242.theme';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Stockage indisponible : le thème de marque s'applique.
  }
  // Sombre par défaut : choix d'identité assumé, adapté à l'usage nocturne des
  // équipes de terrain. L'utilisateur bascule et sa préférence est conservée.
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Préférence non persistée : sans conséquence fonctionnelle.
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((current) => (current === 'dark' ? 'light' : 'dark')), []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme doit être utilisé dans un ThemeProvider.');
  return context;
}
