import type { Habit, Category } from '../types';

export const HABITS: Habit[] = [
  {
    id: 'alarmup',
    label: 'Alarmup',
    shortLabel: 'Alarmup',
    categories: ['morning'],
  },
  {
    id: 'gospelStudy',
    label: '30 minutes of gospel study',
    shortLabel: 'Gospel study',
    categories: ['morning'],
  },
  {
    id: 'noEatingBefore1pm',
    label: 'No eating before 1pm',
    shortLabel: 'Fast to 1pm',
    categories: ['morning'],
  },
  {
    id: 'prayers',
    label: '2 five-minute prayers',
    shortLabel: 'Prayers',
    sublabel: 'One morning, one evening',
    categories: ['morning', 'evening'],
  },
  {
    id: 'noEatingAfterPortion',
    label: 'No eating after 1½ portions of dinner',
    shortLabel: 'Dinner portions',
    sublabel: 'Stop at 1½ portions',
    categories: ['evening'],
  },
  {
    id: 'exercise',
    label: '15 minutes of exercise',
    shortLabel: 'Exercise',
    categories: ['other'],
  },
  {
    id: 'coldShowerBreathing',
    label: '5 minutes of cold shower | Breathing exercises',
    shortLabel: 'Cold shower',
    sublabel: '5 min cold shower OR breathing exercises',
    categories: ['other'],
  },
  {
    id: 'makeKeepCommitment',
    label: 'Make and keep 1 commitment',
    shortLabel: 'Commitment',
    categories: ['other'],
  },
  {
    id: 'tenMinOutside',
    label: '10 minutes outside',
    shortLabel: 'Outside',
    categories: ['none'],
  },
  {
    id: 'twoHoursDeepWork',
    label: '2 hours of deep work',
    shortLabel: 'Deep work',
    categories: ['none'],
  },
  {
    id: 'savorBite',
    label: 'Savor 1 bite of food',
    shortLabel: 'Savor',
    categories: ['none'],
  },
  {
    id: 'stopBeforeGone',
    label: 'Stop lunch or dinner before food is gone when sufficiently full',
    shortLabel: 'Stop early',
    sublabel: 'Stop before plate is empty when full',
    categories: ['none'],
  },
  {
    id: 'manualLabor',
    label: '30 minutes of manual labor',
    shortLabel: 'Manual labor',
    sublabel: 'House cleaning, yard work, etc.',
    categories: ['none'],
  },
  {
    id: 'pleasureReadingGratitude',
    label: '30 minutes of pleasure reading | Write gratitude journal entry',
    shortLabel: 'Reading',
    sublabel: '30 min reading OR gratitude journal',
    categories: ['none'],
  },
  {
    id: 'physicalContactConversation',
    label: '5 minutes of physical contact | 1 meaningful conversation',
    shortLabel: 'Connection',
    sublabel: '5 min physical contact OR 1 meaningful conversation',
    categories: ['none'],
  },
  {
    id: 'meditationCbt',
    label: '5 minutes of meditation | 10 minutes of CBT training',
    shortLabel: 'Meditation',
    sublabel: '5 min meditation OR 10 min CBT training',
    categories: ['none'],
  },
];

export const HABIT_MAP = Object.fromEntries(HABITS.map(h => [h.id, h])) as Record<string, Habit>;

export const HABITS_BY_CATEGORY: Record<Category, Habit[]> = {
  morning: HABITS.filter(h => h.categories.includes('morning')),
  evening: HABITS.filter(h => h.categories.includes('evening')),
  other: HABITS.filter(h => h.categories.includes('other')),
  none: HABITS.filter(h => h.categories[0] === 'none'),
};

export const PRIORITY_CATEGORIES: Category[] = ['morning', 'evening', 'other'];
