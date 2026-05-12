import {
  ActivityLevel,
  BMICategory,
  Gender,
  Goal,
  GoalConflict,
  HealthMetrics,
  UserProfile,
  WeightProjection,
} from '../types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

export function calculateDailyCalories(tdee: number, goal: Goal): number {
  if (goal === 'cut') return Math.round(tdee * 0.82);
  if (goal === 'bulk') return Math.round(tdee * 1.12);
  return Math.round(tdee);
}

export function calculateMacros(
  dailyCalories: number,
  weight: number,
  goal: Goal
): { protein: number; fat: number; carbs: number } {
  let proteinPerKg: number;
  let fatCalorieRatio: number;

  if (goal === 'cut') {
    proteinPerKg = 2.0;
    fatCalorieRatio = 0.25;
  } else if (goal === 'bulk') {
    proteinPerKg = 2.2;
    fatCalorieRatio = 0.25;
  } else {
    proteinPerKg = 1.6;
    fatCalorieRatio = 0.28;
  }

  const protein = Math.round(weight * proteinPerKg);
  const fat = Math.round((dailyCalories * fatCalorieRatio) / 9);
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbCalories = dailyCalories - proteinCalories - fatCalories;
  const carbs = Math.round(Math.max(carbCalories, 0) / 4);

  return { protein, fat, carbs };
}

export function calculateWater(weight: number): number {
  return Math.round(weight * 0.033 * 10) / 10;
}

export function calculateStepTarget(goal: Goal): number {
  if (goal === 'cut') return 12000;
  if (goal === 'bulk') return 7000;
  return 10000;
}

export function detectGoalConflict(goal: Goal, bmi: number): GoalConflict | null {
  if (goal === 'cut' && bmi < 18.5) {
    return {
      type: 'cut_underweight',
      message:
        'Your BMI is below 18.5, which means you are underweight. Cutting calories could be harmful.',
      recommendation: 'bulk',
    };
  }
  if (goal === 'bulk' && bmi >= 25) {
    return {
      type: 'bulk_overweight',
      message:
        'Your BMI is 25 or above. A traditional bulk may increase body fat further.',
      recommendation: 'maintain',
    };
  }
  return null;
}

export function calculateWeightProjections(
  currentWeight: number,
  targetWeight: number,
  goal: Goal,
  tdee: number,
  dailyCalories: number
): WeightProjection[] {
  const dailyDelta = goal === 'cut'
    ? tdee - dailyCalories
    : goal === 'bulk'
    ? dailyCalories - tdee
    : 0;

  const weeklyKgChange = (dailyDelta * 7) / 7700;
  const direction = goal === 'bulk' ? 1 : -1;

  return [1, 2, 4, 8, 12].map((week) => ({
    week,
    weight: Math.round((currentWeight + direction * weeklyKgChange * week) * 10) / 10,
  }));
}

export function estimateWeeksToGoal(
  currentWeight: number,
  targetWeight: number,
  goal: Goal,
  tdee: number,
  dailyCalories: number
): number {
  const diff = Math.abs(targetWeight - currentWeight);
  const dailyDelta = Math.abs(tdee - dailyCalories);
  if (dailyDelta === 0) return 0;
  return Math.round((diff * 7700) / (dailyDelta * 7));
}

export function getGoalActionSteps(goal: Goal): string[] {
  if (goal === 'cut') {
    return [
      'Eat in a calorie deficit of ~18% below your TDEE every day',
      'Hit your protein target daily to preserve muscle during fat loss',
      'Prioritise compound lifts (squat, deadlift, bench) with 10–15 rep ranges',
      'Drink your full water target and walk to your step goal each day',
      'Log meals daily and weigh yourself weekly at the same time',
    ];
  }
  if (goal === 'bulk') {
    return [
      'Eat in a calorie surplus of ~12% above your TDEE to fuel muscle growth',
      'Hit 2.2g of protein per kg of bodyweight every single day',
      'Focus on progressive overload — add weight or reps to compound lifts each week',
      'Limit cardio to light walks on rest days to maximise recovery',
      'Weigh yourself weekly — aim for 0.1–0.4 kg gain per week for lean bulking',
    ];
  }
  return [
    'Eat at your TDEE and adjust by ±100 kcal based on weekly weight trend',
    'Hit 1.6g of protein per kg of bodyweight to support body recomposition',
    'Combine 3–4 strength sessions with 2 zone-2 cardio sessions per week',
    'Drink your full water target and aim for 10,000 steps daily',
    'Monitor weight and energy levels — small adjustments keep you on track',
  ];
}

export function computeAllMetrics(profile: UserProfile): HealthMetrics {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const dailyCalories = calculateDailyCalories(tdee, profile.goal);
  const { protein, fat, carbs } = calculateMacros(dailyCalories, profile.weight, profile.goal);
  const water = calculateWater(profile.weight);
  const stepTarget = calculateStepTarget(profile.goal);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories,
    protein,
    fat,
    carbs,
    water,
    stepTarget,
  };
}
