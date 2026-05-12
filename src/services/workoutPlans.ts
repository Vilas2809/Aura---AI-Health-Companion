import { Equipment, Exercise, FitnessLevel, Goal, GymDays, WeeklyWorkoutPlan, WorkoutDay } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ex(name: string, muscleTarget: string, sets: number, reps: string, notes?: string): Exercise {
  return { name, muscleTarget, sets, reps, notes };
}

function gymDay(day: string, muscleGroup: string, exercises: Exercise[], cardioGuidance?: string): WorkoutDay {
  return { day, isRest: false, muscleGroup, exercises, cardioGuidance };
}

function restDay(day: string, cardioGuidance: string): WorkoutDay {
  return { day, isRest: true, cardioGuidance };
}

// ---------------------------------------------------------------------------
// CUT PLANS  (higher reps 10-15, supersets, compound + isolation)
// ---------------------------------------------------------------------------

const cut3Day: WeeklyWorkoutPlan = {
  splitName: 'Full Body 3×/week — Cut',
  cardioGuidance: '20–30 min moderate cardio at 60–70% max heart rate on all rest days.',
  days: [
    gymDay('Monday', 'Full Body A', [
      ex('Barbell Back Squat', 'Quadriceps, Glutes', 4, '12–15', 'Keep chest up, knees tracking toes'),
      ex('Incline Dumbbell Press', 'Upper Chest, Shoulders', 3, '12–15'),
      ex('Bent-Over Barbell Row', 'Upper Back, Lats', 3, '12–15'),
      ex('Dumbbell Romanian Deadlift', 'Hamstrings, Glutes', 3, '12–15'),
      ex('Plank Hold', 'Core', 3, '45 sec'),
    ]),
    restDay('Tuesday', '30 min brisk walk or cycling at 65% max HR'),
    gymDay('Wednesday', 'Full Body B', [
      ex('Leg Press', 'Quadriceps, Glutes', 4, '12–15'),
      ex('Flat Barbell Bench Press', 'Chest, Triceps', 3, '12–15'),
      ex('Lat Pulldown', 'Lats, Biceps', 3, '12–15'),
      ex('Dumbbell Lunges', 'Glutes, Quads', 3, '12 each leg'),
      ex('Cable Crunch', 'Core', 3, '15–20'),
    ]),
    restDay('Thursday', '25 min steady-state jog or elliptical'),
    gymDay('Friday', 'Full Body C — Metabolic Finisher', [
      ex('Goblet Squat', 'Quads, Glutes', 4, '15'),
      ex('Push-Up Variation', 'Chest, Triceps', 3, '15–20'),
      ex('Dumbbell Single-Arm Row', 'Back, Biceps', 3, '12 each'),
      ex('Hip Thrust (Barbell)', 'Glutes, Hamstrings', 3, '15'),
      ex('Mountain Climbers', 'Core, Cardio', 3, '30 sec'),
    ]),
    restDay('Saturday', '30 min moderate cardio + 10 min stretching'),
    restDay('Sunday', 'Active recovery: 20 min walk, foam roll'),
  ],
};

