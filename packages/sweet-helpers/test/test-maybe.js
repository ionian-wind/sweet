import test from 'ava';
import { Just, Maybe, Nothing } from '../src/maybe.js';

test('of, empty and zero construct the right variant', (t) => {
  t.true(Maybe.of(1) instanceof Just);
  t.true(Maybe.empty() instanceof Nothing);
  t.true(Maybe.zero() instanceof Nothing);
  t.true(Maybe['fantasy-land/of'](1) instanceof Just);
  t.true(Maybe['fantasy-land/empty']() instanceof Nothing);
  t.true(Maybe['fantasy-land/zero']() instanceof Nothing);
});

test('isJust and isNothing identify variants', (t) => {
  t.true(Maybe.isJust(Maybe.of(1)));
  t.false(Maybe.isJust(Maybe.empty()));
  t.true(Maybe.isNothing(Maybe.empty()));
  t.false(Maybe.isNothing(Maybe.of(1)));
});

test('Just maps and chains', (t) => {
  t.is(Maybe.of(2).map((x) => x * 2).value, 4);
  t.is(Maybe.of(2).chain((x) => Maybe.of(x + 1)).value, 3);
  t.is(Maybe.of(2)['fantasy-land/map']((x) => x + 1).value, 3);
  t.is(Maybe.of(2)['fantasy-land/chain']((x) => Maybe.of(x + 1)).value, 3);
});

test('Just applies a wrapped function', (t) => {
  t.is(Maybe.of(2).ap(Maybe.of((x) => x + 1)).value, 3);
  t.true(Maybe.of(2).ap(Maybe.empty()) instanceof Nothing);
  t.is(Maybe.of(2)['fantasy-land/ap'](Maybe.of((x) => x + 1)).value, 3);
});

test('Nothing short-circuits map, ap and chain', (t) => {
  const nothing = Maybe.empty();

  t.true(nothing.map((x) => x) instanceof Nothing);
  t.true(nothing.ap(Maybe.of((x) => x)) instanceof Nothing);
  t.true(nothing.chain((x) => Maybe.of(x)) instanceof Nothing);
  t.true(nothing['fantasy-land/map']((x) => x) instanceof Nothing);
  t.true(nothing['fantasy-land/ap'](Maybe.of((x) => x)) instanceof Nothing);
  t.true(nothing['fantasy-land/chain']((x) => Maybe.of(x)) instanceof Nothing);
});

test('the Maybe base class requires concrete implementations', (t) => {
  const maybe = new Maybe();

  t.throws(() => maybe.map((x) => x));
  t.throws(() => maybe.ap(maybe));
  t.throws(() => maybe.chain((x) => x));
});
