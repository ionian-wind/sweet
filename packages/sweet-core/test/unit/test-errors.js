import test from 'ava';
import { assert, expect } from '../../src/errors.js';

test('expect does nothing when the condition holds', (t) => {
  t.notThrows(() => expect(true, 'should not fail'));
});

test('expect throws the provided message', (t) => {
  const error = t.throws(() => expect(false, 'something went wrong'));

  t.is(error.message, '[error]: something went wrong\n');
});

test('assert does nothing when the condition holds', (t) => {
  t.notThrows(() => assert(true, 'should not fail'));
});

test('assert throws an assertion error', (t) => {
  const error = t.throws(() => assert(false, 'invariant violated'));

  t.is(error.message, '[assertion error]: invariant violated');
});
