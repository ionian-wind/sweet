---
layout: default
toc: true
use_anchors: true
---

# Project status

> **This is a preservation fork, not an official Sweet.js release.** The original
> sweet-js repositories have been archived and are read-only on GitHub. This site and
> the `ionian-wind/sweet` repository document a local integration of that archived code.

## What this repository is

This monorepo brings the seven archived Sweet.js projects together so they can be
built, tested, and documented from one place:

- [`sweet-js/sweet-core`](https://github.com/sweet-js/sweet-core) → `@sweet-js/core`
- [`sweet-js/sweet-cli`](https://github.com/sweet-js/sweet-cli) → `@sweet-js/cli`
- [`sweet-js/sweet-helpers`](https://github.com/sweet-js/sweet-helpers) → `@sweet-js/helpers`
- [`sweet-js/sweet-spec`](https://github.com/sweet-js/sweet-spec) → `sweet-spec`
- [`sweet-js/sweet-spec-macro`](https://github.com/sweet-js/sweet-spec-macro) → `sweet-spec-macro`
- [`sweet-js/sweet-shell`](https://github.com/sweet-js/sweet-shell) → `sweet.js`
- [`sweet-js/sweet-website`](https://github.com/sweet-js/sweet-website) → `@sweet-js/website`

Each package was imported from its original `master` branch with `git subtree`, so the
upstream commit history is preserved alongside the integration commits.

## What is different from the archived code

The macro language and compiler behavior are intentionally preserved. The differences
are in the repository layout, tooling, module format, and a small set of compatibility
fixes needed to make the archived packages work together on current Node.js.

### Repository and build

- Seven separate repositories are now one npm-workspaces monorepo managed by Turbo.
- Shared tooling packages provide the Babel preset, ESLint flat config, Prettier
  config, and the AVA test loader.
- Build, lint, test, and coverage tasks run through Turbo (`npm run build`,
  `npm test`, `npm run lint`, `npm run coverage`).

### Toolchain and runtime

- Babel 8 replaces Babel 6.
- AVA 8 replaces ava 0.19; tests run as ESM.
- ESLint 10 and Prettier 3 replace ESLint 4 and Prettier 1.
- Flow 0.339 replaces Flow 0.45, with all legacy suppressions and `@noflow` pragmas
  removed.
- Node.js `^22.20` or `>=24.12` is required.
- Turbo 2.11 coordinates the workspace.

### Modules and packages

- Every workspace package is native ESM (`"type": "module"`).
- Relative imports use explicit `.js` extensions.
- `sweet-spec` ships a single ESM build; the transitional CommonJS output was removed.
- The CLI uses static ESM imports and no longer relies on `createRequire`.
- `ramda-fantasy` is imported through its default export for native ESM compatibility.

### Compatibility fixes

- `sweet-spec` 4.1.0 is consumed from the workspace instead of a nested published
  4.0.0 copy.
- The spec gained a `TypeElement` base class, optional `hasQuestionToken` fields, a
  `FormalParameters` union that accepts legacy binding terms, and TypeScript annotation
  fields renamed from `type` to `typeAnnotation`.
- `sweet-spec-macro` no longer treats optional (`?`) attributes as required.
- The `declare` DSL was ported to Sweet.js 3's term API, and the generated
  `dist/term-spec.js` is committed as a self-hosting bootstrap artifact.
- The CLI's `--no-babel` / `-b` flag now correctly disables the Babel backend.
- Runtime dependencies were upgraded: Immutable 5, Ramda 0.32, `ramda-fantasy` 0.8,
  and `shift-codegen` 8.
- External-library test fixtures were updated to Angular 1.8.3 and jQuery 4.0.0.

### Tests, coverage, and docs

- Test coverage was expanded beyond the archived suites, including the CLI,
  `sweet-spec`, the `sweet.js` wrapper, Babel preset, ESLint config, helpers, and
  additional core reader/loader cases.
- Coverage is collected with c8; every measured package enforces at least 87%
  statements, branches, and functions.
- Pull requests run ESLint (`npm run lint`) and the full test suite (`npm test`) in
  GitHub Actions.
- The documentation is Markdown rendered by Jekyll and is current with this codebase.

## What stayed the same

- Sweet's hygienic macro semantics, `syntax`/`syntaxrec`, `operator`, modules,
  `for syntax` imports, syntax objects, and syntax templates.
- The public package names, with the original source still attributed to the Sweet.js
  contributors.
- Existing package versions are preserved unless a compatibility fix required a local
  change.

## Caveats

- This repository is not an official upstream release and is not maintained by the
  original Sweet.js maintainers.
- The workspace packages are not published to npm from this repository; use them from
  the workspace or build them locally.
- The browser playground uses a prebuilt browser bundle, so the CLI and `@sweet-js/core`
  are the source of truth for current behavior.

For the complete technical change list, see the
[repository README](https://github.com/ionian-wind/sweet#compatibility-fixes-and-migration-notes).
