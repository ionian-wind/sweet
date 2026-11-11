import test from 'ava';
import Term, {
  Expression,
  RawSyntax,
  Statement,
  SyntaxTerm,
  VariableDeclarationStatement,
} from '../dist/term-spec.js';
import * as spec from '../dist/term-spec.js';

test('exposes the Term class as the default export', (t) => {
  t.is(typeof Term, 'function');
  t.is(spec.default, Term);
});

test('creates frozen, typed terms', (t) => {
  const term = new Term({}, 'CustomTerm');

  t.is(term.type, 'CustomTerm');
  t.is(term.loc, null);
  t.true(Object.isFrozen(term));
});

test('exports the term hierarchy', (t) => {
  t.true(SyntaxTerm.prototype instanceof Term);
  t.true(Statement.prototype instanceof Term);
  t.true(Expression.prototype instanceof Term);
});

test('exports a broad set of concrete terms', (t) => {
  t.true(Object.keys(spec).length > 100);
  t.is(typeof spec.VariableDeclarationStatement, 'function');
  t.is(typeof spec.ImportDeclaration, 'function');
});

test('requires declared attributes', (t) => {
  t.throws(() => new VariableDeclarationStatement({}), {
    message: /Missing attribute: declaration/,
  });
  t.throws(() => new RawSyntax({}), {
    message: /Missing attribute: value/,
  });
});

test('constructs and clones concrete terms', (t) => {
  const declaration = { type: 'VariableDeclaration' };
  const term = new VariableDeclarationStatement({ declaration });

  t.is(term.type, 'VariableDeclarationStatement');
  t.is(term.declaration, declaration);

  const clone = term.extend({ declaration });

  t.not(clone, term);
  t.is(clone.type, 'VariableDeclarationStatement');
  t.is(clone.declaration, declaration);
});
