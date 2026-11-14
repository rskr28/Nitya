import assert from 'node:assert/strict';
import test, { beforeEach } from 'node:test';
import { journeys, lessons, sources, topics } from '../src/data/content.ts';
import { finishWithoutReflection, saveReflection } from '../src/features/reflection/service.ts';
import {
  evaluateCompletedJourneys,
} from '../src/features/journey/service.ts';
import {
  getActivityCounts,
  readGrowth,
  recordLessonOpened,
  setLessonStep,
} from '../src/features/growth/storage.ts';
import { recordPractice } from '../src/features/practice/service.ts';
import { getLotusStage } from '../src/utils/lotus.ts';
import { resolveLessonEntry } from '../src/features/wisdom/lessonView.ts';

function installStorage() {
  const values = new Map<string, string>();
  const storage = {
    getItem(key: string) { return values.get(key) ?? null; },
    setItem(key: string, value: string) { values.set(key, value); },
    removeItem(key: string) { values.delete(key); },
    clear() { values.clear(); },
  };
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: storage, dispatchEvent() { return true; } },
  });
}
beforeEach(installStorage);

function moveLessonToReflectWithPractice(lessonId: string) {
  const lesson = lessons.find((item) => item.id === lessonId);
  assert.ok(lesson, `Missing lesson fixture: ${lessonId}`);
  recordLessonOpened(lesson);
  setLessonStep(lesson.id, 'understand');
  setLessonStep(lesson.id, 'practise');
  assert.ok(recordPractice(lesson, lesson.practise.logLabel));
}

test('journey definition contains 3 authored lessons with matching lesson membership', () => {
  assert.equal(journeys.length, 1);
  const journey = journeys[0];
  assert.equal(journey.lessonIds.length, 3);
  assert.deepEqual(
    lessons.filter((lesson) => lesson.journeyId === journey.id).map((lesson) => lesson.id),
    journey.lessonIds,
  );
});


test('only lesson-backed topics and original sources are exposed in Explore', () => {
  assert.deepEqual(sources, ['Bhagavad Gītā']);
  assert.deepEqual(
    topics.map((topic) => topic.name).sort(),
    [...new Set(lessons.map((lesson) => lesson.topic))].sort(),
  );
});

test('every authored lesson has the full four-stage content and a source reference', () => {
  for (const lesson of lessons) {
    assert.ok(lesson.discover.context.trim());
    assert.ok(lesson.discover.invitation.trim());
    assert.ok(lesson.understand.teaching.trim());
    assert.ok(lesson.understand.explanation.length >= 2);
    assert.ok(lesson.understand.modernExample.trim());
    assert.ok(lesson.understand.nuance.trim());
    assert.ok(lesson.practise.whatToDo.trim());
    assert.ok(lesson.practise.whatToObserve.trim());
    assert.ok(lesson.practise.whatToLearn.trim());
    assert.ok(lesson.reflect.questions.length >= 2);
    assert.ok(lesson.reference.sanskrit.trim());
    assert.ok(lesson.reference.transliteration.trim());
    assert.ok(lesson.reference.editorialRendering.trim());
    assert.ok(lesson.reference.sourceUrl.startsWith('https://heritage.iitk.ac.in/SBG/2.'));
  }
});


test('completed lessons enter read-only review at Discover without changing saved progress', () => {
  const completed = { completed: true, currentStep: 'complete' as const };
  assert.deepEqual(resolveLessonEntry(completed, true), {
    mode: 'review',
    initialStep: 'discover',
  });
  assert.deepEqual(completed, { completed: true, currentStep: 'complete' });
});

test('a completed lesson without a review request retains its completion entry mode', () => {
  assert.deepEqual(resolveLessonEntry({ completed: true, currentStep: 'complete' }, false), {
    mode: 'completion',
    initialStep: 'complete',
  });
});

test('a requested review cannot bypass an incomplete lesson stage', () => {
  assert.deepEqual(resolveLessonEntry({ completed: false, currentStep: 'practise' }, true), {
    mode: 'learning',
    initialStep: 'practise',
  });
});

