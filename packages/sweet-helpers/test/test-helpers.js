import test from 'ava';
import * as H from '../src/helpers.js';

const syntax = {
  fromIdentifier: (value) => ['identifier', value],
  fromKeyword: (value) => ['keyword', value],
  fromPunctuator: (value) => ['punctuator', value],
  fromNumber: (value) => ['number', value],
  fromString: (value) => ['string', value],
  from: (kind, value) => [kind, value],
};

const raw = (typeCode, extra = {}) => ({
  type: 'RawSyntax',
  value: { token: { typeCode, ...extra }, ...syntax },
});

const delimiter = (kind, inner = []) => ({
  type: 'RawDelimiter',
  kind,
  inner,
});

test('unwrap extracts token values by kind', (t) => {
  t.deepEqual(H.unwrap(null), {});
  t.deepEqual(H.unwrap(raw(4, { str: 'hello' })), { value: 'hello' });
  t.deepEqual(H.unwrap(raw(6, { items: ['a'] })), { value: ['a'] });
  t.deepEqual(H.unwrap(raw(0, { value: 'name' })), { value: 'name' });
  t.deepEqual(H.unwrap(delimiter('parens', ['inner'])), {
    value: ['inner'],
  });
  t.deepEqual(H.unwrap({ type: 'Unknown' }), {});
});

test('identifies token terms', (t) => {
  t.true(H.isIdentifier(raw(0)));
  t.true(H.isKeyword(raw(1)));
  t.true(H.isPunctuator(raw(2)));
  t.true(H.isNumericLiteral(raw(3)));
  t.true(H.isStringLiteral(raw(4)));
  t.true(H.isTemplateElement(raw(5)));
  t.true(H.isTemplate(raw(6)));
  t.true(H.isRegExp(raw(7)));

  t.false(H.isIdentifier(raw(1)));
  t.false(H.isKeyword(delimiter('parens')));
});

test('identifies delimiter terms', (t) => {
  t.true(H.isDelimiter(delimiter('parens')));
  t.true(H.isParens(delimiter('parens')));
  t.true(H.isBrackets(delimiter('brackets')));
  t.true(H.isBraces(delimiter('braces')));
  t.true(H.isSyntaxTemplate(delimiter('syntaxTemplate')));

  t.false(H.isParens(delimiter('braces')));
  t.false(H.isBrackets(delimiter('parens')));
  t.false(H.isBraces(delimiter('parens')));
  t.false(H.isSyntaxTemplate(delimiter('parens')));
  t.false(H.isDelimiter(raw(0)));
});

test('from* helpers delegate to the underlying syntax', (t) => {
  const term = raw(0);

  t.deepEqual(H.fromIdentifier(term, 'name'), ['identifier', 'name']);
  t.deepEqual(H.fromKeyword(term, 'if'), ['keyword', 'if']);
  t.deepEqual(H.fromPunctuator(term, '+'), ['punctuator', '+']);
  t.deepEqual(H.fromNumericLiteral(term, 1), ['number', 1]);
  t.deepEqual(H.fromStringLiteral(term, 'text'), ['string', 'text']);
  t.deepEqual(H.fromParens(term, ['x']), ['parens', ['x']]);
  t.deepEqual(H.fromBrackets(term, ['x']), ['brackets', ['x']]);
  t.deepEqual(H.fromBraces(term, ['x']), ['braces', ['x']]);
});
