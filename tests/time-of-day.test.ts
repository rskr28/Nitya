import assert from 'node:assert/strict';
import test from 'node:test';
import { getTimePeriod, millisecondsUntilNextPeriod } from '../src/features/visualIdentity/timeOfDay.ts';
test('local greeting period boundaries', () => {
  assert.equal(getTimePeriod(new Date(2026,0,1,4,59)),'night');
  assert.equal(getTimePeriod(new Date(2026,0,1,5,0)),'morning');
  assert.equal(getTimePeriod(new Date(2026,0,1,11,59)),'morning');
  assert.equal(getTimePeriod(new Date(2026,0,1,12,0)),'afternoon');
  assert.equal(getTimePeriod(new Date(2026,0,1,16,59)),'afternoon');
  assert.equal(getTimePeriod(new Date(2026,0,1,17,0)),'evening');
  assert.equal(getTimePeriod(new Date(2026,0,1,20,59)),'evening');
  assert.equal(getTimePeriod(new Date(2026,0,1,21,0)),'night');
});
test('schedule next boundary in device-local time', () => {
  assert.equal(millisecondsUntilNextPeriod(new Date(2026,0,1,4,59,30)),30000);
  assert.equal(millisecondsUntilNextPeriod(new Date(2026,0,1,20,59,30)),30000);
  assert.equal(millisecondsUntilNextPeriod(new Date(2026,0,1,22,0,0)),7*60*60*1000);
});