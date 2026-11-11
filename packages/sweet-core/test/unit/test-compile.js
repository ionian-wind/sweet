import test from 'ava';
import { compile, parse } from '../../src/sweet.js';
import StoreLoader from '../../src/store-loader.js';

function makeLoader(source = 'var x = 1;') {
  return new StoreLoader(import.meta.dirname, new Map([['main.js', source]]));
}

test('parse accepts compile options', (t) => {
  const ast = parse('main.js', makeLoader(), { refererName: 'ref.js' });

  t.is(ast.type, 'Module');
});

test('compile can skip Babel', (t) => {
  const result = compile('main.js', makeLoader(), {
    refererName: 'ref.js',
    noBabel: true,
  });

  t.regex(result.code, /var x_\d+ = 1;/);
  t.false(result.code.includes('sourceMappingURL'));
});

test('compile runs Babel when requested', (t) => {
  const result = compile('main.js', makeLoader(), {});

  t.regex(result.code, /var x_\d+ = 1;/);
  t.true(result.code.includes('sourceMappingURL'));
});
