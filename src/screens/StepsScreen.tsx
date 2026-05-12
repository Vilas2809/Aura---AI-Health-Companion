import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThreeRingProgress } from '../components/CircularProgress';
import { AICoachCard } from '../components/AICoachCard';
import { Colors } from '../constants/colors';
import { getStepDistribution, getStepTip } from '../services/workoutPlans';
import { useUserStore } from '../store/userStore';
import { useStepCounter } from '../hooks/useStepCounter';

function HourlyBar({ label, steps, max }: { label: string; steps: number; max: number }) {
  const h = Math.max(4, (steps / max) * 80);
  return (
    <View style={styles.barWrapper}>
      <View style={[styles.bar, { height: h }]} />
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

function StatRow({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statRight}>
        <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
        {unit && <Text style={styles.statUnit}> {unit}</Text>}
      </View>
    </View>
  );
}

export function StepsScreen() {
  const navigation = useNavigation();
  const { profile, metrics } = useUserStore();
  const { steps, isPedometerAvailable } = useStepCounter();

  if (!metrics) return null;

  const goal = metrics.stepTarget;
  const progress = Math.min(steps / goal, 1);
  const distribution = getStepDistribution(goal);
  const tip = getStepTip(profile.goal);
  const caloriesBurned = Math.round(steps * 0.04);
  const distanceKm = (steps * 0.00075).toFixed(2);
  const activeMinutes = Math.round(steps / 100);

  // Simulated hourly data (in a real app this comes from HealthKit)
  const hourlyData = [
    { label: '6AM', steps: Math.round(distribution.morning * 0.25) },
    { label: '8AM', steps: Math.round(distribution.morning * 0.45) },
    { label: '10AM', steps: Math.round(distribution.morning * 0.30) },
    { label: '12PM', steps: Math.round(distribution.afternoon * 0.40) },
    { label: '2PM', steps: Math.round(distribution.afternoon * 0.35) },
    { label: '4PM', steps: Math.round(distribution.afternoon * 0.25) },
    { label: '6PM', steps: Math.round(distribution.evening * 0.35) },
    { label: '8PM', steps: Math.round(distribution.evening * 0.40) },
    { label: '10PM', steps: Math.round(distribution.evening * 0.25) },
  ];
  const maxHourly = Math.max(...hourlyData.map((h) => h.steps), 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Steps Today</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Three ring progress */}
        <View style={styles.ringSection}>
          <ThreeRingProgress
            stepProgress={progress}
            calorieProgress={Math.min(caloriesBurned / 500, 1)}
            activeProgress={Math.min(activeMinutes / 60, 1)}
            stepColor={Colors.stepRing}
            calorieColor={Colors.calorieRing}
            activeColor={Colors.activeRing}
            size={220}
            centerLabel="steps today"
            centerValue={steps.toLocaleString()}
          />
          <View style={styles.legendRow}>
            <LegendItem color={Colors.stepRing} label="Steps" />
            <LegendItem color={Colors.calorieRing} label="Calories" />
            <LegendItem color={Colors.activeRing} label="Active min" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <StatRow icon="👟" label="Steps" value={steps.toLocaleString()} unit={`/ ${goal.toLocaleString()}`} color={Colors.primary} />
          <View style={styles.divider} />
          <StatRow icon="🔥" label="Calories burned" value={caloriesBurned} unit="kcal" color={Colors.calorieRing} />
          <View style={styles.divider} />
          <StatRow icon="📍" label="Distance" value={distanceKm} unit="km" />
          <View style={styles.divider} />
          <StatRow icon="⏱️" label="Active minutes" value={activeMinutes} unit="min" color={Colors.activeRing} />
          <View style={styles.divider} />
          <StatRow icon="🎯" label="Goal remaining" value={Math.max(0, goal - steps).toLocaleString()} unit="steps" />
        </View>

        {/* Sensor status */}
        {!isPedometerAvailable && (
          <View style={styles.sensorNote}>
            <Text style={styles.sensorNoteText}>
              ⚠️ Step sensor unavailable. Connect Apple Health or Google Health Connect for live tracking.
            </Text>
          </View>
        )}

        {/* Step distribution targets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Distribution Target</Text>
          <View style={styles.distCard}>
            <DistRow icon="🌅" label="Morning" value={distribution.morning} time="6–12 PM" />
            <DistRow icon="☀️" label="Afternoon" value={distribution.afternoon} time="12–6 PM" />
            <DistRow icon="🌙" label="Evening" value={distribution.evening} time="6–10 PM" />
          </View>
        </View>

        {/* Hourly breakdown bars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hourly Breakdown</Text>
          <View style={styles.barChart}>
            {hourlyData.map((h) => (
              <HourlyBar key={h.label} label={h.label} steps={h.steps} max={maxHourly} />
            ))}
          </View>
        </View>

        {/* Tip */}
        <View style={styles.section}>
          <AICoachCard
            message={tip}
            category="Steps"
            compact
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function DistRow({ icon, label, value, time }: { icon: string; label: string; value: number; time: string }) {
  return (
    <View style={styles.distRow}>
      <Text style={styles.distIcon}>{icon}</Text>
      <View style={styles.distInfo}>
        <Text style={styles.distLabel}>{label}</Text>
        <Text style={styles.distTime}>{time}</Text>
      </View>
      <Text style={styles.distValue}>{value.toLocaleString()} steps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backBtn: { width: 70 },
  backBtnText: { color: Colors.primary, fontSize: 15 },
  headerTitle: { color: Colors.text, fontSize: 17, fontWeight: '700' },
  ringSection: { alignItems: 'center', paddingVertical: 24 },
  legendRow: { flexDirection: 'row', gap: 20, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: Colors.textSecondary, fontSize: 12 },
  statsCard: { backgroundColor: Colors.surface, borderRadius: 16, marginHorizontal: 16, padding: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, gap: 10 },
  statIcon: { fontSize: 20, width: 28 },
  statLabel: { flex: 1, color: Colors.textSecondary, fontSize: 14 },
  statRight: { flexDirection: 'row', alignItems: 'baseline' },
  statValue: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  statUnit: { color: Colors.textSecondary, fontSize: 12 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 8 },
  sensorNote: { backgroundColor: Colors.warningDim, marginHorizontal: 16, borderRadius: 12, padding: 12, marginBottom: 12 },
  sensorNoteText: { color: Colors.warning, fontSize: 13, lineHeight: 18 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', marginBottom: 10 },
  distCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 8, borderWidth: 1, borderColor: Colors.border },
  distRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, gap: 10 },
  distIcon: { fontSize: 20, width: 28 },
  distInfo: { flex: 1 },
  distLabel: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  distTime: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  distValue: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 6 },
  barWrapper: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '80%', backgroundColor: Colors.primary + '70', borderRadius: 4 },
  barLabel: { color: Colors.textMuted, fontSize: 9 },
});