const cut4Day: WeeklyWorkoutPlan = {
  splitName: 'Upper/Lower 4×/week — Cut',
  cardioGuidance: '20–25 min moderate cardio on rest days. Prioritise walking and cycling at 60–70% max HR.',
  days: [
    gymDay('Monday', 'Upper Body A', [
      ex('Flat Barbell Bench Press', 'Chest, Triceps', 4, '12–15'),
      ex('Bent-Over Row', 'Back, Biceps', 4, '12–15'),
      ex('Overhead Dumbbell Press', 'Shoulders', 3, '12–15'),
      ex('Dumbbell Bicep Curl', 'Biceps', 3, '12–15'),
      ex('Tricep Pushdown (Cable)', 'Triceps', 3, '12–15'),
    ]),
    gymDay('Tuesday', 'Lower Body A', [
      ex('Barbell Back Squat', 'Quads, Glutes', 4, '12–15'),
      ex('Romanian Deadlift', 'Hamstrings, Glutes', 3, '12–15'),
      ex('Leg Extension', 'Quadriceps', 3, '15'),
      ex('Lying Leg Curl', 'Hamstrings', 3, '15'),
      ex('Calf Raise (Standing)', 'Calves', 4, '20'),
    ]),
    restDay('Wednesday', '25 min moderate cardio — jog or elliptical'),
    gymDay('Thursday', 'Upper Body B', [
      ex('Incline Dumbbell Press', 'Upper Chest', 4, '12–15'),
      ex('Lat Pulldown', 'Lats, Biceps', 4, '12–15'),
      ex('Lateral Raises', 'Side Delts', 3, '15–20'),
      ex('Face Pulls', 'Rear Delts, Rotator Cuff', 3, '15–20'),
      ex('Hammer Curl', 'Brachialis', 3, '12–15'),
    ]),
    gymDay('Friday', 'Lower Body B — Glute Focus', [
      ex('Hip Thrust (Barbell)', 'Glutes, Hamstrings', 4, '12–15'),
      ex('Bulgarian Split Squat', 'Glutes, Quads', 3, '10–12 each'),
      ex('Leg Press', 'Quads, Glutes', 3, '15'),
      ex('Seated Leg Curl', 'Hamstrings', 3, '15'),
      ex('Standing Calf Raise', 'Calves', 4, '20'),
    ]),
    restDay('Saturday', '30 min walk or light bike ride'),
    restDay('Sunday', 'Full rest + stretching'),
  ],
};

const cut5Day: WeeklyWorkoutPlan = {
  splitName: 'Push/Pull/Legs + Upper/Full — Cut',
  cardioGuidance: '20 min cardio at 65% max HR after each session. Light walking on rest days.',
  days: [
    gymDay('Monday', 'Push — Chest, Shoulders, Triceps', [
      ex('Flat Barbell Bench Press', 'Chest, Triceps', 4, '12–15'),
      ex('Overhead Dumbbell Press', 'Shoulders', 3, '12–15'),
      ex('Incline Cable Fly', 'Upper Chest', 3, '15'),
      ex('Lateral Raises', 'Side Delts', 3, '15–20'),
      ex('Overhead Tricep Extension', 'Triceps Long Head', 3, '12–15'),
    ]),
    gymDay('Tuesday', 'Pull — Back, Biceps', [
      ex('Pull-Up (Weighted or Assisted)', 'Lats, Biceps', 4, '8–12'),
      ex('Bent-Over Barbell Row', 'Mid Back, Lats', 4, '12'),
      ex('Face Pull', 'Rear Delts', 3, '15–20'),
      ex('Dumbbell Bicep Curl', 'Biceps', 3, '12–15'),
      ex('Hammer Curl', 'Brachialis', 3, '12'),
    ]),
    gymDay('Wednesday', 'Legs — Quad Focus', [
      ex('Barbell Back Squat', 'Quads, Glutes', 4, '12–15'),
      ex('Leg Extension', 'Quadriceps', 3, '15'),
      ex('Romanian Deadlift', 'Hamstrings', 3, '12'),
      ex('Walking Lunges', 'Quads, Glutes', 3, '12 each'),
      ex('Calf Raise', 'Calves', 4, '20'),
    ]),
    gymDay('Thursday', 'Upper Body Hypertrophy', [
      ex('Incline Dumbbell Press', 'Upper Chest', 4, '12–15'),
      ex('Lat Pulldown', 'Lats', 4, '12–15'),
      ex('Cable Lateral Raise', 'Side Delts', 3, '15–20'),
      ex('EZ Bar Curl', 'Biceps', 3, '12'),
      ex('Tricep Pushdown', 'Triceps', 3, '15'),
    ]),
    gymDay('Friday', 'Legs + Core — Hamstring Focus', [
      ex('Hip Thrust', 'Glutes', 4, '12–15'),
      ex('Bulgarian Split Squat', 'Quads, Glutes', 3, '10 each'),
      ex('Lying Leg Curl', 'Hamstrings', 4, '12–15'),
      ex('Leg Press (Narrow Stance)', 'Quads', 3, '15'),
      ex('Cable Crunch', 'Abs', 3, '15–20'),
    ]),
    restDay('Saturday', '30 min moderate cardio (bike, swim, or jog)'),
    restDay('Sunday', 'Full rest or 20 min walk'),
  ],
};

