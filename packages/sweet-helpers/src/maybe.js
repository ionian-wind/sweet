'lang sweet.js';
// @flow

export class Maybe<T> {
  // $FlowFixMe[cannot-resolve-name]
  static ['fantasy-land/of'](v: T): Maybe<T> {
    return Maybe.of(v);
  }

  // $FlowFixMe[cannot-resolve-name]
  static of(v: T): Maybe<T> {
    return new Just(v);
  }

  // $FlowFixMe[cannot-resolve-name]
  static ['fantasy-land/empty'](): Maybe<T> {
    return Maybe.empty();
  }

  // $FlowFixMe[cannot-resolve-name]
  static empty(): Maybe<T> {
    return new Nothing();
  }

  // $FlowFixMe[cannot-resolve-name]
  static ['fantasy-land/zero'](): Maybe<T> {
    return Maybe.zero();
  }

  // $FlowFixMe[cannot-resolve-name]
  static zero(): Maybe<T> {
    return new Nothing();
  }

  static isJust(v: Maybe<any>): boolean {
    return v instanceof Just;
  }

  static isNothing(v: Maybe<any>): boolean {
    return v instanceof Nothing;
  }

  ['fantasy-land/map']<V>(f: (T) => V): Maybe<V> {
    return this.map(f);
  }

  map<V>(f: (T) => V): Maybe<V> {
    throw new Error();
  }

  ['fantasy-land/ap']<V>(other: Maybe<(T) => V>): Maybe<V> {
    return this.ap(other);
  }

  ap<V>(other: Maybe<(T) => V>): Maybe<V> {
    throw new Error();
  }

  ['fantasy-land/chain']<V>(f: (T) => Maybe<V>): Maybe<V> {
    return this.chain(f);
  }

  chain<V>(f: (T) => Maybe<V>): Maybe<V> {
    throw new Error();
  }
}

export class Nothing<T> extends Maybe<T> {
  map<V>(f: (T) => V): Maybe<V> {
    return Maybe.empty();
  }

  ap<V>(other: Maybe<(T) => V>): Maybe<V> {
    return Maybe.empty();
  }

  chain<V>(f: (T) => Maybe<V>): Maybe<V> {
    return Maybe.empty();
  }
}

export class Just<T> extends Maybe<T> {
  value: T;

  constructor(v: T) {
    super();
    this.value = v;
  }

  map<V>(f: (T) => V): Maybe<V> {
    return new Just(f(this.value));
  }

  ap<V>(other: Maybe<(T) => V>): Maybe<V> {
    if (other instanceof Just) {
      return Maybe.of(other.value(this.value));
    }
    return Maybe.empty();
  }

  chain<V>(f: (T) => Maybe<V>): Maybe<V> {
    return f(this.value);
  }
}
