# sweet-monorepo

A [Turborepo](https://turbo.build/repo) monorepo that consolidates the repositories
from the archived [`sweet-js`](https://github.com/orgs/sweet-js/repositories) GitHub
organization into a single npm workspace, with one `build` / `test` / `lint` pipeline.

## What is Sweet.js?

Sweet.js is a **hygienic macro system for JavaScript**. It lets you define new syntax
directly in JavaScript and compile it away, so you can extend the language without a
separate parser or preprocessor. Macros operate on syntax objects and are hygienic,
meaning introduced bindings do not accidentally capture names from the surrounding
code.

For example:

```js
syntax hi = function (ctx) {
  return #`console.log('hello, world!')`;
}
hi
```

compiles to:

```js
console.log('hello, world!');
```

The project was an active research/compiler effort around 2014–2017 and was marked
experimental upstream. The `sweet-js` organization was archived on **February 17,
2026** and is no longer maintained.

## What this repository is

This monorepo is a preservation and integration effort, not a new release of Sweet.js.
It:

- imports all seven original repositories with their full git history;
- links the packages through npm workspaces (`@sweet-js/core`, `sweet-spec`, etc.);
- provides unified `build`, `test`, `lint`, and `clean` tasks via Turbo;
- includes the minimal compatibility fixes needed to run the 2017-era toolchain on
  current Node.js (see below).

## Repository layout

| Path                        | Package               | Description                                     |
| --------------------------- | --------------------- | ----------------------------------------------- |
| `packages/sweet-core`       | `@sweet-js/core`      | Hygienic macros for JavaScript (the compiler)   |
| `packages/sweet-cli`        | `@sweet-js/cli`       | Command-line interface (`sjs`)                  |
| `packages/sweet-helpers`    | `@sweet-js/helpers`   | Utilities for matching syntax in macros         |
| `packages/sweet-spec`       | `sweet-spec`          | The Sweet.js Term specification                 |
| `packages/sweet-spec-macro` | `sweet-spec-macro`    | Macro for defining term specifications          |
| `packages/sweet-shell`      | `sweet.js`            | Deprecated wrapper package (use the CLI/core)   |
| `apps/sweet-website`        | `@sweet-js/website`   | Documentation website assets                    |

## Source of the original code

All code in this repository comes from the following public GitHub repositories. Each
was imported from its `master` branch with `git subtree`, so the original commit
history is preserved under the package directory.

| Package               | Original repository                                          | Original version | License        |
| --------------------- | ------------------------------------------------------------ | ---------------- | -------------- |
| `@sweet-js/core`      | [sweet-js/sweet-core](https://github.com/sweet-js/sweet-core) | 3.0.13           | BSD-2-Clause   |
| `@sweet-js/cli`       | [sweet-js/sweet-cli](https://github.com/sweet-js/sweet-cli)   | 3.0.13           | BSD-2-Clause   |
| `@sweet-js/helpers`   | [sweet-js/sweet-helpers](https://github.com/sweet-js/sweet-helpers) | 4.0.1      | BSD-2-Clause   |
| `sweet-spec`          | [sweet-js/sweet-spec](https://github.com/sweet-js/sweet-spec) | 4.0.0 (local `4.1.0`) | BSD-2-Clause |
| `sweet-spec-macro`    | [sweet-js/sweet-spec-macro](https://github.com/sweet-js/sweet-spec-macro) | 3.0.0 | BSD-2-Clause |
| `sweet.js`            | [sweet-js/sweet-shell](https://github.com/sweet-js/sweet-shell) | 3.0.15         | BSD-2-Clause   |
| `@sweet-js/website`   | [sweet-js/sweet-website](https://github.com/sweet-js/sweet-website) | 1.0.0      | BSD-2-Clause   |

Every import is recorded as a subtree merge commit containing the upstream commit SHA,
for example:

```bash
git log --oneline --first-parent
git log --oneline <subtree-merge-commit>^2 -- src/syntax.js
```

The original repositories are read-only archives on GitHub. Any fixes made here are
local to this monorepo and are listed under
[Compatibility fixes](#compatibility-fixes).

## Requirements

- Node.js >= 18 (developed and verified on Node 24)
- npm >= 10 (the workspace uses npm workspaces)

## Commands

```bash
npm install          # install all workspace dependencies
npm run build        # turbo run build
npm test             # turbo run test
npm run lint         # turbo run lint
npm run clean        # turbo run clean
npm run graph        # write the dependency graph to graph.html
```

Run a task for a single workspace:

```bash
npm run build -w @sweet-js/core
npx turbo run test --filter=@sweet-js/cli
```

Run every test even if one package fails:

```bash
npx turbo run test --continue
```

## Current status

`npm run build`, `npm run lint`, and `npm test` all pass on Node 24.

| Workspace | Build | Tests |
| --------- | ----- | ----- |
| `@sweet-js/core` | ✔ | 208 passing (ava) |
| `@sweet-js/helpers` | ✔ | 24 passing (ava) |
| `sweet-spec` | ✔ | No upstream tests |
| `sweet-spec-macro` | — | 8 passing (ava) |
| `@sweet-js/cli`, `sweet.js`, `@sweet-js/website` | — | No test scripts |

## Compatibility fixes

The archived repositories are not fully consistent with each other, and their 2017
toolchain does not run unmodified on Node 24. The following targeted fixes were
applied:

- **`sweet-spec`** — added the missing `TypeElement` base class used by
  `TsTypeElement`, and bumped the local package to `4.1.0`. Upstream `master` is an
  unreleased TypeScript-era revision that differs from the published `4.0.0`.
- **`sweet-spec-macro`** — optional (`?`) attributes are no longer treated as required
  by the generated `hasOwnProperty` checks.
- **`@sweet-js/core` / `@sweet-js/helpers`** — depend on published `sweet-spec@4.0.0`
  because their source matches that release, not the local `4.1.0` master. npm installs
  the published copy nested under `sweet-core`.
- **`@sweet-js/core` lint** — replaced ESLint 3 + babel-eslint 7 (which could not
  scope-analyze Flow class properties) with ESLint 4.19 + babel-eslint 8.2, pinned the
  legacy Prettier version, and moved `ecmaVersion` into `parserOptions`.
- **Flow** — `sweet-core/.flowconfig` includes the hoisted root `node_modules` and
  ignores stale `chalk` libdefs.

Dependencies otherwise stay close to the versions pinned in the original repositories.

## Dependency alignment and pinning

Every dependency is pinned to an **exact version** (no `^` or `~` ranges), and shared
dependencies use the same version across all workspaces. This makes installs
reproducible alongside `package-lock.json`; `.npmrc` sets `save-exact=true` so newly
added dependencies are pinned too.

Notable versions: `ava` 0.19.1, `eslint` 4.19.1, `babel-eslint` 8.2.6,
`babel-cli` 6.26.0, `babel-core` 6.26.3, and `@sweet-js/core` 3.0.13.

`flow-bin` is pinned to **0.45.0** in every package: Flow 0.46+ rejects the archived
`sweet-spec` type declarations for term constructors, so 0.45 is the newest version
that keeps both `core` and `helpers` green. The `sweet-spec-macro` tests import their
macro as `./src/spec.js` because ava 0.19 resolves relative imports from the package
root.

## License

This monorepo is released under the **BSD 2-Clause License**; see
[`LICENSE`](./LICENSE).

The imported packages keep their original licenses, primarily BSD-2-Clause. License
files are kept inside the package directories where the originals provided them. See
the `LICENSE*` files in each project and the `license` field in each `package.json`.
