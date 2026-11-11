import test from 'ava';
import MacroContext, { wrapInTerms } from '../../src/macro-context.js';
import read from '../../src/reader/token-reader.js';
import Syntax from '../../src/syntax.js';
import { makeEnforester } from '../assertions.js';
import { List } from 'immutable';

test('a macro context should have a name', (t) => {
  let enf = makeEnforester('a');
  let ctx = new MacroContext(enf, Syntax.fromIdentifier('foo'), {});
  t.true(ctx.name().value.val() === 'foo');
});

test('a macro context should be resettable', (t) => {
  let enf = makeEnforester('a b c');
  let ctx = new MacroContext(enf, 'foo', enf.context);

  let [a1, b1, c1] = [...ctx];
  t.true(ctx.next().done);

  ctx.reset();

  let nxt = ctx.next();
  t.false(nxt.done);

  let [a2, b2, c2] = [nxt.value, ...ctx];
  t.true(a1 === a2);
  t.true(b1 === b2);
  t.true(c1 === c2);
});

test('a macro context should be able to create a reset point', (t) => {
  let enf = makeEnforester('a b c');
  let ctx = new MacroContext(enf, Syntax.fromIdentifier('foo'), {});

  let a1 = ctx.next(); // a

  const bMarker = ctx.mark();

  const b1 = ctx.next(); // b

  const cMarker = ctx.mark();

  const c1 = ctx.next(); // c

  t.true(ctx.next().done);

  ctx.reset(bMarker);

  const [b2, c2] = [...ctx];

  ctx.reset(cMarker);

  const c3 = ctx.next();

  ctx.reset();

  let [a2, b3, c4] = [...ctx];

  ctx.reset(cMarker);

  let c5 = ctx.next();

  t.true(a1.value === a2);
  t.true(b1.value === b2 && b2 === b3);
  t.true(c1.value === c2 && c2 === c3.value && c2 === c4 && c4 === c5.value);
});

test("an enforester should be able to access a macro context's syntax list", (t) => {
  let enf = makeEnforester('a');
  let ctx = new MacroContext(enf, Syntax.fromIdentifier('foo'), {});
  t.true(ctx._rest(enf) instanceof List);
});

test('a macro context rejects access from another enforester', (t) => {
  let enf = makeEnforester('a');
  let ctx = new MacroContext(enf, Syntax.fromIdentifier('foo'), {});

  t.throws(() => ctx._rest(makeEnforester('b')), {
    message: 'Unauthorized access!',
  });
});

test('a macro context can contextify a delimiter', (t) => {
  let enf = makeEnforester('a');
  let ctx = new MacroContext(enf, Syntax.fromIdentifier('foo'), {});
  let [delimiter] = wrapInTerms(read('(a)'));

  t.true(ctx.contextify(delimiter) instanceof MacroContext);
});

test('a macro context rejects contextifying a non-delimiter', (t) => {
  let ctx = new MacroContext(
    makeEnforester('a'),
    Syntax.fromIdentifier('foo'),
    {},
  );

  t.throws(() => ctx.contextify({}), {
    message: /Can only contextify a delimiter/,
  });
});

test('a macro context reports the end of input when expanding', (t) => {
  let ctx = new MacroContext(
    makeEnforester(''),
    Syntax.fromIdentifier('foo'),
    {},
  );

  t.deepEqual(ctx.expand('expr'), { done: true, value: null });
});

test('a macro context rejects unknown expansion types', (t) => {
  let ctx = new MacroContext(
    makeEnforester('1'),
    Syntax.fromIdentifier('foo'),
    {},
  );

  t.throws(() => ctx.expand('UnknownType'), {
    message: 'Unknown term type: UnknownType',
  });
});

test('a macro context rejects invalid reset markers', (t) => {
  let ctx = new MacroContext(
    makeEnforester('a'),
    Syntax.fromIdentifier('foo'),
    {},
  );

  t.throws(() => ctx.reset('not-a-marker'), {
    message: 'marker must be an instance of Marker',
  });
});

test('a macro context rejects markers from another context', (t) => {
  let ctx1 = new MacroContext(
    makeEnforester('a'),
    Syntax.fromIdentifier('foo'),
    {},
  );
  let ctx2 = new MacroContext(
    makeEnforester('a'),
    Syntax.fromIdentifier('bar'),
    {},
  );

  t.throws(() => ctx2.reset(ctx1.mark()), {
    message: 'marker must originate from this context',
  });
});

test('a macro context can mark the end of the input', (t) => {
  let ctx = new MacroContext(
    makeEnforester('a'),
    Syntax.fromIdentifier('foo'),
    {},
  );
  ctx.next();

  let marker = ctx.mark();
  ctx.reset(marker);

  t.true(ctx.next().done);
});
