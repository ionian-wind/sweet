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
- modernizes the build/test/lint toolchain (Babel 8, AVA 8, ESLint 10, Prettier 3,
  Flow 0.339) and upgrades the compiler's runtime dependencies (Immutable 5,
  Ramda 0.32, shift-codegen 8);
- shares Babel, ESLint, and Prettier configuration through local tooling packages.

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
| `packages/babel-preset`     | `@sweet-js/babel-preset` | Shared Babel 8 preset (preset-env + Flow)   |
| `packages/eslint-config`    | `@sweet-js/eslint-config` | Shared ESLint 10 flat config              |
| `packages/prettier-config`  | `@sweet-js/prettier-config` | Shared Prettier config                 |
| `packages/test-loader`      | `@sweet-js/test-loader`     | ESM Babel loader used by AVA 8         |

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

- Node.js `^22.20` or `>=24.12` (Babel 8 / AVA 8; verified on Node 24)
- npm >= 10 (the workspace uses npm workspaces)

## Commands

```bash
npm install          # install all workspace dependencies
npm run build        # turbo run build
npm test             # turbo run test
npm run lint         # turbo run lint
npm run coverage     # turbo run coverage (c8 + AVA)
npm run docs -w @sweet-js/website  # build the Jekyll docs site
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

## Publishing docs

The website is published to **https://ionian-wind.github.io/sweet/** by
[`.github/workflows/pages.yml`](.github/workflows/pages.yml). On the repository's
**Settings → Pages** screen, set **Source** to **GitHub Actions** once. After that,
pushes touching `apps/sweet-website/**` deploy automatically, and the workflow can be
run manually from the Actions tab.

The Jekyll build injects the project base path (`/sweet`) through
`actions/configure-pages`, so the same source also works when served locally from the
site root:

```bash
cd apps/sweet-website
bundle install
npm run docs:serve
```

## Current status

`npm run build`, `npm run lint`, and `npm test` all pass on Node 24 — **13/13 Turbo
tasks**.

| Workspace | Build | Lint | Tests |
| --------- | ----- | ---- | ----- |
| `@sweet-js/core` | ✔ | ✔ | 294 passing (AVA 8) |
| `@sweet-js/helpers` | ✔ | ✔ | 48 passing (AVA 8) |
| `sweet-spec` | ✔ | — | 6 passing (generated terms) |
| `sweet-spec-macro` | — | — | 8 passing (AVA 8) |
| `@sweet-js/cli` | — | — | 7 passing (AVA 8) |
| `@sweet-js/babel-preset` | — | — | 5 passing (AVA 8) |
| `@sweet-js/eslint-config` | — | — | 4 passing (AVA 8) |
| `sweet.js` | — | — | 3 passing (AVA 8) |
| `@sweet-js/website` | — | — | No test script |

Coverage is collected with c8 through AVA. Every measured package enforces at least
87% statements, branches, and functions through c8 `check-coverage`; `@sweet-js/core`
additionally enforces 90% statements and functions.

| Workspace | Statements | Functions |
| --------- | ---------- | --------- |
| `@sweet-js/core` | 90.9% | 91.7% |
| `@sweet-js/helpers` | 93.1% | 93.6% |
| `@sweet-js/cli` | 91.1% | 100% |
| `@sweet-js/babel-preset` | 100% | 100% |
| `@sweet-js/eslint-config` | 100% | 100% |
| `sweet.js` | 100% | 100% |
| `sweet-spec` | excluded (generated `dist/term-spec.js`) | — |
| **Overall** | **91.1%** | **92.0%** |

Overall measured source is **91.1% statements, 88.2% branches, and 92.0% functions**.
The generated `sweet-spec/dist/term-spec.js` artifact is excluded from coverage; its
tests still run and cover construction, attribute validation, the term hierarchy, and
cloning. `sweet-spec-macro` source is Sweet.js syntax consumed by the compiler, so it
is not instrumentable by Node's coverage tooling.

## Toolchain

| Area | Tooling |
| ---- | ------- |
| Babel | `@babel/core` / `@babel/cli` 8.1 through `@sweet-js/babel-preset` |
| Tests | AVA 8.4 with an ESM Flow loader (`@sweet-js/test-loader`) |
| Coverage | c8 12 over AVA (`npm run coverage`) |
| Lint | ESLint 10.14 flat config through `@sweet-js/eslint-config` |
| Formatting | Prettier 3.9 through `@sweet-js/prettier-config` |
| Types | Flow 0.339, configured as one project at the repository root |
| CLI | yargs 18.2.0 and semver 7.8.6 |
| Docs | Markdown rendered by Jekyll (`apps/sweet-website`) |

All tooling majors are now current; no major upgrades are intentionally blocked.

## Compatibility fixes and migration notes

The archived repositories are not fully consistent with each other, and their 2017
toolchain does not run unmodified on Node 24. The following fixes were applied:

- **`sweet-spec`** — the local `4.1.0` master is now consumed by core/helpers. It
  gained the missing `TypeElement` base class, optional `hasQuestionToken` fields, a
  `FormalParameters` union that accepts the legacy binding terms, and its TypeScript
  annotation fields were renamed from `type` to `typeAnnotation` because `type` is the
  term tag generated by the `declare` DSL.
- **`sweet-spec-macro`** — optional (`?`) attributes are no longer treated as required
  by the generated `hasOwnProperty` checks.
- **`@sweet-js/core` / `@sweet-js/helpers`** — resolve `sweet-spec` from the local
  workspace (`4.1.0`); the nested published `4.0.0` copy is no longer used.
- **Babel** — migrated from Babel 6 to Babel 8 (`@babel/preset-env` +
  `@babel/preset-flow`, ESM-only packages). Core's runtime macro compiler now uses
  `transformSync`; the helpers ESM build targets Node 8 so class fields are lowered for
  Sweet's enforester.
- **Tests** — migrated from ava 0.19 to AVA 8.4. Tests now run as ESM through a small
  shared loader (`@sweet-js/test-loader`) that strips Flow types. Duplicate titles were
  made unique and snapshots regenerated.
- **Lint/formatting** — migrated from ESLint 4 + Prettier 1 to ESLint 10 flat config and
  Prettier 3, shared through the local tooling packages.
- **Flow** — migrated from 0.45 to 0.339. The package-local configs were replaced by a
  single root `.flowconfig` (needed for hoisted `node_modules`). All legacy
  suppressions and `@noflow` pragmas were removed; remaining gaps are typed through
  local libdefs and `any` annotations.
- **Modules** — every workspace package is now native ESM (`"type": "module"`).
  Relative imports carry explicit `.js` extensions, `sweet-spec` ships a single ESM
  build, and the CLI uses static imports instead of `createRequire`. The AVA loader is
  retained only to strip Flow types; it no longer models CommonJS interop or resolves
  extensionless imports.
- **Runtime dependencies** — upgraded `immutable` 3.8 → 5.1, `ramda` 0.22 → 0.32,
  `ramda-fantasy` 0.6 → 0.8, and `shift-codegen` 5 → 8. Ramda's removed `merge` and
  `contains` helpers were replaced with `mergeRight` and `includes`, and
  shift-codegen 8 is imported through its named `codeGen` export. The unused
  `shift-reducer` and `semver` dependencies were removed from core.
- **`sweet-spec` / `sweet-spec-macro` build** — the `declare` macro DSL was ported to
  Sweet.js 3's term API, so the spec now builds with the workspace `@sweet-js/cli`
  instead of the legacy `sjs` 2.2.1 compiler. Because the spec is self-hosting (Core
  needs `sweet-spec` to compile anything), the generated
  `packages/sweet-spec/dist/term-spec.js` is committed as a bootstrap artifact; the
  build regenerates it and Babel emits the final `dist`.
- **CLI/website** — the CLI was converted to ESM and upgraded to yargs 18.2 (latest).
  The website docs are now Markdown rendered by Jekyll; the old AsciiDoc pipeline was
  removed.

No registry `sweet.js@2` dependency remains. The workspace package named `sweet.js` is
only the local 3.0.15 compatibility wrapper around `@sweet-js/core`/`cli`.

## Dependency alignment and pinning

Every dependency is pinned to an **exact version** (no `^` or `~` ranges), and shared
dependencies use the same version across all workspaces. This makes installs
reproducible alongside `package-lock.json`; `.npmrc` sets `save-exact=true` so newly
added dependencies are pinned too.

Notable versions: `@babel/core` 8.1.0, `immutable` 5.1.10, `ramda` 0.32.0,
`shift-codegen` 8.1.0, `ava` 8.4.0, `eslint` 10.14.0, `prettier` 3.9.10,
`flow-bin` 0.339.0, `yargs` 18.2.0, `semver` 7.8.6, and `@sweet-js/core` 3.0.13.

## AI assistance

The monorepo integration was built with the help of an AI coding agent (OpenCode,
running DeepSeek V4.1 Flash). The agent scaffolded the Turbo/npm workspace, imported
the original repositories, implemented the compatibility fixes, pinned dependencies,
migrated the toolchain to Babel 8 / AVA 8 / ESLint 10 / Prettier 3 / Flow 0.339, and
wrote this documentation.

The original Sweet.js source code and git history were written by the Sweet.js
contributors and are preserved here unmodified except for the compatibility fixes
listed above. AI-assisted changes should be reviewed like any other contribution.

## License

This monorepo is released under the **BSD 2-Clause License**; see
[`LICENSE`](./LICENSE).

The imported packages keep their original licenses, primarily BSD-2-Clause. License
files are kept inside the package directories where the originals provided them. See
the `LICENSE*` files in each project and the `license` field in each `package.json`.
