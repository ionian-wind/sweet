// @flow
// $FlowFixMe[import-value-as-type]
import type { Symbol as $IMPORTED_TYPE$_Symbol } from './symbol';
import { Symbol } from './symbol';

let scopeIndex = 0;

export function freshScope(name: string = 'scope'): $IMPORTED_TYPE$_Symbol {
  scopeIndex++;
  return Symbol(name + '_' + scopeIndex);
}

export function Scope(name: string): $IMPORTED_TYPE$_Symbol {
  return Symbol(name);
}
