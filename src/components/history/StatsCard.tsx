import type { DayRecord } from '../../types';
import { HABITS } from '../../constants/habits';

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

  // Most missed habit
  let mostMissed = '—';
  if (totalDays > 0) {
    let lowestRate = Infinity;
    let lowestHabit = '';
    for (const habit of HABITS) {
      const completions = allRecords.filter(r => r.completed.includes(habit.id)).length;
      const rate = completions / totalDays;
      if (rate < lowestRate) {
        lowestRate = rate;
        lowestHabit = habit.shortLabel;
      }
    }
    mostMissed = lowestHabit;
  }

  const stats = [
    { label: 'Days Logged', value: String(totalDays), icon: '📅' },
    { label: 'Avg Score', value: avgScore, icon: '📊' },
    { label: 'Current Streak', value: `${currentStreak}d`, icon: '🔥' },
    { label: 'Best Streak', value: `${bestStreak}d`, icon: '🏆' },
    { label: 'Most Missed', value: mostMissed, icon: '⚠️', wide: true },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Overview</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.filter(s => !s.wide).map(s => (
          <div key={s.label} className="bg-stone-50 rounded-xl p-3">
            <p className="text-xs text-stone-400 mb-1">{s.label}</p>
            <p className="text-xl font-bold text-stone-800">{s.value}</p>
          </div>
        ))}
      </div>
      {totalDays > 0 && (
        <div className="mt-3 bg-rose-50 rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs text-rose-600 font-medium">Most often missed</span>
          <span className="text-sm font-semibold text-rose-700">{mostMissed}</span>
        </div>
      )}
    </div>
  );
}
