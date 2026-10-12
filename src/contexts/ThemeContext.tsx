import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextData {
  themeMode: ThemeMode;
  isDark: boolean;
  theme: AppTheme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = '@petguardian_theme_mode';

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  // Carrega preferência salva no dispositivo
  useEffect(() => {
    async function carregarTemaSalvo() {
      try {
        const salvo = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (salvo === 'light' || salvo === 'dark' || salvo === 'system') {
          setThemeModeState(salvo);
        }
      } catch (e) {
        console.warn('Erro ao carregar tema do storage:', e);
      }
    }
    carregarTemaSalvo();
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Erro ao salvar tema no storage:', e);
    }
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  const activeTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        theme: activeTheme,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return context;
}

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Hook utilitário centralizado para criar StyleSheets dinâmicos tipados a partir do tema ativo.
 */
export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (theme: AppTheme) => T
): T {
  const { theme } = useTheme();
  return useMemo(() => factory(theme), [theme]);
}
