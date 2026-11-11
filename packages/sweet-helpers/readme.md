# @ionian-wind/sweet-helpers

A collection of utilities for matching syntax in [Sweet.js](https://www.sweetjs.org)
macros.

This package is published from a preservation fork of the archived Sweet.js
repositories. See the [project status](https://www.sweetjs.org/doc/status.html) for
what changed.

## Install

```sh
npm install @ionian-wind/sweet-helpers
```

Use it inside a macro with a compiletime import:

```js
import { unwrap, isKeyword } from '@ionian-wind/sweet-helpers' for syntax;

syntax m = ctx => {
  let id = ctx.next().value;
  return #`${id}`;
};
```

## Documentation

- [Helpers reference](https://www.sweetjs.org/doc/reference.html#helpers)
- [Tutorial](https://www.sweetjs.org/doc/tutorial.html)
- [Project status](https://www.sweetjs.org/doc/status.html)
- [Source repository](https://github.com/ionian-wind/sweet)

## License

BSD-2-Clause. Original Sweet.js code is by the Sweet.js contributors.
