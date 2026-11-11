import test from 'ava';
import read from '../../src/reader/token-reader.js';
import * as T from '../../src/tokens.js';

function numeric(source) {
  const [token] = read(source);
  return token;
}

test('reads hexadecimal, binary and octal literals', (t) => {
  t.is(numeric('0x1f').value, 31);
  t.is(numeric('0b101').value, 5);
  t.is(numeric('0o17').value, 15);
});

test('reads legacy octal literals', (t) => {
  const octal = numeric('077');

  t.is(octal.value, 63);
  t.true(octal.octal);
  t.false(octal.noctal);
});

test('reads legacy decimal literals with an octal prefix', (t) => {
  const decimal = numeric('089');

  t.is(decimal.value, 89);
  t.true(decimal.octal);
  t.true(decimal.noctal);
});

test('reads decimal and exponent forms', (t) => {
  t.is(numeric('0').value, 0);
  t.is(numeric('1.5').value, 1.5);
  t.is(numeric('1.5e2').value, 150);
  t.is(numeric('1e2').value, 100);
  t.is(numeric('1e+2').value, 100);
  t.is(numeric('1e-2').value, 0.01);
});

test('rejects empty radix literals', (t) => {
  t.throws(() => read('0x'), { message: /Unexpected end of input/ });
  t.throws(() => read('0b'), { message: /Unexpected end of input/ });
  t.throws(() => read('0o'), { message: /Unexpected end of input/ });
});

test('rejects invalid binary digits', (t) => {
  t.throws(() => read('0b102'), { message: /Unexpected "2"/ });
});

test('rejects incomplete exponents', (t) => {
  t.throws(() => read('1e'), { message: /Unexpected end of input/ });
  t.throws(() => read('1e+'), { message: /Unexpected end of input/ });
});

test('stops at a non-numeric token', (t) => {
  const [number, identifier] = read('42foo');

  t.true(T.isNumeric(number, 42));
  t.true(T.isIdentifier(identifier, 'foo'));
});
