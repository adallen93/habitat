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
  if (effectiveScore < 12) rating = 'Miss';
  else if (effectiveScore <= 13) rating = 'Accomplished';
  else if (effectiveScore <= 15) rating = 'Well Done';
  else rating = 'Above and Beyond';

  return { score, effectiveScore, rating, penalties };
}

export function getRatingConfig(rating: Rating) {
  switch (rating) {
    case 'Miss':
      return { color: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500', label: 'Miss' };
    case 'Accomplished':
      return { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Accomplished' };
    case 'Well Done':
      return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Well Done' };
    case 'Above and Beyond':
      return { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-700', label: 'Above and Beyond' };
  }
}
