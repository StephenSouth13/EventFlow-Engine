import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SeasonTheme = 'spring' | 'summer' | 'autumn' | 'winter';
export type FestiveTheme = 'christmas' | 'lunar-new-year' | 'vietnam-national' | 'halloween' | 'valentine' | 'new-year' | null;

interface ThemeContextType {
  season: SeasonTheme;
  festive: FestiveTheme;
  autoSeason: boolean;
  setSeason: (season: SeasonTheme) => void;
  setFestive: (festive: FestiveTheme) => void;
  setAutoSeason: (auto: boolean) => void;
  effectsEnabled: boolean;
  setEffectsEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getAutoSeason(): SeasonTheme {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring'; // Mar-May
  if (month >= 5 && month <= 7) return 'summer'; // Jun-Aug
  if (month >= 8 && month <= 10) return 'autumn'; // Sep-Nov
  return 'winter'; // Dec-Feb
}

function getAutoFestive(): FestiveTheme {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  
  // Christmas: Dec 15 - Dec 31
  if (month === 11 && day >= 15) return 'christmas';
  // New Year: Dec 31 - Jan 3
  if ((month === 11 && day === 31) || (month === 0 && day <= 3)) return 'new-year';
  // Lunar New Year: Jan 20 - Feb 15 (approximate)
  if ((month === 0 && day >= 20) || (month === 1 && day <= 15)) return 'lunar-new-year';
  // Valentine: Feb 10-14
  if (month === 1 && day >= 10 && day <= 14) return 'valentine';
  // Vietnam National Day: Sep 1-3
  if (month === 8 && day >= 1 && day <= 3) return 'vietnam-national';
  // Halloween: Oct 25-31
  if (month === 9 && day >= 25) return 'halloween';
  
  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [season, setSeasonState] = useState<SeasonTheme>(() => {
    const saved = localStorage.getItem('theme-season');
    return (saved as SeasonTheme) || getAutoSeason();
  });
  
  const [festive, setFestiveState] = useState<FestiveTheme>(() => {
    const saved = localStorage.getItem('theme-festive');
    if (saved === 'null') return null;
    return (saved as FestiveTheme) || getAutoFestive();
  });
  
  const [autoSeason, setAutoSeasonState] = useState(() => {
    const saved = localStorage.getItem('theme-auto-season');
    return saved !== 'false';
  });
  
  const [effectsEnabled, setEffectsEnabledState] = useState(() => {
    const saved = localStorage.getItem('theme-effects');
    return saved !== 'false';
  });

  useEffect(() => {
    if (autoSeason) {
      setSeasonState(getAutoSeason());
    }
  }, [autoSeason]);

  useEffect(() => {
    document.documentElement.setAttribute('data-season', season);
    document.documentElement.setAttribute('data-festive', festive || '');
    document.documentElement.setAttribute('data-effects', effectsEnabled ? 'true' : 'false');
  }, [season, festive, effectsEnabled]);

  const setSeason = (s: SeasonTheme) => {
    setSeasonState(s);
    localStorage.setItem('theme-season', s);
  };

  const setFestive = (f: FestiveTheme) => {
    setFestiveState(f);
    localStorage.setItem('theme-festive', f || 'null');
  };

  const setAutoSeason = (auto: boolean) => {
    setAutoSeasonState(auto);
    localStorage.setItem('theme-auto-season', String(auto));
  };

  const setEffectsEnabled = (enabled: boolean) => {
    setEffectsEnabledState(enabled);
    localStorage.setItem('theme-effects', String(enabled));
  };

  return (
    <ThemeContext.Provider value={{
      season,
      festive,
      autoSeason,
      setSeason,
      setFestive,
      setAutoSeason,
      effectsEnabled,
      setEffectsEnabled,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
