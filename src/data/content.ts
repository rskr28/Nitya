import type { LessonSummary } from '../types';

export const featuredLesson: LessonSummary = {
  id: 'letting-go',
  title: 'The Art of Letting Go',
  source: 'Bhagavad Gita · Chapter 2, Verse 47',
  description: 'Explore the difference between what you can influence and what you cannot control.',
  minutes: 5,
  topic: 'Self-awareness',
};
export const lessons: LessonSummary[] = [featuredLesson];
export const topics = [
  { name: 'Self-awareness', icon: 'brain' },
  { name: 'Inner peace', icon: 'sun' },
  { name: 'Discipline', icon: 'mountain' },
  { name: 'Compassion', icon: 'heart' },
  { name: 'Detachment', icon: 'leaf' },
  { name: 'Patience', icon: 'hourglass' },
];
export const sources = ['Bhagavad Gita', 'Upanishads', 'Yoga Sutras', 'Dhammapada'];
export const journeys = [
  { title: 'Understanding Yourself', lessons: 7, description: 'A guided path to understand your thoughts, patterns and choices.' },
  { title: 'The Practice of Self-Control', lessons: 5, description: 'Explore practical ways to respond with intention.' },
];
export function findLesson(lessonId: string | undefined): LessonSummary | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}
