# @ionian-wind/sweet

The command-line compiler for [Sweet.js](https://www.sweetjs.org), published from a
preservation fork of the archived Sweet.js repositories.

## Install

```sh
npm install -g @ionian-wind/sweet
```

Or run it without a global install:

```sh
npx @ionian-wind/sweet my_sweet_code.js
```

## Usage

```
sjs [options] <files...>

-o, --out-file <file>   write the result to a file
-d, --out-dir <dir>     write each result into a directory
-b, --no-babel          skip the Babel backend
-h, --help              show usage
--version               show the CLI version
```

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
- [Source repository](https://github.com/ionian-wind/sweet)

## License

BSD-2-Clause. Original Sweet.js code is by the Sweet.js contributors.
