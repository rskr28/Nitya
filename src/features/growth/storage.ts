import type { ActivityCounts, LessonSummary, LotusStage } from '../../types';
import { canMoveToStep, type LessonStep } from '../wisdom/lessonFlow.ts';

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
  currentStep: LessonStep;
  completed: boolean;
  updatedAt: string;
}
export interface LotusTransition {
  from: LotusStage;
  to: LotusStage;
  createdAt: string;
}
export interface GrowthState {
  version: 1;
  lessonsExplored: string[];
  practices: PracticeRecord[];
  reflections: ReflectionRecord[];
  lessonProgress: Record<string, LessonProgress>;
  journeysCompleted: string[];
  /** A single pending, genuine milestone change; consumed when the new stage is viewed. */
  lotusTransition?: LotusTransition | null;
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
      !parsed.lessonProgress || typeof parsed.lessonProgress !== 'object' ||
      !Array.isArray(parsed.journeysCompleted)) return emptyState();
    return { ...emptyState(), ...parsed } as GrowthState;
  } catch {
    return emptyState();
  }
}
export function persistGrowth(state: GrowthState): GrowthState {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('nitya:growth-updated'));
  return state;
}
/** Consume a milestone animation only on the matching new stage. Refreshes cannot replay it. */
export function consumePendingLotusTransition(currentStage: LotusStage): LotusTransition | null {
  const state = readGrowth();
  const pending = state.lotusTransition ?? null;
  if (!pending || pending.to !== currentStage) return null;
  state.lotusTransition = null;
  persistGrowth(state);
  return pending;
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
  return persistGrowth(state);
}
export function setLessonStep(lessonId: string, step: LessonStep): GrowthState {
  const state = readGrowth();
  const previous = state.lessonProgress[lessonId];
  // Reflect is reachable only through recordPractice, which first creates the self-reported practice event.
  if (!previous || step === 'reflect' || step === 'complete' || !canMoveToStep(previous.currentStep, step)) return state;
  state.lessonProgress[lessonId] = { ...previous, currentStep: step, updatedAt: new Date().toISOString() };
  return persistGrowth(state);
}