const cut6Day: WeeklyWorkoutPlan = {
  splitName: 'PPL × 2 (6-Day) — Cut',
  cardioGuidance: '15–20 min cardio post-session. Sunday is complete rest.',
  days: [
    gymDay('Monday', 'Push — Chest + Triceps', [
      ex('Flat Barbell Bench Press', 'Chest, Triceps', 4, '12–15'),
      ex('Incline Dumbbell Press', 'Upper Chest', 3, '12–15'),
      ex('Overhead Press', 'Shoulders', 3, '12'),
      ex('Tricep Dips', 'Triceps', 3, '12–15'),
      ex('Cable Lateral Raise', 'Side Delts', 3, '15'),
    ]),
    gymDay('Tuesday', 'Pull — Back + Biceps', [
      ex('Deadlift', 'Posterior Chain', 4, '10–12'),
      ex('Lat Pulldown', 'Lats', 4, '12–15'),
      ex('Seated Cable Row', 'Mid Back', 3, '12–15'),
      ex('Incline Dumbbell Curl', 'Biceps', 3, '12'),
      ex('Face Pulls', 'Rear Delts', 3, '15'),
    ]),
    gymDay('Wednesday', 'Legs — Glute + Quad', [
      ex('Barbell Squat', 'Quads, Glutes', 4, '12–15'),
      ex('Hip Thrust', 'Glutes', 4, '12–15'),
      ex('Leg Extension', 'Quads', 3, '15'),
      ex('Leg Curl', 'Hamstrings', 3, '15'),
      ex('Calf Raise', 'Calves', 4, '20'),
    ]),
    gymDay('Thursday', 'Push — Shoulders + Triceps', [
      ex('Overhead Barbell Press', 'Shoulders', 4, '10–12'),
      ex('Cable Fly (Mid)', 'Chest', 3, '15'),
      ex('Lateral Raises (Drop Set)', 'Side Delts', 3, '15→20'),
      ex('Skull Crushers', 'Triceps', 3, '12'),
      ex('Overhead Cable Tricep', 'Triceps', 3, '15'),
    ]),
    gymDay('Friday', 'Pull — Arms + Back', [
      ex('Pull-Up', 'Lats, Biceps', 4, '8–12'),
      ex('Single-Arm Dumbbell Row', 'Lats', 3, '12 each'),
      ex('Preacher Curl', 'Biceps Peak', 3, '12'),
      ex('Hammer Curl', 'Brachialis', 3, '12'),
      ex('Reverse Fly', 'Rear Delts', 3, '15'),
    ]),
    gymDay('Saturday', 'Legs — Hamstring Focus + Core', [
      ex('Romanian Deadlift', 'Hamstrings, Glutes', 4, '12'),
      ex('Bulgarian Split Squat', 'Glutes, Quads', 3, '10 each'),
      ex('Lying Leg Curl', 'Hamstrings', 3, '15'),
      ex('Standing Calf Raise', 'Calves', 4, '20'),
      ex('Plank + Side Plank', 'Core', 3, '45 sec each'),
    ]),
    restDay('Sunday', 'Full rest. Light 20 min walk if feeling good.'),
  ],
};

// ---------------------------------------------------------------------------
// BULK PLANS  (lower reps 5–8, heavy compounds, progressive overload)
// ---------------------------------------------------------------------------

