import test from 'ava';
import { List } from 'immutable';
import {
  expandCompiletime,
  sanitizeReplacementValues,
} from '../../src/load-syntax.js';

test('expands a compiletime term in the next phase', (t) => {
  const term = { type: 'RawSyntax', value: {} };
  const context = { phase: 0, store: {} };

  t.is(expandCompiletime(term, context), term);
});

test('sanitizes arrays and lists recursively', (t) => {
  t.deepEqual(sanitizeReplacementValues([1, 2]).toArray(), [1, 2]);
  t.deepEqual(sanitizeReplacementValues(List([1, List([2, 3])])).toJS(), [
    1,
    [2, 3],
  ]);
});

test('sanitizes iterators', (t) => {
  const iterator = [1, 2].values();

  t.deepEqual(sanitizeReplacementValues(iterator).toArray(), [1, 2]);
});

test('leaves scalar replacement values unchanged', (t) => {
  t.is(sanitizeReplacementValues(42), 42);
  t.is(sanitizeReplacementValues('value'), 'value');
});

test('rejects null replacement values', (t) => {
  t.throws(() => sanitizeReplacementValues(null), {
    message: /must not be null or undefined/,
  });
  t.throws(() => sanitizeReplacementValues([undefined]), {
    message: /must not be null or undefined/,
  });
});
