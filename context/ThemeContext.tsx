import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  activeColorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('app-theme').then((storedTheme) => {
      if (storedTheme) {
        setThemeState(storedTheme as ThemeType);
      }
      setIsLoaded(true);
    });
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('app-theme', newTheme);
  };

  const activeColorScheme = theme === 'system' ? (systemColorScheme || 'light') : theme;

  if (!isLoaded) return null; // Prevent flicker

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activeColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProviderWrapper');
  }
  return context;
}
