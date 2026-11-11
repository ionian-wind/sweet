import { ImmutableContext } from '../src/parser.js';
import { compile } from '@sweet-js/core';
import NodeLoader from '@sweet-js/core/dist/node-loader';
import { transformSync } from '@babel/core';

export class MockContext {
  constructor(...values) {
    this.index = -1;
    this.values = values;
  }

  static of(...values) {
    return new ImmutableContext(new MockContext(...values));
  }

  mark() {
    return this.index;
  }
  reset(mark) {
    this.index = mark;
  }

  next() {
    if (this.index < this.values.length - 1) {
      return {
        done: false,
        value: this.values[++this.index],
      };
    }
    return { done: true };
  }
}

class EntrypointNodeLoader extends NodeLoader {
  constructor(entrypoint, basedir, options) {
    super(basedir, options);
    this.sourceCache.set(`${basedir}/*entrypoint*`, entrypoint);
  }

  normalize(name, refererName, refererAddress) {
    if (name === '*entrypoint*') {
      return `${this.baseDir}/*entrypoint*:0`;
    }
    return super.normalize(name, refererName, refererAddress);
  }
}

export function compileAndEval(code) {
  // eslint-disable-next-line no-unassigned-vars
  let output;
  let loader = new EntrypointNodeLoader(code, import.meta.dirname);
  let res = transformSync(compile('*entrypoint*', loader).code, {
    configFile: false,
    babelrc: false,
    presets: [['@sweet-js/babel-preset', { modules: false }]],
  }).code;
  eval(res);
  return output;
}
