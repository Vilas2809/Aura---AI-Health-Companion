import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

export interface StepCounterState {
  steps: number;
  isPedometerAvailable: boolean;
  error: string | null;
}

export function useStepCounter(enabled: boolean = true): StepCounterState {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<ReturnType<typeof Pedometer.watchStepCount> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const getStartOfDay = (): Date => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const loadHistoricalSteps = useCallback(async () => {
    if (Platform.OS === 'web') return;
    try {
      const available = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(available);
      if (!available) {
        setError('Step counter not available on this device.');
        return;
      }
      const result = await Pedometer.getStepCountAsync(getStartOfDay(), new Date());
      setSteps(result.steps);
    } catch (e) {
      setError('Could not load step data.');
    }
  }, []);

  const startLiveTracking = useCallback(() => {
    if (Platform.OS === 'web') return;
    if (subscriptionRef.current) return;
    subscriptionRef.current = Pedometer.watchStepCount((result) => {
      setSteps((prev) => prev + result.steps);
    });
  }, []);

  const stopLiveTracking = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    loadHistoricalSteps();
    startLiveTracking();

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        loadHistoricalSteps();
        startLiveTracking();
      } else if (nextState.match(/inactive|background/)) {
        stopLiveTracking();
      }
      appStateRef.current = nextState;
    });

    return () => {
      stopLiveTracking();
      subscription.remove();
    };
  }, [enabled, loadHistoricalSteps, startLiveTracking, stopLiveTracking]);

  return { steps, isPedometerAvailable, error };
}
