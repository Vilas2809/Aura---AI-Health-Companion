import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  message: string;
  loading?: boolean;
  category?: string;
  compact?: boolean;
}

export function AICoachCard({ message, loading = false, category, compact = false }: Props) {
  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>V</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.name}>Aura Coach</Text>
          {category && <Text style={styles.category}>{category}</Text>}
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={Colors.primary} size="small" />
          <Text style={styles.loadingText}>Generating insight…</Text>
        </View>
      ) : (
        <Text style={styles.message}>{message}</Text>
      )}
      <View style={styles.footer}>
        <View style={styles.dot} />
        <Text style={styles.footerText}>Powered by Groq · Llama 3.3 70B</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    marginBottom: 12,
  },
  compact: { padding: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  category: {
    color: Colors.primary,
    fontSize: 11,
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  message: { color: Colors.text, fontSize: 14, lineHeight: 21, marginBottom: 10 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  loadingText: { color: Colors.textSecondary, fontSize: 13 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  footerText: { color: Colors.textMuted, fontSize: 11 },
});
