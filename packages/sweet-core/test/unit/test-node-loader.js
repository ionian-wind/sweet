import test from 'ava';
import NodeLoader from '../../src/node-loader.js';

test('a node loader should normalize a path that is missing the extension', (t) => {
  let loader = new NodeLoader(import.meta.dirname);
  t.regex(loader.normalize('./test-node-loader'), /.*test-node-loader\.js/);
});
