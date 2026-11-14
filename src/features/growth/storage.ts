import type { ActivityCounts, LessonSummary } from '../../types';

export interface PracticeRecord {
  id: string;
  lessonId: string;
  lessonTitle: string;
  activity: string;
  attemptedAt: string;
}
export interface ReflectionRecord {
  lessonId: string;
  lessonTitle: string;
  text: string;
  savedAt: string;
}
export interface LessonProgress {
  lessonId: string;
  currentStep: 'discover' | 'understand' | 'practise' | 'reflect' | 'complete';
  completed: boolean;
  updatedAt: string;
}
export interface GrowthState {
  version: 1;
  lessonsExplored: string[];
  practices: PracticeRecord[];
  reflections: ReflectionRecord[];
  lessonProgress: Record<string, LessonProgress>;
  journeysCompleted: string[];
}
const STORAGE_KEY = 'nitya.growth.v1';
const emptyState = (): GrowthState => ({
  version: 1, lessonsExplored: [], practices: [], reflections: [],
  lessonProgress: {}, journeysCompleted: [],
});
export function readGrowth(): GrowthState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<GrowthState>;
    if (parsed.version !== 1 || !Array.isArray(parsed.lessonsExplored) ||
      !Array.isArray(parsed.practices) || !Array.isArray(parsed.reflections) ||
      !parsed.lessonProgress || !Array.isArray(parsed.journeysCompleted)) return emptyState();
    return { ...emptyState(), ...parsed } as GrowthState;
  } catch {
    return emptyState();
  }
}
function writeGrowth(state: GrowthState): GrowthState {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('nitya:growth-updated'));
  return state;
}
export function getActivityCounts(state = readGrowth()): ActivityCounts {
  return {
    lessonsExplored: state.lessonsExplored.length,
    practicesAttempted: state.practices.length,
    journeysCompleted: state.journeysCompleted.length,
  };
}
export function recordLessonOpened(lesson: LessonSummary): GrowthState {
  const state = readGrowth();
  if (!state.lessonsExplored.includes(lesson.id)) state.lessonsExplored.push(lesson.id);
  if (!state.lessonProgress[lesson.id]) state.lessonProgress[lesson.id] = {
    lessonId: lesson.id, currentStep: 'discover', completed: false, updatedAt: new Date().toISOString(),
  };
  return writeGrowth(state);
}
export function setLessonStep(lessonId: string, step: LessonProgress['currentStep']): GrowthState {
  const state = readGrowth();
  const previous = state.lessonProgress[lessonId];
  if (!previous) return state;
  const order: LessonProgress['currentStep'][] = ['discover', 'understand', 'practise', 'reflect', 'complete'];
  const nextIndex = order.indexOf(step);
  const previousIndex = order.indexOf(previous.currentStep);
  if (nextIndex > previousIndex + 1) return state;
  state.lessonProgress[lessonId] = { ...previous, currentStep: step, updatedAt: new Date().toISOString() };
  return writeGrowth(state);
}
export function recordPractice(lesson: LessonSummary, activity: string): GrowthState {
  const state = readGrowth();
  const record: PracticeRecord = {
    id: `${lesson.id}:${Date.now()}`, lessonId: lesson.id, lessonTitle: lesson.title,
    activity, attemptedAt: new Date().toISOString(),
  };
  state.practices.unshift(record);
  return writeGrowth(state);
}
export function completeLesson(lessonId: string): GrowthState {
  const state = readGrowth();
  const previous = state.lessonProgress[lessonId];
  if (!previous) return state;
  state.lessonProgress[lessonId] = {
    ...previous, currentStep: 'complete', completed: true, updatedAt: new Date().toISOString(),
  };
  return writeGrowth(state);
}
export function saveReflection(lessonId: string, lessonTitle: string, text: string): GrowthState {
  const state = readGrowth();
  const trimmed = text.trim();
  if (trimmed) {
    const record = { lessonId, lessonTitle, text: trimmed, savedAt: new Date().toISOString() };
    state.reflections = [record, ...state.reflections.filter(item => item.lessonId !== lessonId)];
  }
  return completeLessonInState(state, lessonId);
}
export function finishWithoutReflection(lessonId: string): GrowthState {
  return completeLesson(lessonId);
}
function completeLessonInState(state: GrowthState, lessonId: string): GrowthState {
  const previous = state.lessonProgress[lessonId];
  if (!previous) return state;
  state.lessonProgress[lessonId] = {
    ...previous, currentStep: 'complete', completed: true, updatedAt: new Date().toISOString(),
  };
  return writeGrowth(state);
}
