'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type ThemeName = 'productivity' | 'warm';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_COOKIE = 'team-todo-theme';

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: ThemeName;
}) {
  const [theme, setThemeState] = useState(initialTheme);

  function setTheme(nextTheme: ThemeName) {
    setThemeState(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.cookie = `${THEME_COOKIE}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) throw new Error('useTheme must be used inside ThemeProvider.');
  return value;
}
