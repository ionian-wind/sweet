import test from 'ava';
import fs from 'node:fs';
import * as core from '@ionian-wind/sweet-core';
import CoreNodeLoader from '@ionian-wind/sweet-core/dist/node-loader.js';
import * as shell from '../index.js';
import ShellNodeLoader from '../node-loader.js';

test('re-exports the core compiler API', (t) => {
  t.is(shell.compile, core.compile);
  t.is(shell.parse, core.parse);
});

test('re-exports the node loader', (t) => {
  t.is(ShellNodeLoader, CoreNodeLoader);
});

test('ships a CLI entrypoint', (t) => {
  t.true(fs.existsSync(new URL('../sjs.js', import.meta.url)));
});
