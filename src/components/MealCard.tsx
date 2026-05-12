import React, { useState } from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Meal } from '../types';

interface Props {
  meal: Meal;
  targetCalories: number;
}

export function MealCard({ meal, targetCalories }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  const percent = Math.round((meal.totalCalories / targetCalories) * 100);

  return (
    <TouchableOpacity style={styles.card} onPress={toggle} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.emoji}>{meal.emoji}</Text>
          <View>
            <Text style={styles.name}>{meal.name}</Text>
            <Text style={styles.time}>{meal.time}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.calories}>{meal.totalCalories} kcal</Text>
          <Text style={styles.percent}>{percent}% of day</Text>
        </View>
      </View>

      <View style={styles.macroRow}>
        <MacroChip label="P" value={meal.totalProtein} color={Colors.protein} />
        <MacroChip label="C" value={meal.totalCarbs} color={Colors.carbs} />
        <MacroChip label="F" value={meal.totalFat} color={Colors.fat} />
      </View>

      {expanded && (
        <View style={styles.items}>
          {meal.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.quantity}</Text>
              </View>
              <Text style={styles.itemCal}>{item.calories} kcal</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.chevron}>{expanded ? '▲ Less' : '▼ See items'}</Text>
    </TouchableOpacity>
  );
}

function MacroChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.chip, { borderColor: color + '50' }]}>
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
      <Text style={styles.chipValue}>{value}g</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emoji: { fontSize: 28 },
  name: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  time: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  calories: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  percent: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  macroRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  chipLabel: { fontSize: 11, fontWeight: '700' },
  chipValue: { color: Colors.textSecondary, fontSize: 11 },
  items: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  itemLeft: { flex: 1 },
  itemName: { color: Colors.text, fontSize: 13 },
  itemQty: { color: Colors.textSecondary, fontSize: 11, marginTop: 1 },
  itemCal: { color: Colors.textSecondary, fontSize: 12 },
  chevron: { color: Colors.primary, fontSize: 12, textAlign: 'center', marginTop: 4 },
});
