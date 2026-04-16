import type { Habit, HabitId } from '../../types';

interface Props {
  habit: Habit;
  checked: boolean;
  onToggle: (id: HabitId) => void;
}

export function HabitRow({ habit, checked, onToggle }: Props) {
  return (
    <label
      className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors group"
      htmlFor={`habit-${habit.id}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
            checked
              ? 'bg-amber-400 border-amber-400'
              : 'border-stone-300 bg-white group-hover:border-stone-400'
          }`}
        >
          {checked && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <input
        id={`habit-${habit.id}`}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(habit.id)}
        className="sr-only"
        aria-label={habit.label}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug transition-colors ${checked ? 'text-stone-500 line-through decoration-stone-300' : 'text-stone-800'}`}>
          {habit.label}
        </p>
        {habit.sublabel && (
          <p className="text-xs text-stone-400 mt-0.5">{habit.sublabel}</p>
        )}
      </div>
    </label>
  );
}
