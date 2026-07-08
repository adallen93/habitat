import type { DayRecord, Habit } from '../types';
import { getLastNDays } from './dateUtils';

export type TimeWindow = '2wk' | '30d' | 'all';

export const TIME_WINDOWS: { key: TimeWindow; label: string; days: number | null }[] = [
  { key: '2wk', label: '2wk', days: 14 },
  { key: '30d', label: '30d', days: 30 },
  { key: 'all', label: 'All time', days: null },
];

/** Records falling within the last `days` calendar days, or all records when `days` is null. */
export function windowRecords(all: DayRecord[], days: number | null): DayRecord[] {
  if (days == null) return all;
  const set = new Set(getLastNDays(days));
  return all.filter(r => set.has(r.date));
}

/**
 * Completion rate (0–100, rounded) for a habit over the given records, restricted to days on or
 * after the habit's effective start date. Returns null when there are no eligible days.
 */
export function completionRate(
  records: DayRecord[],
  habit: Habit,
  firstRecordDate: string | undefined,
): number | null {
  const start = habit.createdDate ?? firstRecordDate;
  const eligible = start ? records.filter(r => r.date >= start) : records;
  if (eligible.length === 0) return null;
  const done = eligible.filter(r => r.completed.includes(habit.id)).length;
  return Math.round((done / eligible.length) * 100);
}

/** A distinct palette cycled across habit lines/series. */
export const HABIT_COLORS = [
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#ef4444', // red
  '#14b8a6', // teal
  '#eab308', // yellow
  '#6366f1', // indigo
  '#f97316', // orange
  '#06b6d4', // cyan
  '#a855f7', // purple
];

export function habitColor(index: number): string {
  return HABIT_COLORS[index % HABIT_COLORS.length];
}