const bulk3Day: WeeklyWorkoutPlan = {
  splitName: 'Powerbuilding 3×/week — Bulk',
  cardioGuidance: 'Rest days: light walking only (15–20 min). Avoid cardio that impairs recovery.',
  days: [
    gymDay('Monday', 'Squat Focus — Legs + Core', [
      ex('Barbell Back Squat', 'Quads, Glutes, Core', 5, '5', 'Work to a heavy 5RM. Progressive overload weekly.'),
      ex('Romanian Deadlift', 'Hamstrings, Glutes', 3, '8'),
      ex('Leg Press', 'Quads', 3, '10–12'),
      ex('Walking Lunges', 'Quads, Glutes', 3, '10 each'),
      ex('Plank', 'Core', 3, '60 sec'),
    ]),
    restDay('Tuesday', 'Light 20 min walk. Stretch and foam roll.'),
    gymDay('Wednesday', 'Bench Focus — Push', [
      ex('Flat Barbell Bench Press', 'Chest, Triceps, Shoulders', 5, '5', 'Add 2.5kg when you hit all 5 sets of 5.'),
      ex('Incline Dumbbell Press', 'Upper Chest', 3, '8–10'),
      ex('Overhead Barbell Press', 'Shoulders', 3, '8'),
      ex('Tricep Skull Crushers', 'Triceps', 3, '8–10'),
      ex('Dips (Weighted)', 'Chest, Triceps', 3, '8'),
    ]),
    restDay('Thursday', 'Light 20 min walk. Stretch hips and shoulders.'),
    gymDay('Friday', 'Deadlift Focus — Pull', [
      ex('Conventional Deadlift', 'Posterior Chain, Back', 5, '5', 'The king of mass-builders. Focus on form.'),
      ex('Barbell Row', 'Upper Back, Lats, Biceps', 4, '8'),
      ex('Weighted Pull-Up', 'Lats, Biceps', 3, '6–8'),
      ex('Dumbbell Bicep Curl', 'Biceps', 3, '10'),
      ex('Face Pull', 'Rear Delts, Rotator Cuff', 3, '15'),
    ]),
    restDay('Saturday', 'Full rest or very light walk.'),
    restDay('Sunday', 'Full rest. Focus on eating and sleeping for recovery.'),
  ],
};

const bulk4Day: WeeklyWorkoutPlan = {
  splitName: 'Upper/Lower Strength 4×/week — Bulk',
  cardioGuidance: 'Walk 20 min on rest days only. No high-intensity cardio.',
  days: [
    gymDay('Monday', 'Upper — Strength', [
      ex('Flat Barbell Bench Press', 'Chest, Triceps', 5, '5'),
      ex('Barbell Row', 'Back, Biceps', 5, '5'),
      ex('Overhead Barbell Press', 'Shoulders', 3, '8'),
      ex('Weighted Pull-Up', 'Lats', 3, '6–8'),
      ex('Tricep Skull Crushers', 'Triceps', 3, '8'),
    ]),
    gymDay('Tuesday', 'Lower — Strength', [
      ex('Barbell Back Squat', 'Quads, Glutes', 5, '5'),
      ex('Romanian Deadlift', 'Hamstrings', 3, '8'),
      ex('Leg Press (Heavy)', 'Quads', 3, '8–10'),
      ex('Leg Curl', 'Hamstrings', 3, '10'),
      ex('Calf Raise (Heavy)', 'Calves', 4, '8–10'),
    ]),
    restDay('Wednesday', '20 min easy walk'),
    gymDay('Thursday', 'Upper — Hypertrophy', [
      ex('Incline Dumbbell Press', 'Upper Chest', 4, '8–12'),
      ex('Seated Cable Row', 'Mid Back', 4, '10–12'),
      ex('Dumbbell Lateral Raise', 'Side Delts', 3, '12–15'),
      ex('Hammer Curl', 'Biceps', 3, '10–12'),
      ex('Tricep Pushdown', 'Triceps', 3, '12'),
    ]),
    gymDay('Friday', 'Lower — Hypertrophy + Deadlift', [
      ex('Conventional Deadlift', 'Posterior Chain', 4, '6–8'),
      ex('Hip Thrust', 'Glutes', 4, '10–12'),
      ex('Bulgarian Split Squat', 'Quads, Glutes', 3, '8–10 each'),
      ex('Lying Leg Curl', 'Hamstrings', 3, '10–12'),
      ex('Standing Calf Raise', 'Calves', 4, '12'),
    ]),
    restDay('Saturday', '20 min walk or full rest'),
    restDay('Sunday', 'Full rest. Prioritise 8+ hours of sleep.'),
  ],
};

