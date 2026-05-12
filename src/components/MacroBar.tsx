import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export function MacroBar({ label, current, target, unit, color }: MacroBarProps) {
  const progress = Math.min(current / target, 1);
  const percent = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {current}
          <Text style={styles.unit}>/{target}{unit}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

interface TripleMacroProps {
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
}

export function TripleMacroBar({ protein, carbs, fat }: TripleMacroProps) {
  return (
    <View style={styles.tripleContainer}>
      <MacroBar label="Protein" current={protein.current} target={protein.target} unit="g" color={Colors.protein} />
      <MacroBar label="Carbs" current={carbs.current} target={carbs.target} unit="g" color={Colors.carbs} />
      <MacroBar label="Fat" current={fat.current} target={fat.target} unit="g" color={Colors.fat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: Colors.textSecondary, fontSize: 13 },
  value: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  unit: { color: Colors.textSecondary, fontWeight: '400' },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
  tripleContainer: { gap: 2 },
});
