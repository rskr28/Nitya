import type { LessonSummary } from '../../types';
import { persistGrowth, readGrowth, type PracticeRecord } from '../growth/storage';

/** Records a self-reported practice attempt and advances to Reflect atomically. */
export function recordPractice(lesson: LessonSummary, activity: string): PracticeRecord | null {
  const state = readGrowth();
  const previous = state.lessonProgress[lesson.id];
  if (!previous || previous.completed || previous.currentStep !== 'practise') return null;

  const record: PracticeRecord = {
    id: `${lesson.id}:${Date.now()}:${state.practices.length}`,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    activity,
    attemptedAt: new Date().toISOString(),
  };
  state.practices.unshift(record);
  state.lessonProgress[lesson.id] = {
    ...previous,
    currentStep: 'reflect',
    updatedAt: new Date().toISOString(),
  };
  persistGrowth(state);
  return record;
}