const bulk5Day: WeeklyWorkoutPlan = {
  splitName: 'PPL + Legs + Arms — Bulk',
  cardioGuidance: 'No cardio sessions. Walk on weekends only.',
  days: [
    gymDay('Monday', 'Push — Heavy Chest + Shoulders', [
      ex('Flat Barbell Bench Press', 'Chest', 5, '5'),
      ex('Overhead Barbell Press', 'Shoulders', 4, '6–8'),
      ex('Incline Dumbbell Press', 'Upper Chest', 3, '8–10'),
      ex('Weighted Dips', 'Chest, Triceps', 3, '6–8'),
      ex('Overhead Cable Tricep Extension', 'Triceps', 3, '10–12'),
    ]),
    gymDay('Tuesday', 'Pull — Heavy Back + Biceps', [
      ex('Conventional Deadlift', 'Posterior Chain', 4, '5'),
      ex('Barbell Row', 'Back, Lats', 4, '6–8'),
      ex('Weighted Pull-Up', 'Lats, Biceps', 4, '6–8'),
      ex('Seated Cable Row', 'Mid Back', 3, '10'),
      ex('EZ Bar Preacher Curl', 'Biceps', 3, '8–10'),
    ]),
    gymDay('Wednesday', 'Legs — Squat Focus', [
      ex('Barbell Back Squat', 'Quads, Glutes', 5, '5'),
      ex('Leg Press (Heavy)', 'Quads', 4, '8'),
      ex('Romanian Deadlift', 'Hamstrings', 3, '8'),
      ex('Leg Extension', 'Quads', 3, '10–12'),
      ex('Standing Calf Raise', 'Calves', 5, '8–10'),
    ]),
    gymDay('Thursday', 'Shoulders + Traps', [
      ex('Overhead Dumbbell Press', 'Shoulders', 4, '8'),
      ex('Barbell Upright Row', 'Traps, Side Delts', 3, '10'),
      ex('Lateral Raises (Cable)', 'Side Delts', 3, '12–15'),
      ex('Rear Delt Fly', 'Rear Delts', 3, '15'),
      ex('Barbell Shrug', 'Traps', 4, '8–10'),
    ]),
    gymDay('Friday', 'Arms + Core', [
      ex('EZ Bar Bicep Curl', 'Biceps', 4, '8'),
      ex('Hammer Curl', 'Brachialis', 3, '10'),
      ex('Skull Crushers', 'Triceps', 4, '8'),
      ex('Tricep Pushdown (Rope)', 'Triceps', 3, '12'),
      ex('Weighted Crunch', 'Abs', 4, '15'),
    ]),
    restDay('Saturday', 'Full rest or light 20 min walk'),
    restDay('Sunday', 'Full rest. 8–9 hours sleep mandatory.'),
  ],
};

const bulk6Day: WeeklyWorkoutPlan = {
  splitName: 'PPL × 2 Strength/Hypertrophy — Bulk',
  cardioGuidance: 'No cardio. Sunday is mandatory full rest.',
  days: [
    gymDay('Monday', 'Push Strength — Chest + Triceps', [
      ex('Flat Barbell Bench Press', 'Chest, Triceps', 5, '5'),
      ex('Incline Dumbbell Press', 'Upper Chest', 4, '8'),
      ex('Overhead Barbell Press', 'Shoulders', 4, '6–8'),
      ex('Weighted Dips', 'Triceps, Chest', 3, '6–8'),
      ex('Lateral Raises', 'Side Delts', 3, '12'),
    ]),
    gymDay('Tuesday', 'Pull Strength — Back + Biceps', [
      ex('Deadlift', 'Full Posterior Chain', 5, '5'),
      ex('Barbell Row', 'Back, Lats', 4, '6–8'),
      ex('Weighted Pull-Up', 'Lats, Biceps', 4, '6–8'),
      ex('EZ Bar Curl', 'Biceps', 3, '8'),
      ex('Face Pull', 'Rear Delts', 3, '15'),
    ]),
    gymDay('Wednesday', 'Legs Strength — Squat Focus', [
      ex('Barbell Back Squat', 'Quads, Glutes', 5, '5'),
      ex('Romanian Deadlift', 'Hamstrings, Glutes', 4, '8'),
      ex('Leg Press', 'Quads', 3, '8'),
      ex('Leg Curl', 'Hamstrings', 3, '10'),
      ex('Calf Raise', 'Calves', 5, '8'),
    ]),
    gymDay('Thursday', 'Push Hypertrophy — Shoulders + Chest', [
      ex('Overhead Dumbbell Press', 'Shoulders', 4, '10–12'),
      ex('Cable Fly', 'Chest', 4, '12–15'),
      ex('Arnold Press', 'Full Shoulder', 3, '10–12'),
      ex('Lateral Raises (Drop Set)', 'Side Delts', 3, '15→20'),
      ex('Overhead Tricep Extension', 'Triceps', 3, '12'),
    ]),
    gymDay('Friday', 'Pull Hypertrophy — Lats + Arms', [
      ex('Lat Pulldown', 'Lats', 4, '10–12'),
      ex('Seated Cable Row', 'Mid Back', 4, '12'),
      ex('Single-Arm DB Row', 'Lats', 3, '10 each'),
      ex('Incline Dumbbell Curl', 'Biceps', 3, '12'),
      ex('Hammer Curl', 'Brachialis', 3, '12'),
    ]),
    gymDay('Saturday', 'Legs Hypertrophy — Glutes + Hamstrings', [
      ex('Hip Thrust (Barbell)', 'Glutes', 5, '10–12'),
      ex('Bulgarian Split Squat', 'Glutes, Quads', 3, '8–10 each'),
      ex('Lying Leg Curl', 'Hamstrings', 4, '12'),
      ex('Leg Extension', 'Quads', 3, '15'),
      ex('Seated Calf Raise', 'Calves', 4, '15'),
    ]),
    restDay('Sunday', 'Complete rest. Eat at your calorie target and sleep 8+ hours.'),
  ],
};

