# @ionian-wind/sweet-core

Hygienic macros for JavaScript. Sweet lets you define new syntax directly in
JavaScript and compile it away, without a separate parser or preprocessor.

This package is published from a preservation fork of the archived Sweet.js
repositories. It is not an official upstream release. See the
[project status](https://www.sweetjs.org/doc/status.html) for what changed.

## Install

```sh
npm install @ionian-wind/sweet-core
```

For the command-line compiler:

```sh
npm install -g @ionian-wind/sweet
```

## Getting started

Write Sweet code:

```js
syntax hi = function (ctx) {
  return #`console.log('hello, world!')`;
}
hi
```

Compile it:

```sh
sjs my_sweet_code.js
```

## Documentation

- [Tutorial](https://www.sweetjs.org/doc/tutorial.html)
- [Reference](https://www.sweetjs.org/doc/reference.html)
- [Project status](https://www.sweetjs.org/doc/status.html)
- [Editor](https://www.sweetjs.org/browser/editor.html)
- [Source repository](https://github.com/ionian-wind/sweet)

## License

BSD-2-Clause. Original Sweet.js code is by the Sweet.js contributors.
