import { journeys } from '../../data/content';
import { persistGrowth, readGrowth, type GrowthState } from '../growth/storage';

export interface LessonCompletionResult {
  completed: boolean;
  newlyCompletedJourneyIds: string[];
}

/**
 * A journey qualifies only when every required lesson is complete and each
 * lesson has a self-reported practice record. Reflection is never a gate.
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

/** Completes the lesson, stores an optional reflection, and checks journey qualification in one write. */
export function completeLesson(
  lessonId: string,
  reflection?: { lessonTitle: string; text: string },
): LessonCompletionResult {
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

  if (reflection) {
    state.reflections = [
      {
        lessonId,
        lessonTitle: reflection.lessonTitle,
        text: reflection.text,
        savedAt: new Date().toISOString(),
      },
      ...state.reflections.filter((item) => item.lessonId !== lessonId),
    ];
  }

  const completedJourneyIds = evaluateCompletedJourneys(state);
  const newlyCompletedJourneyIds = completedJourneyIds.filter(
    (journeyId) => !state.journeysCompleted.includes(journeyId),
  );
  state.journeysCompleted = [...new Set([...state.journeysCompleted, ...newlyCompletedJourneyIds])];
  persistGrowth(state);

  return { completed: true, newlyCompletedJourneyIds };
}
