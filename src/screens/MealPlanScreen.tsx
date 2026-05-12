import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AICoachCard } from '../components/AICoachCard';
import { MealCard } from '../components/MealCard';
import { Colors } from '../constants/colors';
import { getCuisineBadgeColor, getMealPlan } from '../services/mealPlans';
import { useUserStore } from '../store/userStore';

const CUISINE_EMOJIS: Record<string, string> = {
  indian: '🫓',
  japanese: '🍱',
  mediterranean: '🫒',
  western: '🥩',
  asian: '🍜',
  middle_eastern: '🧆',
  mexican: '🌮',
  balanced: '🌍',
};

export function MealPlanScreen() {
  const { profile, metrics } = useUserStore();
  const [selectedDay, setSelectedDay] = useState(0);

  if (!metrics) return null;

  const plan = getMealPlan(profile.cuisine, profile.dietType, profile.goal, metrics.dailyCalories);
  const badgeColor = getCuisineBadgeColor(profile.cuisine);
  const emoji = CUISINE_EMOJIS[profile.cuisine] ?? '🍽️';

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const goalLabels: Record<string, string> = {
    cut: 'Fat Loss',
    bulk: 'Muscle Gain',
    maintain: 'Maintenance',
  };

  const totalProtein = plan.meals.reduce((s, m) => s + m.totalProtein, 0);
  const totalCarbs = plan.meals.reduce((s, m) => s + m.totalCarbs, 0);
  const totalFat = plan.meals.reduce((s, m) => s + m.totalFat, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Daily Meal Plan</Text>
            <Text style={styles.subtitle}>
              {goalLabels[profile.goal]} • {profile.dietType === 'any' ? 'No restriction' : profile.dietType === 'veg' ? 'Vegetarian' : 'Vegan'}
            </Text>
          </View>
          <View style={[styles.cuisineBadge, { backgroundColor: badgeColor + '25', borderColor: badgeColor + '60' }]}>
            <Text style={styles.cuisineEmoji}>{emoji}</Text>
            <Text style={[styles.cuisineLabel, { color: badgeColor }]}>{plan.cuisineLabel}</Text>
          </View>
        </View>

        {/* Day selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
          {days.map((d, i) => (
            <TouchableOpacity
              key={d}
              style={[styles.dayBtn, selectedDay === i && styles.dayBtnActive]}
              onPress={() => setSelectedDay(i)}
            >
              <Text style={[styles.dayBtnText, selectedDay === i && styles.dayBtnTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Macro summary */}
        <View style={styles.macroSummary}>
          <MacroSummaryItem label="Calories" value={plan.totalCalories} unit="kcal" color={Colors.primary} />
          <MacroSummaryItem label="Protein" value={totalProtein} unit="g" color={Colors.protein} />
          <MacroSummaryItem label="Carbs" value={totalCarbs} unit="g" color={Colors.carbs} />
          <MacroSummaryItem label="Fat" value={totalFat} unit="g" color={Colors.fat} />
        </View>

        {/* Calorie breakdown bar */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Calorie Distribution</Text>
          <View style={styles.breakdownBar}>
            {plan.meals.map((m, i) => {
              const pct = (m.totalCalories / plan.totalCalories) * 100;
              const barColors = [Colors.protein, Colors.carbs, Colors.primary, Colors.fat, Colors.info];
              return (
                <View
                  key={m.id}
                  style={[
                    styles.breakdownSegment,
                    { width: `${pct}%`, backgroundColor: barColors[i % barColors.length] },
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.breakdownLegend}>
            {plan.meals.map((m, i) => {
              const barColors = [Colors.protein, Colors.carbs, Colors.primary, Colors.fat, Colors.info];
              return (
                <View key={m.id} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: barColors[i % barColors.length] }]} />
                  <Text style={styles.legendText}>{m.name.replace('Mid-Morning ', '').replace('Afternoon ', '')} ({m.totalCalories})</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Meal cards */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Meals for {days[selectedDay]}</Text>
          {plan.meals.map((m) => (
            <MealCard key={m.id} meal={m} targetCalories={plan.totalCalories} />
          ))}
        </View>

        {/* Goal tip */}
        <View style={styles.tipSection}>
          <AICoachCard message={plan.tip} category="Meal Tip" compact />
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>📋 Meal Plan Note</Text>
          <Text style={styles.noteText}>
            This plan rotates automatically with your goal and cuisine. Tap any meal card to see individual food items and their macros. Portions scale to your {metrics.dailyCalories} kcal daily target.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MacroSummaryItem({
  label, value, unit, color,
}: {
  label: string; value: number; unit: string; color: string;
}) {
  return (
    <View style={styles.macroItem}>
      <Text style={[styles.macroValue, { color }]}>{value}</Text>
      <Text style={styles.macroUnit}>{unit}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 3 },
  cuisineBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  cuisineEmoji: { fontSize: 18 },
  cuisineLabel: { fontSize: 13, fontWeight: '700' },
  dayScroll: { paddingLeft: 16, marginBottom: 16 },
  dayBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayBtnText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  dayBtnTextActive: { color: '#fff' },
  macroSummary: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  macroItem: { flex: 1, alignItems: 'center' },
  macroValue: { fontSize: 18, fontWeight: '700' },
  macroUnit: { color: Colors.textSecondary, fontSize: 11, marginTop: 1 },
  macroLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  breakdownSection: { paddingHorizontal: 16, marginBottom: 16 },
  breakdownTitle: { color: Colors.text, fontSize: 15, fontWeight: '600', marginBottom: 8 },
  breakdownBar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', backgroundColor: Colors.border },
  breakdownSegment: { height: '100%' },
  breakdownLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Colors.textSecondary, fontSize: 11 },
  mealsSection: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', marginBottom: 12 },
  tipSection: { paddingHorizontal: 16 },
  noteCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  noteTitle: { color: Colors.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  noteText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },
});
