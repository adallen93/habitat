import { useState } from 'react';
import type { DayRecord } from '../../types';
import { getDaysInMonth, getFirstDayOfWeek, formatMonthYear, todayString, isFuture } from '../../lib/dateUtils';

interface Props {
  records: Record<string, DayRecord>;
  onDateClick?: (date: string) => void;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getCellClass(record: DayRecord | undefined, date: string): string {
  if (isFuture(date)) return 'bg-stone-800 text-stone-700 cursor-default';
  if (!record) return 'bg-stone-800 text-stone-500 hover:bg-stone-700 cursor-pointer';
  switch (record.rating) {
    case 'Miss': return 'bg-rose-950 text-rose-400 hover:bg-rose-900 cursor-pointer';
    case 'Pass': return 'bg-amber-950 text-amber-400 hover:bg-amber-900 cursor-pointer';
    case 'Good': return 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900 cursor-pointer';
    case 'Excellent': return 'bg-emerald-500 text-stone-900 hover:bg-emerald-400 cursor-pointer font-bold';
  }
}

export function CalendarHeatmap({ records, onDateClick }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const days = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const todayStr = todayString();

  function prev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Calendar</p>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-1 rounded-lg hover:bg-stone-800 text-stone-500 hover:text-stone-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-stone-300 min-w-[120px] text-center">
            {formatMonthYear(year, month)}
          </span>
          <button onClick={next} className="p-1 rounded-lg hover:bg-stone-800 text-stone-500 hover:text-stone-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-stone-600 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(date => {
          const record = records[date];
          const isToday = date === todayStr;
          const future = isFuture(date);
          const cellClass = getCellClass(record, date);
          const dayNum = parseInt(date.split('-')[2]);

          return (
            <button
              key={date}
              onClick={() => !future && onDateClick?.(date)}
              disabled={future}
              title={record ? `${date}: ${record.rating} (${record.effectiveScore}/16)` : date}
              className={`
                aspect-square flex items-center justify-center text-xs rounded-lg font-medium
                transition-all duration-100
                ${cellClass}
                ${isToday ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-900' : ''}
              `}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-stone-800">
        {[
          { color: 'bg-stone-700', label: 'No record' },
          { color: 'bg-rose-950 border border-rose-800', label: 'Miss' },
          { color: 'bg-amber-950 border border-amber-800', label: 'Pass' },
          { color: 'bg-emerald-950 border border-emerald-800', label: 'Good' },
          { color: 'bg-emerald-500', label: 'Excellent' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${item.color}`} />
            <span className="text-xs text-stone-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
