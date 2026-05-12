import { Platform } from 'react-native';
import { WearableData } from '../types';

// ─── iOS HealthKit ────────────────────────────────────────────────────────────
async function fetchFromHealthKit(): Promise<WearableData | null> {
  try {
    const AppleHealthKit = require('react-native-health').default;

    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.HeartRateVariabilitySDNN,
          AppleHealthKit.Constants.Permissions.RestingHeartRate,
          AppleHealthKit.Constants.Permissions.SleepAnalysis,
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.StepCount,
        ],
        write: [],
      },
    };

    await new Promise<void>((resolve, reject) => {
      AppleHealthKit.initHealthKit(permissions, (err: string) => {
        if (err) reject(new Error(err));
        else resolve();
      });
    });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const options = {
      startDate: yesterday.toISOString(),
      endDate: new Date().toISOString(),
      limit: 10,
      ascending: false,
    };

    // HRV
    const hrv = await new Promise<number | undefined>((resolve) => {
      AppleHealthKit.getHeartRateVariabilitySamples(options, (err: string, results: any[]) => {
        if (err || !results?.length) { resolve(undefined); return; }
        const avg = results.reduce((s, r) => s + r.value, 0) / results.length;
        resolve(Math.round(avg));
      });
    });

    // Resting HR
    const restingHeartRate = await new Promise<number | undefined>((resolve) => {
      AppleHealthKit.getRestingHeartRate(options, (err: string, result: any) => {
        if (err || !result?.value) { resolve(undefined); return; }
        resolve(Math.round(result.value));
      });
    });

    // Sleep
    const { sleepEfficiency, sleepDuration } = await new Promise<{ sleepEfficiency?: number; sleepDuration?: number }>((resolve) => {
      AppleHealthKit.getSleepSamples(options, (err: string, results: any[]) => {
        if (err || !results?.length) { resolve({}); return; }
        const asleep = results.filter((r) => r.value === 'ASLEEP' || r.value === 'CORE' || r.value === 'DEEP' || r.value === 'REM');
        const inBed = results.filter((r) => r.value === 'INBED');
        const asleepMins = asleep.reduce((s, r) => {
          const diff = (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 60000;
          return s + diff;
        }, 0);
        const inBedMins = inBed.reduce((s, r) => {
          const diff = (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 60000;
          return s + diff;
        }, 0);
        resolve({
          sleepDuration: Math.round((asleepMins / 60) * 10) / 10,
          sleepEfficiency: inBedMins > 0 ? Math.round((asleepMins / inBedMins) * 100) : undefined,
        });
      });
    });

    // Current heart rate
    const heartRate = await new Promise<number | undefined>((resolve) => {
      AppleHealthKit.getHeartRateSamples(options, (err: string, results: any[]) => {
        if (err || !results?.length) { resolve(undefined); return; }
        resolve(Math.round(results[0].value));
      });
    });

    return { hrv, restingHeartRate, sleepEfficiency, sleepDuration, heartRate };
  } catch {
    return null;
  }
}

// ─── Android Health Connect ───────────────────────────────────────────────────
async function fetchFromHealthConnect(): Promise<WearableData | null> {
  try {
    const {
      initialize,
      requestPermission,
      readRecords,
      getSdkStatus,
      SdkAvailabilityStatus,
    } = require('react-native-health-connect');

    const status = await getSdkStatus();
    if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) return null;

    await initialize();

    await requestPermission([
      { accessType: 'read', recordType: 'HeartRateVariabilitySdnn' },
      { accessType: 'read', recordType: 'RestingHeartRate' },
      { accessType: 'read', recordType: 'SleepSession' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'Steps' },
    ]);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const timeRangeFilter = {
      operator: 'between',
      startTime: yesterday.toISOString(),
      endTime: new Date().toISOString(),
    };

    // HRV
    let hrv: number | undefined;
    try {
      const { records } = await readRecords('HeartRateVariabilitySdnn', { timeRangeFilter });
      if (records.length) {
        const avg = records.reduce((s: number, r: any) => s + r.heartRateVariabilityMillis, 0) / records.length;
        hrv = Math.round(avg);
      }
    } catch {}

    // Resting HR
    let restingHeartRate: number | undefined;
    try {
      const { records } = await readRecords('RestingHeartRate', { timeRangeFilter });
      if (records.length) restingHeartRate = Math.round(records[records.length - 1].beatsPerMinute);
    } catch {}

    // Sleep
    let sleepEfficiency: number | undefined;
    let sleepDuration: number | undefined;
    try {
      const { records } = await readRecords('SleepSession', { timeRangeFilter });
      if (records.length) {
        const session = records[records.length - 1] as any;
        const totalMins = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000;
        const asleepMins = session.stages
          ?.filter((s: any) => [2, 3, 4, 5].includes(s.stage))
          .reduce((sum: number, s: any) => sum + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000, 0) ?? totalMins * 0.85;
        sleepDuration = Math.round((asleepMins / 60) * 10) / 10;
        sleepEfficiency = Math.round((asleepMins / totalMins) * 100);
      }
    } catch {}

    // Heart rate
    let heartRate: number | undefined;
    try {
      const { records } = await readRecords('HeartRate', { timeRangeFilter });
      if (records.length) {
        const last = records[records.length - 1] as any;
        heartRate = Math.round(last.samples?.[0]?.beatsPerMinute ?? last.beatsPerMinute);
      }
    } catch {}

    return { hrv, restingHeartRate, sleepEfficiency, sleepDuration, heartRate };
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function fetchWearableData(): Promise<WearableData | null> {
  if (Platform.OS === 'ios') return fetchFromHealthKit();
  if (Platform.OS === 'android') return fetchFromHealthConnect();
  return null;
}

export function isHealthAvailable(): boolean {
  try {
    if (Platform.OS === 'ios') {
      require('react-native-health');
      return true;
    }
    if (Platform.OS === 'android') {
      require('react-native-health-connect');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
