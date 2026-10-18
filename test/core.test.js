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
  assert.equal(routedText({ label: 'Archive' }, ' memo '), '[Archive]  memo ');
});

test('bounded preview preserves whitespace and routed export keeps the full source',()=>{
 const source='  '+ 'é'.repeat(3000)+'  ',request=buildRequest(source);
 assert.equal(request.observation.text,source.slice(0,2000));assert.equal(request.observation.truncated,true);
 assert.equal(routedText({label:'Archive'},source),'[Archive] '+source);
});

test('changed clipboard blocks copying and unchanged snapshot copies exact output',async()=>{
 const {replaceRoutedClipboard}=await import('../src/core.js');const writes=[];
 const clipboard={readText:async()=> 'changed',copy:async value=>{writes.push(value);}};
 await assert.rejects(replaceRoutedClipboard('original','[Archive] original',clipboard),/Clipboard changed/);assert.deepEqual(writes,[]);
 clipboard.readText=async()=> 'original';await replaceRoutedClipboard('original','[Archive] original',clipboard);assert.deepEqual(writes,['[Archive] original']);
});


test('preview boundary never splits a valid surrogate pair and full export remains exact',()=>{
 const source='x'.repeat(1999)+'😀 suffix',request=buildRequest(source);
 assert.equal(request.observation.text,'x'.repeat(1999));assert.equal(request.observation.truncated,true);assert.equal(routedText({label:'Archive'},source),'[Archive] '+source);
 const complete='x'.repeat(1998)+'😀';assert.equal(buildRequest(complete).observation.text,complete);assert.equal(buildRequest(complete).observation.truncated,false);
});
test('exported finite route entries cannot be globally rewritten',async()=>{
 const {ROUTES}=await import('../src/core.js');assert.throws(()=>{ROUTES[0].id='injected';},TypeError);
 assert.equal(buildRequest('text').candidates[0].id,'do_now');
});
