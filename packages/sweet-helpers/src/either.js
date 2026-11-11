'lang sweet.js';
// @flow

export class Either<L, R> {
  right: any;
  left: any;
  static ['fantasy-land/of']<V>(v: V): Either<any, V> {
    return Either.of(v);
  }

  static of<V>(v: V): Either<any, V> {
    return new Right(v);
  }

  static isLeft(e: Either<any, any>): boolean {
    return e instanceof Left;
  }

  static isRight(e: Either<any, any>): boolean {
    return e instanceof Right;
  }

  ['fantasy-land/map']<C>(f: (R) => C): Either<L, C> {
    return this.map(f);
  }

  ['fantasy-land/ap']<C>(either: Either<L, (R) => C>): Either<L, C> {
    return this.ap(either);
  }

  ['fantasy-land/chain']<C>(f: (R) => Either<L, C>): Either<L, C> {
    return this.chain(f);
  }

  ['fantasy-land/extend']<C>(e: (Either<L, R>) => C): Either<L, C> {
    return this.extend(e);
  }

  ['fantasy-land/bimap']<C, D>(l: (L) => C, r: (R) => D): Either<C, D> {
    return this.bimap(l, r);
  }

  map<C>(f: (R) => C): Either<L, C> {
    throw new Error();
  }

  ap<C>(either: Either<L, (R) => C>): Either<L, C> {
    throw new Error();
  }

  chain<C>(f: (R) => Either<L, C>): Either<L, C> {
    throw new Error();
  }

  extend<C>(e: (Either<L, R>) => C): Either<L, C> {
    throw new Error();
  }

  bimap<C, D>(l: (L) => C, r: (R) => D): Either<C, D> {
    throw new Error();
  }

  either<C>(l: (L) => C, r: (R) => C): C {
    throw new Error();
  }

  foreach(l: (L) => void, r: (R) => void): Either<L, R> {
    throw new Error();
  }
}
export class Left<L, R> extends Either<L, R> {
  left: L;

  constructor(left: L) {
    super();
    this.left = left;
  }

  map<C>(f: (R) => C): Either<L, C> {
    return new Left(this.left);
  }

  ap<C>(either: Either<L, (R) => C>): Either<L, C> {
    return new Left(this.left);
  }

  chain<C>(f: (R) => Either<L, C>): Either<L, C> {
    return new Left(this.left);
  }

  extend<C>(e: (Either<L, R>) => C): Either<L, C> {
    return new Left(this.left);
  }

  bimap<C, D>(l: (L) => C, r: (R) => D): Either<C, D> {
    return new Left(l(this.left));
  }

  either<C>(l: (L) => C, r: (R) => C): C {
    return l(this.left);
  }

  foreach(l: (L) => void, r: (R) => void): Either<L, R> {
    l(this.left);
    return new Left(this.left);
  }
}

export class Right<L, R> extends Either<L, R> {
  right: R;

  constructor(right: R) {
    super();
    this.right = right;
  }

  map<C>(f: (R) => C): Either<L, C> {
    return new Right(f(this.right));
  }

  ap<C>(either: Either<L, (R) => C>): Either<L, C> {
    if (either instanceof Left) {
      return new Left(either.left);
    } else if (either instanceof Right && typeof this.right === 'function') {
      let rightFn: any = this.right;
      return new Right(rightFn(either.right));
    }
    throw new Error('Invalid type');
  }

  chain<C>(f: (R) => Either<L, C>): Either<L, C> {
    return f(this.right);
  }

  extend<C>(e: (Either<L, R>) => C): Either<L, C> {
    return new Right(e(this));
  }

  bimap<C, D>(l: (L) => C, r: (R) => D): Either<C, D> {
    return new Right(r(this.right));
  }

  either<C>(l: (L) => C, r: (R) => C): C {
    return r(this.right);
  }

  foreach(l: (L) => void, r: (R) => void): Either<L, R> {
    r(this.right);
    return new Right(this.right);
  }
}
