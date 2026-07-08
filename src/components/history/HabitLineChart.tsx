import { useState } from 'react';
import type { DayRecord, HabitId } from '../../types';
import { HABITS } from '../../constants/habits';
import { formatDisplayDate } from '../../lib/dateUtils';
import { completionRate, windowRecords, habitColor, TIME_WINDOWS, type TimeWindow } from '../../lib/analytics';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface Props {
  records: Record<string, DayRecord>;
}

// Number of trailing logged days averaged into each point (smooths the 0/1 daily signal).
const ROLL = 7;

const colorByHabit = Object.fromEntries(HABITS.map((h, i) => [h.id, habitColor(i)])) as Record<HabitId, string>;

export function HabitLineChart({ records }: Props) {
  const allRecords = Object.values(records);
  const firstRecordDate = Object.keys(records).sort()[0];

  // Default: watch the three lowest all-time completion habits.
  const [selected, setSelected] = useState<Set<HabitId>>(() => {
    const ranked = HABITS
      .map(h => ({ id: h.id, rate: completionRate(allRecords, h, firstRecordDate) ?? 100 }))
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3)
      .map(h => h.id);
    return new Set(ranked);
  });
  const [windowKey, setWindowKey] = useState<TimeWindow>('30d');

  if (allRecords.length === 0) return null;

  const days = TIME_WINDOWS.find(w => w.key === windowKey)!.days;
  const windowDates = new Set(windowRecords(allRecords, days).map(r => r.date));
  const sorted = allRecords.slice().sort((a, b) => a.date.localeCompare(b.date));

  // Trailing rolling completion rate, computed across all history so window-start points are warm.
  const buffers: Record<string, number[]> = {};
  HABITS.forEach(h => (buffers[h.id] = []));

  const data: Record<string, number | null | string>[] = [];
  for (const rec of sorted) {
    const row: Record<string, number | null | string> = { date: rec.date };
    for (const habit of HABITS) {
      const start = habit.createdDate ?? firstRecordDate;
      if (start && rec.date < start) {
        row[habit.id] = null;
        continue;
      }
      const buf = buffers[habit.id];
      buf.push(rec.completed.includes(habit.id) ? 1 : 0);
      if (buf.length > ROLL) buf.shift();
      row[habit.id] = Math.round((buf.reduce((a, b) => a + b, 0) / buf.length) * 100);
    }
    if (windowDates.has(rec.date)) data.push(row);
  }

  const selectedIds = HABITS.filter(h => selected.has(h.id)).map(h => h.id);

  function toggle(id: HabitId) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-700 p-4">
      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
        <div className="flex items-baseline gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Completion Trend</p>
          <span className="text-[10px] uppercase tracking-wider text-stone-600 bg-stone-800 rounded px-1.5 py-0.5">
            experimental
          </span>
        </div>
        <div className="flex gap-1">
          {TIME_WINDOWS.map(w => (
            <button
              key={w.key}
              onClick={() => setWindowKey(w.key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                windowKey === w.key
                  ? 'bg-amber-400 border-amber-400 text-stone-900'
                  : 'bg-transparent border-stone-700 text-stone-400'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-stone-600 mb-3">{ROLL}-day rolling completion rate</p>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#44403c" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#78716c' }}
            tickFormatter={d => formatDisplayDate(d as string).replace(/^\w+, /, '')}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 11, fill: '#57534e' }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            width={38}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-stone-800 border border-stone-600 rounded-xl shadow-xl p-3 text-xs">
                  <p className="font-semibold text-stone-300 mb-2">{formatDisplayDate(label as string)}</p>
                  <div className="space-y-1">
                    {payload
                      .filter(p => p.value != null)
                      .map(p => (
                        <div key={p.dataKey as string} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-stone-400">{HABITS.find(h => h.id === p.dataKey)?.shortLabel}:</span>
                          <span className="font-medium text-stone-200">{p.value as number}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              );
            }}
          />
          {selectedIds.map(id => (
            <Line
              key={id}
              type="monotone"
              dataKey={id}
              stroke={colorByHabit[id]}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {selectedIds.length === 0 && (
        <p className="text-center text-sm text-stone-500 py-2">Select habits below to plot their trend.</p>
      )}

      {/* Habit selector chips */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {HABITS.map(habit => {
          const on = selected.has(habit.id);
          return (
            <button
              key={habit.id}
              onClick={() => toggle(habit.id)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                on ? 'border-stone-500 text-stone-100' : 'border-stone-800 text-stone-500 hover:text-stone-300'
              }`}
              style={on ? { backgroundColor: `${colorByHabit[habit.id]}22` } : undefined}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: on ? colorByHabit[habit.id] : '#44403c' }}
              />
              {habit.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
