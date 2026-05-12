import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Exercise } from '../types';

interface Props {
  exercise: Exercise;
  index: number;
}

function openVideo(exerciseName: string) {
  const query = encodeURIComponent(`${exerciseName} exercise tutorial form`);
  WebBrowser.openBrowserAsync(`https://www.youtube.com/results?search_query=${query}`, {
    toolbarColor: Colors.surface,
    controlsColor: Colors.primary,
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
  });
}

export function ExerciseCard({ exercise, index }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.muscle}>{exercise.muscleTarget}</Text>
        {exercise.notes && <Text style={styles.notes}>{exercise.notes}</Text>}
      </View>
      <View style={styles.right}>
        <View style={styles.setsReps}>
          <Text style={styles.sets}>{exercise.sets}</Text>
          <Text style={styles.setsLabel}>sets</Text>
          <Text style={styles.reps}>{exercise.reps}</Text>
          <Text style={styles.repsLabel}>reps</Text>
        </View>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => openVideo(exercise.name)}
          activeOpacity={0.7}
        >
          <Text style={styles.playIcon}>▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  content: { flex: 1 },
  name: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  muscle: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  notes: { color: Colors.primary, fontSize: 11, marginTop: 3 },
  right: { alignItems: 'center', gap: 8 },
  setsReps: { alignItems: 'center' },
  sets: { color: Colors.text, fontSize: 18, fontWeight: '700', lineHeight: 20 },
  setsLabel: { color: Colors.textSecondary, fontSize: 10 },
  reps: { color: Colors.primary, fontSize: 13, fontWeight: '600', marginTop: 2 },
  repsLabel: { color: Colors.textSecondary, fontSize: 10 },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { color: '#fff', fontSize: 11, marginLeft: 2 },
});
