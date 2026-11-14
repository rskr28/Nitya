import assert from 'node:assert/strict';
import test, { beforeEach } from 'node:test';
import { canMoveToStep } from '../src/features/wisdom/lessonFlow.ts';
import { getLotusStage } from '../src/utils/lotus.ts';
import {
  getActivityCounts,
  readGrowth,
  recordLessonOpened,
  setLessonStep,
} from '../src/features/growth/storage.ts';
import { recordPractice } from '../src/features/practice/service.ts';
import { finishWithoutReflection, saveReflection } from '../src/features/reflection/service.ts';

const sampleLesson = {
  id: 'letting-go',
  title: 'The Art of Letting Go',
  source: 'Bhagavad Gita · Chapter 2, Verse 47',
  description: 'Explore what is within your influence.',
  minutes: 5,
  topic: 'Self-awareness',
};

function installStorage(options: { failGet?: boolean; failSet?: boolean } = {}) {
  const values = new Map<string, string>();
  const storage = {
    getItem(key: string) {
      if (options.failGet) throw new Error('Storage access denied');
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (options.failSet) throw new Error('Storage quota exceeded');
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
    clear() {
      values.clear();
    },
  };
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: storage,
      dispatchEvent() { return true; },
    },
  });
  return { storage, values };
}

function moveToPractice() {
  recordLessonOpened(sampleLesson);
  setLessonStep(sampleLesson.id, 'understand');
  setLessonStep(sampleLesson.id, 'practise');
}

beforeEach(() => installStorage());

test('lesson exploration and practice counts do not advance the lotus', () => {
  assert.equal(getLotusStage({ lessonsExplored: 18, practicesAttempted: 42, journeysCompleted: 0 }), 'seed');
});

test('the first explicitly completed learning journey reaches Sprout', () => {
  assert.equal(getLotusStage({ lessonsExplored: 1, practicesAttempted: 0, journeysCompleted: 1 }), 'sprout');
});

test('later lotus thresholds are not inferred from raw activity counters', () => {
  assert.equal(getLotusStage({ lessonsExplored: 100, practicesAttempted: 200, journeysCompleted: 1 }), 'sprout');
});

test('lesson flow allows only the next stage or a return to an earlier stage', () => {
  assert.equal(canMoveToStep('discover', 'understand'), true);
  assert.equal(canMoveToStep('discover', 'practise'), false);
  assert.equal(canMoveToStep('understand', 'practise'), true);
  assert.equal(canMoveToStep('practise', 'reflect'), true);
  assert.equal(canMoveToStep('reflect', 'understand'), true);
});

test('lesson completion is only possible from Reflect', () => {
  assert.equal(canMoveToStep('reflect', 'complete'), true);
  assert.equal(canMoveToStep('practise', 'complete'), false);
  assert.equal(canMoveToStep('understand', 'complete'), false);
  assert.equal(canMoveToStep('complete', 'discover'), false);
});

test('opening a lesson persists it once and resumes its saved stage', () => {
  recordLessonOpened(sampleLesson);
  setLessonStep(sampleLesson.id, 'understand');
  recordLessonOpened(sampleLesson);
  const state = readGrowth();
  assert.deepEqual(state.lessonsExplored, [sampleLesson.id]);
  assert.equal(state.lessonProgress[sampleLesson.id].currentStep, 'understand');
  assert.equal(getActivityCounts(state).lessonsExplored, 1);
});

test('practice cannot be recorded before the Practise stage', () => {
  recordLessonOpened(sampleLesson);
  assert.equal(recordPractice(sampleLesson, 'Try the practice'), null);
  assert.equal(readGrowth().practices.length, 0);
});

test('practice attempt is persisted and advances the lesson to Reflect', () => {
  moveToPractice();
  const record = recordPractice(sampleLesson, 'Notice what is within your control');
  const state = readGrowth();
  assert.ok(record);
  assert.equal(record?.lessonId, sampleLesson.id);
  assert.equal(state.practices.length, 1);
  assert.equal(state.practices[0].activity, 'Notice what is within your control');
  assert.equal(state.lessonProgress[sampleLesson.id].currentStep, 'reflect');
  assert.equal(getActivityCounts(state).practicesAttempted, 1);
});

test('a repeated practice action cannot create a second attempt for the same stage', () => {
  moveToPractice();
  assert.ok(recordPractice(sampleLesson, 'First attempt'));
  assert.equal(recordPractice(sampleLesson, 'Duplicate click'), null);
  assert.equal(readGrowth().practices.length, 1);
});

test('saving a reflection trims and persists text, then completes the lesson', () => {
  moveToPractice();
  recordPractice(sampleLesson, 'Observe effort and outcome');
  assert.equal(saveReflection(sampleLesson.id, sampleLesson.title, '  I noticed my focus shifting.  '), true);
  const state = readGrowth();
  assert.equal(state.reflections.length, 1);
  assert.equal(state.reflections[0].text, 'I noticed my focus shifting.');
  assert.equal(state.lessonProgress[sampleLesson.id].completed, true);
  assert.equal(state.lessonProgress[sampleLesson.id].currentStep, 'complete');
});

test('empty reflection cannot be saved or complete the lesson', () => {
  moveToPractice();
  recordPractice(sampleLesson, 'Observe effort and outcome');
  assert.equal(saveReflection(sampleLesson.id, sampleLesson.title, '   '), false);
  const state = readGrowth();
  assert.equal(state.reflections.length, 0);
  assert.equal(state.lessonProgress[sampleLesson.id].completed, false);
});

test('skipping reflection completes the lesson without creating a reflection record', () => {
  moveToPractice();
  recordPractice(sampleLesson, 'Observe effort and outcome');
  assert.equal(finishWithoutReflection(sampleLesson.id), true);
  const state = readGrowth();
  assert.equal(state.lessonProgress[sampleLesson.id].completed, true);
  assert.equal(state.reflections.length, 0);
});

test('reflection and skip actions cannot complete a lesson before Reflect', () => {
  recordLessonOpened(sampleLesson);
  assert.equal(saveReflection(sampleLesson.id, sampleLesson.title, 'Too early'), false);
  assert.equal(finishWithoutReflection(sampleLesson.id), false);
  assert.equal(readGrowth().lessonProgress[sampleLesson.id].completed, false);
});

test('malformed persisted JSON safely starts with an empty growth state', () => {
  const { values } = installStorage();
  values.set('nitya.growth.v1', '{not valid JSON');
  assert.deepEqual(readGrowth(), {
    version: 1,
    lessonsExplored: [],
    practices: [],
    reflections: [],
    lessonProgress: {},
    journeysCompleted: [],
  });
});

test('blocked localStorage reads safely return an empty growth state', () => {
  installStorage({ failGet: true });
  assert.equal(readGrowth().lessonsExplored.length, 0);
  assert.equal(readGrowth().practices.length, 0);
});

test('blocked localStorage writes surface an error for the UI to report', () => {
  installStorage({ failSet: true });
  assert.throws(() => recordLessonOpened(sampleLesson), /Storage quota exceeded/);
});
