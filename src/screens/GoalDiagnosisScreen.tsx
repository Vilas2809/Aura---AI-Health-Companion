import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ConflictWarning } from '../components/ConflictWarning';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  detectGoalConflict,
  estimateWeeksToGoal,
  getGoalActionSteps,
  calculateWeightProjections,
} from '../services/calculations';
import { useUserStore } from '../store/userStore';
import { Goal } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function MetricCard({
  label,
  value,
  unit,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  color?: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={[styles.metricValue, color ? { color } : {}]}>{value}</Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
      {sub && <Text style={styles.metricSub}>{sub}</Text>}
    </View>
  );
}

function MacroDonut({
  protein,
  carbs,
  fat,
  calories,
}: {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}) {
  const pCal = protein * 4;
  const cCal = carbs * 4;
  const fCal = fat * 9;

  const segments = [
    { label: 'Protein', grams: protein, kcal: pCal, color: Colors.protein },
    { label: 'Carbs', grams: carbs, kcal: cCal, color: Colors.carbs },
    { label: 'Fat', grams: fat, kcal: fCal, color: Colors.fat },
  ];

  return (
    <View style={styles.macroContainer}>
      {segments.map((s) => (
        <View key={s.label} style={styles.macroItem}>
          <View style={[styles.macroDot, { backgroundColor: s.color }]} />
          <Text style={styles.macroLabel}>{s.label}</Text>
          <Text style={styles.macroGrams}>{s.grams}g</Text>
          <Text style={styles.macroKcal}>{s.kcal} kcal</Text>
          <Text style={styles.macroPercent}>{Math.round((s.kcal / calories) * 100)}%</Text>
        </View>
      ))}
    </View>
  );
}

