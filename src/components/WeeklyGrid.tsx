import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { WorkoutDay } from '../types';

interface Props {
  days: WorkoutDay[];
}

export function WeeklyGrid({ days }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.grid}>
        {days.map((day, i) => (
          <View key={i} style={[styles.dayCell, day.isRest ? styles.restCell : styles.gymCell]}>
            <Text style={styles.dayName}>{day.day.slice(0, 3)}</Text>
            {day.isRest ? (
              <>
                <Text style={styles.restIcon}>💤</Text>
                <Text style={styles.restLabel}>Rest</Text>
              </>
            ) : (
              <>
                <Text style={styles.gymIcon}>💪</Text>
                <Text style={styles.muscleLabel}>{day.muscleGroup}</Text>
              </>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

interface GymStreakGridProps {
  sessionCounts: number[]; // sessions per week, recent first
}

export function GymStreakGrid({ sessionCounts }: GymStreakGridProps) {
  const getColor = (sessions: number) => {
    if (sessions >= 4) return Colors.gymGreen;
    if (sessions >= 2) return Colors.gymYellow;
    return Colors.gymRed;
  };

  const getLabel = (sessions: number) => {
    if (sessions >= 4) return '💪';
    if (sessions >= 2) return '🟡';
    return '😴';
  };

  return (
    <View style={styles.streakContainer}>
      {sessionCounts.slice(-8).map((count, i) => (
        <View key={i} style={[styles.streakCell, { backgroundColor: getColor(count) + '30', borderColor: getColor(count) + '60' }]}>
          <Text style={styles.streakIcon}>{getLabel(count)}</Text>
          <Text style={[styles.streakCount, { color: getColor(count) }]}>{count}</Text>
          <Text style={styles.streakLabel}>W{sessionCounts.length - i}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -16 },
  grid: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  dayCell: {
    width: 72,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 100,
    justifyContent: 'center',
  },
  gymCell: { backgroundColor: Colors.primaryGlow, borderColor: Colors.primary + '50' },
  restCell: { backgroundColor: Colors.surface, borderColor: Colors.border },
  dayName: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600', marginBottom: 6 },
  gymIcon: { fontSize: 20, marginBottom: 4 },
  restIcon: { fontSize: 20, marginBottom: 4 },
  muscleLabel: { color: Colors.primary, fontSize: 10, textAlign: 'center', fontWeight: '600' },
  restLabel: { color: Colors.textSecondary, fontSize: 10, textAlign: 'center' },
  streakContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  streakCell: {
    width: 60,
    height: 70,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  streakIcon: { fontSize: 16, marginBottom: 2 },
  streakCount: { fontSize: 16, fontWeight: '700' },
  streakLabel: { color: Colors.textSecondary, fontSize: 10, marginTop: 2 },
});
