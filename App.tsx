import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { scheduleAllNotifications } from './src/services/notifications';
import { useUserStore } from './src/store/userStore';

export default function App() {
  const { profile, metrics } = useUserStore();

  useEffect(() => {
    if (profile.onboardingComplete && metrics) {
      scheduleAllNotifications(metrics.stepTarget);
    }
  }, [profile.onboardingComplete, metrics?.stepTarget]);

  return (
    <>
      <StatusBar style="light" backgroundColor="#0F1117" />
      <AppNavigator />
    </>
  );
}
