import test from 'ava';
import { transformSync } from '@babel/core';
import preset from '../index.js';

function transform(code, options) {
  return transformSync(code, {
    babelrc: false,
    configFile: false,
    presets: [[preset, options]],
  }).code;
}

test('strips Flow types by default', (t) => {
  const output = transform('const value: number = 1;');

  t.regex(output, /const value = 1;/);
  t.false(output.includes(': number'));
});

test('preserves ES modules by default', (t) => {
  const output = transform('export const value = 1;');

  t.regex(output, /export const value = 1;/);
});

test('can emit CommonJS', (t) => {
  const output = transform('export const value = 1;', {
    modules: 'commonjs',
  });

  t.regex(output, /exports\.value/);
});

test('can disable the Flow preset', (t) => {
  const output = transform('const value = 1;', { flow: false });

  t.regex(output, /const value = 1;/);
});

test('honours explicit targets', (t) => {
  const output = transform('const fn = () => 1;', {
    targets: { ie: '11' },
  });

  t.regex(output, /function/);
});
