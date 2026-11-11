import test from 'ava';
import { List } from 'immutable';
import {
  ArrayBinding,
  BindingIdentifier,
  BindingPropertyIdentifier,
  BindingPropertyProperty,
  ObjectBinding,
} from 'sweet-spec';
import { collectBindings } from '../../src/hygiene-utils.js';

test('collects a single binding identifier', (t) => {
  const binding = new BindingIdentifier({ name: 'value' });

  t.deepEqual(collectBindings(binding).toArray(), ['value']);
});

test('collects array binding elements and rest bindings', (t) => {
  const binding = new ArrayBinding({
    elements: List.of(
      new BindingIdentifier({ name: 'first' }),
      null,
      new BindingIdentifier({ name: 'second' }),
    ),
    rest: new BindingIdentifier({ name: 'rest' }),
  });

  t.deepEqual(collectBindings(binding).filter(Boolean).toArray(), [
    'rest',
    'first',
    'second',
  ]);
});

test('collects binding property identifiers', (t) => {
  const identifier = new BindingPropertyIdentifier({
    binding: new BindingIdentifier({ name: 'value' }),
  });
  const property = new BindingPropertyProperty({
    name: { name: 'key' },
    binding: new BindingIdentifier({ name: 'value' }),
  });

  t.deepEqual(collectBindings(identifier).toArray(), ['value']);
  t.deepEqual(collectBindings(property).toArray(), ['value']);
});

test('collects no names from an object binding', (t) => {
  const binding = new ObjectBinding({ properties: List() });

  t.deepEqual(collectBindings(binding).toArray(), []);
});
