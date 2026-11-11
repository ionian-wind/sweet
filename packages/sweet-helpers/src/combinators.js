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

export const identifier: Parser<Term, Term> = Parser.sat(
  H.isIdentifier,
  'identifier',
);
export const identifierWith = (pred: (string) => boolean): Parser<any, any> =>
  Parser.sat(
    (obj) => H.isIdentifier(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'identifier',
  );
export const keyword: Parser<Term, Term> = Parser.sat(H.isKeyword, 'keyword');
export const keywordWith = (pred: (string) => boolean): Parser<any, any> =>
  Parser.sat(
    (obj) => H.isKeyword(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'keyword',
  );
export const punctuator: Parser<Term, Term> = Parser.sat(
  H.isPunctuator,
  'punctuator',
);
export const punctuatorWith = (pred: (string) => boolean): Parser<any, any> =>
  Parser.sat(
    (obj) => H.isPunctuator(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'punctuator',
  );
export const numeric: Parser<Term, Term> = Parser.sat(
  H.isNumericLiteral,
  'numeric',
);
export const numericWith = (pred: (number) => boolean): Parser<any, any> =>
  Parser.sat(
    (obj) =>
      H.isNumericLiteral(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'numeric',
  );
export const string: Parser<Term, Term> = Parser.sat(
  H.isStringLiteral,
  'string',
);
export const stringWith = (pred: (string) => boolean): Parser<any, any> =>
  Parser.sat(
    (obj) => H.isStringLiteral(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'string',
  );
export const templateElement: Parser<Term, Term> = Parser.sat(
  H.isTemplateElement,
  'templateElement',
);
export const templateElementWith = (
  pred: (Term) => boolean,
): Parser<any, any> =>
  Parser.sat(
    (obj) =>
      H.isTemplateElement(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'templateElement',
  );
export const template: Parser<Term, Term> = Parser.sat(
  H.isTemplate,
  'template',
);
export const templateWith = (pred: (Term) => boolean): Parser<any, any> =>
  Parser.sat(
    (obj) => H.isTemplate(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'template',
  );
export const regex: Parser<Term, Term> = Parser.sat(H.isRegExp, 'regex');
export const regexWith = (pred: (Term) => boolean): Parser<any, any> =>
  Parser.sat(
    (obj) => H.isRegExp(obj) && pred(unsafeProp('value', H.unwrap(obj))),
    'regex',
  );
export const braces: Parser<Term, Term> = Parser.sat(H.isBraces, 'braces');
export const brackets: Parser<Term, Term> = Parser.sat(
  H.isBrackets,
  'brackets',
);
export const parens: Parser<Term, Term> = Parser.sat(H.isParens, 'parens');

function runParserInner(
  p: Parser<any, Term>,
  pred: (Term) => boolean,
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

export function delimiterInner(p: Parser<any, Term>): Parser<any, Term> {
  return runParserInner(p, H.isDelimiter);
}

export function bracesInner(p: Parser<any, Term>): Parser<any, Term> {
  return runParserInner(p, H.isBraces);
}

export function bracketsInner(p: Parser<any, Term>): Parser<any, Term> {
  return runParserInner(p, H.isBrackets);
}

export function parensInner(p: Parser<any, Term>): Parser<any, Term> {
  return runParserInner(p, H.isParens);
}

export function many<A>(p: Parser<A, any>): Parser<A[], any> {
  return p
    .chain((x) => many(p).chain((xs) => Parser.of(xs.concat(x))))
    .alt(Parser.of([]));
}

export function many1<A>(p: Parser<A, any>): Parser<A[], any> {
  return p.chain((x) => many(p).chain((xs) => Parser.of(xs.concat(x))));
}

export function sepBy1<A, B>(
  p: Parser<A, any>,
  sep: Parser<B, any>,
): Parser<A[], any> {
  return p.chain((x) =>
    many1(sep.chain(() => p.chain((y) => Parser.of(y)))).chain((xs) =>
      Parser.of(xs.concat(x)),
    ),
  );
}

export function sepBy<A, B>(
  p: Parser<A, any>,
  sep: Parser<B, any>,
): Parser<A[], any> {
  return sepBy1(p, sep).alt(Parser.of([]));
}

export function lift2<A, B, C>(
  f: (A, B) => C,
): (a: Parser<A, any>, b: Parser<B, any>) => Parser<C, any> {
  return (a, b) => a.chain((va) => b.chain((vb) => Parser.of(f(va, vb))));
}

export function sequence<A>(...parsers: Parser<A, any>[]): Parser<A[], any> {
  let init: Parser<A[], any> = Parser.of([]);
  let f: (Parser<A[], any>, Parser<A, any>) => Parser<A[], any> = lift2(
    (a, b) => a.concat(b),
  );
  return parsers.reduce(f, init);
}

export function disj<A>(
  a: Parser<A, any>,
  b: Parser<A, any>,
  msg: string = 'failed disjunction',
): Parser<A, any> {
  return a.alt(b).alt(Parser.failure(msg));
}

export function infixl<A>(
  p: Parser<A, any>,
  op: Parser<(A, A) => A, any>,
): Parser<A, any> {
  // $FlowFixMe[missing-local-annot]
  // $FlowFixMe[recursive-definition]
  function rest(x) {
    return op.chain((f) => p.chain((y) => rest(f(x, y)))).alt(Parser.of(x));
  }
  return p.chain(rest);
}

export function infixr<A>(
  p: Parser<A, any>,
  op: Parser<(A, A) => A, any>,
): Parser<A, any> {
  return p.chain((x) =>
    op
      .chain((f) => infixr(p, op).chain((y) => Parser.of(f(x, y))))
      .alt(Parser.of(x)),
  );
}
