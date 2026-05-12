import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUserStore } from '../store/userStore';
import {
  ActivityLevel,
  Cuisine,
  DietType,
  Equipment,
  FitnessLevel,
  Gender,
  Goal,
  GymDays,
  UserProfile,
} from '../types';

const { width } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList>;

// ---------------------------------------------------------------------------
// Option picker helpers
// ---------------------------------------------------------------------------

interface OptionBtn<T> {
  label: string;
  value: T;
  emoji?: string;
  desc?: string;
}

function OptionGrid<T>({
  options,
  selected,
  onSelect,
  columns = 2,
}: {
  options: OptionBtn<T>[];
  selected: T;
  onSelect: (v: T) => void;
  columns?: number;
}) {
  return (
    <View style={[styles.grid, { flexWrap: 'wrap' }]}>
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <TouchableOpacity
            key={String(opt.value)}
            style={[
              styles.optionBtn,
              { width: columns === 2 ? '48%' : columns === 3 ? '31%' : '23%' },
              active && styles.optionBtnActive,
            ]}
            onPress={() => onSelect(opt.value)}
          >
            {opt.emoji && <Text style={styles.optionEmoji}>{opt.emoji}</Text>}
            <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
              {opt.label}
            </Text>
            {opt.desc && <Text style={styles.optionDesc}>{opt.desc}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min: number;
  max: number;
}) {
  const [text, setText] = useState(String(value));

  const handleChangeText = (t: string) => {
    setText(t);
    const n = parseFloat(t);
    if (!isNaN(n) && n >= min && n <= max) onChange(n);
  };

  const handleBlur = () => {
    const n = parseFloat(text);
    if (isNaN(n) || n < min) {
      onChange(min);
      setText(String(min));
    } else if (n > max) {
      onChange(max);
      setText(String(max));
    } else {
      setText(String(n));
    }
  };

  const step = (dir: 1 | -1) => {
    const next = Math.min(max, Math.max(min, value + dir));
    onChange(next);
    setText(String(next));
  };

  return (
    <View style={styles.numInputContainer}>
      <Text style={styles.numLabel}>{label}</Text>
      <View style={styles.numRow}>
        <TouchableOpacity style={styles.numBtn} onPress={() => step(-1)}>
          <Text style={styles.numBtnText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.numInput}
          value={text}
          keyboardType="decimal-pad"
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          selectTextOnFocus
        />
        <Text style={styles.numUnit}>{unit}</Text>
        <TouchableOpacity style={styles.numBtn} onPress={() => step(1)}>
          <Text style={styles.numBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Step data
// ---------------------------------------------------------------------------

const STEPS = ['Basic Info', 'Goals', 'Diet', 'Fitness'];

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const { completeOnboarding } = useUserStore();

  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Profile state
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [targetWeight, setTargetWeight] = useState<number | undefined>(undefined);
  const [dietType, setDietType] = useState<DietType>('any');
  const [cuisine, setCuisine] = useState<Cuisine>('balanced');
  const [gymDays, setGymDays] = useState<GymDays>(4);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('intermediate');
  const [equipment, setEquipment] = useState<Equipment>('full_gym');

  const animateTo = (next: number) => {
    const dir = next > currentStep ? 1 : -1;
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -dir * 30, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: dir * 30, duration: 0, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    setCurrentStep(next);
  };

  const next = () => {
    if (currentStep < STEPS.length - 1) animateTo(currentStep + 1);
    else finish();
  };

  const back = () => {
    if (currentStep > 0) animateTo(currentStep - 1);
  };

  const finish = () => {
    const profile: UserProfile = {
      age, height, weight, gender, activityLevel,
      goal, targetWeight, dietType, cuisine,
      gymDays, fitnessLevel, equipment,
      onboardingComplete: true,
    };
    completeOnboarding(profile);
    navigation.replace('GoalDiagnosis');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <Text style={styles.stepSubtitle}>We use this to calculate your personalised targets.</Text>

            <View style={styles.row}>
              <NumberInput label="Age" value={age} onChange={setAge} unit="yrs" min={13} max={90} />
              <NumberInput label="Weight" value={weight} onChange={setWeight} unit="kg" min={30} max={250} />
            </View>
            <NumberInput label="Height" value={height} onChange={setHeight} unit="cm" min={120} max={230} />

            <Text style={styles.fieldLabel}>Gender</Text>
            <OptionGrid
              options={[
                { label: 'Male', value: 'male' as Gender, emoji: '♂️' },
                { label: 'Female', value: 'female' as Gender, emoji: '♀️' },
              ]}
              selected={gender}
              onSelect={setGender}
            />

            <Text style={styles.fieldLabel}>Activity Level</Text>
            <OptionGrid
              options={[
                { label: 'Sedentary', value: 'sedentary' as ActivityLevel, desc: 'Desk job, little exercise' },
                { label: 'Light', value: 'light' as ActivityLevel, desc: '1–3 days/week' },
                { label: 'Moderate', value: 'moderate' as ActivityLevel, desc: '3–5 days/week' },
                { label: 'Active', value: 'active' as ActivityLevel, desc: '6–7 days/week' },
                { label: 'Athlete', value: 'athlete' as ActivityLevel, desc: 'Twice daily training' },
              ]}
              selected={activityLevel}
              onSelect={setActivityLevel}
              columns={2}
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your goal?</Text>
            <Text style={styles.stepSubtitle}>This determines your calorie target, macros, and training style.</Text>

            <OptionGrid
              options={[
                { label: 'Lose Fat', value: 'cut' as Goal, emoji: '🔥', desc: 'Calorie deficit + high protein' },
                { label: 'Maintain', value: 'maintain' as Goal, emoji: '⚖️', desc: 'Body recomposition' },
                { label: 'Build Muscle', value: 'bulk' as Goal, emoji: '💪', desc: 'Calorie surplus + heavy lifts' },
              ]}
              selected={goal}
              onSelect={setGoal}
            />

            <Text style={styles.fieldLabel}>Target Weight (optional)</Text>
            <Text style={styles.fieldHint}>Used to estimate your timeline to goal.</Text>
            <View style={styles.optionalRow}>
              <TouchableOpacity
                style={[styles.optionalChip, targetWeight == null && styles.optionalChipActive]}
                onPress={() => setTargetWeight(undefined)}
              >
                <Text style={styles.optionalChipText}>Skip</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.targetInput}
                placeholder={`${weight - 5} kg`}
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={targetWeight != null ? String(targetWeight) : ''}
                onChangeText={(t) => {
                  const n = parseFloat(t);
                  setTargetWeight(isNaN(n) ? undefined : n);
                }}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your diet preferences</Text>
            <Text style={styles.stepSubtitle}>We'll generate authentic meal plans for your cuisine.</Text>

            <Text style={styles.fieldLabel}>Diet Type</Text>
            <OptionGrid
              options={[
                { label: 'No Restriction', value: 'any' as DietType, emoji: '🍗' },
                { label: 'Vegetarian', value: 'veg' as DietType, emoji: '🥦' },
                { label: 'Vegan', value: 'vegan' as DietType, emoji: '🌱' },
              ]}
              selected={dietType}
              onSelect={setDietType}
            />

            <Text style={styles.fieldLabel}>Cuisine Preference</Text>
            <OptionGrid
              options={[
                { label: 'Balanced', value: 'balanced' as Cuisine, emoji: '🌍' },
                { label: 'Indian', value: 'indian' as Cuisine, emoji: '🫓' },
                { label: 'Mediterranean', value: 'mediterranean' as Cuisine, emoji: '🫒' },
                { label: 'Asian', value: 'asian' as Cuisine, emoji: '🍜' },
                { label: 'Western', value: 'western' as Cuisine, emoji: '🥩' },
                { label: 'Middle Eastern', value: 'middle_eastern' as Cuisine, emoji: '🧆' },
                { label: 'Mexican', value: 'mexican' as Cuisine, emoji: '🌮' },
                { label: 'Japanese', value: 'japanese' as Cuisine, emoji: '🍱' },
              ]}
              selected={cuisine}
              onSelect={setCuisine}
              columns={2}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your fitness setup</Text>
            <Text style={styles.stepSubtitle}>We'll create a workout split that fits your schedule and equipment.</Text>

            <Text style={styles.fieldLabel}>Gym Days Per Week</Text>
            <OptionGrid
              options={[
                { label: '3 days', value: 3 as GymDays, desc: 'Full body splits' },
                { label: '4 days', value: 4 as GymDays, desc: 'Upper/Lower split' },
                { label: '5 days', value: 5 as GymDays, desc: 'PPL + extra' },
                { label: '6 days', value: 6 as GymDays, desc: 'PPL × 2' },
              ]}
              selected={gymDays}
              onSelect={setGymDays}
            />

            <Text style={styles.fieldLabel}>Fitness Level</Text>
            <OptionGrid
              options={[
                { label: 'Beginner', value: 'beginner' as FitnessLevel, desc: '< 1 year training' },
                { label: 'Intermediate', value: 'intermediate' as FitnessLevel, desc: '1–3 years' },
                { label: 'Advanced', value: 'advanced' as FitnessLevel, desc: '3+ years' },
              ]}
              selected={fitnessLevel}
              onSelect={setFitnessLevel}
            />

            <Text style={styles.fieldLabel}>Equipment Access</Text>
            <OptionGrid
              options={[
                { label: 'Full Gym', value: 'full_gym' as Equipment, emoji: '🏋️' },
                { label: 'Home Dumbbells', value: 'home_dumbbells' as Equipment, emoji: '🏠' },
                { label: 'Bodyweight', value: 'bodyweight' as Equipment, emoji: '🤸' },
              ]}
              selected={equipment}
              onSelect={setEquipment}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {STEPS.map((step, i) => (
          <View key={i} style={styles.progressItem}>
            <View style={[styles.progressDot, i <= currentStep && styles.progressDotActive]} />
            <Text style={[styles.progressLabel, i === currentStep && styles.progressLabelActive]}>
              {step}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          {renderStep()}
        </Animated.View>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navButtons}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={back}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, currentStep === 0 && styles.nextBtnFull]}
          onPress={next}
        >
          <Text style={styles.nextBtnText}>
            {currentStep === STEPS.length - 1 ? 'Calculate My Plan 🚀' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressItem: { alignItems: 'center', gap: 3, flex: 1 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.primary, width: 24, borderRadius: 4 },
  progressLabel: { color: Colors.textMuted, fontSize: 10 },
  progressLabelActive: { color: Colors.primary, fontWeight: '600' },
  scroll: { flex: 1 },
  stepContent: { padding: 20, paddingBottom: 40 },
  stepTitle: { color: Colors.text, fontSize: 24, fontWeight: '700', marginBottom: 6 },
  stepSubtitle: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 24 },
  fieldLabel: { color: Colors.text, fontSize: 15, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  fieldHint: { color: Colors.textSecondary, fontSize: 12, marginTop: -6, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12 },
  numInputContainer: { flex: 1, marginBottom: 16 },
  numLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 6 },
  numRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  numBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  numBtnText: { color: Colors.text, fontSize: 20, fontWeight: '300' },
  numInput: {
    flex: 1,
    height: 36,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  numUnit: { color: Colors.textSecondary, fontSize: 13 },
  grid: { flexDirection: 'row', gap: 10 },
  optionBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  optionBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGlow },
  optionEmoji: { fontSize: 22, marginBottom: 4 },
  optionLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  optionLabelActive: { color: Colors.primary },
  optionDesc: { color: Colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 2 },
  optionalRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  optionalChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionalChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGlow },
  optionalChipText: { color: Colors.textSecondary, fontSize: 13 },
  targetInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 8 : 20,
  },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { color: Colors.text, fontSize: 15 },
  nextBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnFull: { flex: 1 },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
