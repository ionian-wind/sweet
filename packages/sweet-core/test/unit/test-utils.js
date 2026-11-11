import test from 'ava';
import { List } from 'immutable';
import ASTDispatcher from '../../src/ast-dispatcher.js';
import Multimap from '../../src/multimap.js';
import read from '../../src/reader/token-reader.js';
import {
  getOperatorAssoc,
  getOperatorPrec,
  isOperator,
  isUnaryOperator,
  operatorLt,
} from '../../src/operators.js';
import { Scope } from '../../src/scope.js';
import Syntax from '../../src/syntax.js';
import * as T from '../../src/tokens.js';

const readTokens = (source) => read(source);

test('operatorLt handles left and right associativity', (t) => {
  t.true(operatorLt(1, 2, 'left'));
  t.false(operatorLt(2, 1, 'left'));
  t.true(operatorLt(2, 2, 'right'));
});

test('operator precedence and associativity are exposed', (t) => {
  t.is(getOperatorPrec('*'), 14);
  t.is(getOperatorPrec('|'), 7);
  t.is(getOperatorAssoc('*'), 'left');
});

test('detects unary operators', (t) => {
  t.true(isUnaryOperator(Syntax.fromPunctuator('!')));
  t.true(isUnaryOperator(Syntax.fromPunctuator('+')));
  t.true(isUnaryOperator(Syntax.fromIdentifier('typeof')));
  t.false(isUnaryOperator(Syntax.fromPunctuator(')')));
});

test('detects operators', (t) => {
  t.true(isOperator(Syntax.fromPunctuator('!')));
  t.true(isOperator(Syntax.fromIdentifier('typeof')));
  t.false(isOperator(Syntax.fromNumber(1)));
});

test('Scope creates interned symbols', (t) => {
  const scope = Scope('custom');

  t.is(scope.toString(), 'custom');
  t.is(Scope('custom'), scope);
});

test('Multimap appends to existing buckets', (t) => {
  const map = new Multimap();
  map.add('key', 1);
  map.add('key', 2);

  t.deepEqual(map.get('key').toArray(), [1, 2]);
  t.true(map.containsAt('key', 1));
  t.true(map.containsAt('key', 2));
  t.false(map.containsAt('key', 3));
  t.false(map.containsAt('missing', 1));
});

test('ASTDispatcher calls prefixed methods', (t) => {
  const dispatcher = new ASTDispatcher('visit', true);
  dispatcher.visitThing = (term) => term.value;

  t.is(dispatcher.dispatch({ type: 'Thing', value: 42 }), 42);
});

test('ASTDispatcher can return the term or throw', (t) => {
  const lenient = new ASTDispatcher('visit', false);
  const term = { type: 'Thing' };

  t.is(lenient.dispatch(term), term);
  t.throws(() => new ASTDispatcher('visit', true).dispatch(term), {
    message: 'Missing implementation for: visitThing',
  });
});

test('token predicates work without an expected value', (t) => {
  const [numeric] = readTokens('42');
  const [string] = readTokens('"text"');
  const [template] = readTokens('`text`');
  const [regexp] = readTokens('/text/');

  t.true(T.isNumeric(numeric));
  t.true(T.isString(string));
  t.true(T.isTemplateElement(template.items.get(0)));
  t.true(T.isRegExp(regexp));
});

test('getLineNumber handles slices, iterables and missing data', (t) => {
  const [numeric] = readTokens('42');

  t.is(T.getLineNumber({}), null);
  t.is(T.getLineNumber(List.of(numeric)), 1);
  t.is(T.getLineNumber(numeric), 1);
});
