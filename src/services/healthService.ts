import { WearableData } from '../types';

// Health package integration is pending a native build with HealthKit / Health Connect.
// These stubs allow the app to build and run, showing demo data on the Recovery screen.

export async function fetchWearableData(): Promise<WearableData | null> {
  return null;
}

export function isHealthAvailable(): boolean {
  return false;
}
