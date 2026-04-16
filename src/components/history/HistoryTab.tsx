import type { DayRecord } from '../../types';
import { StatsCard } from './StatsCard';
import { WeekTable } from './WeekTable';
import { CompletionChart } from './CompletionChart';
import { CalendarHeatmap } from './CalendarHeatmap';
import { useStreaks } from '../../hooks/useStreaks';

interface Props {
  records: Record<string, DayRecord>;
  onDateClick?: (date: string) => void;
}

export function HistoryTab({ records, onDateClick }: Props) {
  const { currentStreak, bestStreak } = useStreaks(records);
  const hasData = Object.keys(records).length > 0;

  if (!hasData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🌱</div>
        <h2 className="text-xl font-semibold text-stone-300 mb-2">No history yet</h2>
        <p className="text-stone-500 text-sm">Complete your first check-in to start tracking progress.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <StatsCard records={records} currentStreak={currentStreak} bestStreak={bestStreak} />
      <CalendarHeatmap records={records} onDateClick={onDateClick} />
      <WeekTable records={records} onDateClick={onDateClick} />
      <CompletionChart records={records} />
    </div>
  );
}
