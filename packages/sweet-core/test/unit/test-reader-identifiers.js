import test from 'ava';
import read from '../../src/reader/token-reader.js';
import * as T from '../../src/tokens.js';

test('reads unicode-escaped identifiers', (t) => {
  const [token] = read('\\u0061');

  t.true(T.isIdentifier(token, 'a'));
});

test('reads brace-escaped identifiers', (t) => {
  const [token] = read('\\u{61}');

  t.true(T.isIdentifier(token, 'a'));
});

test('reads escapes in the middle of an identifier', (t) => {
  const [token] = read('a\\u0062');

  t.true(T.isIdentifier(token, 'ab'));
});

test('reads non-ASCII identifiers', (t) => {
  const [token] = read('café');

  t.true(T.isIdentifier(token, 'café'));
});

test('rejects an incomplete unicode escape', (t) => {
  t.throws(() => read('a\\ub'), { message: /Unexpected "\\\\"/ });
});

test('rejects an unsupported escape', (t) => {
  t.throws(() => read('\\x61'), { message: /Unexpected "\\\\"/ });
});
