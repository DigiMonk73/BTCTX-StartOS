<p align="center">
  <img src="icon.svg" alt="BitcoinTX Logo" width="21%">
</p>

# BitcoinTX on StartOS

> Everything not listed in this document should behave the same as upstream
> BitcoinTX. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[BitcoinTX](https://github.com/DigiMonk73/BTCTX-MCP) is a single-user Bitcoin portfolio and tax tracker: a double-entry ledger, per-account FIFO lots, and IRS Form 8949 / Schedule D, with an MCP server that lets an AI assistant enter transactions. This package runs its web server, replaces the default login with a generated one, and adds actions for connecting an AI assistant and recalculating the ledger.

- **Upstream repo:** <https://github.com/DigiMonk73/BTCTX-MCP> (this package is developed in its `startos/` directory)
- **Wrapper repo:** <https://github.com/DigiMonk73/BTCTX-StartOS> (mirror of `startos/`)

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The image is the app's own published image, pulled rather than built: the same one Docker users run.

| Property      | Value                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| Image         | `ghcr.io/digimonk73/btctx-mcp`, pinned to the package's upstream version |
| Architectures | x86_64, aarch64                                                        |
| Command       | `uvicorn backend.main:app --port 80`, after a `migrate` oneshot        |
| Environment   | `DATABASE_FILE=/data/btctx.db`, `LOG_LEVEL=INFO`                       |

| Subcontainer    | Lifetime            | Purpose                                                                    |
| --------------- | ------------------- | -------------------------------------------------------------------------- |
| `btctx`         | the running service | The `migrate` oneshot, then the `webui` daemon — this is the one to attach to |
| `cli-<command>` | one action or init  | Runs `python -m backend.cli <command>` (set-password, recalculate) and exits |

All package changes to the app's data go through the app's own maintenance CLI (`python -m backend.cli migrate | set-password | recalculate`, run from `/app`); the package never edits the database itself.

## Volume and Data Layout

Two volumes: the app's data, and this package's own state, which the app never sees.

| Volume    | Mount Point      | Purpose                                                              |
| --------- | ---------------- | -------------------------------------------------------------------- |
| `main`    | `/data`          | The app's data (below)                                               |
| `startos` | none (not mounted) | `store.json`, the package's state                                  |

| Path on `main`          | What                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `btctx.db`              | The SQLite ledger                                                                          |
| `.btctx_secret_key`     | Session-cookie signing key, generated on first start (mode 600)                            |
| `backups/`              | The app's copies of `btctx.db` from before a schema upgrade or an in-app restore; the newest 5 are kept |

Installs from 0.8.0:1 and older also had `.startos-wrapper.json` on `main`; the update moves its password into `store.json` and deletes it.

## File Models

One model, `store.json` on the `startos` volume. The package writes no app configuration: BitcoinTX keeps its settings (tax timezone, login) in its own database.

| Key                 | Meaning                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `adminPassword`     | The password the package generated at install or on Reset Login Credentials. Not updated when the user changes the password inside BitcoinTX. Absent on installs from before generated passwords (they started with `admin` / `password`). |
| `recalculateLedger` | `true` after an update from a version before 0.8.0, until Recalculate Ledger runs.                             |

## Dependencies

None.

## Network Access and Interfaces

One HTTP port with two interfaces. StartOS terminates TLS; the app serves plain HTTP on port 80 inside the container. BitcoinTX makes outbound requests only for BTC prices (CoinGecko, Kraken, CoinDesk).

| Interface | Id      | Type | Port | Path   | Description                                          |
| --------- | ------- | ---- | ---- | ------ | ---------------------------------------------------- |
| Web UI    | `webui` | ui   | 80   | `/`    | The BitcoinTX web interface                          |
| MCP API   | `mcp`   | api  | 80   | `/api` | The address MCP clients use as `BTCTX_URL`           |

Both are on the `ui-multi` host, so a domain added to one is available to both. The MCP API needs no separate credential: MCP clients log in with the BitcoinTX username and password (session cookie). The MCP server itself runs on the user's computer, not on StartOS, and accepts the `…/api` address as `BTCTX_URL`.

## Installation and First-Run Flow

Install replaces the app's shipped default login (`admin` / `password`, which its first-run page asks users to change) with a generated one.

1. A temporary subcontainer runs `set-password`, which creates and migrates the database and sets `admin` / a random 24-character password. This is an install progress phase ("Creating the BitcoinTX database").
2. The password is saved in `store.json`.
3. A **critical** task points at Show Credentials — see [Tasks](#tasks).

Because the login is no longer the default, the app's first-run registration page does not appear.

## Actions

Four actions. All run with the service running or stopped, except Reset Login Credentials.

### Show Credentials

Returns `admin` and the password from `store.json`. Changes nothing; safe to repeat. On installs from before generated passwords it shows `admin` / `password`. If the user changed the login inside BitcoinTX, the shown values are stale: Reset Login Credentials is the fix.

### Connect an AI Assistant

Returns the MCP API's https addresses (`.local` first), the username and stored password, the StartOS root CA (from `sdk.getSslCertificate`, last certificate in the chain), and a Claude Desktop config and `claude mcp add` command that run the MCP server with `uvx` from this release's git tag. Changes nothing; safe to repeat. If the root CA can't be read, the message points to System > About this Server to download it. Resolves "the AI can't connect" (wrong URL, TLS verification failures).

### Recalculate Ledger

Runs `python -m backend.cli recalculate` (migrates the schema first if needed): rebuilds every ledger entry, lot and disposal from the transactions, exactly like the app's Settings > Recalculate Ledger. Transactions are not modified. Takes seconds to a minute on large ledgers and may look up historical BTC prices for unpriced spends. Safe to repeat. Clears the `recalculateLedger` flag and its task. Resolves gains or lots that look wrong after an update with calculation fixes.

### Reset Login Credentials

Only while stopped. Sets the username to `admin` and a new random password through `set-password`, then stores it. Transactions and settings are untouched. Use when locked out; running it replaces any login the user set in the app.

## Tasks

Two tasks.

| Task                | Severity    | Raised when                                        | Cleared when                     |
| ------------------- | ----------- | -------------------------------------------------- | -------------------------------- |
| Show Credentials    | `critical`  | At install, after the password is set              | The action runs                  |
| Recalculate Ledger  | `important` | After updating (or restoring a backup) from before 0.8.0 | The action runs            |

The critical task blocks starting the service until the user has seen the password. The recalculation task does not block: the app works, but gains computed before 0.8.0's fixes (transfer fees, sale proceeds, holding period) stay wrong until a recalculation.

## Health Checks

One check, on the `webui` daemon.

| Check                   | Method                                                | Grace Period |
| ----------------------- | ----------------------------------------------------- | ------------ |
| `webui` "Web Interface" | `GET /api/health` must return 200                     | 30 s         |

`/api/health` returns 200 only when the database answers at the schema this version expects; a 503 carries the reason ("database schema is X, expected Y" or "database unreachable"), which the check shows. Schema upgrades happen before this, in the `migrate` oneshot; if that fails (for example a database written by a newer BitcoinTX), the service does not start and the error is in the service logs.

## Backups and Restore

Both volumes are copied whole (`sdk.Backups.ofVolumes('main', 'startos')`). StartOS stops the service first, so the SQLite file is copied at rest; there is no dump step.

- **Included:** the database, the session key, the app's pre-upgrade copies in `backups/`, and `store.json`.
- **Restore:** complete, including the generated password. A backup taken on an older package version is migrated forward on restore like an update (including the Recalculate Ledger task when it predates 0.8.0).
- The app also has its own password-encrypted database export (Settings in the web UI), independent of StartOS backups.

## Limitations and Differences

1. **No downgrades.** Every version declares downgrades impossible: an older BitcoinTX refuses a database a newer one has migrated. Roll back by restoring a StartOS backup; the app's `backups/` folder also holds pre-upgrade copies of the database.
2. **The generated password is not kept in sync** with changes made inside BitcoinTX.
3. **The first-run registration page never appears**; the login is set at install.
4. **The MCP server is not hosted here.** It runs on the user's computer and connects to the MCP API address.
5. **No riscv64 build.**

---

## Quick Reference for AI Consumers

```yaml
package_id: btctx
image: ghcr.io/digimonk73/btctx-mcp # pinned tag = package upstream version
architectures:
  - x86_64
  - aarch64
subcontainers:
  - btctx # migrate oneshot + webui daemon
  - cli-<command> # temporary, per action/init
volumes:
  main: /data
  startos: null # store.json, not mounted
file_models:
  - store.json
startos_managed_env_vars:
  - DATABASE_FILE
  - LOG_LEVEL
dependencies: []
interfaces:
  webui: { type: ui, port: 80, path: / }
  mcp: { type: api, port: 80, path: /api }
actions:
  - show-credentials
  - connect-ai
  - recalculate-ledger
  - reset-credentials
tasks:
  - { action: show-credentials, severity: critical }
  - { action: recalculate-ledger, severity: important }
health_checks:
  - webui # GET /api/health == 200
app_cli: python -m backend.cli {migrate|set-password|recalculate} # cwd /app
```
