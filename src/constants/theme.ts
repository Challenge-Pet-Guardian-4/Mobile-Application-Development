/**
 * PetGuardian Design System - Theme Tokens
 * Centraliza a paleta de cores harmoniosa, espaçamentos, raios de borda e medidas modais.
 */

export const colors = {
  // Cores Primárias de Ação e Destaque
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    default: '#2563EB',
  },

  // Sucesso, Conclusão de Tarefas e Saúde Positiva
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    default: '#10B981',
  },

  // Perigo, Alerta e Ações Destrutivas
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    default: '#EF4444',
  },

  // Avisos, Pontos XP e Destaques Amarelos/Laranja
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    default: '#D97706',
  },

  // Tons Neutros e Superfícies (Slate)
  neutral: {
    white: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Overlays translúcidos
  overlay: {
    dark: 'rgba(15, 23, 42, 0.65)',
    light: 'rgba(255, 255, 255, 0.85)',
  },

  // Trilha Duolingo & Aulas Educativas
  gamification: {
    green: '#58CC02',
    gold: '#FF9600',
    blue: '#0066FF',
    purple: '#7C3AED',
  },

  // Paleta de cores para os nós das trilhas de treinamento
  trainingPalette: [
    '#58CC02', // Duolingo Green
    '#1CB0F6', // Vibrant Sky Blue
    '#A855F7', // Amethyst Purple
    '#F59E0B', // Amber Gold
    '#EC4899', // Coral Pink
    '#10B981', // Emerald
  ],
} as const;

export const trainingPalette = colors.trainingPalette;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const layout = {
  modal: {
    width: {
      sm: 360,
      md: 440,
      lg: 520,
    },
    maxHeightRatio: 0.7,
    maxHeightMaxPx: 540,
    cardPadding: 22,
  },
  screenPadding: 20,
  headerHeight: 60,
} as const;

/**
 * Paleta de Modo Claro (Light Mode)
 */
export const lightTheme = {
  isDark: false,
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  primary: colors.primary[600],
  statusBar: 'dark' as const,
  colors,
  spacing,
  borderRadius,
  layout,
};

/**
 * Paleta de Modo Escuro (Dark Mode)
 */
export const darkTheme = {
  isDark: true,
  background: '#090D16',
  card: '#131D31',
  cardSubtle: '#1E293B',
  border: '#334155',
  borderSubtle: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: colors.primary[500],
  statusBar: 'light' as const,
  colors,
  spacing,
  borderRadius,
  layout,
};

export type AppTheme = {
  isDark: boolean;
  background: string;
  card: string;
  cardSubtle: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  statusBar: 'light' | 'dark';
  colors: typeof colors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  layout: typeof layout;
};

export const theme = lightTheme;

export default theme;
