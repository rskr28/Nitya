import { journeys } from '../../data/content';
import { persistGrowth, readGrowth, type GrowthState } from '../growth/storage';

export interface LessonCompletionResult {
  completed: boolean;
  newlyCompletedJourneyIds: string[];
}

/**
 * A lesson may complete only from Reflect. Its practice is a required,
 * self-reported event already stored by recordPractice.
 * A journey completes once every lesson in its authored lessonIds is complete
 * and has a corresponding practice record. Reflection is deliberately not a gate.
 */
export function evaluateCompletedJourneys(state: GrowthState): string[] {
  return journeys
    .filter((journey) => journey.lessonIds.length > 0)
    .filter((journey) => journey.lessonIds.every((lessonId) =>
      state.lessonProgress[lessonId]?.completed === true &&
      state.practices.some((practice) => practice.lessonId === lessonId),
    ))
    .map((journey) => journey.id);
}

export function completeLesson(lessonId: string): LessonCompletionResult {
  const state = readGrowth();
  const previous = state.lessonProgress[lessonId];
  if (!previous || previous.completed || previous.currentStep !== 'reflect') {
    return { completed: false, newlyCompletedJourneyIds: [] };
  }

  state.lessonProgress[lessonId] = {
    ...previous,
    currentStep: 'complete',
    completed: true,
    updatedAt: new Date().toISOString(),
  };

  const completedJourneyIds = evaluateCompletedJourneys(state);
  const newlyCompletedJourneyIds = completedJourneyIds.filter(
    (journeyId) => !state.journeysCompleted.includes(journeyId),
  );
  state.journeysCompleted = [...new Set([...state.journeysCompleted, ...newlyCompletedJourneyIds])];
  persistGrowth(state);

  return { completed: true, newlyCompletedJourneyIds };
}
