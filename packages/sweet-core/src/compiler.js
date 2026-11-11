import TermExpander from './term-expander.js';
import TokenExpander from './token-expander.js';
import * as _ from 'ramda';
import Multimap from './multimap.js';

export default class Compiler {
  constructor(phase, env, store, context) {
    this.phase = phase;
    this.env = env;
    this.store = store;
    this.invokedRegistry = new Multimap();
    this.context = context;
  }

  compile(stxl) {
    let tokenExpander = new TokenExpander(
      _.mergeRight(this.context, {
        phase: this.phase,
        env: this.env,
        store: this.store,
        invokedRegistry: this.invokedRegistry,
      }),
    );
    let termExpander = new TermExpander(
      _.mergeRight(this.context, {
        phase: this.phase,
        env: this.env,
        store: this.store,
        invokedRegistry: this.invokedRegistry,
      }),
    );

    return tokenExpander.expand(stxl).map((t) => termExpander.expand(t));
  }
}
