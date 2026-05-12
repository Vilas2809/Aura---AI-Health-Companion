import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Goal, GoalConflict } from '../types';

interface Props {
  conflict: GoalConflict;
  onSwitch: (goal: Goal) => void;
  onIgnore: () => void;
}

export function ConflictWarning({ conflict, onSwitch, onIgnore }: Props) {
  const isUnderweight = conflict.type === 'cut_underweight';

  return (
    <View style={styles.card}>
      <View style={styles.iconRow}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>
          {isUnderweight ? 'Goal Conflict Detected' : 'Consider Body Recomposition'}
        </Text>
      </View>
      <Text style={styles.message}>{conflict.message}</Text>
      <Text style={styles.recommendation}>
        We recommend switching to{' '}
        <Text style={styles.highlight}>
          {conflict.recommendation === 'bulk' ? 'Bulk' : conflict.recommendation === 'maintain' ? 'Maintain / Recomp' : 'Maintain'}
        </Text>{' '}
        instead.
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => onSwitch(conflict.recommendation)}
        >
          <Text style={styles.primaryBtnText}>
            Switch to {conflict.recommendation === 'bulk' ? 'Bulk' : 'Maintain'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostBtn} onPress={onIgnore}>
          <Text style={styles.ghostBtnText}>Keep my goal anyway</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.warningDim,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.warning + '60',
    marginBottom: 16,
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  icon: { fontSize: 20 },
  title: { color: Colors.warning, fontSize: 15, fontWeight: '700' },
  message: { color: Colors.text, fontSize: 13, lineHeight: 20, marginBottom: 8 },
  recommendation: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 14 },
  highlight: { color: Colors.warning, fontWeight: '600' },
  buttons: { gap: 8 },
  primaryBtn: {
    backgroundColor: Colors.warning,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#000', fontSize: 14, fontWeight: '700' },
  ghostBtn: { padding: 10, alignItems: 'center' },
  ghostBtnText: { color: Colors.textSecondary, fontSize: 13 },
});
