'lang sweet.js';
// @flow

export class Maybe<T> {
  static ['fantasy-land/of']<V>(v: V): Maybe<V> {
    return Maybe.of(v);
  }

  static of<V>(v: V): Maybe<V> {
    return new Just(v);
  }

  static ['fantasy-land/empty']<V>(): Maybe<V> {
    return Maybe.empty();
  }

  static empty<V>(): Maybe<V> {
    return new Nothing();
  }

  static ['fantasy-land/zero']<V>(): Maybe<V> {
    return Maybe.zero();
  }

  static zero<V>(): Maybe<V> {
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
