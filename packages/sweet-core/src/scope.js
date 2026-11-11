// @flow
import type { SymbolClass } from './symbol';
import { Symbol } from './symbol';

let scopeIndex = 0;

export function freshScope(name: string = 'scope'): SymbolClass {
  scopeIndex++;
  return Symbol(name + '_' + scopeIndex);
}

export function Scope(name: string): SymbolClass {
  return Symbol(name);
}
