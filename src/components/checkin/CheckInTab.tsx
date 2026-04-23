import { useState, useEffect } from 'react';
import type { HabitId, DayRecord } from '../../types';
import { HABITS, getHabitsByCategoryForDate } from '../../constants/habits';
import { todayString, formatDisplayDate } from '../../lib/dateUtils';
import { HabitGroup } from './HabitGroup';
import { ScorePreview } from './ScorePreview';

interface Props {
  getRecord: (date: string) => DayRecord | null;
  saveRecord: (date: string, completed: HabitId[]) => DayRecord;
  initialDate?: string;
}

const GROUPS = [
  { key: 'morning' as const, label: 'Morning', accentClass: 'bg-sky-950', labelClass: 'text-sky-400' },
  { key: 'evening' as const, label: 'Evening', accentClass: 'bg-violet-950', labelClass: 'text-violet-400' },
  { key: 'other' as const, label: 'Other Priority', accentClass: 'bg-teal-950', labelClass: 'text-teal-400' },
  { key: 'none' as const, label: 'General', accentClass: 'bg-stone-800', labelClass: 'text-stone-400' },
];

export function CheckInTab({ getRecord, saveRecord, initialDate }: Props) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? todayString());
  const [checked, setChecked] = useState<Set<HabitId>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const record = getRecord(selectedDate);
    setChecked(new Set((record?.completed ?? []) as HabitId[]));
    setSaved(!!record);
  }, [selectedDate, getRecord]);

  function toggle(id: HabitId) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    const record = saveRecord(selectedDate, Array.from(checked) as HabitId[]);
    setSaved(true);
    const msg = `Saved! ${record.rating} — ${record.effectiveScore}/${HABITS.length}`;
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const isToday = selectedDate === todayString();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Date picker */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-1.5">
            Date
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent [color-scheme:dark]"
            />
            <span className="text-sm text-stone-500">{formatDisplayDate(selectedDate)}</span>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayString())}
                className="text-xs text-amber-500 hover:text-amber-400 font-medium"
              >
                → Today
              </button>
            )}
          </div>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Saved
          </div>
        )}
      </div>

      {/* Score preview */}
      <ScorePreview checked={checked} date={selectedDate} />

      {/* Habit groups */}
      {GROUPS.map(g => (
        <HabitGroup
          key={g.key}
          label={g.label}
          habits={getHabitsByCategoryForDate(selectedDate)[g.key]}
          checked={checked}
          onToggle={toggle}
          accentClass={g.accentClass}
          labelClass={g.labelClass}
        />
      ))}

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-semibold py-3.5 px-6 rounded-2xl transition-colors text-base shadow-sm"
      >
        {saved ? 'Update Day' : 'Save Day'}
      </button>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-100 text-stone-900 text-sm font-medium px-5 py-3 rounded-2xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
