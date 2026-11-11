declare module 'readtable' {
  declare export class CharStream {
    constructor(source: string): void;
    peek: (...args: Array<any>) => any;
    readString: (...args: Array<any>) => any;
    getSlice: (...args: Array<any>) => any;
    sourceInfo: any;
  }

  declare export type Reader = any;
  declare export var Reader: any;

  declare export class Readtable {
    extend: (...args: Array<any>) => any;
    get: (...args: Array<any>) => any;
    getMapping: (...args: Array<any>) => any;
    isValue: any;
    set: (...args: Array<any>) => any;
  }

  declare export function isEOS(...args: Array<any>): any;
  declare export function getCurrentReadtable(...args: Array<any>): any;
  declare export function setCurrentReadtable(...args: Array<any>): any;
}
