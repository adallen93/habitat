import type { DayRecord } from '../../types';
import { HABITS } from '../../constants/habits';
import { completionRate, windowRecords, TIME_WINDOWS } from '../../lib/analytics';

interface Props {
  records: Record<string, DayRecord>;
}

const FLAG_THRESHOLD = 50;

export function FlaggedHabitsTable({ records }: Props) {
  const allRecords = Object.values(records);
  const firstRecordDate = Object.keys(records).sort()[0];

  const rows = HABITS.map(habit => {
    const rates = TIME_WINDOWS.map(w =>
      completionRate(windowRecords(allRecords, w.days), habit, firstRecordDate),
    );
    const flagged = rates.some(r => r != null && r < FLAG_THRESHOLD);
    // Sort worst-first by all-time rate (last window); treat null as high so it sinks.
    const sortKey = rates[rates.length - 1] ?? Infinity;
    return { habit, rates, flagged, sortKey };
  })
    .filter(r => r.flagged)
    .sort((a, b) => a.sortKey - b.sortKey);

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-700 p-4">
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Flagged Habits</p>
        <span className="text-[11px] text-stone-600">below {FLAG_THRESHOLD}%</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-stone-500 py-2">
          🎉 Nothing flagged — every habit is at or above {FLAG_THRESHOLD}% in each window.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500">
              <th className="text-left font-medium pb-2">Habit</th>
              {TIME_WINDOWS.map(w => (
                <th key={w.key} className="text-right font-medium pb-2 w-16">{w.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ habit, rates }) => (
              <tr key={habit.id} className="border-t border-stone-800">
                <td className="py-2 pr-2 text-stone-300">{habit.shortLabel}</td>
                {rates.map((rate, i) => (
                  <td key={i} className="py-2 text-right tabular-nums">
                    {rate == null ? (
                      <span className="text-stone-600">—</span>
                    ) : rate < FLAG_THRESHOLD ? (
                      <span className="text-rose-400 font-semibold">{rate}%</span>
                    ) : (
                      <span className="text-stone-400">{rate}%</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
