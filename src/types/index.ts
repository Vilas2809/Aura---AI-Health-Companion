export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
export type Goal = 'cut' | 'maintain' | 'bulk';
export type DietType = 'any' | 'veg' | 'vegan';
export type Cuisine =
  | 'balanced'
  | 'indian'
  | 'mediterranean'
  | 'asian'
  | 'western'
  | 'middle_eastern'
  | 'mexican'
  | 'japanese';
export type GymDays = 3 | 4 | 5 | 6;
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'full_gym' | 'home_dumbbells' | 'bodyweight';
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface UserProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  targetWeight?: number; // kg
  dietType: DietType;
  cuisine: Cuisine;
  gymDays: GymDays;
  fitnessLevel: FitnessLevel;
  equipment: Equipment;
  onboardingComplete: boolean;
}

export interface HealthMetrics {
  bmi: number;
  bmiCategory: BMICategory;
  bmr: number;
  tdee: number;
  dailyCalories: number;
  protein: number; // g
  fat: number; // g
  carbs: number; // g
  water: number; // litres
  stepTarget: number;
}

export interface GoalConflict {
  type: 'cut_underweight' | 'bulk_overweight';
  message: string;
  recommendation: Goal;
}

export interface WeightProjection {
  week: number;
  weight: number;
}

export interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  emoji: string;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DayMealPlan {
  meals: Meal[];
  tip: string;
  totalCalories: number;
  cuisineLabel: string;
}

export interface Exercise {
  name: string;
  muscleTarget: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  isRest: boolean;
  muscleGroup?: string;
  exercises?: Exercise[];
  cardioGuidance?: string;
}

export interface WeeklyWorkoutPlan {
  days: WorkoutDay[];
  cardioGuidance: string;
  splitName: string;
}

export interface ProgressEntry {
  id: string;
  date: string; // ISO date string
  week: number;
  weight: number;
  avgDailySteps: number;
  gymSessions: number;
  note?: string;
}

export interface AIInsight {
  message: string;
  category: 'meal' | 'workout' | 'sleep' | 'steps' | 'general';
  timestamp: number;
}

export interface StepData {
  current: number;
  goal: number;
  morning: number;
  afternoon: number;
  evening: number;
  caloriesBurned: number;
  streak: number;
}

export interface WearableData {
  heartRate?: number;
  hrv?: number;
  sleepEfficiency?: number; // 0-100
  sleepDuration?: number; // hours
  activeMinutes?: number;
  restingHeartRate?: number;
  readinessScore?: number;
  bodyTemperature?: number;
}
