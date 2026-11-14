import type { LessonStep } from './lessonFlow';

export interface LessonEntryProgress {
  completed: boolean;
  currentStep: LessonStep;
}

export type LessonEntryMode = 'learning' | 'completion' | 'review';

export function resolveLessonEntry(
  progress: LessonEntryProgress | undefined,
  reviewRequested: boolean,
): { mode: LessonEntryMode; initialStep: LessonStep } {
  if (!progress) return { mode: 'learning', initialStep: 'discover' };
  if (progress.completed) {
    return reviewRequested
      ? { mode: 'review', initialStep: 'discover' }
      : { mode: 'completion', initialStep: 'complete' };
  }
  return { mode: 'learning', initialStep: progress.currentStep };
}
