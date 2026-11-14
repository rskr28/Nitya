export type LessonStep = 'discover' | 'understand' | 'practise' | 'reflect' | 'complete';
const lessonStepOrder: LessonStep[] = ['discover', 'understand', 'practise', 'reflect', 'complete'];

/** A lesson may advance one stage at a time, revisit earlier stages, and complete only from Reflect. */
export function canMoveToStep(current: LessonStep, next: LessonStep): boolean {
  if (current === next) return true;
  if (current === 'complete') return false;
  const currentIndex = lessonStepOrder.indexOf(current);
  const nextIndex = lessonStepOrder.indexOf(next);
  if (next === 'complete') return current === 'reflect';
  return nextIndex <= currentIndex + 1 && nextIndex < lessonStepOrder.length - 1;
}
