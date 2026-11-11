import test from 'ava';
import * as C from '../src/combinators.js';
import { MockContext } from './_helper.js';

const raw = (typeCode, extra = {}) => ({
  type: 'RawSyntax',
  value: { token: { typeCode, ...extra } },
});

test('typed token parsers accept the matching token kind', (t) => {
  t.is(C.identifier.run(MockContext.of(raw(0))).right[0].type, 'RawSyntax');
  t.is(C.keyword.run(MockContext.of(raw(1))).right[0].type, 'RawSyntax');
  t.is(C.punctuator.run(MockContext.of(raw(2))).right[0].type, 'RawSyntax');
  t.is(C.numeric.run(MockContext.of(raw(3))).right[0].type, 'RawSyntax');
  t.is(C.string.run(MockContext.of(raw(4))).right[0].type, 'RawSyntax');
  t.is(
    C.templateElement.run(MockContext.of(raw(5))).right[0].type,
    'RawSyntax',
  );
  t.is(C.template.run(MockContext.of(raw(6))).right[0].type, 'RawSyntax');
  t.is(C.regex.run(MockContext.of(raw(7))).right[0].type, 'RawSyntax');
});

test('...With parsers filter by token value', (t) => {
  t.is(
    C.identifierWith((value) => value === 'match').run(
      MockContext.of(raw(0, { value: 'match' })),
    ).right[0].type,
    'RawSyntax',
  );
  t.is(
    C.identifierWith((value) => value === 'match').run(
      MockContext.of(raw(0, { value: 'other' })),
    ).left,
    'identifier',
  );

  t.is(
    C.keywordWith((value) => value === 'match').run(
      MockContext.of(raw(1, { value: 'match' })),
    ).right[0].type,
    'RawSyntax',
  );
  t.is(
    C.punctuatorWith((value) => value === '+').run(
      MockContext.of(raw(2, { value: '+' })),
    ).right[0].type,
    'RawSyntax',
  );
  t.is(
    C.numericWith((value) => value === 42).run(
      MockContext.of(raw(3, { value: 42 })),
    ).right[0].type,
    'RawSyntax',
  );
  t.is(
    C.stringWith((value) => value === 'match').run(
      MockContext.of(raw(4, { str: 'match' })),
    ).right[0].type,
    'RawSyntax',
  );
  t.is(
    C.templateElementWith((value) => value === 'match').run(
      MockContext.of(raw(5, { value: 'match' })),
    ).right[0].type,
    'RawSyntax',
  );
  t.is(
    C.templateWith((items) => items.length === 1).run(
      MockContext.of(raw(6, { items: ['part'] })),
    ).right[0].type,
    'RawSyntax',
  );
  t.is(
    C.regexWith((value) => value === 'pattern').run(
      MockContext.of(raw(7, { value: 'pattern' })),
    ).right[0].type,
    'RawSyntax',
  );
});

test('a failed ...With predicate reports the token kind', (t) => {
  t.is(
    C.numericWith((value) => value === 42).run(
      MockContext.of(raw(3, { value: 1 })),
    ).left,
    'numeric',
  );
});

test('delimiter parsers accept matching delimiters', (t) => {
  const delimiter = (kind) => ({
    type: 'RawDelimiter',
    kind,
    inner: [],
  });

  t.is(
    C.braces.run(MockContext.of(delimiter('braces'))).right[0].kind,
    'braces',
  );
  t.is(
    C.brackets.run(MockContext.of(delimiter('brackets'))).right[0].kind,
    'brackets',
  );
  t.is(
    C.parens.run(MockContext.of(delimiter('parens'))).right[0].kind,
    'parens',
  );
  t.is(C.parens.run(MockContext.of(delimiter('braces'))).left, 'parens');
});