// ---------------------------------------------------------------------------
// MAINTAIN PLANS  (balanced strength + zone-2 cardio)
// ---------------------------------------------------------------------------

const maintain3Day: WeeklyWorkoutPlan = {
  splitName: 'Full Body Recomposition 3×/week — Maintain',
  cardioGuidance: '2× zone-2 cardio on rest days (20 min easy jog or bike at conversational pace).',
  days: [
    gymDay('Monday', 'Full Body Strength A', [
      ex('Barbell Back Squat', 'Quads, Glutes', 3, '8–10'),
      ex('Flat Barbell Bench Press', 'Chest, Triceps', 3, '8–10'),
      ex('Bent-Over Row', 'Back, Biceps', 3, '8–10'),
      ex('Overhead Press', 'Shoulders', 3, '10'),
      ex('Plank', 'Core', 3, '45 sec'),
    ]),
    restDay('Tuesday', '20 min easy jog or cycling at conversational pace (zone 2)'),
    gymDay('Wednesday', 'Full Body Strength B', [
      ex('Romanian Deadlift', 'Hamstrings, Glutes', 3, '10'),
      ex('Incline Dumbbell Press', 'Upper Chest', 3, '10'),
      ex('Lat Pulldown', 'Lats, Biceps', 3, '10'),
      ex('Dumbbell Lunges', 'Quads, Glutes', 3, '10 each'),
      ex('Russian Twists', 'Obliques', 3, '20'),
    ]),
    restDay('Thursday', '20 min zone-2 cycling or brisk walk'),
    gymDay('Friday', 'Full Body Strength C + Cardio Finisher', [
      ex('Hip Thrust', 'Glutes', 3, '12'),
      ex('Cable Row', 'Back', 3, '12'),
      ex('Dumbbell Press (Flat)', 'Chest', 3, '12'),
      ex('Step-Ups', 'Quads, Glutes', 3, '12 each'),
      ex('15-min Moderate Cardio', 'Cardiovascular', 1, '15 min'),
    ]),
    restDay('Saturday', '30 min leisurely walk or active hobbies'),
    restDay('Sunday', 'Full rest'),
  ],
};

