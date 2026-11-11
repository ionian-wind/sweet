import test from 'ava';
import { List } from 'immutable';
import { BindingIdentifier, ObjectBinding } from 'sweet-spec';
import { collectBindings } from '../../src/hygiene-utils.js';

test('collects a single binding identifier', (t) => {
  const binding = new BindingIdentifier({ name: 'value' });

  t.deepEqual(collectBindings(binding).toArray(), ['value']);
});

test('collects no names from an object binding', (t) => {
  const binding = new ObjectBinding({ properties: List() });

  t.deepEqual(collectBindings(binding).toArray(), []);
});
