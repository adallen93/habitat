import type { DayRecord } from '../../types';

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
    </div>
  );
}
