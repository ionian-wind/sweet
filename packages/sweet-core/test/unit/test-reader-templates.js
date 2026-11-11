import test from 'ava';
import read from '../../src/reader/token-reader.js';
import * as T from '../../src/tokens.js';

test('reads an empty template', (t) => {
  const [token] = read('``');

  t.true(T.isTemplate(token));
  t.true(T.isTemplateElement(token.items.get(0), ''));
});

test('reads multi-line templates', (t) => {
  const [token] = read('`first\nsecond`');

  t.true(T.isTemplate(token));
  t.true(T.isTemplateElement(token.items.get(0), 'first\nsecond'));
});

test('decodes simple template escapes', (t) => {
  const [token] = read('`a\\nb\\tc`');

  t.true(T.isTemplate(token));
  t.true(T.isTemplateElement(token.items.get(0), 'a\nb\tc'));
});

test('decodes unicode template escapes', (t) => {
  const [token] = read('`a\\u0061`');

  t.true(T.isTemplate(token));
  t.true(T.isTemplateElement(token.items.get(0), 'aa'));
});

test('rejects unterminated templates', (t) => {
  t.throws(() => read('`unterminated'), {
    message: /Unexpected end of input/,
  });
});
