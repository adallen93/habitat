import { useMemo } from 'react';
import type { DayRecord } from '../types';
import { todayString, formatDate } from '../lib/dateUtils';

export function useStreaks(records: Record<string, DayRecord>) {
  return useMemo(() => {
    const sortedDates = Object.keys(records).sort();
    const today = todayString();

    // Current streak: walk backwards from yesterday (or today if submitted)
    let currentStreak = 0;
    const checkDate = new Date();
    // If today has a non-Miss record, start from today; else start from yesterday
    const todayRecord = records[today];
    if (!todayRecord || todayRecord.effectiveScore < 12) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const dateStr = formatDate(checkDate);
      const rec = records[dateStr];
      if (!rec || rec.effectiveScore < 12) break;
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Best streak: walk through all recorded dates
    let bestStreak = 0;
    let runningStreak = 0;
    let prevDate: Date | null = null;

    for (const dateStr of sortedDates) {
      const rec = records[dateStr];
      const d = new Date(dateStr + 'T00:00:00');

      if (prevDate) {
        const diff = (d.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff > 1) {
          // Gap in dates — reset
          runningStreak = 0;
        }
      }

      if (rec.effectiveScore >= 12) {
        runningStreak++;
        bestStreak = Math.max(bestStreak, runningStreak);
      } else {
        runningStreak = 0;
      }

      prevDate = d;
    }

    return { currentStreak, bestStreak };
  }, [records]);
}
