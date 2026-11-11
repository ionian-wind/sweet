import test from 'ava';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import NodeLoader from '../../src/node-loader.js';
import StoreLoader from '../../src/store-loader.js';
import SweetLoader from '../../src/sweet-loader.js';

test('the base loader requires subclasses for fetching and instantiating', (t) => {
  const loader = new SweetLoader(import.meta.dirname);

  t.throws(() => loader.fetch({}), {
    message: 'No default fetch defined',
  });
  t.throws(() => loader.instantiate({}), {
    message: 'Not implemented yet',
  });
  t.is(loader.eval('1 + 1'), 2);
  t.truthy(loader.freshStore());
});

test('the base loader can skip the Babel transform', (t) => {
  const loader = new SweetLoader(import.meta.dirname, { noBabel: true });

  t.deepEqual(loader.context.transform('const value = 1;'), {
    code: 'const value = 1;',
  });
});

test('modules without a lang pragma are skipped when enforcing it', (t) => {
  const loader = new SweetLoader(import.meta.dirname, { logging: true });
  const messages = [];
  const originalLog = console.log;
  console.log = (...args) => messages.push(args.join(' '));
  t.teardown(() => {
    console.log = originalLog;
  });

  const compiled = loader.compileSource('const value = 1;', 'plain.js', {
    enforceLangPragma: true,
    entryPath: 'plain.js',
    isEntrypoint: false,
  });

  t.is(compiled.items.size, 0);
  t.deepEqual(messages, ['skipping module plain.js']);
});

test('the store loader reports missing modules', (t) => {
  const loader = new StoreLoader(import.meta.dirname, new Map());

  t.throws(
    () =>
      loader.fetch({
        name: 'main.js',
        address: { path: 'main.js', phase: 0 },
      }),
    { message: /The module main\.js is not in the debug store/ },
  );
});

test('the node loader leaves unresolved modules unchanged', (t) => {
  const loader = new NodeLoader(import.meta.dirname);

  t.is(loader.normalize('./missing-module'), './missing-module:0');
});

test('the node loader rejects names without phase information', (t) => {
  const loader = new NodeLoader(import.meta.dirname);

  t.throws(() => loader.locate({ name: 'no-phase', metadata: {} }), {
    message: /missing phase information/,
  });
});

test('the node loader caches file contents', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sweet-loader-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'source.js');
  fs.writeFileSync(file, 'const value = 1;');

  const loader = new NodeLoader(dir);
  const request = {
    name: file,
    address: { path: file, phase: 0 },
    metadata: {},
  };

  t.is(loader.fetch(request), 'const value = 1;');
  fs.writeFileSync(file, 'changed');
  t.is(loader.fetch(request), 'const value = 1;');
});

test('the node loader returns an empty string for missing files', (t) => {
  const loader = new NodeLoader(import.meta.dirname);
  const missing = path.join(import.meta.dirname, 'does-not-exist.js');

  t.is(
    loader.fetch({
      name: missing,
      address: { path: missing, phase: 0 },
      metadata: {},
    }),
    '',
  );
});

test('the node loader evaluates in its store sandbox', (t) => {
  const loader = new NodeLoader(import.meta.dirname);
  const store = loader.freshStore();

  t.is(loader.eval('1 + 1', store), 2);
});

test('the node loader accepts custom extensions', (t) => {
  const loader = new NodeLoader(import.meta.dirname, {
    extensions: ['.js'],
  });

  t.deepEqual(loader.extensions, ['.js']);
});
