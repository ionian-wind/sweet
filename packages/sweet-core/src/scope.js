// @flow
import type { SymbolClass } from './symbol.js';
import { Symbol } from './symbol.js';

let scopeIndex = 0;

export function freshScope(name: string = 'scope'): SymbolClass {
  scopeIndex++;
  return Symbol(name + '_' + scopeIndex);
}

export function Scope(name: string): SymbolClass {
  return Symbol(name);
}
