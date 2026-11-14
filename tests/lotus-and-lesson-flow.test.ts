import assert from 'node:assert/strict';
import test from 'node:test';
import { canMoveToStep } from '../src/features/wisdom/lessonFlow.ts';
import { getLotusStage } from '../src/utils/lotus.ts';

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
test('reflection is optional but completion is only possible from Reflect', () => {
  assert.equal(canMoveToStep('reflect', 'complete'), true);
  assert.equal(canMoveToStep('practise', 'complete'), false);
  assert.equal(canMoveToStep('understand', 'complete'), false);
  assert.equal(canMoveToStep('complete', 'discover'), false);
});
