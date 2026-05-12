import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { AICoachCard } from '../components/AICoachCard';
import { GymStreakGrid } from '../components/WeeklyGrid';
import { Colors } from '../constants/colors';
import { getRuleBasedProgressFeedback } from '../services/aiCoach';
import { useProgressStore } from '../store/progressStore';
import { useUserStore } from '../store/userStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 48;

const chartConfig = {
  backgroundGradientFrom: Colors.surface,
  backgroundGradientTo: Colors.surface,
  color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
  labelColor: () => Colors.textSecondary,
  strokeWidth: 2,
  propsForDots: { r: '4', strokeWidth: '2', stroke: Colors.primary },
  propsForBackgroundLines: { stroke: Colors.border },
  decimalPlaces: 1,
};

const barChartConfig = {
  ...chartConfig,
  color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
  propsForDots: {},
};

function LogEntryForm({
  onSubmit,
  currentWeight,
}: {
  onSubmit: (weight: number, steps: number, sessions: number, note: string) => void;
  currentWeight: number;
}) {
  const [weight, setWeight] = useState(String(currentWeight));
  const [steps, setSteps] = useState('8000');
  const [sessions, setSessions] = useState('4');
  const [note, setNote] = useState('');

  const submit = () => {
    const w = parseFloat(weight);
    const s = parseInt(steps, 10);
    const g = parseInt(sessions, 10);
    if (isNaN(w) || isNaN(s) || isNaN(g)) {
      Alert.alert('Invalid input', 'Please fill in all fields with valid numbers.');
      return;
    }
    onSubmit(w, s, g, note);
    setNote('');
  };

  return (
    <View style={styles.logForm}>
      <Text style={styles.logTitle}>📋 Log This Week</Text>
      <View style={styles.logRow}>
        <LogField label="Weight (kg)" value={weight} onChange={setWeight} keyboardType="numeric" />
        <LogField label="Avg Steps/day" value={steps} onChange={setSteps} keyboardType="numeric" />
        <LogField label="Gym Sessions" value={sessions} onChange={setSessions} keyboardType="numeric" />
      </View>
      <TextInput
        style={styles.noteInput}
        placeholder="Weekly note (optional)…"
        placeholderTextColor={Colors.textMuted}
        value={note}
        onChangeText={setNote}
        multiline
      />
      <TouchableOpacity style={styles.logBtn} onPress={submit}>
        <Text style={styles.logBtnText}>Save Weekly Log</Text>
      </TouchableOpacity>
    </View>
  );
}

function LogField({
  label, value, onChange, keyboardType,
}: {
  label: string; value: string; onChange: (v: string) => void; keyboardType?: any;
}) {
  return (
    <View style={styles.logField}>
      <Text style={styles.logFieldLabel}>{label}</Text>
      <TextInput
        style={styles.logFieldInput}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.textMuted}
      />
    </View>
  );
}