const maintain4Day: WeeklyWorkoutPlan = {
  splitName: 'Upper/Lower + 2 Cardio — Maintain',
  cardioGuidance: '2 dedicated zone-2 cardio days. Keep intensity at 60–65% max HR.',
  days: [
    gymDay('Monday', 'Upper Body Strength', [
      ex('Bench Press', 'Chest, Triceps', 4, '8–10'),
      ex('Bent-Over Row', 'Back, Biceps', 4, '8–10'),
      ex('Overhead Press', 'Shoulders', 3, '10'),
      ex('Lat Pulldown', 'Lats', 3, '10'),
      ex('Bicep Curl + Tricep Pushdown Superset', 'Arms', 3, '12'),
    ]),
    gymDay('Tuesday', 'Lower Body Strength', [
      ex('Barbell Squat', 'Quads, Glutes', 4, '8–10'),
      ex('Hip Thrust', 'Glutes', 3, '12'),
      ex('Romanian Deadlift', 'Hamstrings', 3, '10'),
      ex('Leg Extension + Leg Curl Superset', 'Quads, Hamstrings', 3, '12'),
      ex('Calf Raise', 'Calves', 4, '15'),
    ]),
    restDay('Wednesday', '20 min easy jog (zone 2) + 10 min stretching'),
    gymDay('Thursday', 'Upper Body Hypertrophy', [
      ex('Incline Dumbbell Press', 'Upper Chest', 4, '10–12'),
      ex('Cable Row', 'Mid Back', 4, '12'),
      ex('Lateral Raises', 'Side Delts', 3, '15'),
      ex('Face Pull', 'Rear Delts', 3, '15'),
      ex('Dumbbell Curl', 'Biceps', 3, '12'),
    ]),
    restDay('Friday', '20 min zone-2 cycling or swimming'),
    gymDay('Saturday', 'Lower Body Hypertrophy + Core', [
      ex('Leg Press', 'Quads', 4, '12'),
      ex('Bulgarian Split Squat', 'Glutes, Quads', 3, '10 each'),
      ex('Lying Leg Curl', 'Hamstrings', 3, '12'),
      ex('Standing Calf Raise', 'Calves', 4, '15'),
      ex('Plank Variations', 'Core', 3, '45 sec'),
    ]),
    restDay('Sunday', 'Full rest'),
  ],
};

const maintain5Day: WeeklyWorkoutPlan = {
  splitName: 'PPL + 2 Zone-2 Cardio — Maintain',
  cardioGuidance: 'Zone-2 cardio on Thursday and Saturday. Keep to 20–25 min at 60–65% max HR.',
  days: [
    gymDay('Monday', 'Push', [
      ex('Bench Press', 'Chest', 4, '8–12'),
      ex('Overhead Press', 'Shoulders', 3, '10'),
      ex('Incline Fly', 'Upper Chest', 3, '12'),
      ex('Lateral Raises', 'Delts', 3, '15'),
      ex('Tricep Pushdown', 'Triceps', 3, '12'),
    ]),
    gymDay('Tuesday', 'Pull', [
      ex('Pull-Up', 'Lats, Biceps', 4, '8–10'),
      ex('Seated Cable Row', 'Mid Back', 4, '12'),
      ex('Face Pull', 'Rear Delts', 3, '15'),
      ex('Dumbbell Curl', 'Biceps', 3, '12'),
      ex('Hammer Curl', 'Brachialis', 3, '12'),
    ]),
    gymDay('Wednesday', 'Legs', [
      ex('Barbell Squat', 'Quads, Glutes', 4, '10'),
      ex('Hip Thrust', 'Glutes', 3, '12'),
      ex('Romanian Deadlift', 'Hamstrings', 3, '10'),
      ex('Leg Extension', 'Quads', 3, '12'),
      ex('Calf Raise', 'Calves', 4, '15'),
    ]),
    restDay('Thursday', '20 min easy jog or bike (zone 2)'),
    gymDay('Friday', 'Upper Body Balanced', [
      ex('Dumbbell Bench Press', 'Chest', 4, '10–12'),
      ex('Lat Pulldown', 'Lats', 4, '12'),
      ex('Arnold Press', 'Shoulders', 3, '10'),
      ex('EZ Bar Curl', 'Biceps', 3, '12'),
      ex('Skull Crushers', 'Triceps', 3, '12'),
    ]),
    restDay('Saturday', '25 min zone-2 cycling or brisk walk'),
    restDay('Sunday', 'Full rest'),
  ],
};

