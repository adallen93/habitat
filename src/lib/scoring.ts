import type { HabitId, Rating } from '../types';
import { HABITS_BY_CATEGORY, PRIORITY_CATEGORIES } from '../constants/habits';

export interface ScoreResult {
  score: number;
  effectiveScore: number;
  rating: Rating;
  penalties: Record<string, number>;
}

export function computeScore(completed: HabitId[]): ScoreResult {
  const completedSet = new Set(completed);
  const score = completed.length;

  const penalties: Record<string, number> = {};
  let totalPenalty = 0;

  for (const cat of PRIORITY_CATEGORIES) {
    const habitsInCat = HABITS_BY_CATEGORY[cat];
    const missed = habitsInCat.filter(h => !completedSet.has(h.id)).length;
    const penalty = Math.max(0, missed - 1);
    penalties[cat] = penalty;
    totalPenalty += penalty;
  }

  const effectiveScore = score - totalPenalty;

  let rating: Rating;
  if (effectiveScore < 13) rating = 'Miss';
  else if (effectiveScore === 13) rating = 'Pass';
  else if (effectiveScore < 16) rating = 'Good';
  else rating = 'Excellent';

  return { score, effectiveScore, rating, penalties };
}

export function getRatingConfig(rating: Rating) {
  switch (rating) {
    case 'Miss':
      return { color: 'bg-rose-950 text-rose-400 border-rose-800', dot: 'bg-rose-500', label: 'Miss' };
    case 'Pass':
      return { color: 'bg-amber-950 text-amber-400 border-amber-800', dot: 'bg-amber-500', label: 'Pass' };
    case 'Good':
      return { color: 'bg-emerald-950 text-emerald-400 border-emerald-800', dot: 'bg-emerald-500', label: 'Good' };
    case 'Excellent':
      return { color: 'bg-emerald-950 text-emerald-300 border-emerald-700', dot: 'bg-emerald-400', label: 'Excellent' };
  }
}
