export type HabitId =
  | 'alarmup'
  | 'gospelStudy'
  | 'noEatingBefore1pm'
  | 'prayers'
  | 'noEatingAfterPortion'
  | 'exercise'
  | 'coldShowerBreathing'
  | 'makeKeepCommitment'
  | 'noVideosWorkHours'
  | 'tenMinOutside'
  | 'twoHoursDeepWork'
  | 'savorBite'
  | 'stopBeforeGone'
  | 'manualLabor'
  | 'pleasureReadingGratitude'
  | 'physicalContactConversation'
  | 'meditationCbt';

export type Category = 'morning' | 'evening' | 'other' | 'none';

export interface Habit {
  id: HabitId;
  label: string;
  shortLabel: string;
  sublabel?: string;
  categories: Category[];
}

export type Rating = 'Miss' | 'Pass' | 'Good' | 'Excellent';

export interface DayRecord {
  date: string;
  completed: HabitId[];
  score: number;
  effectiveScore: number;
  rating: Rating;
  submittedAt: string;
}

export interface HabitatStore {
  version: number;
  records: Record<string, DayRecord>;
}

export type ActiveTab = 'checkin' | 'history';
