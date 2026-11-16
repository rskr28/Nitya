import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTimePeriod,
  greetingCopy,
  millisecondsUntilNextPeriod,
} from '../src/features/visualIdentity/timeOfDay.ts';

test('local greeting periods use the approved boundaries', () => {
  assert.equal(getTimePeriod(new Date(2026, 10, 14, 4, 59)), 'night');
  assert.equal(getTimePeriod(new Date(2026, 10, 14, 5, 0)), 'morning');
  assert.equal(getTimePeriod(new Date(2026, 10, 14, 11, 59)), 'morning');
  assert.equal(getTimePeriod(new Date(2026, 10, 14, 12, 0)), 'afternoon');
  assert.equal(getTimePeriod(new Date(2026, 10, 14, 16, 59)), 'afternoon');
  assert.equal(getTimePeriod(new Date(2026, 10, 14, 17, 0)), 'evening');
  assert.equal(getTimePeriod(new Date(2026, 10, 14, 20, 59)), 'evening');
  assert.equal(getTimePeriod(new Date(2026, 10, 14, 21, 0)), 'night');
});

test('each time period has its own approved greeting and supporting copy', () => {
  assert.deepEqual(greetingCopy.morning, {
    title: 'Good morning.',
    message: "Here's something meaningful for you today.",
  });
  assert.deepEqual(greetingCopy.afternoon, {
    title: 'Good afternoon.',
    message: 'Take a thoughtful moment for learning and practice.',
  });
  assert.deepEqual(greetingCopy.evening, {
    title: 'Good evening.',
    message: 'Pause, reflect, and carry one insight into the rest of your day.',
  });
  assert.deepEqual(greetingCopy.night, {
    title: 'Good night.',
    message: 'End the day with a little reflection.',
  });
});

test('the next timer targets the next local period boundary', () => {
  assert.equal(millisecondsUntilNextPeriod(new Date(2026, 10, 14, 4, 59, 30)), 30_000);
  assert.equal(millisecondsUntilNextPeriod(new Date(2026, 10, 14, 11, 30)), 30 * 60 * 1000);
  assert.equal(millisecondsUntilNextPeriod(new Date(2026, 10, 14, 20, 59, 30)), 30_000);
  assert.equal(millisecondsUntilNextPeriod(new Date(2026, 10, 14, 22, 0, 0)), 7 * 60 * 60 * 1000);
});
