import type { DayRecord } from '../../types';
import { HABITS } from '../../constants/habits';
import { getLastNDays } from '../../lib/dateUtils';

interface Props {
  records: Record<string, DayRecord>;
  currentStreak: number;
  bestStreak: number;
}

export function StatsCard({ records, currentStreak, bestStreak }: Props) {
  const allRecords = Object.values(records);
  const totalDays = allRecords.length;

  const avgScore = totalDays > 0
    ? (allRecords.reduce((sum, r) => sum + r.effectiveScore, 0) / totalDays).toFixed(1)
    : '—';

  function computeMostMissed(days: DayRecord[]): string {
    if (days.length === 0) return '—';
    let lowestRate = Infinity;
    let lowestHabit = '';
    for (const habit of HABITS) {
      const completions = days.filter(r => r.completed.includes(habit.id)).length;
      const rate = completions / days.length;
      if (rate < lowestRate) {
        lowestRate = rate;
        lowestHabit = habit.shortLabel;
      }
    }
    return lowestHabit;
  }

  const mostMissed = computeMostMissed(allRecords);

  const recentDates = new Set(getLastNDays(14));
  const recentRecords = allRecords.filter(r => recentDates.has(r.date));
  const mostMissed2wk = recentRecords.length >= 2 ? computeMostMissed(recentRecords) : null;

  const stats = [
    { label: 'Days Logged', value: String(totalDays) },
    { label: 'Avg Score', value: avgScore },
    { label: 'Current Streak', value: `${currentStreak}d` },
    { label: 'Best Streak', value: `${bestStreak}d` },
  ];

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-700 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Overview</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="bg-stone-800 rounded-xl p-3">
            <p className="text-xs text-stone-500 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-stone-100">{s.value}</p>
          </div>
        ))}
      </div>
      {totalDays > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="bg-rose-950 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs text-rose-400 font-medium">Most missed (all time)</span>
            <span className="text-sm font-semibold text-rose-300">{mostMissed}</span>
          </div>
          {mostMissed2wk && (
            <div className="bg-rose-950 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-rose-400 font-medium">Most missed (2 weeks)</span>
              <span className="text-sm font-semibold text-rose-300">{mostMissed2wk}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
