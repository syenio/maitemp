/**
 * MaidEase Color System
 * Centralized color configuration for consistent theming across the application
 */

export const colors = {
  // Primary Colors
  primary: {
    50: '#f8f9fa',
    100: '#f1f3f4',
    200: '#e8eaed',
    300: '#dadce0',
    400: '#bdc1c6',
    500: '#9aa0a6',
    600: '#80868b',
    700: '#5f6368',
    800: '#3c4043',
    900: '#202124',
    950: '#000000', // Pure black
  },

  // Semantic Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#f1f3f4',
  },

  text: {
    primary: '#000000',     // Pure black for primary text
    secondary: '#5f6368',   // Gray for secondary text
    tertiary: '#9aa0a6',    // Light gray for tertiary text
    inverse: '#ffffff',     // White text for dark backgrounds
  },

  border: {
    light: '#e8eaed',
    medium: '#dadce0',
    dark: '#bdc1c6',
  },

  // Status Colors
  success: {
    50: '#e8f5e8',
    100: '#c8e6c8',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },

  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    500: '#ff9800',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },

  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },

  info: {
    50: '#e3f2fd',
    100: '#bbdefb',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
} as const;

// Utility functions for easy color access
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let result: any = colors;
  
  for (const key of keys) {
    result = result[key];
    if (result === undefined) {
      console.warn(`Color path "${path}" not found`);
      return '#000000';
    }
  }
  
  return result;
};

// CSS-in-JS helper for inline styles
export const colorStyles = {
  // Text colors
  textPrimary: { color: colors.text.primary },
  textSecondary: { color: colors.text.secondary },
  textTertiary: { color: colors.text.tertiary },
  textInverse: { color: colors.text.inverse },

  // Background colors
  bgPrimary: { backgroundColor: colors.background.primary },
  bgSecondary: { backgroundColor: colors.background.secondary },
  bgTertiary: { backgroundColor: colors.background.tertiary },
  bgBlack: { backgroundColor: colors.primary[950] },

  // Border colors
  borderLight: { borderColor: colors.border.light },
  borderMedium: { borderColor: colors.border.medium },
  borderDark: { borderColor: colors.border.dark },

  // Input and textarea styles
  input: {
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    borderColor: colors.border.medium,
  },
  inputFocus: {
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    borderColor: colors.primary[950],
    outline: 'none',
    boxShadow: `0 0 0 2px ${colors.primary[950]}20`,
  },
  placeholder: {
    color: colors.text.tertiary,
  },

  // Button styles
  buttonPrimary: {
    backgroundColor: colors.primary[950],
    color: colors.text.inverse,
    borderColor: colors.primary[950],
  },
  buttonSecondary: {
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    borderColor: colors.border.medium,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    color: colors.text.primary,
    borderColor: 'transparent',
  },
} as const;

// Utility function for consistent input styling
export const getInputStyles = () => ({
  backgroundColor: colors.background.primary,
  color: colors.text.primary,
  borderColor: colors.border.medium,
});

// Utility function for consistent input class names
export const getInputClasses = () => 
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';

// Common color combinations
export const colorCombinations = {
  // Button variants
  button: {
    primary: {
      bg: colors.primary[950], // Pure black
      text: colors.text.inverse,
      hover: colors.primary[800],
      border: colors.primary[950],
    },
    secondary: {
      bg: colors.background.primary,
      text: colors.text.primary,
      hover: colors.background.secondary,
      border: colors.border.medium,
    },
    ghost: {
      bg: 'transparent',
      text: colors.text.primary,
      hover: colors.background.secondary,
      border: 'transparent',
    },
  },

  // Card variants
  card: {
    default: {
      bg: colors.background.primary,
      border: colors.border.light,
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    elevated: {
      bg: colors.background.primary,
      border: colors.border.light,
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
  },

  // Navigation
  nav: {
    bg: colors.background.primary,
    border: colors.border.light,
    text: colors.text.primary,
    textHover: colors.text.primary,
    bgHover: colors.background.secondary,
  },

  // Footer
  footer: {
    bg: colors.primary[950], // Pure black
    text: colors.text.inverse,
    textSecondary: colors.primary[400],
    border: colors.primary[800],
  },
} as const;

export default colors;