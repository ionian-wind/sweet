// @flow

import * as T from 'sweet-spec';
import * as _ from 'ramda';

export const isImportDeclaration: any = _.is(T.ImportDeclaration);

export const isExportDeclaration: any = _.is(T.ExportDeclaration);
export const isExport: any = _.is(T.Export);
export const isExportDefault: any = _.is(T.ExportDefault);
export const isExportFrom: any = _.is(T.ExportFrom);
export const isExportLocals: any = _.is(T.ExportLocals);

export const isVariableDeclaration: any = _.is(T.VariableDeclaration);
export const isVariableDeclarator: any = _.is(T.VariableDeclarator);
export const isSyntaxVariableDeclartion: any = _.both(
  isVariableDeclaration,
  _.either(_.propEq('kind', 'syntax'), _.propEq('kind', 'syntaxrec')),
);

export const isVariableDeclarationStatement: any = _.is(
  T.VariableDeclarationStatement,
);
export const isSyntaxDeclarationStatement = (term: any): false | boolean => {
  // syntax m = ...
  // syntaxrec m = ...
  return (
    isVariableDeclarationStatement(term) &&
    term.declaration.type === 'VariableDeclaration' &&
    (term.declaration.kind === 'syntax' ||
      term.declaration.kind === 'syntaxrec' ||
      term.declaration.kind === 'operator')
  );
};

export const isCompiletimeStatement = isSyntaxDeclarationStatement;

export const isFunctionDeclaration: any = _.is(T.FunctionDeclaration);
export const isClassDeclaration: any = _.is(T.ClassDeclaration);
