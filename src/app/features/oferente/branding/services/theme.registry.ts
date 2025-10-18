/**
 * Theme Registry
 * Central repository of all available themes with their token definitions
 */

import { ThemeDefinition, ThemeId } from '../models/theme.types';

/**
 * Complete theme definitions
 * Each theme includes light and dark mode token overrides
 */
export const THEME_DEFINITIONS: Record<ThemeId, ThemeDefinition> = {
  nature: {
    id: 'nature',
    title: 'Naturaleza',
    subtitle: 'Fresco y natural, inspirado en la vegetación',
    icon: 'eco',
    light: {
      '--color-primary': '#2e7d32',
      '--color-primary-light': '#66bb6a',
      '--color-primary-dark': '#1b5e20',
      '--color-accent': '#66bb6a',
      '--color-success': '#4caf50',
      '--color-info': '#43a047',
      '--color-primary-bg': 'rgba(46, 125, 50, 0.05)',
      '--color-primary-hover': 'rgba(46, 125, 50, 0.1)',
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f1f8e9',
      '--bg-tertiary': '#dcedc8',
      '--bg-elevated': '#ffffff',
      '--text-primary': '#212121',
      '--text-secondary': '#616161',
      '--border-color': 'rgba(46, 125, 50, 0.12)',
    },
    dark: {
      '--color-primary': '#66bb6a',
      '--color-primary-light': '#9ccc65',
      '--color-primary-dark': '#388e3c',
      '--color-accent': '#81c784',
      '--color-success': '#66bb6a',
      '--color-info': '#81c784',
      '--color-primary-bg': 'rgba(102, 187, 106, 0.1)',
      '--color-primary-hover': 'rgba(102, 187, 106, 0.15)',
      '--bg-primary': '#1a1a1a',
      '--bg-secondary': '#1e2a1f',
      '--bg-tertiary': '#2a3a2b',
      '--bg-elevated': '#2d2d2d',
      '--text-primary': '#e8f5e9',
      '--text-secondary': '#a5d6a7',
      '--border-color': '#2e7d32',
    },
  },

  ocean: {
    id: 'ocean',
    title: 'Océano',
    subtitle: 'Sereno y profundo como el mar',
    icon: 'waves',
    light: {
      '--color-primary': '#1565c0',
      '--color-primary-light': '#42a5f5',
      '--color-primary-dark': '#0d47a1',
      '--color-accent': '#29b6f6',
      '--color-success': '#26a69a',
      '--color-info': '#039be5',
      '--color-primary-bg': 'rgba(21, 101, 192, 0.05)',
      '--color-primary-hover': 'rgba(21, 101, 192, 0.1)',
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#e1f5fe',
      '--bg-tertiary': '#b3e5fc',
      '--bg-elevated': '#ffffff',
      '--text-primary': '#212121',
      '--text-secondary': '#616161',
      '--border-color': 'rgba(21, 101, 192, 0.12)',
    },
    dark: {
      '--color-primary': '#42a5f5',
      '--color-primary-light': '#81d4fa',
      '--color-primary-dark': '#1976d2',
      '--color-accent': '#4fc3f7',
      '--color-success': '#4dd0e1',
      '--color-info': '#29b6f6',
      '--color-primary-bg': 'rgba(66, 165, 245, 0.1)',
      '--color-primary-hover': 'rgba(66, 165, 245, 0.15)',
      '--bg-primary': '#0a1929',
      '--bg-secondary': '#0d1f2d',
      '--bg-tertiary': '#1a2b3c',
      '--bg-elevated': '#1e2d3d',
      '--text-primary': '#e3f2fd',
      '--text-secondary': '#90caf9',
      '--border-color': '#1565c0',
    },
  },

  fire: {
    id: 'fire',
    title: 'Fuego',
    subtitle: 'Cálido y energético, lleno de pasión',
    icon: 'local_fire_department',
    light: {
      '--color-primary': '#c62828',
      '--color-primary-light': '#ef5350',
      '--color-primary-dark': '#b71c1c',
      '--color-accent': '#ff7043',
      '--color-success': '#ef6c00',
      '--color-info': '#ff8a65',
      '--color-primary-bg': 'rgba(198, 40, 40, 0.05)',
      '--color-primary-hover': 'rgba(198, 40, 40, 0.1)',
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#ffebee',
      '--bg-tertiary': '#ffcdd2',
      '--bg-elevated': '#ffffff',
      '--text-primary': '#212121',
      '--text-secondary': '#616161',
      '--border-color': 'rgba(198, 40, 40, 0.12)',
    },
    dark: {
      '--color-primary': '#ef5350',
      '--color-primary-light': '#e57373',
      '--color-primary-dark': '#d32f2f',
      '--color-accent': '#ff8a80',
      '--color-success': '#ff6f00',
      '--color-info': '#ff7043',
      '--color-primary-bg': 'rgba(239, 83, 80, 0.1)',
      '--color-primary-hover': 'rgba(239, 83, 80, 0.15)',
      '--bg-primary': '#1a1414',
      '--bg-secondary': '#2d1a1a',
      '--bg-tertiary': '#3a2020',
      '--bg-elevated': '#2d2020',
      '--text-primary': '#ffebee',
      '--text-secondary': '#ef9a9a',
      '--border-color': '#c62828',
    },
  },

  carbon: {
    id: 'carbon',
    title: 'Carbón',
    subtitle: 'Elegante y minimalista en escala de grises',
    icon: 'blur_on',
    light: {
      '--color-primary': '#263238',
      '--color-primary-light': '#546e7a',
      '--color-primary-dark': '#37474f',
      '--color-accent': '#90a4ae',
      '--color-success': '#455a64',
      '--color-info': '#78909c',
      '--color-primary-bg': 'rgba(38, 50, 56, 0.05)',
      '--color-primary-hover': 'rgba(38, 50, 56, 0.1)',
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#eceff1',
      '--bg-tertiary': '#cfd8dc',
      '--bg-elevated': '#ffffff',
      '--text-primary': '#212121',
      '--text-secondary': '#616161',
      '--border-color': 'rgba(38, 50, 56, 0.12)',
    },
    dark: {
      '--color-primary': '#78909c',
      '--color-primary-light': '#90a4ae',
      '--color-primary-dark': '#546e7a',
      '--color-accent': '#b0bec5',
      '--color-success': '#90a4ae',
      '--color-info': '#b0bec5',
      '--color-primary-bg': 'rgba(120, 144, 156, 0.1)',
      '--color-primary-hover': 'rgba(120, 144, 156, 0.15)',
      '--bg-primary': '#121212',
      '--bg-secondary': '#1e1e1e',
      '--bg-tertiary': '#2a2a2a',
      '--bg-elevated': '#2d2d2d',
      '--text-primary': '#eceff1',
      '--text-secondary': '#b0bec5',
      '--border-color': '#546e7a',
    },
  },

  snow: {
    id: 'snow',
    title: 'Nieve',
    subtitle: 'Limpio y luminoso como un día nevado',
    icon: 'ac_unit',
    light: {
      '--color-primary': '#546e7a',
      '--color-primary-light': '#78909c',
      '--color-primary-dark': '#37474f',
      '--color-accent': '#cfd8dc',
      '--color-success': '#90a4ae',
      '--color-info': '#b0bec5',
      '--color-primary-bg': 'rgba(84, 110, 122, 0.05)',
      '--color-primary-hover': 'rgba(84, 110, 122, 0.1)',
      '--bg-primary': '#fafafa',
      '--bg-secondary': '#ffffff',
      '--bg-tertiary': '#eceff1',
      '--bg-elevated': '#ffffff',
      '--text-primary': '#212121',
      '--text-secondary': '#616161',
      '--border-color': 'rgba(84, 110, 122, 0.12)',
    },
    dark: {
      '--color-primary': '#b0bec5',
      '--color-primary-light': '#cfd8dc',
      '--color-primary-dark': '#90a4ae',
      '--color-accent': '#eceff1',
      '--color-success': '#b0bec5',
      '--color-info': '#cfd8dc',
      '--color-primary-bg': 'rgba(176, 190, 197, 0.1)',
      '--color-primary-hover': 'rgba(176, 190, 197, 0.15)',
      '--bg-primary': '#1a1a1a',
      '--bg-secondary': '#232323',
      '--bg-tertiary': '#2d2d2d',
      '--bg-elevated': '#303030',
      '--text-primary': '#fafafa',
      '--text-secondary': '#cfd8dc',
      '--border-color': '#78909c',
    },
  },

  violet: {
    id: 'violet',
    title: 'Violeta',
    subtitle: 'Tema por defecto, creativo y vibrante',
    icon: 'auto_awesome',
    light: {
      '--color-primary': '#673ab7',
      '--color-primary-light': '#9575cd',
      '--color-primary-dark': '#512da8',
      '--color-accent': '#ff4081',
      '--color-success': '#4caf50',
      '--color-info': '#2196f3',
      '--color-primary-bg': 'rgba(103, 58, 183, 0.05)',
      '--color-primary-hover': 'rgba(103, 58, 183, 0.1)',
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f5f5f5',
      '--bg-tertiary': '#e0e0e0',
      '--bg-elevated': '#ffffff',
      '--text-primary': '#212121',
      '--text-secondary': '#666666',
      '--border-color': 'rgba(103, 58, 183, 0.12)',
    },
    dark: {
      '--color-primary': '#bb86fc',
      '--color-primary-light': '#d1b3ff',
      '--color-primary-dark': '#9965f4',
      '--color-accent': '#ff4081',
      '--color-success': '#66bb6a',
      '--color-info': '#42a5f5',
      '--color-primary-bg': 'rgba(187, 134, 252, 0.1)',
      '--color-primary-hover': 'rgba(187, 134, 252, 0.15)',
      '--bg-primary': '#121212',
      '--bg-secondary': '#1e1e1e',
      '--bg-tertiary': '#2a2a2a',
      '--bg-elevated': '#2d2d2d',
      '--text-primary': '#ffffff',
      '--text-secondary': '#b3b3b3',
      '--border-color': '#673ab7',
    },
  },
};

/**
 * Get all available theme IDs
 */
export function getAllThemeIds(): ThemeId[] {
  return Object.keys(THEME_DEFINITIONS) as ThemeId[];
}

/**
 * Get theme definition by ID
 */
export function getThemeById(id: ThemeId): ThemeDefinition {
  return THEME_DEFINITIONS[id];
}

/**
 * Get preview palette for a theme
 */
export function getThemePalette(id: ThemeId, mode: 'light' | 'dark' = 'light') {
  const theme = THEME_DEFINITIONS[id];
  const tokens = mode === 'light' ? theme.light : theme.dark;

  return {
    primary: tokens['--color-primary'],
    accent: tokens['--color-accent'],
    background: tokens['--bg-secondary'],
    text: tokens['--text-primary'],
  };
}
