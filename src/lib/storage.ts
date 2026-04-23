import type { HabitatStore, DayRecord, HabitId } from '../types';
import { computeScore } from './scoring';
import { HABIT_MAP } from '../constants/habits';

const STORAGE_KEY = 'habitat_records';
const CURRENT_VERSION = 1;

function getEmptyStore(): HabitatStore {
  return { version: CURRENT_VERSION, records: {} };
}

export function loadStore(): HabitatStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyStore();
    const parsed = JSON.parse(raw) as HabitatStore;
    if (parsed.version !== CURRENT_VERSION) return getEmptyStore();
    return parsed;
  } catch {
    return getEmptyStore();
  }
}

export function saveStore(store: HabitatStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function saveRecord(date: string, completed: HabitId[]): DayRecord {
  const store = loadStore();
  const cleanedCompleted = completed.filter(id => id in HABIT_MAP);
  const { score, effectiveScore, rating } = computeScore(cleanedCompleted as HabitId[], date);
  const record: DayRecord = {
    date,
    completed: cleanedCompleted as HabitId[],
    score,
    effectiveScore,
    rating,
    submittedAt: new Date().toISOString(),
  };
  store.records[date] = record;
  saveStore(store);
  return record;
}

export function getRecord(date: string): DayRecord | null {
  const store = loadStore();
  return store.records[date] ?? null;
}

export function getAllRecords(): Record<string, DayRecord> {
  return loadStore().records;
}

export function exportJson(): string {
  return JSON.stringify(loadStore(), null, 2);
}

export function importJson(json: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(json) as HabitatStore;
    if (!parsed.version || !parsed.records) {
      return { success: false, message: 'Invalid backup file format.' };
    }
    saveStore({ version: CURRENT_VERSION, records: parsed.records });
    return { success: true, message: 'Data imported successfully.' };
  } catch {
    return { success: false, message: 'Could not parse backup file.' };
  }
}
