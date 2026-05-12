import { WearableData } from '../types';

export interface RecoveryScore {
  score: number;          // 0–100
  level: 'high' | 'moderate' | 'low';
  color: string;
  label: string;
  breakdown: {
    hrv: number | null;       // 0–100 component score
    sleep: number | null;
    restingHR: number | null;
  };
  insight: string;
}

// Typical healthy ranges used for normalisation
const HRV_MIN = 20;   // ms — low end
const HRV_MAX = 100;  // ms — elite end
const RHR_MIN = 40;   // bpm — athlete
const RHR_MAX = 80;   // bpm — elevated
const SLEEP_OPTIMAL = 8;   // hours
const SLEEP_MIN = 4;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function scoreHRV(hrv: number): number {
  // Higher HRV = better recovery. Normalise to 0–100.
  return clamp(((hrv - HRV_MIN) / (HRV_MAX - HRV_MIN)) * 100, 0, 100);
}

function scoreRestingHR(rhr: number): number {
  // Lower RHR = better recovery. Invert the scale.
  return clamp(((RHR_MAX - rhr) / (RHR_MAX - RHR_MIN)) * 100, 0, 100);
}

function scoreSleep(efficiency: number, duration: number): number {
  const efficiencyScore = clamp(efficiency, 0, 100);
  const durationScore = clamp((duration / SLEEP_OPTIMAL) * 100, 0, 100);
  // Penalise heavily under SLEEP_MIN hours
  const durationPenalty = duration < SLEEP_MIN ? (SLEEP_MIN - duration) * 15 : 0;
  return clamp((efficiencyScore * 0.5 + durationScore * 0.5) - durationPenalty, 0, 100);
}

function buildInsight(score: number, data: WearableData): string {
  if (score >= 67) {
    if (data.hrv && data.hrv > 60) return `HRV of ${data.hrv}ms is strong — your body is primed for a hard session today.`;
    if (data.sleepDuration && data.sleepDuration >= 7.5) return `Great sleep last night (${data.sleepDuration}h). Full power available today.`;
    return 'Recovery is high. Push hard today and aim to maintain your sleep quality tonight.';
  }
  if (score >= 34) {
    if (data.restingHeartRate && data.restingHeartRate > 65) return `Resting HR is elevated at ${data.restingHeartRate}bpm — moderate intensity only today.`;
    if (data.sleepEfficiency && data.sleepEfficiency < 75) return `Sleep efficiency was low (${data.sleepEfficiency}%). Prioritise sleep tonight and keep today light.`;
    return 'Moderate recovery. Stick to zone-2 cardio or a light strength session today.';
  }
  if (data.hrv && data.hrv < 30) return `HRV dropped to ${data.hrv}ms — your body needs rest. Skip the gym and walk instead.`;
  if (data.sleepDuration && data.sleepDuration < 5) return `Only ${data.sleepDuration}h sleep detected. Recovery is poor — rest is the workout today.`;
  return 'Low recovery. Take a rest day, hydrate, and aim for 8h sleep tonight.';
}

export function calculateRecoveryScore(data: WearableData): RecoveryScore {
  const components: number[] = [];
  const weights: number[] = [];
  const breakdown = { hrv: null as number | null, sleep: null as number | null, restingHR: null as number | null };

  if (data.hrv != null) {
    breakdown.hrv = Math.round(scoreHRV(data.hrv));
    components.push(breakdown.hrv);
    weights.push(0.40);
  }

  if (data.sleepEfficiency != null && data.sleepDuration != null) {
    breakdown.sleep = Math.round(scoreSleep(data.sleepEfficiency, data.sleepDuration));
    components.push(breakdown.sleep);
    weights.push(0.35);
  } else if (data.sleepDuration != null) {
    breakdown.sleep = Math.round(clamp((data.sleepDuration / SLEEP_OPTIMAL) * 100, 0, 100));
    components.push(breakdown.sleep);
    weights.push(0.25);
  }

  if (data.restingHeartRate != null) {
    breakdown.restingHR = Math.round(scoreRestingHR(data.restingHeartRate));
    components.push(breakdown.restingHR);
    weights.push(0.25);
  }

  let score = 50; // default when no data
  if (components.length > 0) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    score = Math.round(
      components.reduce((sum, c, i) => sum + c * weights[i], 0) / totalWeight
    );
  }

  score = clamp(score, 0, 100);

  const level: RecoveryScore['level'] = score >= 67 ? 'high' : score >= 34 ? 'moderate' : 'low';
  const color = level === 'high' ? '#00D4A0' : level === 'moderate' ? '#F5A623' : '#FF4C4C';
  const label = level === 'high' ? 'High Recovery' : level === 'moderate' ? 'Moderate' : 'Low Recovery';

  return { score, level, color, label, breakdown, insight: buildInsight(score, data) };
}

export function getRecoveryTrend(scores: number[]): 'improving' | 'declining' | 'stable' {
  if (scores.length < 3) return 'stable';
  const recent = scores.slice(-3);
  const diff = recent[2] - recent[0];
  if (diff >= 8) return 'improving';
  if (diff <= -8) return 'declining';
  return 'stable';
}
