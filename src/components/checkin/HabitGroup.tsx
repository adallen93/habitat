import type { Habit, HabitId } from '../../types';
import { HabitRow } from './HabitRow';

interface Props {
  label: string;
  habits: Habit[];
  checked: Set<HabitId>;
  onToggle: (id: HabitId) => void;
  accentClass: string;
  labelClass: string;
}

export function HabitGroup({ label, habits, checked, onToggle, accentClass, labelClass }: Props) {
  const completedCount = habits.filter(h => checked.has(h.id)).length;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
      <div className={`flex items-center justify-between px-4 py-2.5 ${accentClass}`}>
        <span className={`text-xs font-semibold uppercase tracking-widest ${labelClass}`}>{label}</span>
        <span className={`text-xs font-medium ${labelClass} opacity-70`}>{completedCount} / {habits.length}</span>
      </div>
      <div className="divide-y divide-stone-50">
        {habits.map(habit => (
          <HabitRow
            key={habit.id}
            habit={habit}
            checked={checked.has(habit.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
