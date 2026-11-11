---
layout: default
---

<div style="text-align: center">
  <img src="sweetjs.png" />
</div>

<h1 class="hero">Build your dream language</h1>

Sweet brings the hygienic macros of languages like Scheme and Rust to JavaScript. Macros allow you to sweeten the syntax of JavaScript and craft the language you always wanted.

## Getting started

Sweet requires Node.js `^22.20` or `>=24.12`. Install the command line app:

```
$ npm install -g @ionian-wind/sweet
```

Write your sweet code:

```
syntax hi = function (ctx) {
  return #`console.log('hello, world!')`;
}
hi
```

And compile:

```
$ sjs my_sweet_code.js
console.log('hello, world!')
```

The CLI is also available through `npx` without a global install:

```
$ npx @ionian-wind/sweet my_sweet_code.js
```

## Next steps

- **Learning**: read the [tutorial](doc/tutorial.html) or check out the [reference](doc/reference.html).
- **Embedding**: use [`@ionian-wind/sweet-core`](https://www.npmjs.com/package/@ionian-wind/sweet-core) to compile Sweet from Node.
- **Questions**: feel free to open an [issue](https://github.com/sweet-js/sweet-core/issues) on GitHub with any questions you might have.
- **Contributing**: from documentation, website upkeep, bug fixes, and features we'd love your help! See the [contributing guide](https://github.com/sweet-js/sweet-core/blob/master/CONTRIBUTING.md) for pointers on how to get involved.
