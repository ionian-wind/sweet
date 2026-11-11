import { parse } from './dist/sweet.js';
import NodeLoader from './dist/node-loader.js';

console.log(
  JSON.stringify(parse('test.js', new NodeLoader(import.meta.dirname)), null, 2),
);
