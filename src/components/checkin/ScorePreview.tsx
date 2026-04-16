import type { HabitId } from '../../types';
import { computeScore } from '../../lib/scoring';
import { RatingBadge } from '../shared/RatingBadge';

interface Props {
  checked: Set<HabitId>;
}

const TOTAL = 16;

export function ScorePreview({ checked }: Props) {
  const completed = Array.from(checked) as HabitId[];
  const { score, effectiveScore, rating, penalties } = computeScore(completed);
  const totalPenalty = Object.values(penalties).reduce((a, b) => a + b, 0);

  const pct = (score / TOTAL) * 100;

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-1">Today's Score</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-stone-100">{score}</span>
            <span className="text-stone-500 text-lg">/ {TOTAL}</span>
            {totalPenalty > 0 && (
              <span className="text-sm text-rose-400 font-medium ml-1">→ {effectiveScore} effective</span>
            )}
          </div>
        </div>
        <RatingBadge rating={rating} />
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-stone-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-300 bg-amber-400"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Penalty breakdown */}
      {totalPenalty > 0 && (
        <div className="flex gap-3 text-xs">
          {(['morning', 'evening', 'other'] as const).map(cat => (
            penalties[cat] > 0 ? (
              <span key={cat} className="text-rose-400 font-medium">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}: -{penalties[cat]}
              </span>
            ) : null
          ))}
          <span className="text-stone-500 ml-auto">Priority penalty</span>
        </div>
      )}
    </div>
  );
}
