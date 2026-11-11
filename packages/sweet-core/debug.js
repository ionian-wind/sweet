/*
This file makes debugging sweet.js easier. Uses the built version of sweet.js
to compile 'test.js'. You can use node-inspector to step through the expansion
process:

	npm install -g node-inspector
	node-debug debug.js
*/

import { compile } from './src/sweet.js';
import NodeLoader from './src/node-loader.js';

debugger;

let result = compile('./test.js', new NodeLoader(import.meta.dirname));
console.log(result.code);
