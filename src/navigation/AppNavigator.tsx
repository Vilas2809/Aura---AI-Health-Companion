import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';
import { DashboardScreen } from '../screens/DashboardScreen';
import { DailySummaryScreen } from '../screens/DailySummaryScreen';
import { GoalDiagnosisScreen } from '../screens/GoalDiagnosisScreen';
import { MealPlanScreen } from '../screens/MealPlanScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ProgressTrackerScreen } from '../screens/ProgressTrackerScreen';
import { RecoveryScreen } from '../screens/RecoveryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StepsScreen } from '../screens/StepsScreen';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { useUserStore } from '../store/userStore';

export type RootStackParamList = {
  Onboarding: undefined;
  GoalDiagnosis: undefined;
  Main: undefined;
  Steps: undefined;
  DailySummary: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Meals: undefined;
  Workout: undefined;
  Recovery: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{icon}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Meals"
        component={MealPlanScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🍛" focused={focused} /> }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="💪" focused={focused} /> }}
      />
      <Tab.Screen
        name="Recovery"
        component={RecoveryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="❤️" focused={focused} /> }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressTrackerScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📈" focused={focused} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const onboardingComplete = useUserStore((s) => s.profile.onboardingComplete);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'fade' }}
        initialRouteName={onboardingComplete ? 'Main' : 'Onboarding'}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="GoalDiagnosis" component={GoalDiagnosisScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Steps"
          component={StepsScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="DailySummary"
          component={DailySummaryScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
