import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

// Define color schemes
const lightTheme = {
  background: '#ffffff',
  surface: '#f5f5f5',
  surfaceDark: '#eeeeee',
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  accent: '#1DB954',
  accentDark: '#1aa34a',
  border: '#e0e0e0',
  card: '#ffffff',
  input: '#f0f0f0',
  error: '#e74c3c',
  success: '#27ae60',
};

const darkTheme = {
  background: '#121212',
  surface: '#1e1e1e',
  surfaceDark: '#2a2a2a',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  textTertiary: '#888888',
  accent: '#1DB954',
  accentDark: '#1aa34a',
  border: '#333333',
  card: '#1e1e1e',
  input: '#2a2a2a',
  error: '#e74c3c',
  success: '#1DB954',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark
  const [isHydrated, setIsHydrated] = useState(false);

  // Load theme preference from storage on app start
  useEffect(() => {
    let isMounted = true;
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@musica_theme');
        if (savedTheme && isMounted) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.warn('Failed to load theme preference', error);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadThemePreference();
    
    // Safety timeout - ensure hydration completes within 2 seconds
    const timeout = setTimeout(() => {
      if (isMounted && !isHydrated) {
        console.warn('Theme hydration timeout, forcing hydration');
        setIsHydrated(true);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  // Save theme preference to storage when it changes
  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('@musica_theme', JSON.stringify(newTheme));
    } catch (error) {
      console.warn('Failed to save theme preference', error);
    }
  };

  // Select theme based on current mode
  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    isDarkMode,
    toggleTheme,
    theme,
    isHydrated,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