const maintain6Day: WeeklyWorkoutPlan = {
  splitName: 'PPL × 2 + Active Rest — Maintain',
  cardioGuidance: 'Sunday: 20 min zone-2 cardio. Replace one session/week with a swim or hike.',
  days: [
    gymDay('Monday', 'Push — Chest + Triceps', [
      ex('Bench Press', 'Chest', 4, '10–12'),
      ex('Incline DB Press', 'Upper Chest', 3, '12'),
      ex('Overhead Press', 'Shoulders', 3, '10'),
      ex('Lateral Raises', 'Delts', 3, '15'),
      ex('Tricep Pushdown', 'Triceps', 3, '12'),
    ]),
    gymDay('Tuesday', 'Pull — Back + Biceps', [
      ex('Lat Pulldown', 'Lats', 4, '12'),
      ex('Seated Row', 'Mid Back', 4, '12'),
      ex('Face Pull', 'Rear Delts', 3, '15'),
      ex('Dumbbell Curl', 'Biceps', 3, '12'),
      ex('Hammer Curl', 'Brachialis', 3, '12'),
    ]),
    gymDay('Wednesday', 'Legs — Quad Focus', [
      ex('Barbell Squat', 'Quads', 4, '10'),
      ex('Leg Press', 'Quads', 3, '12'),
      ex('Romanian Deadlift', 'Hamstrings', 3, '10'),
      ex('Leg Extension', 'Quads', 3, '15'),
      ex('Calf Raise', 'Calves', 4, '15'),
    ]),
    gymDay('Thursday', 'Push — Shoulder Focus', [
      ex('Overhead Dumbbell Press', 'Shoulders', 4, '10'),
      ex('Cable Fly', 'Chest', 3, '15'),
      ex('Lateral Raises', 'Side Delts', 3, '15'),
      ex('Rear Delt Fly', 'Rear Delts', 3, '15'),
      ex('Tricep Extension', 'Triceps', 3, '12'),
    ]),
    gymDay('Friday', 'Pull — Lats + Arms', [
      ex('Pull-Up', 'Lats', 4, '8–10'),
      ex('Single-Arm Row', 'Lats', 3, '12 each'),
      ex('Cable Curl', 'Biceps', 3, '12'),
      ex('Hammer Curl', 'Brachialis', 3, '12'),
      ex('Reverse Curl', 'Forearms', 3, '15'),
    ]),
    gymDay('Saturday', 'Legs — Glute + Hamstring Focus', [
      ex('Hip Thrust', 'Glutes', 4, '12'),
      ex('Bulgarian Split Squat', 'Glutes, Quads', 3, '10 each'),
      ex('Lying Leg Curl', 'Hamstrings', 4, '12'),
      ex('Seated Calf Raise', 'Calves', 4, '15'),
      ex('Plank', 'Core', 3, '60 sec'),
    ]),
    restDay('Sunday', '20 min easy zone-2 jog or a leisure hike'),
  ],
};

// ---------------------------------------------------------------------------
// Master lookup
// ---------------------------------------------------------------------------

type PlanKey = `${Goal}_${GymDays}`;

const PLANS: Partial<Record<PlanKey, WeeklyWorkoutPlan>> = {
  cut_3: cut3Day,
  cut_4: cut4Day,
  cut_5: cut5Day,
  cut_6: cut6Day,
  bulk_3: bulk3Day,
  bulk_4: bulk4Day,
  bulk_5: bulk5Day,
  bulk_6: bulk6Day,
  maintain_3: maintain3Day,
  maintain_4: maintain4Day,
  maintain_5: maintain5Day,
  maintain_6: maintain6Day,
};

export function getWorkoutPlan(
  goal: Goal,
  gymDays: GymDays,
  _fitnessLevel: FitnessLevel,
  _equipment: Equipment
): WeeklyWorkoutPlan {
  const key: PlanKey = `${goal}_${gymDays}`;
  return PLANS[key] ?? cut4Day;
}

export function getStepDistribution(stepTarget: number): {
  morning: number;
  afternoon: number;
  evening: number;
} {
  return {
    morning: Math.round(stepTarget * 0.35),
    afternoon: Math.round(stepTarget * 0.25),
    evening: Math.round(stepTarget * 0.40),
  };
}

export function getStepTip(goal: Goal): string {
  if (goal === 'cut') {
    return 'Walking burns ~0.04 kcal per step. At 12,000 steps, that\'s ~480 kcal — a huge chunk of your deficit. Don\'t skip it.';
  }
  if (goal === 'bulk') {
    return 'Keep steps light. You\'re walking for blood flow and mental clarity, not calorie burn.';
  }
  return 'Consistent daily steps are the most underrated fat-loss and health tool. Make it a non-negotiable habit.';
}
