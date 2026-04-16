import type { DayRecord } from '../../types';
import { HABITS } from '../../constants/habits';
import { getLastNDays, formatDisplayDate } from '../../lib/dateUtils';
import { RatingBadge } from '../shared/RatingBadge';

interface Props {
  records: Record<string, DayRecord>;
  onDateClick?: (date: string) => void;
}

export function WeekTable({ records, onDateClick }: Props) {
  const dates = getLastNDays(14);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Last 14 Days</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="text-left px-4 py-2 font-medium text-stone-500 sticky left-0 bg-white min-w-[110px]">Date</th>
              {HABITS.map(h => (
                <th key={h.id} className="px-1.5 py-2 font-medium text-stone-400 whitespace-nowrap" title={h.label}>
                  {h.shortLabel.split(' ')[0]}
                </th>
              ))}
              <th className="px-3 py-2 font-medium text-stone-500 sticky right-0 bg-white">Rating</th>
            </tr>
          </thead>
          <tbody>
            {dates.map(date => {
              const record = records[date];
              return (
                <tr key={date} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-2 sticky left-0 bg-white">
                    <button
                      onClick={() => onDateClick?.(date)}
                      className="text-stone-600 hover:text-amber-600 font-medium transition-colors text-left"
                    >
                      {formatDisplayDate(date)}
                    </button>
                  </td>
                  {HABITS.map(h => {
                    if (!record) {
                      return <td key={h.id} className="px-1.5 py-2 text-center text-stone-300">—</td>;
                    }
                    const done = record.completed.includes(h.id);
                    return (
                      <td key={h.id} className="px-1.5 py-2 text-center" title={h.label}>
                        {done ? (
                          <span className="text-emerald-500">✓</span>
                        ) : (
                          <span className="text-rose-400">✗</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 sticky right-0 bg-white">
                    {record ? (
                      <RatingBadge rating={record.rating} size="sm" />
                    ) : (
                      <span className="text-stone-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
