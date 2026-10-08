# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes. This file restates neither:
whoever changes the package has both, so it carries only what they don't — repo mechanics,
a change that looks right and is not, where the next thing gets added, a naming trap, a
build or test invocation particular to this repo.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **Two homes.** The package is developed in `startos/` of
  [DigiMonk73/BTCTX-MCP](https://github.com/DigiMonk73/BTCTX-MCP) (on `develop`),
  mirrored to [DigiMonk73/BTCTX-StartOS](https://github.com/DigiMonk73/BTCTX-StartOS),
  and reaches [Start9-Community/BTCTX-StartOS](https://github.com/Start9-Community/BTCTX-StartOS)
  only as a pull request from that mirror. A change made on the Start9 fork must be
  taken back with BTCTX-MCP's `scripts/start9-pull.sh` before the next mirror sync,
  or the sync undoes it (`UPDATING.md`).
- **Never edit the SQLite database from package code.** Credentials, migrations and
  the ledger recalculation go through `python -m backend.cli`, the app's contract
  with this package (`docs/STARTOS_COMPATIBILITY.md` in BTCTX-MCP).
- **Ids are frozen:** package `btctx`, host `ui-multi`, interfaces `webui` and `mcp`,
  actions `price-source`, `set-credentials`, `recalculate-ledger` and `connect-ai`,
  volumes `main` and `startos`. Sideloaded installs from 0.3.x on depend on them.
- **The package version is `<VERSION>:<revision>`**, `<VERSION>` being BTCTX-MCP's
  root `VERSION` file and the image tag `v<VERSION>`. `down` stays `IMPOSSIBLE`: an
  older app refuses a newer database.
- **Name the app's own screens in English** in every locale: the app is English-only.
- **Checks:** `rm -rf javascript && make javascript/index.js && node scripts/check-manifest.mjs`
  (`make` type-checks, lints, format-checks and bundles).
