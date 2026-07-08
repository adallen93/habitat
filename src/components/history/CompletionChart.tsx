import { useState } from 'react';
import type { DayRecord } from '../../types';
import { HABITS } from '../../constants/habits';
import { completionRate, windowRecords, TIME_WINDOWS, type TimeWindow } from '../../lib/analytics';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface Props {
  records: Record<string, DayRecord>;
}

const SERIES: Record<TimeWindow, { label: string; color: string }> = {
  '2wk': { label: 'Last 2 weeks', color: '#fbbf24' },
  '30d': { label: 'Last 30 days', color: '#10b981' },
  all: { label: 'All time', color: '#3b82f6' },
};

export function CompletionChart({ records }: Props) {
  const [active, setActive] = useState<Record<TimeWindow, boolean>>({ '2wk': true, '30d': true, all: true });
  const allRecords = Object.values(records);

  if (allRecords.length === 0) {
    return (
      <div className="bg-stone-900 rounded-2xl border border-stone-700 p-8 text-center">
        <p className="text-stone-500 text-sm">No data yet — complete your first check-in to see charts.</p>
      </div>
    );
  }

  const firstRecordDate = Object.keys(records).sort()[0];
  const windowRecordSets = Object.fromEntries(
    TIME_WINDOWS.map(w => [w.key, windowRecords(allRecords, w.days)]),
  ) as Record<TimeWindow, DayRecord[]>;

  const data = HABITS.map(habit => {
    const row: Record<string, string | number> = { name: habit.shortLabel, fullName: habit.label };
    for (const w of TIME_WINDOWS) {
      row[w.key] = completionRate(windowRecordSets[w.key], habit, firstRecordDate) ?? 0;
    }
    return row;
  });

  const activeKeys = TIME_WINDOWS.map(w => w.key).filter(k => active[k]);

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-700 p-4">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Completion Rate by Habit</p>
        <div className="flex gap-1.5">
          {TIME_WINDOWS.map(w => {
            const on = active[w.key];
            return (
              <button
                key={w.key}
                onClick={() => setActive(prev => ({ ...prev, [w.key]: !prev[w.key] }))}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                  on
                    ? 'bg-stone-800 border-stone-600 text-stone-200'
                    : 'bg-transparent border-stone-800 text-stone-600'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: on ? SERIES[w.key].color : '#57534e' }}
                />
                {w.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div style={{ minWidth: '700px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 60 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#44403c" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#78716c' }}
                angle={-35}
                textAnchor="end"
                interval={0}
                tickLine={false}
                axisLine={false}
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
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                content={({ active: ttActive, payload }) => {
                  if (!ttActive || !payload?.length) return null;
                  const item = payload[0]?.payload as Record<string, string | number>;
                  return (
                    <div className="bg-stone-800 border border-stone-600 rounded-xl shadow-xl p-3 text-xs">
                      <p className="font-semibold text-stone-200 mb-2 max-w-[180px]">{item.fullName}</p>
                      <div className="space-y-1">
                        {activeKeys.map(k => (
                          <div key={k} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SERIES[k].color }} />
                            <span className="text-stone-400">{SERIES[k].label}:</span>
                            <span className="font-medium text-stone-200">{item[k]}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              {activeKeys.map(k => (
                <Bar key={k} dataKey={k} name={SERIES[k].label} fill={SERIES[k].color} radius={[4, 4, 0, 0]} maxBarSize={20} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
