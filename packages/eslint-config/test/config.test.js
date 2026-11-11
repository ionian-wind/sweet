import test from 'ava';
import defaultConfig, { createConfig } from '../index.js';

test('exposes a default config and a factory', (t) => {
  t.true(Array.isArray(defaultConfig));
  t.true(Array.isArray(createConfig()));
});

test('ignores build output and custom paths', (t) => {
  const [ignores] = createConfig({ ignores: ['custom/**'] });

  t.true(ignores.ignores.includes('**/dist/**'));
  t.true(ignores.ignores.includes('**/coverage/**'));
  t.true(ignores.ignores.includes('custom/**'));
});

test('merges globals and rules', (t) => {
  const [, config] = createConfig({
    globals: { sweet: 'readonly' },
    rules: { semi: 'error' },
  });

  t.is(config.languageOptions.globals.sweet, 'readonly');
  t.is(config.languageOptions.globals.process, false);
  t.is(config.rules.semi, 'error');
  t.is(config.rules['prettier/prettier'], 'error');
});

test('accepts custom file globs', (t) => {
  const [, config] = createConfig({ files: ['src/**/*.mjs'] });

  t.deepEqual(config.files, ['src/**/*.mjs']);
});
