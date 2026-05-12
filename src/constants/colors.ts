export const Colors = {
  background: '#0F1117',
  surface: '#1A1D27',
  surfaceAlt: '#21253A',
  border: '#2A2D3E',

  primary: '#6C63FF',
  primaryLight: '#8A84FF',
  primaryDark: '#4F47CC',
  primaryGlow: 'rgba(108, 99, 255, 0.15)',

  success: '#4ADE80',
  successDim: 'rgba(74, 222, 128, 0.15)',
  warning: '#FBBF24',
  warningDim: 'rgba(251, 191, 36, 0.15)',
  error: '#F87171',
  errorDim: 'rgba(248, 113, 113, 0.15)',
  info: '#60A5FA',

  protein: '#6C63FF',
  carbs: '#34D399',
  fat: '#FB923C',

  stepRing: '#6C63FF',
  calorieRing: '#F472B6',
  activeRing: '#34D399',

  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#4B5563',
  textOnPrimary: '#FFFFFF',

  // Cuisine badge colours
  cuisineIndian: '#FF6B35',
  cuisineMediterranean: '#3B82F6',
  cuisineAsian: '#EF4444',
  cuisineWestern: '#10B981',
  cuisineMiddleEastern: '#F59E0B',
  cuisineMexican: '#8B5CF6',
  cuisineJapanese: '#EC4899',
  cuisineBalanced: '#6C63FF',

  gymGreen: '#4ADE80',
  gymYellow: '#A3E635',
  gymRed: '#F87171',
} as const;

export const Gradients = {
  primary: ['#6C63FF', '#4F47CC'] as [string, string],
  success: ['#4ADE80', '#22C55E'] as [string, string],
  card: ['#1A1D27', '#21253A'] as [string, string],
  dark: ['#0F1117', '#1A1D27'] as [string, string],
  purple: ['#6C63FF', '#8B5CF6'] as [string, string],
  orange: ['#FB923C', '#F97316'] as [string, string],
} as const;
