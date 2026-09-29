<p align="center">
  <img src="icon.svg" alt="BitcoinTX Logo" width="21%">
</p>

# BitcoinTX on StartOS

> Everything not listed in this document should behave the same as upstream
> BitcoinTX. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[BitcoinTX](https://github.com/DigiMonk73/BTCTX-MCP) is a single-user Bitcoin portfolio and tax tracker: a double-entry ledger, per-account FIFO lots, and IRS Form 8949 / Schedule D, with an MCP server that lets an AI assistant enter transactions. This package runs its web server, replaces the default login with a generated one, and adds actions for choosing where prices come from (your own Mempool on this server, public sites optionally over Tor, or nothing), connecting an AI assistant and recalculating the ledger.

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
| Command       | `uvicorn backend.main:app --host 0.0.0.0 --port 80`, after a `migrate` oneshot |
| Environment   | `DATABASE_FILE=/data/btctx.db`, `LOG_LEVEL=INFO`; the `BTCTX_*` price variables once chosen in Price Source & Privacy |

| Subcontainer    | Lifetime            | Purpose                                                                    |
| --------------- | ------------------- | -------------------------------------------------------------------------- |
| `btctx`         | the running service | The `migrate` oneshot, then the `webui` daemon — this is the one to attach to |
| `cli-<command>` | one action or init  | Runs `python -m backend.cli <command>` (set-password, recalculate) and exits; recalculate gets the price variables too |

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

Installs from before the separate `startos` volume also had `.startos-wrapper.json` on `main`; the update moves its password into `store.json` and deletes it.

## File Models

One model, `store.json` on the `startos` volume. The package writes no app configuration: BitcoinTX keeps its settings (tax timezone, login, privacy & network) in its own database. The one exception is the price source: once chosen in Price Source & Privacy, `main.ts` passes it to the app as environment variables, which win over the app's own setting (the app shows them read-only).

| Key                 | Meaning                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `adminPassword`     | The password the package generated at install, on Reset Login Credentials, or when an update replaced a login still on the default. Not updated when the user changes the password inside BitcoinTX. Absent on installs from before generated passwords whose owner set a password in the app. |
| `recalculateLedger` | `true` after an update from a version with the old gain calculations (transfer fees, sale proceeds, holding period), until Recalculate Ledger runs. |
| `priceSource`       | `unset` (or absent): BitcoinTX's Settings decide. `off`, `public` or `mempool`: set by Price Source & Privacy and passed as `BTCTX_PRICE_SOURCE`. |
| `mempoolFallback`   | With `mempool`: ask public sites when Mempool can't answer (`BTCTX_MEMPOOL_FALLBACK`). |
| `useTor`            | Public sites through Tor's SOCKS proxy (`BTCTX_PROXY_URL`), when public sites may be asked. |
| `checkDefaultLogin` | Set by the update that introduced generated passwords; the next init replaces a login still on `admin` / `password`, then clears it. |
| `priceSourceTask`   | Set by the update that introduced Price Source & Privacy; the next init raises its optional task (unless a source was already chosen), then clears it. |

## Dependencies

Two, both optional and declared only while the Price Source & Privacy choice uses them (`dependencies.ts`); nothing is required otherwise.

| Dependency | When                                                         | Requirement                                   | Reached at |
| ---------- | ------------------------------------------------------------ | --------------------------------------------- | ---------- |
| `mempool`  | Price source **My Mempool on this server**                   | running, the minimum version in `dependencies.ts`, health check `webui` | `http://<bridge>` from `sdk.host.getBridgeAddress` (host `main`, port 8080, `ssl: false`); its `/api/v1/prices`, `/api/blocks/tip/height`, `/api/v1/historical-price` |
| `tor`      | **Reach public price sites over Tor**, with public sites or the fallback | running, the minimum version in `dependencies.ts`, health check `tor` | `socks5h://<bridge>` (host `socks`, port 9050, `fallbackPort: 9050`) |

The bridge address (`10.0.3.1:<assigned port>`) is plain HTTP inside StartOS: no certificate to trust and no LAN address that can change. `main.ts` reads both with `.const()`, so installing, removing or re-binding a dependency restarts BitcoinTX with the new address. While Mempool is missing, `BTCTX_MEMPOOL_URL` is left out and the app answers price requests with "install and start Mempool" (or asks public sites if the fallback is on). Tor's address falls back to its fixed port, so without Tor those requests fail instead of going out directly.

## Network Access and Interfaces

One HTTP port with two interfaces. StartOS terminates TLS; the app serves plain HTTP on port 80 inside the container. BitcoinTX makes no outbound request until the owner chooses a price source (the Price Source & Privacy action, or the app's **Settings → Privacy & Network**, which asks at first login unless the action set it): their own mempool server (live price `/api/v1/prices`, block height, past prices from `/api/v1/historical-price`, keeping hourly 00:00 UTC rows), public sites, or off. Public sites: live price from Kraken or CoinGecko, block height from Blockchain.info, Blockstream or mempool.space, and past daily prices from one download of the whole history in fixed blocks (Bitstamp, else Coinbase), then only the latest days (Bitstamp, Kraken or Coinbase). No request names a transaction date. With a mempool server, the public sites are asked only if the owner turns on the fallback. Tor (the action's toggle, or a proxy set in the app) can carry requests to public sites; the service's outbound traffic can also go through a VPN with StartOS's **Set Outbound Gateway**. The log names the source of each past-price download ("Price history from your mempool server: N days", "BTC price history from public site …").

| Interface | Id      | Type | Port | Path   | Description                                          |
| --------- | ------- | ---- | ---- | ------ | ---------------------------------------------------- |
| Web UI    | `webui` | ui   | 80   | `/`    | The BitcoinTX web interface                          |
| MCP API   | `mcp`   | api  | 80   | `/api` | The address MCP clients use as `BTCTX_URL`           |

Both are on the `ui-multi` host, so a domain added to one is available to both. MCP clients authenticate with an AI key the owner creates in the app (**Settings → Connect an AI Assistant**; `Authorization: Bearer`, env `BTCTX_AI_KEY`), never the password. The key works only while the owner has AI access turned on, and only on the routes the MCP tools use (read the ledger, add, change or delete single entries, recalculate, make a backup copy in the app's `backups/` folder); login, password changes, restore, file imports, delete-all and settings answer 403. The app stores only the key's SHA-256; the owner can replace or revoke it there. The MCP server itself runs on the user's computer, not on StartOS, and accepts the `…/api` address as `BTCTX_URL`.

## Installation and First-Run Flow

Install replaces the app's shipped default login (`admin` / `password`, which its first-run page asks users to change) with a generated one.

1. A temporary subcontainer runs `set-password`, which creates and migrates the database and sets `admin` / a random 24-character password. This is an install progress phase ("Creating the BitcoinTX database").
2. The password is saved in `store.json`.
3. A **critical** task points at Show Credentials, and an **important** one at Price Source & Privacy — see [Tasks](#tasks).

Because the login is no longer the default, the app's first-run registration page does not appear.

Installs from before generated passwords started with `admin` / `password`, which BitcoinTX now accepts only with the setup code from the service log. The update that introduced generated passwords (and a restore of an older backup) runs `set-password --if-default` with a generated password: if the login was still the default, the password is stored and the critical Show Credentials task is raised; otherwise nothing changes.

## Actions

Five actions. All run with the service running or stopped, except Reset Login Credentials.

### Show Credentials

Returns `admin` and the password from `store.json`. Changes nothing; safe to repeat. On installs from before generated passwords whose owner set a password in the app, it shows only the username. If the user changed the login inside BitcoinTX, the shown values are stale: Reset Login Credentials is the fix.

### Price Source & Privacy

A form (prefilled from `store.json`): **Price source** (My Mempool on this server / Public price sites / Off / Choose in BitcoinTX), **Fall back to public price sites**, **Reach public price sites over Tor**. Saves to `store.json` and clears its task; `main.ts` and `dependencies.ts` watch those keys, so the service restarts with the new `BTCTX_*` variables and dependencies. "Choose in BitcoinTX" (`unset`) passes nothing and the app's own Settings decide again. Resolves "no prices" (Mempool not installed or not running: install/start it, or turn on the fallback) and "the public sites see my IP" (Tor or Set Outbound Gateway).

### Connect an AI Assistant

Returns the MCP API's https addresses (`.local` first), the StartOS root CA (from `sdk.getSslCertificate`, last certificate in the chain), and a Claude Desktop config and `claude mcp add` command that run the MCP server with `uvx btctx-mcp==<this release>` (from PyPI, pinned to the package's version), with `YOUR_BITCOINTX_AI_KEY` where the key goes. It reads no credentials: the key is created and shown (once) only in the app. Changes nothing; safe to repeat. If the root CA can't be read, the message points to System > About this Server to download it. Resolves "the AI can't connect" (wrong URL, TLS verification failures).

### Recalculate Ledger

Runs `python -m backend.cli recalculate` (migrates the schema first if needed): rebuilds every ledger entry, lot and disposal from the transactions, exactly like the app's Settings > Recalculate Ledger. Transactions are not modified. Takes seconds to a minute on large ledgers and may look up historical BTC prices for unpriced spends. Safe to repeat. Clears the `recalculateLedger` flag and its task. Resolves gains or lots that look wrong after an update with calculation fixes.

### Reset Login Credentials

Only while stopped. Sets the username to `admin` and a new random password through `set-password`, then stores it. Transactions and settings are untouched. Use when locked out; running it replaces any login the user set in the app.

## Tasks

Three actions raise tasks.

| Task                   | Severity    | Raised when                                        | Cleared when                     |
| ---------------------- | ----------- | -------------------------------------------------- | -------------------------------- |
| Show Credentials       | `critical`  | At install, after the password is set; after an update replaced a default login | The action runs |
| Price Source & Privacy | `important` | At install                                         | The action runs                  |
| Price Source & Privacy | `optional`  | Once, after updating (or restoring a backup) from before this action existed, without a choice made here | The action runs, or dismissed |
| Recalculate Ledger     | `important` | After updating (or restoring a backup) from a version with the old gain calculations | The action runs |

The critical task blocks starting the service until the user has seen the password. The price task does not block: until a source is chosen, the app asks at first login and contacts nothing. The recalculation task does not block: the app works, but gains computed the old way (transfer fees, sale proceeds, holding period) stay wrong until a recalculation.

Updating across the change that made a withdrawal's network fee its own disposal (and gave Lost withdrawals no gain or loss) raises no task, but the next recalculation (or any add, edit or delete) changes those figures. **Settings → Ledger Review** in the app lists them beforehand.

## Health Checks

One check, on the `webui` daemon.

| Check                   | Method                                                | Grace Period |
| ----------------------- | ----------------------------------------------------- | ------------ |
| `webui` "Web Interface" | `GET /api/health` must return 200                     | 30 s         |

`/api/health` returns 200 only when the database answers at the schema this version expects; a 503 carries the reason ("database schema is X, expected Y" or "database unreachable"), which the check shows. Schema upgrades happen before this, in the `migrate` oneshot; if that fails (for example a database written by a newer BitcoinTX), the service does not start and the error is in the service logs.

## Backups and Restore

Both volumes are copied whole (`sdk.Backups.ofVolumes('main', 'startos')`). StartOS stops the service first, so the SQLite file is copied at rest; there is no dump step.

- **Included:** the database, the session key, the app's pre-upgrade copies in `backups/`, and `store.json`.
- **Restore:** complete, including the generated password. A backup taken on an older package version is migrated forward on restore like an update (including the Recalculate Ledger task when it predates the gain-calculation fixes).
- **Address after a restore:** a restore is a fresh install, so StartOS may assign the web UI and MCP API a new port (ports are kept across restarts and updates, released on uninstall). Rerun **Connect an AI Assistant** and update the AI client's `BTCTX_URL`.
- The app also has its own password-encrypted database export (Settings in the web UI), independent of StartOS backups. Restoring one of those in the app brings back the ledger and settings but keeps the login and AI key in use, so Show Credentials stays right.

## Limitations and Differences

BitcoinTX on StartOS is the same app as on Docker; these are the differences and limits to know.

1. **No downgrades.** Every version declares downgrades impossible: an older BitcoinTX refuses a database a newer one has migrated. Roll back by restoring a StartOS backup; the app's `backups/` folder also holds pre-upgrade copies of the database.
2. **The generated password is not kept in sync** with changes made inside BitcoinTX.
3. **The first-run registration page never appears**; the login is set at install.
4. **The MCP server is not hosted here.** It runs on the user's computer and connects to the MCP API address.
5. **No riscv64 build.**
6. **English and US taxes only.** The app's interface is in English and it produces US (IRS) tax forms. The store listing, release notes, actions and tasks are translated (Spanish, German, Polish, French); they name the app's own screens in English.
7. **Prices set in the action are read-only in the app.** Choose **Choose in BitcoinTX** in the action to manage them in the app again (for example for a mempool server on another machine, or your own proxy).

---

## Quick Reference for AI Consumers

The package's operable surface in one block, its keys in section order.

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
  - BTCTX_PRICE_SOURCE # only once chosen in price-source
  - BTCTX_MEMPOOL_URL # http://<bridge>, left out while Mempool is missing
  - BTCTX_MEMPOOL_FALLBACK
  - BTCTX_PROXY_URL # socks5h://<bridge>:9050 with Tor
dependencies: # both optional, only while chosen
  mempool: { kind: running, health: webui, host: main, port: 8080 }
  tor: { kind: running, health: tor, host: socks, port: 9050 }
interfaces:
  webui: { type: ui, port: 80, path: / }
  mcp: { type: api, port: 80, path: /api }
actions:
  - show-credentials
  - price-source
  - connect-ai
  - recalculate-ledger
  - reset-credentials
tasks:
  - { action: show-credentials, severity: critical }
  - { action: price-source, severity: important } # install; optional after update
  - { action: recalculate-ledger, severity: important }
health_checks:
  - webui # GET /api/health == 200
app_cli: python -m backend.cli {migrate|set-password [--if-default]|recalculate} # cwd /app
```
