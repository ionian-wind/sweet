import test from 'ava';
import Syntax from '../../src/syntax.js';

test('Syntax.of creates a syntax wrapper', (t) => {
  const token = { type: 'custom' };
  const stx = Syntax.of(token);

  t.is(stx.token, token);
});

test('Syntax.from rejects unknown and non-creatable types', (t) => {
  t.throws(() => Syntax.from('unknown', 1), {
    message: 'unknown is not a valid type',
  });
  t.throws(() => Syntax.from('assign', '='), {
    message: 'Cannot create a syntax from type assign',
  });
});

test('instance from* helpers create syntax values', (t) => {
  const base = Syntax.fromIdentifier('base');

  t.true(base.fromNull().value.isNullLiteral());
  t.true(base.fromNumber(1).value.isNumericLiteral(1));
  t.true(base.fromString('text').value.isStringLiteral('text'));
  t.true(base.fromPunctuator('+').value.isPunctuator('+'));
  t.true(base.fromKeyword('if').value.isKeyword('if'));
  t.true(base.fromIdentifier('value').value.isIdentifier('value'));
  t.true(
    base.fromRegularExpression('/value/').value.isRegularExpression('/value/'),
  );
});

test('static from* helpers create syntax values', (t) => {
  t.true(Syntax.fromNull().isNullLiteral());
  t.true(Syntax.fromNumber(1).isNumericLiteral(1));
  t.true(Syntax.fromString('text').isStringLiteral('text'));
  t.true(Syntax.fromPunctuator('+').isPunctuator('+'));
  t.true(Syntax.fromKeyword('if').isKeyword('if'));
  t.true(Syntax.fromIdentifier('value').isIdentifier('value'));
  t.true(
    Syntax.fromRegularExpression('/value/').isRegularExpression('/value/'),
  );
});

test('match rejects unknown types', (t) => {
  t.throws(() => Syntax.fromIdentifier('value').match('unknown'), {
    message: 'unknown is an invalid type',
  });
});

test('resolve requires a phase', (t) => {
  t.throws(() => Syntax.fromIdentifier('value').resolve(), {
    message: /must provide a phase to resolve/,
  });
});

test('toString renders string, number and identifier values', (t) => {
  t.is(Syntax.fromString('text').toString(), "'text'");
  t.is(Syntax.fromNumber(42).toString(), 42);
  t.is(Syntax.fromIdentifier('value').toString(), 'value');
});
