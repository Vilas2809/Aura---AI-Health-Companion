import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AICoachCard } from '../components/AICoachCard';
import { CircularProgress } from '../components/CircularProgress';
import { Colors } from '../constants/colors';
import { generateInsight } from '../services/aiCoach';
import { useProgressStore } from '../store/progressStore';
import { useUserStore } from '../store/userStore';
import { useStepCounter } from '../hooks/useStepCounter';

export function DailySummaryScreen() {
  const navigation = useNavigation();
  const { profile, metrics } = useUserStore();
  const { stepStreak } = useProgressStore();
  const { steps } = useStepCounter();
  const [recap, setRecap] = useState('');
  const [loading, setLoading] = useState(true);

  if (!metrics) return null;

  const goal = metrics.stepTarget;
  const goalHit = steps >= goal;
  const progress = Math.min(steps / goal, 1);
  const caloriesBurned = Math.round(steps * 0.04);
  const distanceKm = (steps * 0.00075).toFixed(2);
  const activeMinutes = Math.round(steps / 100);

  const tomorrowGoal = goalHit
    ? metrics.stepTarget + 500
    : metrics.stepTarget;

  useEffect(() => {
    (async () => {
      const msg = await generateInsight({
        type: 'step_nudge',
        profile,
        metrics,
        extraContext: String(steps),
      });
      setRecap(msg);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Daily Summary</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Goal hit indicator */}
        <View style={[styles.goalBanner, goalHit ? styles.goalBannerHit : styles.goalBannerMissed]}>
          <Text style={styles.goalBannerIcon}>{goalHit ? '🎉' : '💪'}</Text>
          <View>
            <Text style={[styles.goalBannerTitle, goalHit ? styles.goalTextHit : styles.goalTextMissed]}>
              {goalHit ? 'Goal Achieved!' : 'Keep Going!'}
            </Text>
            <Text style={styles.goalBannerSub}>
              {goalHit
                ? `You hit ${goal.toLocaleString()} steps today!`
                : `${(goal - steps).toLocaleString()} more steps to reach your goal`}
            </Text>
          </View>
        </View>

        {/* Step ring */}
        <View style={styles.ringSection}>
          <CircularProgress
            size={180}
            strokeWidth={14}
            progress={progress}
            color={goalHit ? Colors.success : Colors.primary}
          >
            <View style={styles.ringCenter}>
              <Text style={styles.ringSteps}>{steps.toLocaleString()}</Text>
              <Text style={styles.ringLabel}>steps</Text>
            </View>
          </CircularProgress>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatBox icon="🔥" label="Calories" value={`${caloriesBurned}`} unit="kcal" color={Colors.calorieRing} />
          <StatBox icon="📍" label="Distance" value={distanceKm} unit="km" color={Colors.info} />
          <StatBox icon="⏱️" label="Active" value={`${activeMinutes}`} unit="min" color={Colors.activeRing} />
          <StatBox icon="🔥" label="Streak" value={`${stepStreak}`} unit="days" color={Colors.warning} />
        </View>

        {/* AI recap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Recap</Text>
          <AICoachCard message={recap} loading={loading} category="Daily Recap" />
        </View>

        {/* Tomorrow */}
        <View style={styles.tomorrowCard}>
          <Text style={styles.tomorrowLabel}>Tomorrow's Target</Text>
          <Text style={styles.tomorrowValue}>{tomorrowGoal.toLocaleString()}</Text>
          <Text style={styles.tomorrowSteps}>steps</Text>
          {goalHit && (
            <Text style={styles.tomorrowNote}>🎯 +500 bonus steps for hitting your goal today!</Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({
  icon, label, value, unit, color,
}: {
  icon: string; label: string; value: string; unit: string; color: string;
}) {
  return (
    <View style={[styles.statBox, { borderColor: color + '40' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backBtn: { width: 70 },
  backBtnText: { color: Colors.primary, fontSize: 15 },
  title: { color: Colors.text, fontSize: 17, fontWeight: '700' },
  goalBanner: { marginHorizontal: 16, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  goalBannerHit: { backgroundColor: Colors.success + '20', borderWidth: 1, borderColor: Colors.success + '40' },
  goalBannerMissed: { backgroundColor: Colors.primary + '20', borderWidth: 1, borderColor: Colors.primary + '40' },
  goalBannerIcon: { fontSize: 36 },
  goalBannerTitle: { fontSize: 17, fontWeight: '700' },
  goalTextHit: { color: Colors.success },
  goalTextMissed: { color: Colors.primary },
  goalBannerSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  ringSection: { alignItems: 'center', paddingVertical: 16 },
  ringCenter: { alignItems: 'center' },
  ringSteps: { color: Colors.text, fontSize: 28, fontWeight: '800' },
  ringLabel: { color: Colors.textSecondary, fontSize: 13 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  statBox: { width: '47%', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1 },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '700' },
  statUnit: { color: Colors.textSecondary, fontSize: 12, marginTop: 1 },
  statLabel: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', marginBottom: 10 },
  tomorrowCard: { marginHorizontal: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  tomorrowLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 4 },
  tomorrowValue: { color: Colors.primary, fontSize: 40, fontWeight: '800' },
  tomorrowSteps: { color: Colors.textSecondary, fontSize: 14 },
  tomorrowNote: { color: Colors.success, fontSize: 13, marginTop: 8 },
});
