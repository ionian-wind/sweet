#!/usr/bin/env node

import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  throw new Error('usage: add-flow-constructors.js <flow-file>');
}

let source = fs.readFileSync(file, 'utf8');
const constructor = '  constructor(attrs?: any, type?: string): void;';

// Expand single-line class declarations that have no body.
source = source.replace(
  /(declare\s+export\s+(?:default\s+)?class\s+[A-Za-z_$][\w$]*(?:\s+extends\s+[A-Za-z_$][\w$.]*)?\s*\{)[ \t]*\}/g,
  `$1\n${constructor}\n}`,
);

// Insert a constructor immediately after the opening brace of multi-line classes
// that do not already declare one.
source = source.replace(
  /(declare\s+export\s+(?:default\s+)?class\s+[A-Za-z_$][\w$]*(?:\s+extends\s+[A-Za-z_$][\w$.]*)?\s*\{)\n(?!\s*constructor\b)/g,
  `$1\n${constructor}\n`,
);

source = source.replace(/\binner: Term\[\];/g, 'inner: any;');

source = source.replace(
  /(declare\s+export\s+default\s+class\s+Term\s*\{\n\s*constructor\([^\n]*\n)/,
  `$1  static CloneReducer: any;\n  type: string;\n  loc: any;\n  reduce(reducer: any): any;\n  extend(attrs?: any): any;\n  _reduceState(reducer: any, state?: any): any;\n  _cloneAttrs(): any;\n`,
);

fs.writeFileSync(file, source);
