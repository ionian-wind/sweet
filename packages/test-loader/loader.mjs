import { existsSync, readFileSync } from 'node:fs';
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

function relativeWithExtension(specifier) {
  return (
    (specifier.startsWith('./') || specifier.startsWith('../')) &&
    !/\.[a-z0-9]+$/i.test(specifier)
  );
}

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (!/\.[a-z0-9]+$/i.test(specifier)) {
      for (const candidate of [`${specifier}.js`, `${specifier}/index.js`]) {
        try {
          return await nextResolve(candidate, context);
        } catch {
          // try the next candidate
        }
      }
    }
    throw error;
  }
}

export async function load(url, context, nextLoad) {
  if (!shouldTransform(url)) {
    return nextLoad(url, context);
  }

  const filename = fileURLToPath(url);
  let source = readFileSync(filename, 'utf8');

  // Models the CommonJS interop Babel used to provide for the runtime.
  source = source.replace(
    /import Term, \* as ([A-Za-z_$][\w$]*) from 'sweet-spec';/g,
    "import * as $1 from 'sweet-spec';\nconst Term = $1.default.default || $1.default;",
  );
  source = source.replace(
    /import Term from 'sweet-spec';/g,
    "import * as SweetSpec from 'sweet-spec';\nconst Term = SweetSpec.default.default || SweetSpec.default;",
  );
  source = source.replace(
    /import \{ Maybe \} from 'ramda-fantasy';/g,
    "import ramdaFantasy from 'ramda-fantasy';\nconst { Maybe } = ramdaFantasy;",
  );

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
