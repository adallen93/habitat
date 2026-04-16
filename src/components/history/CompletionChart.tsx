import type { DayRecord } from '../../types';
import { HABITS } from '../../constants/habits';
import { getLastNDays } from '../../lib/dateUtils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Props {
  records: Record<string, DayRecord>;
}

export function CompletionChart({ records }: Props) {
  const allRecords = Object.values(records);
  const last14 = getLastNDays(14);
  const last14Records = last14.map(d => records[d]).filter(Boolean) as DayRecord[];

  if (allRecords.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
        <p className="text-stone-400 text-sm">No data yet — complete your first check-in to see charts.</p>
      </div>
    );
  }

  const data = HABITS.map(habit => {
    const allTime = allRecords.length > 0
      ? Math.round(allRecords.filter(r => r.completed.includes(habit.id)).length / allRecords.length * 100)
      : 0;
    const twoWeek = last14Records.length > 0
      ? Math.round(last14Records.filter(r => r.completed.includes(habit.id)).length / last14Records.length * 100)
      : 0;
    return {
      name: habit.shortLabel,
      fullName: habit.label,
      allTime,
      twoWeek,
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">Completion Rate by Habit</p>
      <div className="overflow-x-auto">
        <div style={{ minWidth: '700px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 60 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
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
                tick={{ fontSize: 11, fill: '#a8a29e' }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                width={38}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0]?.payload as { fullName: string; allTime: number; twoWeek: number };
                  return (
                    <div className="bg-white border border-stone-200 rounded-xl shadow-lg p-3 text-xs">
                      <p className="font-semibold text-stone-700 mb-2 max-w-[180px]">{item.fullName}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-stone-500">All time:</span>
                          <span className="font-medium text-stone-700">{item.allTime}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-stone-500">Last 14 days:</span>
                          <span className="font-medium text-stone-700">{item.twoWeek}%</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: '#78716c', fontSize: '11px' }}>
                    {value === 'allTime' ? 'All time' : 'Last 14 days'}
                  </span>
                )}
              />
              <Bar dataKey="allTime" name="allTime" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="twoWeek" name="twoWeek" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
