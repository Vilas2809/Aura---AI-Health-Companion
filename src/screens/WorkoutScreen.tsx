import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ExerciseCard } from '../components/ExerciseCard';
import { WeeklyGrid } from '../components/WeeklyGrid';
import { Colors } from '../constants/colors';
import { getWorkoutPlan } from '../services/workoutPlans';
import { useUserStore } from '../store/userStore';
import { WorkoutDay } from '../types';

export function WorkoutScreen() {
  const { profile, metrics } = useUserStore();
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);

  if (!metrics) return null;

  const plan = getWorkoutPlan(profile.goal, profile.gymDays, profile.fitnessLevel, profile.equipment);

  const gymDays = plan.days.filter((d) => !d.isRest);
  const today = new Date().getDay(); // 0 = Sunday
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[today];

  const todayWorkout = plan.days.find((d) => !d.isRest && d.day === todayName);
  const displayDay = selectedDay ?? todayWorkout ?? plan.days.find((d) => !d.isRest);

  const goalColors: Record<string, string> = {
    cut: Colors.error,
    bulk: Colors.success,
    maintain: Colors.primary,
  };
  const gColor = goalColors[profile.goal] ?? Colors.primary;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Weekly Workout</Text>
            <Text style={styles.subtitle}>{plan.splitName}</Text>
          </View>
          <View style={[styles.gymDaysBadge, { backgroundColor: gColor + '25', borderColor: gColor + '60' }]}>
            <Text style={[styles.gymDaysValue, { color: gColor }]}>{profile.gymDays}</Text>
            <Text style={[styles.gymDaysLabel, { color: gColor }]}>days/wk</Text>
          </View>
        </View>

        {/* Split info */}
        <View style={styles.splitInfo}>
          <SplitChip icon="💪" label={`${gymDays.length} gym days`} color={Colors.primary} />
          <SplitChip icon="😴" label={`${plan.days.length - gymDays.length} rest days`} color={Colors.textSecondary} />
          <SplitChip
            icon={profile.goal === 'cut' ? '🏃' : profile.goal === 'bulk' ? '🏋️' : '⚖️'}
            label={profile.goal === 'cut' ? 'High reps, 10–15' : profile.goal === 'bulk' ? 'Heavy, 5–8 reps' : 'Mixed rep ranges'}
            color={gColor}
          />
        </View>

        {/* Weekly grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          <WeeklyGrid days={plan.days} />
        </View>

        {/* Day selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dayRow}>
              {plan.days.map((d, i) => {
                const isActive = selectedDay?.day === d.day || (!selectedDay && d.day === displayDay?.day);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.dayChip,
                      d.isRest ? styles.dayChipRest : styles.dayChipGym,
                      isActive && !d.isRest && styles.dayChipActive,
                      isActive && d.isRest && styles.dayChipRestActive,
                    ]}
                    onPress={() => setSelectedDay(d)}
                  >
                    <Text style={[styles.dayChipText, isActive && styles.dayChipTextActive]}>
                      {d.day.slice(0, 3)}
                    </Text>
                    <Text style={styles.dayChipSub}>{d.isRest ? '💤' : '💪'}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Workout detail */}
        {displayDay && (
          <View style={styles.section}>
            <View style={styles.workoutHeader}>
              <View>
                <Text style={styles.workoutDay}>{displayDay.day}</Text>
                <Text style={[styles.workoutMuscle, { color: displayDay.isRest ? Colors.textSecondary : gColor }]}>
                  {displayDay.isRest ? 'Rest Day' : displayDay.muscleGroup}
                </Text>
              </View>
              {displayDay.isRest ? (
                <View style={styles.restBadge}>
                  <Text style={styles.restBadgeText}>💤 Recovery</Text>
                </View>
              ) : (
                <View style={[styles.gymBadge, { backgroundColor: gColor + '20', borderColor: gColor + '50' }]}>
                  <Text style={[styles.gymBadgeText, { color: gColor }]}>
                    {displayDay.exercises?.length} exercises
                  </Text>
                </View>
              )}
            </View>

            {displayDay.isRest ? (
              <View style={styles.restCard}>
                <Text style={styles.restTitle}>Rest Day Protocol</Text>
                <Text style={styles.restText}>{displayDay.cardioGuidance}</Text>
                <View style={styles.restBullets}>
                  <Text style={styles.restBullet}>• Focus on sleep quality and nutrition</Text>
                  <Text style={styles.restBullet}>• Foam roll and light stretching</Text>
                  <Text style={styles.restBullet}>• Hit your water and protein targets</Text>
                </View>
              </View>
            ) : (
              <View>
                {displayDay.exercises?.map((ex, i) => (
                  <ExerciseCard key={i} exercise={ex} index={i} />
                ))}
                {displayDay.cardioGuidance && (
                  <View style={styles.cardioCard}>
                    <Text style={styles.cardioTitle}>Post-Session Cardio</Text>
                    <Text style={styles.cardioText}>{displayDay.cardioGuidance}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Global cardio guidance */}
        <View style={styles.section}>
          <View style={styles.cardioCard}>
            <Text style={styles.cardioTitle}>🏃 Cardio Guidance for {profile.gymDays}-Day Split</Text>
            <Text style={styles.cardioText}>{plan.cardioGuidance}</Text>
          </View>
        </View>

        {/* Progressive overload note for bulk */}
        {profile.goal === 'bulk' && (
          <View style={styles.section}>
            <View style={[styles.noteCard, { borderColor: Colors.success + '40', backgroundColor: Colors.success + '08' }]}>
              <Text style={[styles.noteTitle, { color: Colors.success }]}>📈 Progressive Overload Rule</Text>
              <Text style={styles.noteText}>
                Every session: aim to add 2.5kg to your main compound lifts OR complete one more rep in each set. Log your weights. Progress is non-negotiable on a bulk.
              </Text>
            </View>
          </View>
        )}

        {/* Deload note */}
        <View style={styles.section}>
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>🔄 Deload Week</Text>
            <Text style={styles.noteText}>
              Every 4–6 weeks, take a deload: reduce weights by 40%, same exercises. This prevents injury and kickstarts the next growth phase.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SplitChip({
  icon, label, color,
}: {
  icon: string; label: string; color: string;
}) {
  return (
    <View style={[styles.splitChip, { borderColor: color + '40' }]}>
      <Text style={styles.splitChipIcon}>{icon}</Text>
      <Text style={[styles.splitChipLabel, { color }]}>{label}</Text>
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
  gymDaysBadge: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', borderWidth: 1 },
  gymDaysValue: { fontSize: 24, fontWeight: '800' },
  gymDaysLabel: { fontSize: 11, fontWeight: '600' },
  splitInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 16 },
  splitChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, backgroundColor: Colors.surface },
  splitChipIcon: { fontSize: 14 },
  splitChipLabel: { fontSize: 12, fontWeight: '600' },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', marginBottom: 10 },
  dayRow: { flexDirection: 'row', gap: 8 },
  dayChip: {
    width: 58,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  dayChipGym: { backgroundColor: Colors.surface, borderColor: Colors.border },
  dayChipRest: { backgroundColor: Colors.surface, borderColor: Colors.border, opacity: 0.6 },
  dayChipActive: { backgroundColor: Colors.primaryGlow, borderColor: Colors.primary },
  dayChipRestActive: { backgroundColor: Colors.surface, borderColor: Colors.textMuted, opacity: 1 },
  dayChipText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  dayChipTextActive: { color: Colors.primary },
  dayChipSub: { fontSize: 14, marginTop: 2 },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutDay: { color: Colors.text, fontSize: 20, fontWeight: '700' },
  workoutMuscle: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  restBadge: { backgroundColor: Colors.surfaceAlt, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  restBadgeText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  gymBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  gymBadgeText: { fontSize: 13, fontWeight: '600' },
  restCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  restTitle: { color: Colors.text, fontSize: 15, fontWeight: '600', marginBottom: 6 },
  restText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 10 },
  restBullets: { gap: 4 },
  restBullet: { color: Colors.textSecondary, fontSize: 13 },
  cardioCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.info + '40',
    backgroundColor: Colors.info + '08',
    marginTop: 8,
  },
  cardioTitle: { color: Colors.info, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  cardioText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },
  noteCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noteTitle: { color: Colors.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  noteText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },
});
