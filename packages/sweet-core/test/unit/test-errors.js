import test from 'ava';
import { assert, expect } from '../../src/errors.js';

test('expect does nothing when the condition holds', (t) => {
  t.notThrows(() => expect(true, 'should not fail'));
});

test('expect throws the provided message', (t) => {
  const error = t.throws(() => expect(false, 'something went wrong'));

  t.is(error.message, '[error]: something went wrong\n');
});

test('expect highlights the offending syntax in the remaining input', (t) => {
  const syntax = (value, delimiter = false) => ({
    isDelimiter: () => delimiter,
    val: () => value,
  });
  const offending = syntax('bad');
  const rest = [
    syntax('first'),
    syntax('delimiter', true),
    offending,
    syntax('last'),
  ];

  const error = t.throws(() => expect(false, 'mismatch', offending, rest));

  t.is(error.message, '[error]: mismatch\nfirst ( ... ) __bad__ last');
});

test('expect omits context when no remaining input is provided', (t) => {
  const error = t.throws(() => expect(false, 'no context'));

  t.is(error.message, '[error]: no context\n');
});

test('assert does nothing when the condition holds', (t) => {
  t.notThrows(() => assert(true, 'should not fail'));
});

test('assert throws an assertion error', (t) => {
  const error = t.throws(() => assert(false, 'invariant violated'));

  t.is(error.message, '[assertion error]: invariant violated');
});
