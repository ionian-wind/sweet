#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import semver from 'semver';

const require = createRequire(import.meta.url);
const { compile } = require('@sweet-js/core');
const NodeLoader = require('@sweet-js/core/dist/node-loader').default;

const argv = yargs(hideBin(process.argv))
  .usage('Usage: sjs [options] files ...')
  .demandCommand(1)
  .alias('o', 'out-file')
  .alias('d', 'out-dir')
  .alias('b', 'no-babel')
  .describe('b', 'do not use babel backend')
  .describe('o', 'write output to file')
  .describe('d', 'write output to directory')
  .nargs('out-file', 1)
  .nargs('out-dir', 1)
  .help('h')
  .alias('h', 'help')
  .parseSync();

if (!semver.satisfies(process.version, '>=20.19.0')) {
  console.log(
    'Sweet requires node >=20.19.0, you have: ' + process.version,
  );
  process.exit(1);
}

const loaderOptions = {
  noBabel: argv.noBabel,
  logging: argv.outFile || argv.outDir,
};

const loader = new NodeLoader(process.cwd(), loaderOptions);
argv._.forEach((file) => {
  const output = compile(fs.realpathSync(file), loader, {
    noBabel: argv.noBabel,
  }).code;

  if (argv.outFile) {
    fs.writeFileSync(argv.outFile, output, 'utf8');
  } else if (argv.outDir) {
    fs.writeFileSync(path.join(argv.outDir, path.basename(file)), output, 'utf8');
  } else {
    console.log(output);
  }
});
