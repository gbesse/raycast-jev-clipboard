import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptResponse, buildRequest, fixtureResponse, routedText } from '../src/core.js';

test('request exposes exactly four finite routes', () => {
  const request = buildRequest('Read this proposal');
  assert.deepEqual(request.contract.choose_exactly_one, ['do_now', 'schedule', 'archive', 'review']);
});

test('fixture is deterministic and useful', () => {
  const request = buildRequest('Urgent: ship this today');
  assert.equal(fixtureResponse(request).candidate_id, 'do_now');
  assert.deepEqual(fixtureResponse(request), fixtureResponse(request));
});

test('response validation fails closed', () => {
  const request = buildRequest('hello', 7);
  assert.throws(() => acceptResponse(request, { revision: 6, candidate_id: 'archive' }), /Stale/);
  assert.throws(() => acceptResponse(request, { revision: 7, candidate_id: 'delete_everything' }), /escaped/);
});

test('clipboard input is bounded', () => {
  const request = buildRequest('x'.repeat(3000));
  assert.equal(request.observation.text.length, 2000);
  assert.equal(request.observation.truncated, true);
});

test('route output remains explicit', () => {
  assert.equal(routedText({ label: 'Archive' }, ' memo '), '[Archive] memo');
});
