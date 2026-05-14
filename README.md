# Aura — AI Health Companion

A full-featured mobile health and fitness app built with React Native + Expo. Aura combines AI coaching, meal planning, workout tracking, step counting, and recovery scoring into a single dark-themed app.

**Live PWA:** [https://aura-health-app.netlify.app](https://aura-health-app.netlify.app)

---

## Features

### Dashboard
- Greeting with goal mode badge (Fat Loss / Muscle Gain / Maintenance)
- Live step ring — circular progress hero showing steps vs daily target with calorie burn estimate
- Quick stat cards: Calories, Protein, Water, Steps, Recovery score
- AI-generated daily insight card (powered by Groq / Llama 3.3 70B)
- Macro progress bars (Protein, Carbs, Fat)
- Today's meal preview with calorie totals
- Calorie budget progress bar
- Pull-to-refresh

### Onboarding & Goal Diagnosis
- Multi-step onboarding: age, gender, height, weight, activity level, goal (cut / bulk / maintain), cuisine preference, diet type
- Direct weight/number input with keyboard (plus increment/decrement buttons)
- AI-driven goal diagnosis screen that calculates TDEE, macro splits, step targets, and water targets
- All data persisted with Zustand + AsyncStorage

### Meal Plans
- Automatically generated meal plans based on: cuisine preference (Indian, Mediterranean, American, Asian, Mexican), diet type (balanced, high-protein, vegetarian, vegan, keto), goal, and daily calorie target
- Full day view: Breakfast, Lunch, Dinner, Snack
- Each meal shows ingredients, macros (protein/carbs/fat), and calorie count
- Regenerate button to get a fresh plan

### Workout Plans
- Plans tailored to goal: fat loss (HIIT + circuits), muscle gain (strength splits), maintenance (mixed)
- Exercise cards with sets, reps/duration, rest time, and muscle group tags
- Tap the ▶ play button on any exercise to open a YouTube tutorial in-app (via expo-web-browser)
- Weekly schedule view

### Step Counter
- Live pedometer using expo-sensors (device accelerometer)
- Circular progress ring with daily step target
- Estimated calorie burn (~0.04 kcal/step)
- Best day and weekly stats
- Tap ring on Dashboard to open full Steps screen

### Recovery Score (WHOOP-style)
- Composite 0–100 score from three biometric signals:
  - HRV — 40% weight (higher = better, range 20–100ms)
  - Sleep — 35% weight (duration + efficiency, optimal = 8h)
  - Resting Heart Rate — 25% weight (lower = better, range 40–80bpm)
- Score levels: High Recovery (67–100), Moderate (34–66), Low (0–33)
- Per-component score breakdown bars
- AI-generated personalised insight based on actual biometric values
- Daily recommendation: Train Hard / Moderate Effort / Rest & Recover
- Demo data shown in Expo Go; real data reads from HealthKit (iOS) / Health Connect (Android) after native build

### Progress Tracker
- Log body weight entries over time
- Line chart of weight history (react-native-chart-kit)
- BMI calculator and trend indicator
- Weekly grid view

### AI Coach
- Powered by Groq API with `llama-3.3-70b-versatile`
- Generates personalised insights using: profile, metrics, progress history, and wearable data
- Used on Dashboard (daily opening insight) and throughout the app

### Notifications
- Daily reminders: morning check-in, meal reminders, hydration, step goal, evening summary
- Built with expo-notifications
- Configurable in Settings

### Settings
- Edit profile (name, weight, goal)
- Toggle notifications
- Reset onboarding / recalculate metrics

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React Native 0.81.5 + Expo SDK 54 |
| Language | TypeScript 5 |
| Navigation | React Navigation 6 (bottom tabs + native stack) |
| State / Persistence | Zustand 4 + AsyncStorage |
| AI | Groq SDK (`llama-3.3-70b-versatile`) |
| Step Counter | expo-sensors Pedometer |
| In-app Browser | expo-web-browser |
| Notifications | expo-notifications |
| Charts | react-native-chart-kit + react-native-svg |
| Build / Distribution | EAS Build (Expo Application Services) |
| Web / PWA | Expo web export + Netlify |

---

## Project Structure

```
Fitness app/
├── index.js                    # Entry point (registerRootComponent)
├── App.tsx                     # Root component
├── app.json                    # Expo config (permissions, plugins, EAS project ID)
├── eas.json                    # EAS build profiles
├── react-native.config.js      # Autolinking overrides
├── assets/                     # App icon, splash, notification icon
└── src/
    ├── components/
    │   ├── AICoachCard.tsx      # AI insight card with loading state
    │   ├── CircularProgress.tsx # SVG ring progress component
    │   ├── ConflictWarning.tsx  # Conflicting goal warnings
    │   ├── ExerciseCard.tsx     # Exercise with YouTube play button
    │   ├── MacroBar.tsx         # Horizontal macro progress bar
    │   ├── MealCard.tsx         # Meal detail card
    │   └── WeeklyGrid.tsx       # Weekly calendar grid
    ├── constants/
    │   └── colors.ts            # Dark theme colour palette
    ├── hooks/
    │   └── useStepCounter.ts    # expo-sensors pedometer hook
    ├── navigation/
    │   └── AppNavigator.tsx     # Stack + tab navigator
    ├── screens/
    │   ├── DashboardScreen.tsx  # Main home screen
    │   ├── DailySummaryScreen.tsx
    │   ├── GoalDiagnosisScreen.tsx
    │   ├── MealPlanScreen.tsx
    │   ├── OnboardingScreen.tsx
    │   ├── ProgressTrackerScreen.tsx
    │   ├── RecoveryScreen.tsx
    │   ├── SettingsScreen.tsx
    │   ├── StepsScreen.tsx
    │   └── WorkoutScreen.tsx
    ├── services/
    │   ├── aiCoach.ts           # Groq API integration
    │   ├── calculations.ts      # TDEE, BMR, macro calculations
    │   ├── healthService.ts     # HealthKit / Health Connect stub
    │   ├── mealPlans.ts         # Meal plan generator
    │   ├── notifications.ts     # Push notification scheduling
    │   ├── recoveryScore.ts     # WHOOP-style recovery algorithm
    │   └── workoutPlans.ts      # Workout plan generator
    ├── store/
    │   ├── progressStore.ts     # Weight entries (Zustand)
    │   └── userStore.ts         # Profile + metrics (Zustand)
    └── types/
        └── index.ts             # Shared TypeScript types
```

---

## Try It Now (Web / PWA)

No install needed — open the app directly in any browser:

**[https://aura-health-app.netlify.app](https://aura-health-app.netlify.app)**

On mobile (iOS Safari / Android Chrome) you can add it to your home screen for a native-app feel:
- **iOS**: tap the Share button → *Add to Home Screen*
- **Android**: tap the browser menu → *Add to Home Screen* / *Install App*

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Expo account at [expo.dev](https://expo.dev)

### Install dependencies
```bash
cd "Fitness app"
npm install
```

### Add your Groq API key
The AI coach requires a Groq API key. Get one free at [console.groq.com](https://console.groq.com).

Open `src/services/aiCoach.ts` and set your key:
```ts
const GROQ_API_KEY = 'your-key-here';
```

### Run in Expo Go (development preview)
```bash
npx expo start
```
Scan the QR code with the Expo Go app. Note: step counter and notifications work; health data shows demo values in Expo Go.

---

## Web / PWA Deployment

The app is deployed as a Progressive Web App on Netlify.

### Build and deploy
```bash
npx expo export --platform web
npx netlify-cli deploy --dir=dist --prod --no-build
```

> Always use `--no-build` to skip the Netlify server-side build command and deploy the local `dist/` folder directly.

### Web-specific notes
- `react` and `react-dom` must be pinned to **identical exact versions** (no `^`) — a mismatch causes a silent white screen (React error #527)
- Zustand's ESM build uses `import.meta` which is invalid in Metro's non-module output; `metro.config.js` redirects zustand to its CJS build on web
- `Alert.alert` is a no-op in react-native-web — confirmation dialogs use `window.confirm()` on web via a platform check

---

## Building the App

### Android APK (internal testing)
```bash
eas build --platform android --profile preview
```
Produces a downloadable `.apk` file. Share the direct APK link with testers — no Play Store or login required.

### Android AAB (Play Store)
```bash
eas build --platform android --profile production
```

### iOS (requires Apple Developer account — $99/yr)
```bash
eas build --platform ios --profile preview
```

### Both platforms
```bash
eas build --platform all --profile preview
```

### EAS build profiles (`eas.json`)
| Profile | Android output | iOS output | Use case |
|---|---|---|---|
| `development` | dev client | dev client | Local development |
| `preview` | APK | IPA (device) | Internal testing |
| `production` | AAB | IPA (store) | App store release |

---

## Configuration

### `app.json` highlights
- **Bundle ID**: `com.aura.health`
- **SDK**: 54.0.0
- **New Architecture**: disabled (`newArchEnabled: false`)
- **iOS permissions**: NSHealthShareUsageDescription, NSHealthUpdateUsageDescription, HealthKit type identifiers for HRV, resting HR, sleep, heart rate, steps
- **Android permissions**: ACTIVITY_RECOGNITION, RECEIVE_BOOT_COMPLETED, VIBRATE
- **Plugins**: expo-notifications, expo-sensors, expo-web-browser
- **EAS Project ID**: `6f2235a0-d6df-42e6-b702-ec37fd399a28`

---

## Recovery Score Algorithm

The recovery score is a weighted composite of three biometric signals, inspired by WHOOP:

```
Score = (HRV_score × 0.40) + (Sleep_score × 0.35) + (RHR_score × 0.25)
```

| Signal | Weight | Optimal | Poor |
|---|---|---|---|
| HRV (Heart Rate Variability) | 40% | ≥ 100ms | ≤ 20ms |
| Sleep (duration + efficiency) | 35% | 8h / 100% efficiency | < 4h |
| Resting Heart Rate | 25% | ≤ 40bpm | ≥ 80bpm |

| Score | Level | Recommendation |
|---|---|---|
| 67–100 | High Recovery | Train Hard |
| 34–66 | Moderate | Moderate Effort (70–80% intensity) |
| 0–33 | Low Recovery | Rest & Recover |

---

## Health Data Integration

Currently the app shows **demo data** for recovery metrics (this allows the Android build to work without native health SDKs). Real data integration is ready to be re-enabled:

- **iOS**: HealthKit via `react-native-health` — reads HRV, resting HR, sleep, heart rate, steps from Apple Health / Apple Watch
- **Android**: Health Connect via `react-native-health-connect` — same data types from Google Fit / Samsung Health / Garmin / Fitbit

To re-enable, install the packages and restore `src/services/healthService.ts` from the implementation in the git history.

---

## Design

- **Theme**: Dark (`#0F1117` background)
- **Accent**: Purple (`#6C63FF`)
- **Status colours**: Green (success/high recovery), Orange (warning/moderate), Red (error/low)
- All screens use `SafeAreaView` with `ScrollView` + pull-to-refresh

---

## Known Limitations

- Health data (HRV, sleep, resting HR) shows demo values until the app is built with native health packages re-enabled
- iOS build requires an Apple Developer account ($99/yr)
- AI insights require an active Groq API key and internet connection
- Macro tracking on Dashboard uses estimated values (full food logging not yet implemented)

---

## EAS Project

- **Account**: vilassrirama
- **Project**: aura-health
- **Project ID**: `6f2235a0-d6df-42e6-b702-ec37fd399a28`
- **Dashboard**: https://expo.dev/accounts/vilassrirama/projects/aura-health
