import test from 'ava';
import read from '../../src/reader/token-reader.js';
import * as T from '../../src/tokens.js';

test('reads escaped slashes in regular expressions', (t) => {
  const [token] = read('/a\\/b/g');

  t.true(T.isRegExp(token, '/a\\/b/g'));
});

test('reads slashes inside character classes', (t) => {
  const [token] = read('/[/]/');

  t.true(T.isRegExp(token, '/[/]/'));
});

test('reads multiple flags', (t) => {
  const [token] = read('/a/gim');

  t.true(T.isRegExp(token, '/a/gim'));
});

test('rejects unterminated regular expressions', (t) => {
  t.throws(() => read('/abc'), {
    message: /Invalid regular expression: missing \//,
  });
});

test('rejects line terminators inside regular expressions', (t) => {
  t.throws(() => read('/a\\\nb/'), {
    message: /Invalid regular expression: missing \//,
  });
});
