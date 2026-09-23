# AGENTS.md

This is the StartOS service package for BitcoinTX: it builds `btctx.s9pk` with
start-sdk 2.0.9. It lives in `startos/` of
[DigiMonk73/BTCTX-MCP](https://github.com/DigiMonk73/BTCTX-MCP) (the app) and
is mirrored as-is to [DigiMonk73/BTCTX-StartOS](https://github.com/DigiMonk73/BTCTX-StartOS),
the repository Start9's community registry would fork. **Edit it in
BTCTX-MCP**; a change made only in the mirror is overwritten by the next sync.

The packaging guide is at <https://docs.start9.com/packaging> (source:
`Start9Labs/start-technologies`, branch `live-docs`,
`projects/start-sdk/docs/src/`). Start at its recipe index.

Keep `README.md` (technical reference for an AI support or administering
agent) and `instructions.md` (end-user docs) in sync with your changes.
Releasing, bumping versions and the signing/mirror secrets: `UPDATING.md`.

Bugs and feature requests are GitHub issues on BTCTX-MCP. Don't record work in
the repo instead: no `TODO.md`, `NOTES.md` or `PLAN.md`.

## This package

- **The app contract is `backend/cli.py` and `GET /api/health`** in the app
  (documented in `docs/STARTOS_COMPATIBILITY.md`). Credentials, migrations and
  the ledger recalculation go through `python -m backend.cli`; never edit the
  SQLite database from package code.
- **Ids are frozen:** package `btctx`, host `ui-multi`, interface `webui`,
  actions `show-credentials` and `reset-credentials`, volume `main`. Existing
  installs (0.3.x to 0.8.0:1) depend on them.
- **Versions:** `startos/versions/current.ts` is `<VERSION>:<revision>`. When
  `VERSION` changes and `current.ts`'s `up` does real work, move it to
  `vX_Y_Z_N.ts` and add it to `other` in `versions/index.ts` before writing
  the new `current.ts` (a migration belongs to the version that introduced
  it). `down` stays `IMPOSSIBLE`: an older app refuses a newer database.
- **i18n:** every user-facing string goes through `i18n()`; add new strings to
  the end of `i18n/dictionaries/default.ts` with the next free id. English
  (en_US) only for now: the app produces US tax forms.
- **Checks** (also run by the pre-push hook and CI):
  `npm run check && npm run lint && npm run build && node scripts/check-manifest.mjs`,
  and `npx prettier --check startos`. `backend/tests/test_versions_agree.py`
  checks the image tag and package version against `VERSION`.
