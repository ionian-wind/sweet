declare module 'ramda-fantasy' {
  declare export class Maybe<T> {
    static of: (...args: Array<any>) => any;
    static empty: (...args: Array<any>) => any;
    static zero: (...args: Array<any>) => any;
    static isJust: (...args: Array<any>) => boolean;
    static isNothing: (...args: Array<any>) => boolean;
    static maybe: (...args: Array<any>) => any;
    static Nothing: (...args: Array<any>) => any;
    static Just: (...args: Array<any>) => any;

    map: (...args: Array<any>) => any;
    chain: (...args: Array<any>) => any;
    ap: (...args: Array<any>) => any;
    getOrElse: (...args: Array<any>) => any;
  }
}