function BMIBadge({ category }: { category: string }) {
  const configs = {
    underweight: { color: Colors.info, bg: Colors.info + '20', label: 'Underweight', emoji: '⚠️' },
    normal: { color: Colors.success, bg: Colors.success + '20', label: 'Normal', emoji: '✅' },
    overweight: { color: Colors.warning, bg: Colors.warning + '20', label: 'Overweight', emoji: '⚠️' },
    obese: { color: Colors.error, bg: Colors.error + '20', label: 'Obese', emoji: '🔴' },
  };
  const c = configs[category as keyof typeof configs] ?? configs.normal;
  return (
    <View style={[styles.bmiBadge, { backgroundColor: c.bg }]}>
      <Text style={styles.bmiBadgeEmoji}>{c.emoji}</Text>
      <Text style={[styles.bmiBadgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

export function GoalDiagnosisScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, metrics, setProfile } = useUserStore();
  const [conflictDismissed, setConflictDismissed] = useState(false);

  if (!metrics) return null;

  const conflict = detectGoalConflict(profile.goal, metrics.bmi);
  const showConflict = conflict && !conflictDismissed;

  const weeks = profile.targetWeight
    ? estimateWeeksToGoal(profile.weight, profile.targetWeight, profile.goal, metrics.tdee, metrics.dailyCalories)
    : null;

  const projections = profile.targetWeight
    ? calculateWeightProjections(profile.weight, profile.targetWeight, profile.goal, metrics.tdee, metrics.dailyCalories)
    : null;

  const actionSteps = getGoalActionSteps(profile.goal);

  const goalColors: Record<Goal, string> = {
    cut: Colors.error,
    bulk: Colors.success,
    maintain: Colors.primary,
  };

  const goalLabels: Record<Goal, string> = { cut: 'Fat Loss', bulk: 'Muscle Gain', maintain: 'Maintenance' };

  const handleSwitchGoal = (newGoal: Goal) => {
    setProfile({ goal: newGoal });
    setConflictDismissed(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <LinearGradient
          colors={['#1A1D27', '#0F1117']}
          style={styles.heroSection}
        >
          <View style={styles.heroLabel}>
            <Text style={styles.heroLabelText}>
              {goalLabels[profile.goal]} Plan
            </Text>
          </View>
          <Text style={styles.heroTitle}>Your Personalised</Text>
          <Text style={[styles.heroTitle, { color: goalColors[profile.goal] }]}>Health Plan</Text>
          <Text style={styles.heroSubtitle}>
            Based on your profile — age {profile.age}, {profile.weight}kg,{' '}
            {profile.height}cm
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Conflict warning */}
          {showConflict && (
            <ConflictWarning
              conflict={conflict!}
              onSwitch={handleSwitchGoal}
              onIgnore={() => setConflictDismissed(true)}
            />
          )}

          {/* BMI Row */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Body Metrics</Text>
          </View>
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, styles.bmiCard]}>
              <Text style={styles.metricLabel}>BMI</Text>
              <Text style={[styles.metricValue, { fontSize: 36, color: Colors.text }]}>{metrics.bmi}</Text>
              <BMIBadge category={metrics.bmiCategory} />
            </View>
            <View style={styles.metricCol}>
              <MetricCard label="BMR" value={metrics.bmr} unit="kcal" sub="Resting burn" />
              <MetricCard label="TDEE" value={metrics.tdee} unit="kcal" sub="Total burn" />
            </View>
          </View>

          {/* Calorie target */}
          <View style={styles.calorieCard}>
            <View style={styles.calorieLeft}>
              <Text style={styles.calorieLabel}>Daily Calorie Target</Text>
              <Text style={styles.calorieValue}>{metrics.dailyCalories}</Text>
              <Text style={styles.calorieUnit}>kcal/day</Text>
            </View>
            <View style={styles.calorieDivider} />
            <View style={styles.calorieRight}>
              <Text style={styles.metricLabel}>Water</Text>
              <Text style={styles.metricValue}>{metrics.water}L</Text>
              <Text style={[styles.metricLabel, { marginTop: 10 }]} numberOfLines={1}>Steps/day</Text>
              <Text style={styles.metricValue}>{metrics.stepTarget.toLocaleString()}</Text>
            </View>
          </View>

          {/* Macros */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Macros</Text>
          </View>
          <View style={styles.card}>
            <MacroDonut
              protein={metrics.protein}
              carbs={metrics.carbs}
              fat={metrics.fat}
              calories={metrics.dailyCalories}
            />
          </View>

          {/* Timeline */}
          {weeks != null && weeks > 0 && projections && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Weight Timeline</Text>
                <Text style={styles.sectionSub}>~{weeks} weeks to target</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.timeline}>
                  {projections.map((p) => (
                    <View key={p.week} style={styles.timelinePoint}>
                      <Text style={styles.timelineWeight}>{p.weight}kg</Text>
                      <View style={styles.timelineDot} />
                      <Text style={styles.timelineWeek}>Wk {p.week}</Text>
                    </View>
                  ))}
                  <View style={styles.timelinePoint}>
                    <Text style={[styles.timelineWeight, { color: goalColors[profile.goal] }]}>
                      {profile.targetWeight}kg
                    </Text>
                    <View style={[styles.timelineDot, { backgroundColor: goalColors[profile.goal] }]} />
                    <Text style={styles.timelineWeek}>Goal</Text>
                  </View>
                </View>
              </ScrollView>
            </>
          )}

          {/* Action plan */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your 5-Step Action Plan</Text>
          </View>
          <View style={styles.card}>
            {actionSteps.map((step, i) => (
              <View key={i} style={styles.actionStep}>
                <View style={[styles.actionNum, { backgroundColor: goalColors[profile.goal] + '25' }]}>
                  <Text style={[styles.actionNumText, { color: goalColors[profile.goal] }]}>
                    {i + 1}
                  </Text>
                </View>
                <Text style={styles.actionText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: goalColors[profile.goal] }]}
            onPress={() => navigation.replace('Main')}
          >
            <Text style={styles.ctaBtnText}>Start My Journey 🚀</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  heroSection: { padding: 24, paddingBottom: 28 },
  heroLabel: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryGlow,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  heroLabelText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  heroTitle: { color: Colors.text, fontSize: 32, fontWeight: '800', lineHeight: 38 },
  heroSubtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 8 },
  content: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700' },
  sectionSub: { color: Colors.textSecondary, fontSize: 13 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  metricCol: { flex: 1, gap: 10 },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bmiCard: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  metricLabel: { color: Colors.textSecondary, fontSize: 12, marginBottom: 4 },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  metricValue: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  metricUnit: { color: Colors.textSecondary, fontSize: 12 },
  metricSub: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  bmiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginTop: 6 },
  bmiBadgeEmoji: { fontSize: 12 },
  bmiBadgeText: { fontSize: 12, fontWeight: '600' },
  calorieCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calorieLeft: { flex: 2, alignItems: 'center' },
  calorieLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 4 },
  calorieValue: { color: Colors.text, fontSize: 44, fontWeight: '800', lineHeight: 50 },
  calorieUnit: { color: Colors.textSecondary, fontSize: 13 },
  calorieDivider: { width: 1, height: 60, backgroundColor: Colors.border, marginHorizontal: 16 },
  calorieRight: { flex: 1 },
  macroContainer: { gap: 12 },
  macroItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  macroDot: { width: 10, height: 10, borderRadius: 5 },
  macroLabel: { color: Colors.textSecondary, fontSize: 13, flex: 1 },
  macroGrams: { color: Colors.text, fontSize: 14, fontWeight: '600', width: 50, textAlign: 'right' },
  macroKcal: { color: Colors.textSecondary, fontSize: 12, width: 60, textAlign: 'right' },
  macroPercent: { color: Colors.textMuted, fontSize: 12, width: 35, textAlign: 'right' },
  timeline: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, gap: 0 },
  timelinePoint: { alignItems: 'center', width: 70 },
  timelineWeight: { color: Colors.text, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, marginBottom: 4 },
  timelineWeek: { color: Colors.textSecondary, fontSize: 11 },
  actionStep: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  actionNum: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionNumText: { fontSize: 13, fontWeight: '700' },
  actionText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 20 },
  ctaBtn: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  ctaBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
