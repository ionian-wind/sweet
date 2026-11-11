'lang sweet.js';
// @flow
import Parser from './parser';
import { ImmutableContext } from './parser';
import * as H from './helpers';
import type { Term } from './helpers';
import { Either, Left, Right } from './either';
import { Just } from './maybe';

function unsafeProp(prop: string, obj: any): any {
  return obj[prop];
}

// $FlowFixMe[signature-verification-failure]
export const identifier = Parser.sat(H.isIdentifier, 'identifier');
// $FlowFixMe[signature-verification-failure]
export const identifierWith = (pred: (string) => boolean) =>
  Parser.sat(
    (obj) => H.isIdentifier(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'identifier',
  );
// $FlowFixMe[signature-verification-failure]
export const keyword = Parser.sat(H.isKeyword, 'keyword');
// $FlowFixMe[signature-verification-failure]
export const keywordWith = (pred: (string) => boolean) =>
  Parser.sat(
    (obj) => H.isKeyword(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'keyword',
  );
// $FlowFixMe[signature-verification-failure]
export const punctuator = Parser.sat(H.isPunctuator, 'punctuator');
// $FlowFixMe[signature-verification-failure]
export const punctuatorWith = (pred: (string) => boolean) =>
  Parser.sat(
    (obj) => H.isPunctuator(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'punctuator',
  );
// $FlowFixMe[signature-verification-failure]
export const numeric = Parser.sat(H.isNumericLiteral, 'numeric');
// $FlowFixMe[signature-verification-failure]
export const numericWith = (pred: (number) => boolean) =>
  Parser.sat(
    (obj) =>
      H.isNumericLiteral(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'numeric',
  );
// $FlowFixMe[signature-verification-failure]
export const string = Parser.sat(H.isStringLiteral, 'string');
// $FlowFixMe[signature-verification-failure]
export const stringWith = (pred: (string) => boolean) =>
  Parser.sat(
    (obj) => H.isStringLiteral(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'string',
  );
// $FlowFixMe[signature-verification-failure]
export const templateElement = Parser.sat(
  H.isTemplateElement,
  'templateElement',
);
// $FlowFixMe[signature-verification-failure]
export const templateElementWith = (pred: (Term) => boolean) =>
  Parser.sat(
    (obj) =>
      H.isTemplateElement(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'templateElement',
  );
// $FlowFixMe[signature-verification-failure]
export const template = Parser.sat(H.isTemplate, 'template');
// $FlowFixMe[signature-verification-failure]
export const templateWith = (pred: (Term) => boolean) =>
  Parser.sat(
    (obj) => H.isTemplate(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'template',
  );
// $FlowFixMe[signature-verification-failure]
export const regex = Parser.sat(H.isRegExp, 'regex');
// $FlowFixMe[signature-verification-failure]
export const regexWith = (pred: (Term) => boolean) =>
  Parser.sat(
    (obj) => H.isRegExp(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'regex',
  );
// $FlowFixMe[signature-verification-failure]
export const braces = Parser.sat(H.isBraces, 'braces');
// $FlowFixMe[signature-verification-failure]
export const brackets = Parser.sat(H.isBrackets, 'brackets');
// $FlowFixMe[signature-verification-failure]
export const parens = Parser.sat(H.isParens, 'parens');

// $FlowFixMe[value-as-type]
function runParserInner(
  // $FlowFixMe[value-as-type]
  p: Parser<any, Term>,
  pred: (Term) => boolean,
  // $FlowFixMe[value-as-type]
): Parser<any, Term> {
  return new Parser((ctx) => {
    let i = ctx.head();
    let originalCtx = ctx.ctx;
    if (i instanceof Just && pred(i.value)) {
      let innerCtx = originalCtx.contextify(i.value);
      let result = p.run(new ImmutableContext(innerCtx));
      if (result instanceof Right) {
        return Either.of([result.right[0], ctx.rest()]);
      }
      return result;
    } else {
      return new Left('');
    }
  });
}

// $FlowFixMe[signature-verification-failure]
export function delimiterInner(p: Parser<any, Term>) {
  return runParserInner(p, H.isDelimiter);
}

// $FlowFixMe[signature-verification-failure]
export function bracesInner(p: Parser<any, Term>) {
  return runParserInner(p, H.isBraces);
}

// $FlowFixMe[signature-verification-failure]
export function bracketsInner(p: Parser<any, Term>) {
  return runParserInner(p, H.isBrackets);
}

// $FlowFixMe[signature-verification-failure]
export function parensInner(p: Parser<any, Term>) {
  return runParserInner(p, H.isParens);
}

// $FlowFixMe[value-as-type]
export function many<A>(p: Parser<A, any>): Parser<A[], any> {
  // $FlowFixMe[underconstrained-implicit-instantiation]
  return (
    p
      // $FlowFixMe[underconstrained-implicit-instantiation]
      .chain((x) => many(p).chain((xs) => Parser.of(xs.concat(x))))
      .alt(Parser.of([]))
  );
}

// $FlowFixMe[value-as-type]
export function many1<A>(p: Parser<A, any>): Parser<A[], any> {
  // $FlowFixMe[underconstrained-implicit-instantiation]
  return p.chain((x) => many(p).chain((xs) => Parser.of(xs.concat(x))));
}

// $FlowFixMe[value-as-type]
export function sepBy1<A, B>(
  // $FlowFixMe[value-as-type]
  p: Parser<A, any>,
  // $FlowFixMe[value-as-type]
  sep: Parser<B, any>,
  // $FlowFixMe[value-as-type]
): Parser<A[], any> {
  return p.chain((x) =>
    many1(sep.chain(() => p.chain((y) => Parser.of(y)))).chain((xs) =>
      Parser.of(xs.concat(x)),
    ),
  );
}

// $FlowFixMe[value-as-type]
export function sepBy<A, B>(
  p: Parser<A, any>,
  sep: Parser<B, any>,
  // $FlowFixMe[value-as-type]
): Parser<A[], any> {
  // $FlowFixMe[underconstrained-implicit-instantiation]
  return sepBy1(p, sep).alt(Parser.of([]));
}

// $FlowFixMe[value-as-type]
export function lift2<A, B, C>(
  f: (A, B) => C,
  // $FlowFixMe[value-as-type]
): (a: Parser<A, any>, b: Parser<B, any>) => Parser<C, any> {
  return (a, b) => a.chain((va) => b.chain((vb) => Parser.of(f(va, vb))));
}

export function sequence<A>(...parsers: Parser<A, any>[]): Parser<A[], any> {
  // $FlowFixMe[value-as-type]
  let init: Parser<A[], any> = Parser.of([]);
  // $FlowFixMe[missing-local-annot]
  let f: (Parser<A[], any>, Parser<A, any>) => Parser<A[], any> = lift2(
    // $FlowFixMe[missing-local-annot]
    (a, b) => a.concat(b),
  );
  return parsers.reduce(f, init);
}

// $FlowFixMe[value-as-type]
export function disj<A>(
  // $FlowFixMe[value-as-type]
  a: Parser<A, any>,
  b: Parser<A, any>,
  msg: string = 'failed disjunction',
  // $FlowFixMe[value-as-type]
): Parser<A, any> {
  return a.alt(b).alt(Parser.failure(msg));
}

// $FlowFixMe[value-as-type]
export function infixl<A>(
  // $FlowFixMe[value-as-type]
  p: Parser<A, any>,
  // $FlowFixMe[value-as-type]
  op: Parser<(A, A) => A, any>,
  // $FlowFixMe[value-as-type]
): Parser<A, any> {
  // $FlowFixMe[missing-local-annot]
  // $FlowFixMe[recursive-definition]
  function rest(x) {
    return op.chain((f) => p.chain((y) => rest(f(x, y)))).alt(Parser.of(x));
  }
  return p.chain(rest);
}

// $FlowFixMe[value-as-type]
export function infixr<A>(
  // $FlowFixMe[value-as-type]
  p: Parser<A, any>,
  // $FlowFixMe[value-as-type]
  op: Parser<(A, A) => A, any>,
  // $FlowFixMe[value-as-type]
): Parser<A, any> {
  // $FlowFixMe[underconstrained-implicit-instantiation]
  return p.chain((x) =>
    op
      // $FlowFixMe[underconstrained-implicit-instantiation]
      .chain((f) => infixr(p, op).chain((y) => Parser.of(f(x, y))))
      .alt(Parser.of(x)),
  );
}
