import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleMidDayNudge(stepTarget: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('midday-nudge').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'midday-nudge',
    content: {
      title: "Halfway there? 👟",
      body: `Check your steps — you need ${Math.round(stepTarget / 2).toLocaleString()} by noon to stay on track.`,
      data: { screen: 'Steps' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });
}

export async function scheduleEveningReminder(stepTarget: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('evening-reminder').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'evening-reminder',
    content: {
      title: "Evening step check 🌇",
      body: `Not quite at your ${stepTarget.toLocaleString()} step goal yet. A 25-min walk will close the gap.`,
      data: { screen: 'Steps' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0,
    },
  });
}

export async function scheduleMorningCelebration(streak: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('morning-celebration').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'morning-celebration',
    content: {
      title: `${streak}-day streak! 🔥`,
      body: "You crushed yesterday's step goal. Keep the streak alive today!",
      data: { screen: 'Dashboard' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}

export async function sendImmediateStepNudge(currentSteps: number, goal: number): Promise<void> {
  const remaining = goal - currentSteps;
  const walkMinutes = Math.round(remaining / 100);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Step it up! 🚶",
      body: `${remaining.toLocaleString()} steps to go. About ${walkMinutes} min of walking will do it.`,
      data: { screen: 'Steps' },
    },
    trigger: null,
  });
}

export async function scheduleAllNotifications(stepTarget: number): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('aura-default', {
      name: 'Aura',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  await scheduleMidDayNudge(stepTarget);
  await scheduleEveningReminder(stepTarget);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