export function ProgressTrackerScreen() {
  const { profile, metrics } = useUserStore();
  const { entries, addEntry } = useProgressStore();

  if (!metrics) return null;

  const handleLog = (weight: number, avgDailySteps: number, gymSessions: number, note: string) => {
    addEntry({
      date: new Date().toISOString(),
      weight,
      avgDailySteps,
      gymSessions,
      note: note || undefined,
    });
  };

  // Stats
  const firstEntry = entries[0];
  const latestEntry = entries[entries.length - 1];
  const prevEntry = entries.length >= 2 ? entries[entries.length - 2] : null;

  const totalChange = latestEntry ? latestEntry.weight - profile.weight : 0;
  const weeklyPace =
    entries.length >= 2
      ? ((latestEntry!.weight - firstEntry!.weight) / (entries.length - 1)).toFixed(2)
      : '—';
  const weeksTracked = entries.length;

  const weeksToGoal =
    profile.targetWeight && latestEntry && metrics
      ? Math.max(
          0,
          Math.round(
            (Math.abs(profile.targetWeight - latestEntry.weight) * 7700) /
              (Math.abs(metrics.tdee - metrics.dailyCalories) * 7 || 1)
          )
        )
      : null;

  // Chart data
  const weightLabels = entries.length
    ? entries.slice(-8).map((e) => `W${e.week}`)
    : ['W1', 'W2', 'W3', 'W4'];
  const weightData = entries.length
    ? entries.slice(-8).map((e) => e.weight)
    : [profile.weight, profile.weight, profile.weight, profile.weight];

  const stepsLabels = entries.length
    ? entries.slice(-8).map((e) => `W${e.week}`)
    : ['W1', 'W2', 'W3', 'W4'];
  const stepsData = entries.length
    ? entries.slice(-8).map((e) => e.avgDailySteps)
    : [metrics.stepTarget * 0.8, metrics.stepTarget * 0.9, metrics.stepTarget, metrics.stepTarget * 1.05];

  const sessionCounts = entries.map((e) => e.gymSessions);

  const aiFeedback = getRuleBasedProgressFeedback(entries, profile.goal, metrics.stepTarget);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress Tracker</Text>
          <Text style={styles.subtitle}>{weeksTracked} week{weeksTracked !== 1 ? 's' : ''} tracked</Text>
        </View>

        {/* Summary stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="Total Change"
            value={`${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(1)}kg`}
            color={
              (profile.goal === 'cut' && totalChange < 0) || (profile.goal === 'bulk' && totalChange > 0)
                ? Colors.success
                : Colors.text
            }
          />
          <StatCard label="Weekly Pace" value={`${weeklyPace}kg/wk`} />
          <StatCard
            label="Weeks to Goal"
            value={weeksToGoal != null ? `~${weeksToGoal}wk` : '—'}
            color={Colors.primary}
          />
        </View>

        {/* AI Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Feedback</Text>
          <AICoachCard message={aiFeedback} category="Progress" />
        </View>

        {/* Weight chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Trend</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={{
                labels: weightLabels,
                datasets: [
                  { data: weightData, color: () => Colors.primary, strokeWidth: 2 },
                  {
                    data: profile.targetWeight
                      ? Array(weightLabels.length).fill(profile.targetWeight)
                      : weightData,
                    color: () => Colors.success + '80',
                    strokeWidth: 1,
                    withDots: false,
                  },
                ],
                legend: ['Actual', 'Target'],
              }}
              width={CHART_WIDTH}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Steps chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Avg Steps</Text>
          <View style={styles.chartCard}>
            <BarChart
              data={{
                labels: stepsLabels,
                datasets: [{ data: stepsData }],
              }}
              width={CHART_WIDTH}
              height={160}
              chartConfig={{
                ...barChartConfig,
                color: (opacity = 1) => {
                  return `rgba(108, 99, 255, ${opacity})`;
                },
              }}
              style={styles.chart}
              showValuesOnTopOfBars={false}
              yAxisLabel=""
              yAxisSuffix=""
            />
            <View style={styles.stepsGoalLine}>
              <View style={styles.goalDash} />
              <Text style={styles.goalLineLabel}>Goal: {metrics.stepTarget.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Gym streak grid */}
        {sessionCounts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gym Streak</Text>
            <View style={styles.streakLegend}>
              <LegendChip color={Colors.gymGreen} label="4+ sessions" />
              <LegendChip color={Colors.gymYellow} label="2–3 sessions" />
              <LegendChip color={Colors.gymRed} label="0–1 sessions" />
            </View>
            <GymStreakGrid sessionCounts={sessionCounts} />
          </View>
        )}

        {/* Log entry form */}
        <View style={styles.section}>
          <LogEntryForm
            onSubmit={handleLog}
            currentWeight={latestEntry?.weight ?? profile.weight}
          />
        </View>

        {/* Weekly log table */}
        {entries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Log</Text>
            <View style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.7 }]}>Wk</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Weight</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Steps</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.8 }]}>Gym</Text>
              </View>
              {entries
                .slice()
                .reverse()
                .slice(0, 10)
                .map((entry) => (
                  <View key={entry.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 0.7, color: Colors.textSecondary }]}>#{entry.week}</Text>
                    <Text style={styles.tableCell}>{entry.weight}kg</Text>
                    <Text style={styles.tableCell}>{(entry.avgDailySteps / 1000).toFixed(1)}k</Text>
                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{entry.gymSessions} ✓</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendChip}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 3 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statValue: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  statLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 4, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', marginBottom: 10 },
  chartCard: { backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  chart: { borderRadius: 16 },
  stepsGoalLine: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingBottom: 8 },
  goalDash: { flex: 1, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.success },
  goalLineLabel: { color: Colors.success, fontSize: 11 },
  streakLegend: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  legendChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: Colors.textSecondary, fontSize: 11 },
  logForm: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  logTitle: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 14 },
  logRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  logField: { flex: 1 },
  logFieldLabel: { color: Colors.textSecondary, fontSize: 11, marginBottom: 4 },
  logFieldInput: { backgroundColor: Colors.surfaceAlt, borderRadius: 10, padding: 10, color: Colors.text, fontSize: 14, borderWidth: 1, borderColor: Colors.border, textAlign: 'center' },
  noteInput: { backgroundColor: Colors.surfaceAlt, borderRadius: 10, padding: 10, color: Colors.text, fontSize: 13, borderWidth: 1, borderColor: Colors.border, minHeight: 60, marginBottom: 12, textAlignVertical: 'top' },
  logBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 14, alignItems: 'center' },
  logBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  tableCard: { backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.surfaceAlt, paddingVertical: 10, paddingHorizontal: 12 },
  tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  tableCell: { flex: 1, color: Colors.text, fontSize: 13 },
  tableHeaderText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
});
