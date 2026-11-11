# sweet-monorepo

A [Turborepo](https://turbo.build/repo) monorepo consolidating the repositories from
the now-archived [`sweet-js`](https://github.com/orgs/sweet-js/repositories) GitHub
organization.

Sweet.js is a hygienic macro system for JavaScript. The original repositories were
archived in February 2026; this monorepo preserves their source history in one place
and provides unified `build`, `test`, `lint`, and `clean` tasks.

## Layout

| Path                     | Package            | Description                                        |
| ------------------------ | ------------------ | -------------------------------------------------- |
| `packages/sweet-core`    | `@sweet-js/core`   | Hygienic macros for JavaScript                     |
| `packages/sweet-cli`     | `@sweet-js/cli`    | Command line interface (`sjs`)                     |
| `packages/sweet-helpers` | `@sweet-js/helpers`| Utilities for writing Sweet.js macros              |
| `packages/sweet-spec`    | `sweet-spec`       | The Sweet.js Term specification                    |
| `packages/sweet-spec-macro` | `sweet-spec-macro` | Macro for defining specs                       |
| `packages/sweet-shell`   | `sweet.js`         | Deprecated wrapper package                         |
| `apps/sweet-website`     | `@sweet-js/website`| Documentation website                              |

## Requirements

- Node.js >= 18 (Node 24 is what this repo was set up with)
- npm >= 10 (uses npm workspaces)

## Commands

```bash
npm install          # install all workspace dependencies
npm run build        # turbo run build
npm run test         # turbo run test
npm run lint         # turbo run lint
npm run clean        # turbo run clean
npm run graph        # write the dependency graph to graph.html
```

Run a task for a single workspace:

```bash
npm run build -w @sweet-js/core
npx turbo run test --filter=@sweet-js/cli
```

To run every test even when some fail:

```bash
npx turbo run test --continue
```

## Current status (Node 24)

The full pipeline is green: `npm run build`, `npm run lint`, and `npm test` all pass.

| Workspace | Build | Tests |
| --------- | ----- | ----- |
| `@sweet-js/core` | ✔ | 208 passing (ava) |
| `@sweet-js/helpers` | ✔ | 24 passing (ava) |
| `sweet-spec` | ✔ | No upstream tests |
| `sweet-spec-macro` | — | 8 passing (ava) |
| `@sweet-js/cli`, `sweet.js`, `@sweet-js/website` | — | No test scripts |

### Compatibility fixes applied

The archived repositories are not mutually consistent, so a few targeted fixes were
needed to get the legacy suites running:

- **`sweet-spec`**: added the missing `TypeElement` base class and bumped the local
  package to `4.1.0`. Its master branch is an unreleased TypeScript-era revision that
  differs from published `4.0.0`.
- **`sweet-spec-macro`**: `?` (optional) attributes are no longer treated as required
  by the generated `hasOwnProperty` checks.
- **`sweet-core` / `sweet-js/helpers`**: depend on published `sweet-spec@4.0.0`
  (installed nested by npm) because their source matches that release, not the local
  `4.1.0` master.
- **`sweet-core` lint**: ESLint 4.19 / babel-eslint 8.2 replaced the ESLint 3 pair
  (which could not scope-analyze Flow class properties), with the legacy Prettier
  version pinned and `ecmaVersion` moved into `parserOptions`.
- **Flow**: `sweet-core`'s `.flowconfig` includes the hoisted root `node_modules`.


## History

Each project was imported with `git subtree`, so per-project history is preserved
under its directory. Example for one project:

```bash
git subtree add --prefix=packages/sweet-core \
  https://github.com/sweet-js/sweet-core.git master
```

## Legacy toolchain notes

The imported projects date from 2014–2017 and use Babel 6, ava 0.16, Flow, and
other tooling from that era. Dependencies are pinned close to their upstream
versions; the compatibility fixes above are the only deviations required to run
them on current Node.js. `turbo run build` skips packages that define no matching
script.

## License

Each package retains its original license (mostly BSD-2-Clause). See the
`LICENSE*` files inside each project directory.
