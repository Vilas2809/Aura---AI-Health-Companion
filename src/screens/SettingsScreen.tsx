import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  cancelAllNotifications,
  scheduleAllNotifications,
} from '../services/notifications';
import { useProgressStore } from '../store/progressStore';
import { useUserStore } from '../store/userStore';
import {
  ActivityLevel,
  Cuisine,
  DietType,
  Equipment,
  FitnessLevel,
  Goal,
  GymDays,
} from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function SettingRow({
  icon,
  label,
  value,
  onPress,
  showArrow = true,
  danger = false,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={[styles.settingLabel, danger && styles.dangerText]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && onPress && <Text style={styles.settingArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function PickerRow<T>({
  icon,
  label,
  options,
  selected,
  onSelect,
}: {
  icon: string;
  label: string;
  options: { label: string; value: T }[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === selected)?.label ?? String(selected);

  return (
    <View>
      <TouchableOpacity style={styles.settingRow} onPress={() => setOpen((v) => !v)}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={styles.settingLabel}>{label}</Text>
        <View style={styles.settingRight}>
          <Text style={styles.settingValue}>{current}</Text>
          <Text style={styles.settingArrow}>{open ? '▲' : '›'}</Text>
        </View>
      </TouchableOpacity>
      {open && (
        <View style={styles.pickerOptions}>
          {options.map((o) => (
            <TouchableOpacity
              key={String(o.value)}
              style={[
                styles.pickerOption,
                selected === o.value && styles.pickerOptionActive,
              ]}
              onPress={() => {
                onSelect(o.value);
                setOpen(false);
              }}
            >
              <Text style={[styles.pickerOptionText, selected === o.value && styles.pickerOptionTextActive]}>
                {o.label}
              </Text>
              {selected === o.value && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, setProfile, resetProfile, metrics } = useUserStore();
  const { clearEntries } = useProgressStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val);
    if (val && metrics) {
      await scheduleAllNotifications(metrics.stepTarget);
    } else {
      await cancelAllNotifications();
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Profile',
      'This will delete all your profile data and progress logs. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProfile();
            clearEntries();
            navigation.replace('Onboarding');
          },
        },
      ]
    );
  };

  const handleClearProgress = () => {
    Alert.alert(
      'Clear Progress',
      'This will delete all your weekly logs. Your profile will remain.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearEntries() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your profile and preferences</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {profile.gender === 'male' ? '♂' : '♀'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile.age}y • {profile.weight}kg • {profile.height}cm
            </Text>
            <Text style={styles.profileGoal}>
              {profile.goal === 'cut' ? '🔥 Fat Loss' : profile.goal === 'bulk' ? '💪 Muscle Gain' : '⚖️ Maintenance'} •{' '}
              {profile.cuisine.replace('_', ' ')} cuisine
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('GoalDiagnosis')}
          >
            <Text style={styles.editBtnText}>View Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Goal & calorie */}
        <SettingSection title="GOAL & CALORIES">
          <PickerRow
            icon="🎯"
            label="Goal"
            options={[
              { label: '🔥 Lose Fat (Cut)', value: 'cut' as Goal },
              { label: '⚖️ Maintain', value: 'maintain' as Goal },
              { label: '💪 Build Muscle (Bulk)', value: 'bulk' as Goal },
            ]}
            selected={profile.goal}
            onSelect={(v) => setProfile({ goal: v })}
          />
          <PickerRow
            icon="🏃"
            label="Activity Level"
            options={[
              { label: 'Sedentary', value: 'sedentary' as ActivityLevel },
              { label: 'Light (1–3 days/wk)', value: 'light' as ActivityLevel },
              { label: 'Moderate (3–5 days/wk)', value: 'moderate' as ActivityLevel },
              { label: 'Active (6–7 days/wk)', value: 'active' as ActivityLevel },
              { label: 'Athlete (twice daily)', value: 'athlete' as ActivityLevel },
            ]}
            selected={profile.activityLevel}
            onSelect={(v) => setProfile({ activityLevel: v })}
          />
        </SettingSection>

        {/* Diet */}
        <SettingSection title="DIET PREFERENCES">
          <PickerRow
            icon="🥗"
            label="Diet Type"
            options={[
              { label: 'No Restriction', value: 'any' as DietType },
              { label: 'Vegetarian', value: 'veg' as DietType },
              { label: 'Vegan', value: 'vegan' as DietType },
            ]}
            selected={profile.dietType}
            onSelect={(v) => setProfile({ dietType: v })}
          />
          <PickerRow
            icon="🌍"
            label="Cuisine"
            options={[
              { label: '🌍 Balanced', value: 'balanced' as Cuisine },
              { label: '🫓 Indian', value: 'indian' as Cuisine },
              { label: '🫒 Mediterranean', value: 'mediterranean' as Cuisine },
              { label: '🍜 Asian', value: 'asian' as Cuisine },
              { label: '🥩 Western', value: 'western' as Cuisine },
              { label: '🧆 Middle Eastern', value: 'middle_eastern' as Cuisine },
              { label: '🌮 Mexican', value: 'mexican' as Cuisine },
              { label: '🍱 Japanese', value: 'japanese' as Cuisine },
            ]}
            selected={profile.cuisine}
            onSelect={(v) => setProfile({ cuisine: v })}
          />
        </SettingSection>

        {/* Fitness */}
        <SettingSection title="FITNESS">
          <PickerRow
            icon="📅"
            label="Gym Days / Week"
            options={([3, 4, 5, 6] as GymDays[]).map((d) => ({ label: `${d} days/week`, value: d }))}
            selected={profile.gymDays}
            onSelect={(v) => setProfile({ gymDays: v })}
          />
          <PickerRow
            icon="🏋️"
            label="Fitness Level"
            options={[
              { label: 'Beginner (< 1 year)', value: 'beginner' as FitnessLevel },
              { label: 'Intermediate (1–3 years)', value: 'intermediate' as FitnessLevel },
              { label: 'Advanced (3+ years)', value: 'advanced' as FitnessLevel },
            ]}
            selected={profile.fitnessLevel}
            onSelect={(v) => setProfile({ fitnessLevel: v })}
          />
          <PickerRow
            icon="🏠"
            label="Equipment"
            options={[
              { label: '🏋️ Full Gym', value: 'full_gym' as Equipment },
              { label: '🏠 Home Dumbbells', value: 'home_dumbbells' as Equipment },
              { label: '🤸 Bodyweight Only', value: 'bodyweight' as Equipment },
            ]}
            selected={profile.equipment}
            onSelect={(v) => setProfile({ equipment: v })}
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="NOTIFICATIONS">
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingLabel}>Smart Nudges</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <SettingRow
            icon="⏰"
            label="Midday step check (12 PM)"
            value="12:00"
            showArrow={false}
          />
          <SettingRow
            icon="🌇"
            label="Evening reminder (7 PM)"
            value="19:00"
            showArrow={false}
          />
          <SettingRow
            icon="☀️"
            label="Morning celebration (6 AM)"
            value="6:00"
            showArrow={false}
          />
        </SettingSection>

        {/* Integrations */}
        <SettingSection title="HEALTH INTEGRATIONS">
          <SettingRow
            icon="❤️"
            label="Apple HealthKit"
            value="iOS only"
            onPress={() => Alert.alert('Apple HealthKit', 'Open iPhone Settings > Privacy > Health > Aura to manage permissions.')}
          />
          <SettingRow
            icon="🤖"
            label="Google Health Connect"
            value="Android only"
            onPress={() => Alert.alert('Health Connect', 'Open the Health Connect app on your Android device to manage permissions.')}
          />
          <SettingRow
            icon="⌚"
            label="Fitbit"
            value="Coming soon"
            showArrow={false}
          />
          <SettingRow
            icon="💍"
            label="Oura Ring"
            value="Coming soon"
            showArrow={false}
          />
        </SettingSection>

        {/* About */}
        <SettingSection title="ABOUT">
          <SettingRow icon="🤖" label="AI Model" value="Claude Sonnet 4.6" showArrow={false} />
          <SettingRow icon="📊" label="Nutrition data" value="IFCT + USDA" showArrow={false} />
          <SettingRow icon="ℹ️" label="App version" value="1.0.0" showArrow={false} />
        </SettingSection>

        {/* Danger zone */}
        <SettingSection title="DATA">
          <SettingRow icon="🗑️" label="Clear Progress Logs" onPress={handleClearProgress} />
          <SettingRow icon="🔄" label="Reset Profile & Restart" onPress={handleReset} danger />
        </SettingSection>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 3 },
  profileCard: {
    margin: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: { fontSize: 24, color: Colors.primary },
  profileInfo: { flex: 1 },
  profileName: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  profileGoal: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  editBtn: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  editBtnText: { color: Colors.primary, fontSize: 12, fontWeight: '600' },
  sectionBlock: { paddingHorizontal: 16, marginBottom: 16 },
  sectionLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  settingIcon: { fontSize: 18, width: 26 },
  settingLabel: { flex: 1, color: Colors.text, fontSize: 14 },
  dangerText: { color: Colors.error },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { color: Colors.textSecondary, fontSize: 13 },
  settingArrow: { color: Colors.textMuted, fontSize: 18 },
  pickerOptions: { backgroundColor: Colors.surfaceAlt, borderTopWidth: 1, borderTopColor: Colors.border },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 52,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionActive: { backgroundColor: Colors.primaryGlow },
  pickerOptionText: { flex: 1, color: Colors.textSecondary, fontSize: 14 },
  pickerOptionTextActive: { color: Colors.primary, fontWeight: '600' },
  checkmark: { color: Colors.primary, fontSize: 16 },
});
