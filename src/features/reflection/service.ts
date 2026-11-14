import { canMoveToStep } from '../wisdom/lessonFlow.ts';
import { persistGrowth, readGrowth } from '../growth/storage.ts';

function completeFromReflection(lessonId: string) {
  const state = readGrowth();
  const previous = state.lessonProgress[lessonId];
  if (!previous || previous.completed || !canMoveToStep(previous.currentStep, 'complete')) return false;
  state.lessonProgress[lessonId] = {
    ...previous,
    currentStep: 'complete',
    completed: true,
    updatedAt: new Date().toISOString(),
  };
  persistGrowth(state);
  return true;
}

export function saveReflection(lessonId: string, lessonTitle: string, text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const state = readGrowth();
  const previous = state.lessonProgress[lessonId];
  if (!previous || previous.currentStep !== 'reflect' || previous.completed) return false;

  const record = {
    lessonId,
    lessonTitle,
    text: trimmed,
    savedAt: new Date().toISOString(),
  };
  state.reflections = [record, ...state.reflections.filter((item) => item.lessonId !== lessonId)];
  state.lessonProgress[lessonId] = {
    ...previous,
    currentStep: 'complete',
    completed: true,
    updatedAt: new Date().toISOString(),
  };
  persistGrowth(state);
  return true;
}

/** Skipping is a completion choice; it deliberately does not create a reflection record. */
export function finishWithoutReflection(lessonId: string): boolean {
  return completeFromReflection(lessonId);
}
