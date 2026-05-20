import { useColorScheme } from 'react-native';
import { useState, useEffect, useCallback } from 'react';

export type ThemeType = 'light' | 'dark';

export const useThemeMode = () => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(
    systemScheme === 'dark' ? 'dark' : 'light'
  );
  const [isSystemDefault, setIsSystemDefault] = useState(true);

  // Sync with system theme on change, if user hasn't manually overridden it
  useEffect(() => {
    if (isSystemDefault && systemScheme) {
      setTheme(systemScheme);
    }
  }, [systemScheme, isSystemDefault]);

  const toggleTheme = useCallback(() => {
    setIsSystemDefault(false);
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setManualTheme = useCallback((newTheme: ThemeType) => {
    setIsSystemDefault(false);
    setTheme(newTheme);
  }, []);

  const resetToSystem = useCallback(() => {
    setIsSystemDefault(true);
    if (systemScheme) {
      setTheme(systemScheme);
    }
  }, [systemScheme]);

  return {
    theme,
    isSystemDefault,
    toggleTheme,
    setManualTheme,
    resetToSystem,
  };
};
