# AGENTS.md

This is the StartOS service package for BitcoinTX: it builds `btctx.s9pk` with
the start-sdk (`package.json`). It lives in `startos/` of
[DigiMonk73/BTCTX-MCP](https://github.com/DigiMonk73/BTCTX-MCP) (the app) and
is mirrored as-is to [DigiMonk73/BTCTX-StartOS](https://github.com/DigiMonk73/BTCTX-StartOS),
the repository Start9 forks for its community registry. **Edit it in
BTCTX-MCP, on the `develop` branch** (`main` there holds released code
only); a change made only in the mirror is overwritten by the next sync.
Changes Start9 makes on their fork come back with `scripts/start9-pull.sh`
(`UPDATING.md`).

The packaging guide is at <https://docs.start9.com/packaging> (source:
`Start9Labs/start-technologies`, branch `live-docs`,
`projects/start-sdk/docs/src/`). Start at its recipe index.

Keep `README.md` (technical reference for an AI support or administering
agent) and `instructions.md` (end-user docs) in sync with your changes.
Releasing, bumping versions and the signing/mirror secrets: `UPDATING.md`.

Work this package's `TODO.md` from top to bottom: one `- [ ]` line per item,
removed when it's done, added when you defer work. Bugs and feature requests
are GitHub issues on BTCTX-MCP. No `NOTES.md` or `PLAN.md`: plans live in
BTCTX-MCP's `docs/temp/`.

Everything here follows Start9's packaging guide to the letter (layout,
`README.md` headings, `instructions.md`, `TODO.md`): Start9 reviews the
package against it. BTCTX-MCP's `backend/tests/test_startos_conformance.py`
checks the rules a script can check.

## This repo

- **The app contract is `backend/cli.py` and `GET /api/health`** in the app
  (documented in `docs/STARTOS_COMPATIBILITY.md`). Credentials, migrations and
  the ledger recalculation go through `python -m backend.cli`; never edit the
  SQLite database from package code.
- **Ids are frozen:** package `btctx`, host `ui-multi`, interfaces `webui` and
  `mcp`, actions `show-credentials`, `price-source`, `reset-credentials`,
  `recalculate-ledger` and `connect-ai`, volumes `main` and `startos`.
  Existing installs (0.3.x to the current version) depend on them.
- **Other services** are optional dependencies (`mempool`, `tor`), declared
  in `dependencies.ts` only while the Price Source & Privacy choice uses them
  and reached with `sdk.host.getBridgeAddress` (`priceSource.ts`), with the
  host id and internal port imported from their packages (`mempool-startos`,
  `tor-startos` in `package.json`); never a LAN address, a `.local` name or a
  hardcoded assigned port.
- **Versions:** `startos/versions/current.ts` is `<VERSION>:<revision>`. When
  its version changes (a new `VERSION` or a new revision) and its `up` does
  real work, move it to
  `vX.Y.Z_N.ts` exporting `v_X_Y_Z_N` and add it to `other` in
  `versions/index.ts` before writing the new `current.ts` (a migration
  belongs to the version that introduced it). `down` stays `IMPOSSIBLE`: an
  older app refuses a newer database.
- **i18n:** every user-facing string goes through `i18n()`; add new strings to
  the end of `i18n/dictionaries/default.ts` with the next free id, and its
  translation for every locale in `translations.ts` (es_ES, de_DE, pl_PL,
  fr_FR; the type check fails on a missing one). Keep `${…}` parameters as
  they are and pass them as strings. Name the app's own screens in English:
  the app is English-only and produces US tax forms.
- **Checks** (also run by the pre-push hook and CI):
  `npm run check && npm run lint && npm run build && node scripts/check-manifest.mjs`,
  and `npx prettier --check startos`. `backend/tests/test_versions_agree.py`
  checks the image tag and package version against `VERSION`.
