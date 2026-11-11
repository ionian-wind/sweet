// @flow
import type SweetLoader from './sweet-loader';
import { transform as babel } from '@babel/core';

type CompileOptions = {
  refererName?: string,
  debugStore?: Map<string, string>,
  noBabel?: boolean,
  loader: SweetLoader,
};

function compileModule(
  entryPath: string,
  loader: SweetLoader,
  refererName?: string,
) {
  return loader.compile(entryPath, {
    refererName,
    enforceLangPragma: false,
    isEntrypoint: true,
  });
}

export function parse(
  entryPath: string,
  loader: SweetLoader,
  options?: CompileOptions,
): any {
  let refererName;
  if (options != null) {
    refererName = options.refererName;
  }
  return compileModule(entryPath, loader, refererName).parse();
}

export function compile(
  entryPath: string,
  loader: SweetLoader,
  options?: CompileOptions,
): any | { code: any } {
  let refererName,
    noBabel = true;
  if (options != null) {
    refererName = options.refererName;
    // $FlowFixMe[incompatible-type]
    noBabel = options.noBabel;
  }
  let code = compileModule(entryPath, loader, refererName).codegen();
  if (noBabel) {
    return {
      code,
    };
  }
  return babel(code, {
    babelrc: false,
    configFile: false,
    presets: [['@sweet-js/babel-preset', { modules: false }]],
  });
}
