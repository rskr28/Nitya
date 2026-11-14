import { completeLesson } from '../journey/service.ts';

export function saveReflection(lessonId: string, lessonTitle: string, text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return completeLesson(lessonId, { lessonTitle, text: trimmed }).completed;
}

/** Reflection is optional: skip completes the eligible lesson without a reflection record. */
export function finishWithoutReflection(lessonId: string): boolean {
  return completeLesson(lessonId).completed;
}
