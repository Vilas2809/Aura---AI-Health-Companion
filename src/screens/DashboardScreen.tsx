import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AICoachCard } from '../components/AICoachCard';
import { CircularProgress } from '../components/CircularProgress';
import { MacroBar } from '../components/MacroBar';
import { Colors } from '../constants/colors';
import { RootStackParamList, TabParamList } from '../navigation/AppNavigator';
import { generateInsight } from '../services/aiCoach';
import { fetchWearableData } from '../services/healthService';
import { calculateRecoveryScore } from '../services/recoveryScore';
import { getMealPlan } from '../services/mealPlans';
import { useProgressStore } from '../store/progressStore';
import { useUserStore } from '../store/userStore';
import { useStepCounter } from '../hooks/useStepCounter';
import { WearableData } from '../types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

function QuickStatCard({
  label,
  value,
  unit,
  icon,
  color,
  onPress,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.statCard, { borderColor: color + '40' }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {unit && <Text style={styles.statUnit}>{unit}</Text>}
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, metrics } = useUserStore();
  const { entries } = useProgressStore();
  const { steps } = useStepCounter();
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const [recoveryScore, setRecoveryScore] = useState<number | null>(null);

  const mealPlan = metrics
    ? getMealPlan(profile.cuisine, profile.dietType, profile.goal, metrics.dailyCalories)
    : null;

  const todayCalories = mealPlan
    ? mealPlan.meals.slice(0, 3).reduce((s, m) => s + m.totalCalories, 0)
    : 0;

  const stepProgress = metrics ? steps / metrics.stepTarget : 0;
  const calorieProgress = metrics ? todayCalories / metrics.dailyCalories : 0;

  const latestEntry = entries[entries.length - 1];
  const currentWeight = latestEntry?.weight ?? profile.weight;

  const loadInsight = async () => {
    if (!metrics) return;
    setInsightLoading(true);
    const health = await fetchWearableData();
    if (health) {
      setWearableData(health);
      setRecoveryScore(calculateRecoveryScore(health).score);
    }
    const msg = await generateInsight({
      type: 'daily_opening',
      profile,
      metrics,
      progressEntries: entries,
      wearableData: health ?? undefined,
    });
    setInsight(msg);
    setInsightLoading(false);
  };

  useEffect(() => {
    loadInsight();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsight();
    setRefreshing(false);
  };

  if (!metrics) return null;

  const goalColor: Record<string, string> = {
    cut: Colors.error,
    bulk: Colors.success,
    maintain: Colors.primary,
  };
  const gColor = goalColor[profile.goal] ?? Colors.primary;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()} 👋</Text>
            <Text style={styles.goalBadge}>
              {profile.goal === 'cut' ? '🔥 Fat Loss' : profile.goal === 'bulk' ? '💪 Muscle Gain' : '⚖️ Maintenance'} Mode
            </Text>
          </View>
          <View style={styles.weightBadge}>
            <Text style={styles.weightValue}>{currentWeight}kg</Text>
            <Text style={styles.weightLabel}>current</Text>
          </View>
        </View>

        {/* Step ring hero */}
        <TouchableOpacity
          style={styles.ringContainer}
          onPress={() => navigation.navigate('Steps')}
          activeOpacity={0.85}
        >
          <CircularProgress
            size={200}
            strokeWidth={16}
            progress={stepProgress}
            color={Colors.stepRing}
          >
            <View style={styles.ringCenter}>
              <Text style={styles.ringSteps}>{steps.toLocaleString()}</Text>
              <Text style={styles.ringTarget}>/ {metrics.stepTarget.toLocaleString()}</Text>
              <Text style={styles.ringLabel}>steps today</Text>
              <Text style={styles.ringCalories}>
                ~{Math.round(steps * 0.04)} kcal
              </Text>
            </View>
          </CircularProgress>
          <View style={styles.ringHint}>
            <Text style={styles.ringHintText}>Tap for detail →</Text>
          </View>
        </TouchableOpacity>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <QuickStatCard
            label="Calories"
            value={metrics.dailyCalories}
            unit="kcal"
            icon="🔥"
            color={Colors.calorieRing}
          />
          <QuickStatCard
            label="Protein"
            value={`${metrics.protein}g`}
            icon="🥩"
            color={Colors.protein}
          />
          <QuickStatCard
            label="Water"
            value={`${metrics.water}L`}
            icon="💧"
            color={Colors.info}
          />
          <QuickStatCard
            label="Steps"
            value={metrics.stepTarget.toLocaleString()}
            icon="👟"
            color={Colors.stepRing}
            onPress={() => navigation.navigate('Steps')}
          />
          <QuickStatCard
            label="Recovery"
            value={recoveryScore != null ? recoveryScore : '—'}
            unit={recoveryScore != null ? '/100' : ''}
            icon="❤️"
            color={recoveryScore != null ? (recoveryScore >= 67 ? Colors.success : recoveryScore >= 34 ? Colors.warning : Colors.error) : Colors.textMuted}
            onPress={() => navigation.navigate('Recovery')}
          />
        </View>

        {/* AI Coach */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Insight</Text>
          <AICoachCard
            message={insight}
            loading={insightLoading}
            category="Daily Opening"
          />
        </View>

        {/* Macro progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macro Targets</Text>
          <View style={styles.macroCard}>
            <MacroBar
              label="Protein"
              current={Math.round(metrics.protein * 0.6)}
              target={metrics.protein}
              unit="g"
              color={Colors.protein}
            />
            <MacroBar
              label="Carbs"
              current={Math.round(metrics.carbs * 0.55)}
              target={metrics.carbs}
              unit="g"
              color={Colors.carbs}
            />
            <MacroBar
              label="Fat"
              current={Math.round(metrics.fat * 0.5)}
              target={metrics.fat}
              unit="g"
              color={Colors.fat}
            />
            <Text style={styles.macroNote}>
              Log meals in the Meals tab to track progress
            </Text>
          </View>
        </View>

        {/* Today's meals preview */}
        {mealPlan && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Today's Meals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Meals')}>
                <Text style={styles.seeAll}>See full plan →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mealsPreviewCard}>
              {mealPlan.meals.slice(0, 3).map((meal) => (
                <View key={meal.id} style={styles.mealPreviewRow}>
                  <Text style={styles.mealPreviewEmoji}>{meal.emoji}</Text>
                  <View style={styles.mealPreviewInfo}>
                    <Text style={styles.mealPreviewName}>{meal.name}</Text>
                    <Text style={styles.mealPreviewTime}>{meal.time}</Text>
                  </View>
                  <Text style={styles.mealPreviewCal}>{meal.totalCalories} kcal</Text>
                </View>
              ))}
              <TouchableOpacity onPress={() => navigation.navigate('Meals')}>
                <Text style={styles.mealPreviewMore}>
                  +{mealPlan.meals.length - 3} more meals
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Calorie progress bar */}
        <View style={styles.section}>
          <View style={styles.calorieProgressHeader}>
            <Text style={styles.sectionTitle}>Calorie Budget</Text>
            <Text style={styles.calorieProgressValue}>
              {todayCalories} / {metrics.dailyCalories} kcal
            </Text>
          </View>
          <View style={styles.calorieTrack}>
            <View
              style={[
                styles.calorieFill,
                {
                  width: `${Math.min(calorieProgress * 100, 100)}%`,
                  backgroundColor: calorieProgress > 1 ? Colors.error : gColor,
                },
              ]}
            />
          </View>
          <Text style={styles.calorieRemaining}>
            {Math.max(0, metrics.dailyCalories - todayCalories)} kcal remaining
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  goalBadge: { color: Colors.textSecondary, fontSize: 13, marginTop: 3 },
  weightBadge: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weightValue: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  weightLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  ringContainer: { alignItems: 'center', paddingVertical: 24 },
  ringCenter: { alignItems: 'center' },
  ringSteps: { color: Colors.text, fontSize: 28, fontWeight: '800' },
  ringTarget: { color: Colors.textSecondary, fontSize: 13 },
  ringLabel: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  ringCalories: { color: Colors.primary, fontSize: 12, marginTop: 4 },
  ringHint: { marginTop: 8 },
  ringHintText: { color: Colors.textMuted, fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '700' },
  statUnit: { color: Colors.textSecondary, fontSize: 9 },
  statLabel: { color: Colors.textSecondary, fontSize: 10, marginTop: 2, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', marginBottom: 10 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seeAll: { color: Colors.primary, fontSize: 13 },
  macroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  macroNote: { color: Colors.textMuted, fontSize: 11, marginTop: 6, textAlign: 'center' },
  mealsPreviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mealPreviewRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  mealPreviewEmoji: { fontSize: 22, width: 36 },
  mealPreviewInfo: { flex: 1 },
  mealPreviewName: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  mealPreviewTime: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  mealPreviewCal: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  mealPreviewMore: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 10 },
  calorieProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  calorieProgressValue: { color: Colors.textSecondary, fontSize: 13 },
  calorieTrack: { height: 10, backgroundColor: Colors.border, borderRadius: 5, overflow: 'hidden' },
  calorieFill: { height: '100%', borderRadius: 5 },
  calorieRemaining: { color: Colors.textSecondary, fontSize: 12, marginTop: 6, textAlign: 'right' },
});
