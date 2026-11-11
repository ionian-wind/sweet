import test from 'ava';
import { Either, Left, Right } from '../src/either.js';

test('constructs and identifies Right values', (t) => {
  const value = Either.of(1);

  t.true(value instanceof Right);
  t.true(Either.isRight(value));
  t.false(Either.isLeft(value));
});

test('identifies Left values', (t) => {
  const value = new Left('error');

  t.true(Either.isLeft(value));
  t.false(Either.isRight(value));
});

test('Left short-circuits map, ap, chain and extend', (t) => {
  const value = new Left('error');

  t.is(value.map((x) => x).left, 'error');
  t.is(value.ap(Either.of((x) => x)).left, 'error');
  t.is(value.chain((x) => Either.of(x)).left, 'error');
  t.is(value.extend((x) => x).left, 'error');
});

test('Right maps, applies, chains and extends', (t) => {
  t.is(new Right(2).map((x) => x * 2).right, 4);
  t.is(new Right((x) => x + 1).ap(new Right(2)).right, 3);
  t.is(new Right(2).chain((x) => new Right(x + 1)).right, 3);
  t.is(new Right(2).extend((value) => value.right * 3).right, 6);
});

test('Right propagates a Left through ap', (t) => {
  const result = new Right((x) => x).ap(new Left('error'));

  t.true(result instanceof Left);
  t.is(result.left, 'error');
});

test('Right.ap rejects non-function values', (t) => {
  t.throws(() => new Right(2).ap(new Right(1)), {
    message: 'Invalid type',
  });
});

test('either and bimap select the matching side', (t) => {
  t.is(
    new Right(2).either(
      (l) => l,
      (r) => r + 1,
    ),
    3,
  );
  t.is(
    new Left('error').either(
      (l) => l + '!',
      (r) => r,
    ),
    'error!',
  );
  t.is(
    new Right(2).bimap(
      (l) => l,
      (r) => r + 1,
    ).right,
    3,
  );
  t.is(
    new Left('error').bimap(
      (l) => l + '!',
      (r) => r,
    ).left,
    'error!',
  );
});

test('foreach visits the matching side', (t) => {
  let seen;

  new Right(2).foreach(
    () => {
      seen = 'left';
    },
    (value) => {
      seen = value;
    },
  );
  t.is(seen, 2);

  new Left('error').foreach(
    (value) => {
      seen = value;
    },
    () => {
      seen = 'right';
    },
  );
  t.is(seen, 'error');
});

test('fantasy-land aliases delegate to the core methods', (t) => {
  const value = Right.of(2);

  t.is(Either['fantasy-land/of'](1).right, 1);
  t.is(value['fantasy-land/map']((x) => x + 1).right, 3);
  t.is(Right.of((x) => x * 2)['fantasy-land/ap'](Right.of(2)).right, 4);
  t.is(value['fantasy-land/chain']((x) => Right.of(x + 1)).right, 3);
  t.is(value['fantasy-land/extend']((either) => either.right).right, 2);
  t.is(
    value['fantasy-land/bimap'](
      (l) => l,
      (r) => r,
    ).right,
    2,
  );
});

test('the Either base class requires concrete implementations', (t) => {
  const either = new Either();

  t.throws(() => either.map((x) => x));
  t.throws(() => either.ap(either));
  t.throws(() => either.chain((x) => x));
  t.throws(() => either.extend((x) => x));
  t.throws(() =>
    either.bimap(
      (l) => l,
      (r) => r,
    ),
  );
  t.throws(() =>
    either.either(
      (l) => l,
      (r) => r,
    ),
  );
  t.throws(() =>
    either.foreach(
      () => {},
      () => {},
    ),
  );
});
