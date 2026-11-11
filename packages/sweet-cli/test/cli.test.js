import test from 'ava';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cli = path.join(import.meta.dirname, '..', 'bin', 'sjs.js');
const repoRoot = path.resolve(import.meta.dirname, '..', '..', '..');
const simpleFixture = path.join(import.meta.dirname, 'fixtures', 'simple.js');
const macroFixture = path.join(import.meta.dirname, 'fixtures', 'macro.js');

function run(args, options = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    ...options,
  });
}

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sjs-cli-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('compiles a file to stdout', (t) => {
  const result = run([simpleFixture]);

  t.is(result.status, 0, result.stderr);
  t.regex(result.stdout, /var x_\d+ = 1;/);
});

test('compiles macros', (t) => {
  const result = run([macroFixture]);

  t.is(result.status, 0, result.stderr);
  t.regex(result.stdout, /var result_\d+ = 42;/);
});

test('writes output to --out-file', (t) => {
  const outFile = path.join(tempDir(t), 'output.js');
  const result = run([simpleFixture, '--out-file', outFile]);

  t.is(result.status, 0, result.stderr);
  t.regex(fs.readFileSync(outFile, 'utf8'), /var x_\d+ = 1;/);
});

test('writes output to --out-dir', (t) => {
  const outDir = tempDir(t);
  const result = run([simpleFixture, '--out-dir', outDir]);

  t.is(result.status, 0, result.stderr);
  t.regex(
    fs.readFileSync(path.join(outDir, 'simple.js'), 'utf8'),
    /var x_\d+ = 1;/,
  );
});

test('--no-babel skips the Babel backend', (t) => {
  const result = run(['--no-babel', simpleFixture]);

  t.is(result.status, 0, result.stderr);
  t.regex(result.stdout, /var x_\d+ = 1;/);
  t.false(result.stdout.includes('sourceMappingURL'));
});

test('-b skips the Babel backend', (t) => {
  const result = run(['-b', simpleFixture]);

  t.is(result.status, 0, result.stderr);
  t.regex(result.stdout, /var x_\d+ = 1;/);
  t.false(result.stdout.includes('sourceMappingURL'));
});

test('requires at least one input file', (t) => {
  const result = run([]);

  t.not(result.status, 0);
  t.regex(result.stderr, /Not enough non-option arguments/);
});
