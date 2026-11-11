import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { transformSync } from '@babel/core';

function shouldTransform(url) {
  if (!url.startsWith('file:') || !url.endsWith('.js')) {
    return false;
  }
  const file = fileURLToPath(url);
  return (
    file.includes('/packages/') &&
    !file.includes('/node_modules/') &&
    !file.includes('/dist/')
  );
}

export async function load(url, context, nextLoad) {
  if (!shouldTransform(url)) {
    return nextLoad(url, context);
  }

  const filename = fileURLToPath(url);
  const source = readFileSync(filename, 'utf8');
  const { code } = transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    presets: ['@babel/preset-flow'],
    sourceMaps: 'inline',
  });

  return {
    format: 'module',
    source: code,
    shortCircuit: true,
  };
}
