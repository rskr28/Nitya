import { persistGrowth, readGrowth } from '../growth/storage.ts';
import { completeLesson } from '../journey/service.ts';

export function saveReflection(lessonId: string, lessonTitle: string, text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const result = completeLesson(lessonId);
  if (!result.completed) return false;

  const state = readGrowth();
  state.reflections = [
    {
      lessonId,
      lessonTitle,
      text: trimmed,
      savedAt: new Date().toISOString(),
    },
    ...state.reflections.filter((item) => item.lessonId !== lessonId),
  ];
  persistGrowth(state);
  return true;
}

/** Reflection is optional: skip completes the eligible lesson without a reflection record. */
export function finishWithoutReflection(lessonId: string): boolean {
  return completeLesson(lessonId).completed;
}
