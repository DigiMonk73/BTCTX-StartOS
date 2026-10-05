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

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Two homes.** The package is developed in `startos/` of
  [DigiMonk73/BTCTX-MCP](https://github.com/DigiMonk73/BTCTX-MCP) (on `develop`),
  mirrored to [DigiMonk73/BTCTX-StartOS](https://github.com/DigiMonk73/BTCTX-StartOS),
  and reaches [Start9-Community/BTCTX-StartOS](https://github.com/Start9-Community/BTCTX-StartOS)
  only as a pull request from that mirror. A change made on the Start9 fork must be
  taken back with BTCTX-MCP's `scripts/start9-pull.sh` before the next mirror sync,
  or the sync undoes it (`UPDATING.md`).
- **The app contract is `backend/cli.py` and `GET /api/health`** in the app
  (`docs/STARTOS_COMPATIBILITY.md` in BTCTX-MCP). Credentials, migrations and the
  ledger recalculation go through `python -m backend.cli`; never edit the SQLite
  database from package code.
- **Ids are frozen:** package `btctx`, host `ui-multi`, interfaces `webui` and `mcp`,
  actions `price-source`, `set-credentials`, `recalculate-ledger` and `connect-ai`,
  volumes `main` and `startos`. Sideloaded installs from 0.3.x on depend on them.
- **Mempool and Tor are reached with `sdk.host.getBridgeAddress`**, with the host id
  and internal port imported from `mempool-startos` / `tor-startos`; never a LAN
  address, a `.local` name or a hardcoded assigned port.
- **The package version is `<VERSION>:<revision>`**, `<VERSION>` being BTCTX-MCP's
  root `VERSION` file and the image tag `v<VERSION>`. `down` stays `IMPOSSIBLE`: an
  older app refuses a newer database.
- **Name the app's own screens in English** in every locale: the app is English-only.
- **Checks:** `npm run check && npm run lint && npm run build && node scripts/check-manifest.mjs`
  and `npx prettier --check startos`.