test('lesson three includes an explicitly linked contextual bridge to verse 2.49', () => {
  const lesson = lessons.find((item) => item.id === 'skillful-action');
  assert.ok(lesson?.discover.contextualBridge);
  assert.equal(lesson.discover.contextualBridge.title, 'A contextual pause — Bhagavad Gītā 2.49');
  assert.equal(lesson.discover.contextualBridge.sourceUrl, 'https://heritage.iitk.ac.in/SBG/2.49');
  assert.ok(lesson.discover.context.includes('curated thematic path'));
});

test('journey and lesson time estimates are explicitly in-app learning estimates', () => {
  assert.equal(journeys[0].inAppMinutes, 18);
  assert.ok(lessons.every((lesson) => lesson.inAppMinutes > 0));
});

test('lesson stage cannot be moved to Reflect without a practice event', () => {
  const lesson = lessons[0];
  recordLessonOpened(lesson);
  setLessonStep(lesson.id, 'understand');
  setLessonStep(lesson.id, 'practise');
  const state = setLessonStep(lesson.id, 'reflect');
  assert.equal(state.lessonProgress[lesson.id].currentStep, 'practise');
  assert.equal(state.practices.length, 0);
});

test('journey does not qualify while any required lesson is incomplete', () => {
  const journey = journeys[0];
  for (const lessonId of journey.lessonIds.slice(0, 2)) {
    moveLessonToReflectWithPractice(lessonId);
    assert.equal(finishWithoutReflection(lessonId), true);
  }
  const state = readGrowth();
  assert.deepEqual(evaluateCompletedJourneys(state), []);
  assert.equal(getActivityCounts(state).journeysCompleted, 0);
  assert.equal(getLotusStage(getActivityCounts(state)), 'seed');
});

test('journey does not qualify unless every required lesson has a practice record', () => {
  const journey = journeys[0];
  for (const lessonId of journey.lessonIds) {
    const lesson = lessons.find((item) => item.id === lessonId)!;
    recordLessonOpened(lesson);
    setLessonStep(lesson.id, 'understand');
    setLessonStep(lesson.id, 'practise');
    // Deliberately no recordPractice call.
    // Generic progression must not permit completion to be reached this way.
    assert.equal(setLessonStep(lesson.id, 'reflect').lessonProgress[lesson.id].currentStep, 'practise');
  }
  assert.deepEqual(evaluateCompletedJourneys(readGrowth()), []);
  assert.equal(getLotusStage(getActivityCounts()), 'seed');
});

test('first journey milestone unlocks only after all lessons are practised and completed', () => {
  const journey = journeys[0];
  for (const lessonId of journey.lessonIds) {
    moveLessonToReflectWithPractice(lessonId);
    assert.equal(finishWithoutReflection(lessonId), true);
  }
  const state = readGrowth();
  assert.deepEqual(state.journeysCompleted, [journey.id]);
  assert.equal(getActivityCounts(state).journeysCompleted, 1);
  assert.equal(getLotusStage(getActivityCounts(state)), 'sprout');
  assert.equal(state.reflections.length, 0, 'reflection is not required for journey completion');
});

test('a saved reflection also qualifies the journey and is stored with completion', () => {
  const journey = journeys[0];
  for (const lessonId of journey.lessonIds.slice(0, -1)) {
    moveLessonToReflectWithPractice(lessonId);
    assert.equal(finishWithoutReflection(lessonId), true);
  }
  const finalLesson = lessons.find((lesson) => lesson.id === journey.lessonIds.at(-1))!;
  moveLessonToReflectWithPractice(finalLesson.id);
  assert.equal(saveReflection(finalLesson.id, finalLesson.title, '  I can act with steadiness.  '), true);
  const state = readGrowth();
  assert.deepEqual(state.journeysCompleted, [journey.id]);
  assert.equal(state.reflections.length, 1);
  assert.equal(state.reflections[0].text, 'I can act with steadiness.');
  assert.equal(getLotusStage(getActivityCounts(state)), 'sprout');
});

test('journey completion is unique and cannot be awarded twice', () => {
  const journey = journeys[0];
  for (const lessonId of journey.lessonIds) {
    moveLessonToReflectWithPractice(lessonId);
    finishWithoutReflection(lessonId);
  }
  assert.equal(finishWithoutReflection(journey.lessonIds.at(-1)!), false);
  const state = readGrowth();
  assert.deepEqual(state.journeysCompleted, [journey.id]);
  assert.equal(state.journeysCompleted.filter((id) => id === journey.id).length, 1);
});
