import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { fetchWearableData, isHealthAvailable } from '../services/healthService';
import { calculateRecoveryScore, RecoveryScore } from '../services/recoveryScore';
import { WearableData } from '../types';

// ─── Recovery Ring ────────────────────────────────────────────────────────────
function RecoveryRing({ score, color }: { score: number; color: string }) {
  const size = 200;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background ring */}
      <View style={[styles.ringBg, { width: size, height: size, borderRadius: size / 2, borderWidth: stroke, borderColor: Colors.border }]} />
      {/* Score text */}
      <View style={styles.ringCenter}>
        <Text style={[styles.ringScore, { color }]}>{score}</Text>
        <Text style={styles.ringLabel}>Recovery</Text>
      </View>
    </View>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
  icon, label, value, unit, sub, color,
}: {
  icon: string; label: string; value: string; unit: string; sub?: string; color: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}<Text style={styles.metricUnit}> {unit}</Text></Text>
      <Text style={styles.metricLabel}>{label}</Text>
      {sub && <Text style={styles.metricSub}>{sub}</Text>}
    </View>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <View style={styles.scoreBarRow}>
      <Text style={styles.scoreBarLabel}>{label}</Text>
      <View style={styles.scoreBarTrack}>
        <View style={[styles.scoreBarFill, { width: `${value ?? 0}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.scoreBarValue, { color }]}>{value ?? '—'}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export function RecoveryScreen() {
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const [recovery, setRecovery] = useState<RecoveryScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasHealth, setHasHealth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const available = isHealthAvailable();
    setHasHealth(available);

    if (available) {
      const data = await fetchWearableData();
      if (data) {
        setWearableData(data);
        setRecovery(calculateRecoveryScore(data));
      } else {
        setError('Could not read health data. Make sure permissions are granted.');
        // Show demo data so UI is visible
        setRecovery(calculateRecoveryScore({}));
      }
    } else {
      // Show demo data in Expo Go / simulator
      const demo: WearableData = { hrv: 58, restingHeartRate: 54, sleepEfficiency: 87, sleepDuration: 7.4 };
      setWearableData(demo);
      setRecovery(calculateRecoveryScore(demo));
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Reading health data…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Recovery</Text>
          <Text style={styles.subtitle}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>

        {!hasHealth && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoBannerText}>📱 Demo data — real data available after EAS build with HealthKit / Health Connect</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Recovery ring */}
        {recovery && (
          <>
            <View style={styles.ringSection}>
              <RecoveryRing score={recovery.score} color={recovery.color} />
              <View style={[styles.levelBadge, { backgroundColor: recovery.color + '20', borderColor: recovery.color + '40' }]}>
                <View style={[styles.levelDot, { backgroundColor: recovery.color }]} />
                <Text style={[styles.levelText, { color: recovery.color }]}>{recovery.label}</Text>
              </View>
            </View>

            {/* AI Insight */}
            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>🧠</Text>
              <Text style={styles.insightText}>{recovery.insight}</Text>
            </View>

            {/* Metrics grid */}
            <Text style={styles.sectionTitle}>Today's Biometrics</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                icon="💓"
                label="HRV"
                value={wearableData?.hrv != null ? String(wearableData.hrv) : '—'}
                unit="ms"
                sub="Heart rate variability"
                color={Colors.success}
              />
              <MetricCard
                icon="❤️"
                label="Resting HR"
                value={wearableData?.restingHeartRate != null ? String(wearableData.restingHeartRate) : '—'}
                unit="bpm"
                sub="While sleeping"
                color={Colors.error}
              />
              <MetricCard
                icon="🌙"
                label="Sleep"
                value={wearableData?.sleepDuration != null ? String(wearableData.sleepDuration) : '—'}
                unit="hrs"
                sub={wearableData?.sleepEfficiency != null ? `${wearableData.sleepEfficiency}% efficiency` : undefined}
                color={Colors.info}
              />
              <MetricCard
                icon="🔥"
                label="Heart Rate"
                value={wearableData?.heartRate != null ? String(wearableData.heartRate) : '—'}
                unit="bpm"
                sub="Current"
                color={Colors.warning}
              />
            </View>

            {/* Score breakdown */}
            <Text style={styles.sectionTitle}>Score Breakdown</Text>
            <View style={styles.breakdownCard}>
              <ScoreBar label="HRV Score" value={recovery.breakdown.hrv} color={Colors.success} />
              <ScoreBar label="Sleep Score" value={recovery.breakdown.sleep} color={Colors.info} />
              <ScoreBar label="Resting HR Score" value={recovery.breakdown.restingHR} color={Colors.error} />
            </View>

            {/* Recommendation */}
            <Text style={styles.sectionTitle}>Today's Recommendation</Text>
            <View style={styles.recommendCard}>
              {recovery.level === 'high' && (
                <>
                  <Text style={styles.recommendEmoji}>💪</Text>
                  <Text style={styles.recommendTitle}>Train Hard</Text>
                  <Text style={styles.recommendBody}>Your body is fully recovered. This is the best day for a heavy strength session or high-intensity interval training.</Text>
                </>
              )}
              {recovery.level === 'moderate' && (
                <>
                  <Text style={styles.recommendEmoji}>🚶</Text>
                  <Text style={styles.recommendTitle}>Moderate Effort</Text>
                  <Text style={styles.recommendBody}>Good enough to train, but keep intensity at 70–80%. Zone-2 cardio or a moderate lift. Focus on technique over load.</Text>
                </>
              )}
              {recovery.level === 'low' && (
                <>
                  <Text style={styles.recommendEmoji}>😴</Text>
                  <Text style={styles.recommendTitle}>Rest & Recover</Text>
                  <Text style={styles.recommendBody}>Skip the gym today. Go for a walk, stretch, and prioritise sleep tonight. Pushing hard on low recovery leads to injury.</Text>
                </>
              )}
            </View>
          </>
        )}

        {/* Connect banner for real builds */}
        {!hasHealth && (
          <TouchableOpacity style={styles.connectCard}>
            <Text style={styles.connectIcon}>⌚</Text>
            <View style={styles.connectText}>
              <Text style={styles.connectTitle}>Connect Apple Watch or Fitness Tracker</Text>
              <Text style={styles.connectSub}>Available after installing the full app build. Reads real HRV, sleep and heart rate data automatically.</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: Colors.textSecondary, fontSize: 14 },
  header: { marginBottom: 20 },
  title: { color: Colors.text, fontSize: 28, fontWeight: '700' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 2 },
  demoBanner: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  demoBannerText: { color: Colors.primary, fontSize: 12, textAlign: 'center' },
  errorBanner: { backgroundColor: Colors.errorDim, borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: Colors.error, fontSize: 12 },
  ringSection: { alignItems: 'center', marginBottom: 20 },
  ringBg: { position: 'absolute' },
  ringCenter: { alignItems: 'center' },
  ringScore: { fontSize: 64, fontWeight: '800', lineHeight: 72 },
  ringLabel: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  levelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, marginTop: 16,
  },
  levelDot: { width: 8, height: 8, borderRadius: 4 },
  levelText: { fontSize: 14, fontWeight: '700' },
  insightCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    marginBottom: 24, borderWidth: 1, borderColor: Colors.border,
  },
  insightIcon: { fontSize: 22 },
  insightText: { flex: 1, color: Colors.text, fontSize: 14, lineHeight: 21 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', marginBottom: 12 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  metricCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  metricIcon: { fontSize: 22, marginBottom: 6 },
  metricValue: { fontSize: 26, fontWeight: '800' },
  metricUnit: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary },
  metricLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginTop: 2 },
  metricSub: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  breakdownCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 14, marginBottom: 24,
  },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreBarLabel: { color: Colors.textSecondary, fontSize: 12, width: 110 },
  scoreBarTrack: { flex: 1, height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreBarValue: { fontSize: 13, fontWeight: '700', width: 28, textAlign: 'right' },
  recommendCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 20,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
    marginBottom: 24,
  },
  recommendEmoji: { fontSize: 40, marginBottom: 8 },
  recommendTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  recommendBody: { color: Colors.textSecondary, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  connectCard: {
    flexDirection: 'row', gap: 14, alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  connectIcon: { fontSize: 32 },
  connectText: { flex: 1 },
  connectTitle: { color: Colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  connectSub: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
});
