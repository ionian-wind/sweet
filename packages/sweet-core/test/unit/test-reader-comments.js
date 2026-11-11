import test from 'ava';
import read from '../../src/reader/token-reader.js';
import * as T from '../../src/tokens.js';

test('skips single-line comments', (t) => {
  const [token] = read('// comment\n42');

  t.true(T.isNumeric(token, 42));
});

test('skips single-line comments at end of input', (t) => {
  t.is(read('// comment').size, 0);
});

test('skips block comments', (t) => {
  const [token] = read('/* comment */ 42');

  t.true(T.isNumeric(token, 42));
});

test('skips multi-line block comments', (t) => {
  const [token] = read('/* first\nsecond */ 42');

  t.true(T.isNumeric(token, 42));
});

test('skips block comments with CRLF line endings', (t) => {
  const [token] = read('/* first\r\nsecond */ 42');

  t.true(T.isNumeric(token, 42));
});

test('skips block comments containing line separators', (t) => {
  const [token] = read('/* first\u2028second\u2029third */ 42');

  t.true(T.isNumeric(token, 42));
});

test('rejects unterminated block comments', (t) => {
  t.throws(() => read('/* unterminated'), {
    message: /Unexpected end of input/,
  });
});
