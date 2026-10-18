<p align="center">
  <img src="icon.webp" alt="BitcoinTX Logo" width="21%">
</p>

# BitcoinTX on StartOS

> Everything not listed in this document should behave the same as upstream
> BitcoinTX. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[BitcoinTX](https://github.com/DigiMonk73/BTCTX-MCP) is a single-user Bitcoin portfolio and tax tracker: a double-entry ledger, per-account FIFO lots, and IRS Form 8949 / Schedule D, with an MCP server that lets an AI assistant enter transactions. This package runs its web server, replaces the default login with a generated one, and adds actions for choosing where prices come from (your own Mempool on this server, public sites optionally over Tor, or nothing), connecting an AI assistant and recalculating the ledger.

- **Upstream repo:** <https://github.com/DigiMonk73/BTCTX-MCP> (this package is developed in its `startos/` directory)
- **Package repo:** <https://github.com/Start9-Community/BTCTX-StartOS> (receives `startos/` from BTCTX-MCP by pull request)

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
| Command       | The image's own: its entrypoint `docker-entrypoint.sh` with its `CMD`, `uvicorn backend.main:app --host 0.0.0.0 --port 80 --no-access-log --no-server-header --no-proxy-headers` (no request lines in the log: they carry client addresses and dates; a client's address is its connection's, never an `X-Forwarded-For` header's), after a `migrate` oneshot through the same entrypoint (`sdk.useEntrypoint`) |
| User          | `btctx` (uid and gid 10001), never root: StartOS starts the entrypoint as root, the image's user; it gives `/data` to `btctx` only when something in it isn't `btctx`'s (a volume from a version where the app ran as root is root's), then runs the command through `setpriv` as `btctx`, keeping only the right to open port 80 (an ordinary user can't in StartOS's container: `net.ipv4.ip_unprivileged_port_start` is 1024 there) |
| Environment   | `DATABASE_FILE=/data/btctx.db`, `LOG_LEVEL=INFO`, `BTCTX_HOST=startos` (the app's words name the action); the `BTCTX_*` price variables once chosen in Price Source & Privacy, or `BTCTX_TOR_PROXY_URL` with Decide in BitcoinTX and Use Tor |

| Subcontainer    | Lifetime            | Purpose                                                                    |
| --------------- | ------------------- | -------------------------------------------------------------------------- |
| `btctx`         | the running service | The `migrate` oneshot, then the `webui` daemon — this is the one to attach to (as root by default; `-u btctx` for a command that writes in `/data`). A `backend.cli` command run there by hand without the price variables asks no one for a price while Price Source & Privacy sets the choice or Tor, and says so |
| `cli-<command>` | one action or init  | Runs `python -m backend.cli <command>` (set-password, recalculate) through the entrypoint, which gives `/data` to `btctx` when needed and runs it as `btctx`, and exits; recalculate gets the price variables too |

All package changes to the app's data go through the app's own maintenance CLI (`python -m backend.cli migrate | set-password | recalculate`, run from `/app`); the package never edits the database itself.

## Volume and Data Layout

Two volumes: the app's data, and this package's own state, which the app never sees.

| Volume    | Mount Point      | Purpose                                                              |
| --------- | ---------------- | -------------------------------------------------------------------- |
| `main`    | `/data`          | The app's data (below), `btctx`'s: the image's entrypoint gives it to `btctx` at a start (or an action's command) when something in it isn't `btctx`'s, as on a volume from a version where the app ran as root |
| `startos` | none (not mounted) | `store.json`, the package's state                                  |

| Path on `main`          | What                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `btctx.db`              | The SQLite ledger                                                                          |
| `.btctx_secret_key`     | Session-cookie signing key, generated on first start (mode 600)                            |
| `btc-prices/`           | The hourly BTC price history (one `YYYY.csv` per year, about 3 MB; how it's downloaded: [Network Access and Interfaces](#network-access-and-interfaces)); deleting it only means it's downloaded again |
| `backups/`              | The app's copies of `btctx.db`: before a schema upgrade or an in-app restore (newest 5 kept), before Ledger Review's hourly prices are applied (newest 5 kept, apart), before every transaction is deleted, by Delete All or by Create account on a ledger with transactions (`btctx-before-delete-all-…`, newest 5 kept, apart), and the AI copies: those the AI key asks for, and one before its first change in an hour, an edit, a deletion, a recalculation or an import holding an entry dated before the latest entry (newest 3 kept, plus, for a week, the oldest and the first copy of each day made before the AI changed anything that day) |

## File Models

Two models, both the package's own state. The package writes no app configuration: BitcoinTX keeps its settings (tax timezone, login, privacy & network) in its own database.

- **`store.json`** (JSON, on the `startos` volume, which nothing mounts). Seeded at every init by an empty merge (`init/seedStore.ts`), which creates the file and fills in nothing: every key is optional, and an absent one is unset. After that only the package's actions, init steps and update migrations write it, each merging only its own keys (the table below); nothing re-asserts a key at a start. A hand edit survives as long as the file stays a JSON object: an invalid value (a wrong type, or a `priceSource` outside its list) reads as absent and is dropped at the next init, and a key not in the table is kept but read by nothing. A file that isn't valid JSON makes init fail (no merge can parse it) until it is fixed.
- **`.startos-wrapper.json`** (JSON, on `main`), only on installs from before the separate `startos` volume, where it held the generated password. Never seeded or written: the update from those versions moves its `adminPassword` into `store.json` and deletes the file, and a later update keeps only `loginSet` in its place.

The price choice reaches the app as environment variables, not a file: `main.ts` passes them from `store.json` at every start, and the app reads them at every start, where they win over its own stored setting (it shows them read-only) and never become that setting. Choosing **Decide in BitcoinTX instead** stops passing the choice, so the app's own setting decides again (with Use Tor, only `BTCTX_TOR_PROXY_URL` is passed: this server's Tor for that setting).

| Key                 | Meaning                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `loginSet`          | `true` once Set Login Credentials has given the app a login. Only that is kept, never the password, whose hash the app keeps in its own database (Start9's `recipe-web-ui.md`, "Authentication"). Not changed when the user changes the password inside BitcoinTX. While it is unset, the critical Set Login Credentials task stays raised. |
| `adminPassword`     | The password Set Login Credentials generated, kept by earlier versions of the package. The update that introduced `loginSet` sets it when it finds one, then deletes the password. |
| `recalculateLedger` | `true` after an update whose calculation fixes reach saved transactions only through a recalculation, until Recalculate Ledger runs. |
| `recalculateAsked`  | Set once init has raised the Recalculate Ledger task for that update, so it asks once (see [Tasks](#tasks)); the update that sets `recalculateLedger` resets it. |
| `priceSource`       | Absent: never chosen (the action preselects nothing). `unset`: Decide in BitcoinTX, the app's own card decides. `off` (Nobody), `public` or `mempool`: set by Price Source & Privacy and passed as `BTCTX_PRICE_SOURCE`. |
| `mempoolFallback`   | With `mempool`: ask public sites when Mempool can't answer (`BTCTX_MEMPOOL_FALLBACK`). |
| `useTor`            | Public sites through Tor's SOCKS proxy (`BTCTX_PROXY_URL`), when public sites may be asked; with `unset` (Decide in BitcoinTX), StartOS's Tor lent to the app's own choice (`BTCTX_TOR_PROXY_URL`, shown in the app as Tor on this server, locked on). Either way Tor becomes a dependency. |
| `checkDefaultLogin` | Set by the update that introduced generated passwords; the next init replaces a login still on `admin` / `password`, then clears it. |
| `priceSourceTask`   | Set by the update that introduced Price Source & Privacy. No longer read or written. |
| `priceSourceAsked`  | Set once the package has asked for a price choice (the critical task at install, or the important one after an update), so it asks only once (see [Tasks](#tasks)). |

## Dependencies

Two, both optional (`dependencies.ts`). The manifest lists both; each one's `enabled` reads `store.json`, so a dependency becomes current, with the requirement below, only while the Price Source & Privacy choice uses it. Nothing is required otherwise.

| Dependency | When                                                         | Requirement                                   | Reached at |
| ---------- | ------------------------------------------------------------ | --------------------------------------------- | ---------- |
| `mempool`  | Price source **My Mempool on this server**                   | running, the minimum version in `dependencies.ts`, health check `webui` | `http://<bridge>` from `sdk.host.getBridgeAddress` (host `main`, port 8080, `ssl: false`); its `/api/v1/prices`, `/api/blocks/tip/height`, `/api/v1/historical-price` |
| `tor`      | **Use Tor**, with public sites, the fallback, or Decide in BitcoinTX | running, the minimum version in `dependencies.ts`, health check `tor` | `socks5h://<bridge>` (host `socks`, port 9050, `fallbackPort: 9050`): `BTCTX_PROXY_URL` for a choice made here, `BTCTX_TOR_PROXY_URL` for the app's own choice (locked on in its card; an invalid value asks nobody) |

The bridge address (`10.0.3.1:<assigned port>`) is plain HTTP inside StartOS: no certificate to trust and no LAN address that can change. `main.ts` reads both with `.const()`, so installing, removing or re-binding a dependency restarts BitcoinTX with the new address. While Mempool is missing, `BTCTX_MEMPOOL_URL` is left out and the app answers price requests with "install and start Mempool" (or asks public sites if the fallback is on). Tor's address falls back to its fixed port, so without Tor those requests fail instead of going out directly.

## Network Access and Interfaces

One HTTP port with two interfaces. StartOS terminates TLS; the app serves plain HTTP on port 80 inside the container. BitcoinTX makes no outbound request until the owner chooses a price source (the Price Source & Privacy action, or the app's **Settings → Privacy & Network** card, which asks on its Dashboard unless the action set it; a choice the app stored before it kept a record of when it was made is asked once to confirm, and nothing is sent until then): their own mempool server (live price `/api/v1/prices`, block height, past prices from `/api/v1/historical-price`, its live hourly rows), public sites, or nobody. With a choice that allows public sites, the hourly history (Bitstamp's hourly opens from 2013, in fixed 1,000-hour blocks) is downloaded once and each year checked against the fingerprints in `backend/assets/btc_prices/MANIFEST.csv`. Public sites: live price from Kraken, else Bitstamp; block height from Blockchain.info, Blockstream or mempool.space; and past daily prices from one download of Bitstamp's whole history in fixed blocks, then only the latest days (Bitstamp, else Kraken). No request names a transaction date. With a mempool server, the public sites are asked only if the owner turns on the fallback. Tor (the action's Use Tor, or a proxy set in the app) carries requests to public sites, except Bitstamp's fixed-block history downloads once the owner has answered Yes to downloading them without Tor (Bitstamp refuses Tor: Limitations and Differences, item 5); the service's outbound traffic can also go through a VPN with StartOS's **Set Outbound Gateway**. The log names the source of each past-price download ("Price history from your mempool server: N days", "BTC price history from public site …").

| Interface | Id      | Type | Port | Path   | Description                                          |
| --------- | ------- | ---- | ---- | ------ | ---------------------------------------------------- |
| Web UI    | `webui` | ui   | 80   | `/`    | The BitcoinTX web interface                          |
| MCP API   | `mcp`   | api  | 80   | `/api` | The address MCP clients use as `BTCTX_URL`           |

Both are on the `ui-multi` host, so a domain added to one is available to both. MCP clients authenticate with an AI key the owner creates in the app (**Settings → Connect an AI Assistant**; `Authorization: Bearer`, env `BTCTX_AI_KEY`), never the password. The MCP server itself runs on the user's computer, not on StartOS, and accepts the `…/api` address as `BTCTX_URL`.

## Installation and First-Run Flow

The package, not the app's first-run page, creates the login: the service cannot start until it exists.

1. Install creates nothing in the app. A **critical** task points at Set Login Credentials, then a second **critical** one at Price Source & Privacy: the service starts once both have run — see [Tasks](#tasks).
2. Set Login Credentials runs `set-password` in a temporary subcontainer, which creates and migrates the database and sets `admin` / a random 24-character password, records `loginSet` in `store.json` (never the password) and shows the password once.
3. Because the login is no longer the app's shipped default (`admin` / `password`), the app's first-run registration page never appears.

Installs from before generated passwords started with `admin` / `password`, which BitcoinTX now accepts only with the setup code from the service log. Updating from before generated passwords runs `set-password --if-default` once with a random password nobody is shown (a backup from before then is restored as its own version, and does this at its next update): if the login was still the default, it is now locked and the critical Set Login Credentials task is raised. A login the owner set in the app is kept, but with no `loginSet` the critical task is raised as well, and running it replaces that login. The update clears any outstanding task for the removed Show Credentials action.

## Actions

Four actions, all user-facing: none is hidden. What raises and clears the tasks that point at them is under [Tasks](#tasks).

Set Login Credentials and Recalculate Ledger run a `python -m backend.cli` command in a temporary subcontainer, through the image's entrypoint, with no time limit (the database's size sets how long it takes). When the command fails, the action's alert says "BitcoinTX could not set the password: …" or "BitcoinTX could not recalculate the ledger: …" in the user's language, followed, in English, by what the command's own `error: …` line says (else the start-up script's refusal, the signal that stopped the command, its last line on stderr that is neither a log line nor SQL, or its exit code). The rest of the command's output is neither shown nor logged: it can carry the SQL's values, such as a password's hash. The init step that replaces an old default login logs the same one line when its command fails.

### Set Login Credentials

Besides its task, run it when the owner has lost the password. Sets the username to `admin` and a new random password through `set-password` (creating the database on a fresh install), records `loginSet` (never the password), and returns the password once; nothing shows it again. Transactions and settings are untouched. Destructive on a second run: each run replaces the login, one set in the app included, and the old password stops working.

### Price Source & Privacy

Run it to choose, or change, who BitcoinTX asks for newer prices. Saves `priceSource`, `mempoolFallback` and `useTor` in `store.json` (prefilled from there; nothing is preselected until a choice was made). `main.ts` and `dependencies.ts` watch those keys, so a running BitcoinTX restarts with the new `BTCTX_*` variables and dependencies; a stopped one starts with them. "Decide in BitcoinTX instead" (`unset`) passes no price choice and the app's own card decides: what was chosen there, or, if nothing was, the app asks. Safe to repeat: each run replaces the choice. Resolves "no prices" (Mempool not installed or not running: install or start it, or turn on the fallback) and "the public sites see my IP" (Use Tor, or StartOS's Set Outbound Gateway).

### Connect an AI Assistant

Returns the MCP API's https addresses (`.local` first), the StartOS root CA (from `sdk.getRootCa`; shown as multi-line text and offered as a download named `btctx-root-ca.crt`), and a Claude Desktop config (multi-line text) and `claude mcp add --scope user` command (every folder, not only the current one) that run the MCP server with `uvx btctx-mcp==<this release>` (from PyPI, pinned to the package's version), with `YOUR_BITCOINTX_AI_KEY` where the key goes. It reads no credentials: the key is created and shown (once) only in the app. Changes nothing; safe to repeat. If the root CA can't be read, the message points to System > About this Server to download it. Resolves "the AI can't connect" (wrong URL, TLS verification failures).

### Recalculate Ledger

Runs `python -m backend.cli recalculate` (migrates the schema first if needed): rebuilds every ledger entry, lot and disposal from the transactions, exactly like the app's Settings > Recalculate Ledger. Transactions are not modified. Takes seconds to a minute on large ledgers and may look up historical BTC prices for unpriced spends. Safe to repeat. Sets `recalculateLedger` to `false`. Resolves gains or lots that look wrong after an update with calculation fixes.

## Tasks

Three actions raise tasks.

| Task                   | Severity    | Raised when                                        | Cleared when                     |
| ---------------------- | ----------- | -------------------------------------------------- | -------------------------------- |
| Set Login Credentials  | `critical`  | While `loginSet` is unset (at install, and after an update from an install whose login was set in the app); after an update locked a default login | The action runs |
| Price Source & Privacy | `critical`  | At install, after Set Login Credentials (init order) | The action runs: any choice, Nobody and Decide in BitcoinTX included |
| Price Source & Privacy | `important` | Once, after an update of an install that was never asked and has no choice made here (never critical: a running service never stops) | The action runs, or dismissed |
| Recalculate Ledger     | `important` | Once, after an update whose calculation fixes reach saved transactions only through a recalculation; again after restoring a backup on which `recalculateLedger` is still set | The action runs, or dismissed |

The critical tasks block starting the service until the login exists and a price choice is made (Start9's `tasks.md`: critical is for essential setup such as selecting a backend). Both keep the replay key they always had, so nothing is retired. After an update the price task does not block: until a source is chosen, the app asks on its Dashboard and contacts nothing. The recalculation task does not block: the app works, but figures saved before such an update keep the old calculation until a recalculation. Neither `important` task is raised at a container rebuild (every server restart) or twice for one update: raising a replay key again after the user dismissed it would bring it back each time. A recalculation in the app's own Settings does the same work but doesn't clear the StartOS task or `recalculateLedger`; dismiss the task then.

An update whose calculation fixes reach saved transactions only through a recalculation raises the Recalculate Ledger task (above); any other change to how figures are worked out applies at the next recalculation (an edit or a deletion recalculates too). **Settings → Ledger Review** in the app lists the figures a recalculation would change beforehand.

## Health Checks

One check, on the `webui` daemon.

| Check                   | Method                                                | Grace Period |
| ----------------------- | ----------------------------------------------------- | ------------ |
| `webui` "Web Interface" | `GET /api/health` must return 200                     | 30 s         |

`/api/health` returns 200 only when the database answers at the schema this version expects; a 503 carries the reason ("database schema is X, expected Y" or "database unreachable"), which the check shows. Schema upgrades happen before this, in the `migrate` oneshot; if that fails (for example a database written by a newer BitcoinTX), the service does not start and the error is in the service logs.

## Backups and Restore

Both volumes are copied whole (`sdk.Backups.ofVolumes('main', 'startos')`). StartOS stops the service first, so the SQLite file is copied at rest; there is no dump step.

- **Included:** the database, the session key, the hourly price history in `btc-prices/`, the app's copies in `backups/`, and `store.json`.
- **Restore:** complete: the login is in the app's database (as its hash), and `store.json` says whether it was set. StartOS keeps the installed package in each backup, so a restore brings back the package version the backup was made with, and its data as that version left it. The next update migrates it like any update (including the Recalculate Ledger task when it predates the gain-calculation fixes); a backup from a version before the app had its own user holds root's files, which the entrypoint gives to `btctx` at the first start after that update (or at an action's command, if one runs first). StartOS refuses a restore over an installed package, and an uninstall deletes both volumes, `backups/` included.
- The app also has its own password-encrypted database export (Settings in the web UI), independent of StartOS backups. Restoring one of those in the app brings back the ledger and its other settings but keeps the login, the AI key and the price settings in use.

## Limitations and Differences

BitcoinTX on StartOS is the same app as on Docker; these are the differences and limits to know.

1. **The first-run registration page never appears**; Set Login Credentials creates the login.
2. **The MCP server is not hosted here.** It runs on the user's computer and connects to the MCP API address.
3. **No riscv64 build.**
4. **Prices set in the action are read-only in the app**, until **Decide in BitcoinTX instead** hands them back (for example for the owner's own proxy, with Use Tor off). For a Mempool on another server, the app's **Trust this server** works only for a home-network `https://` address (`.local`, `.lan`, a one-word name, or 10.x, 172.16–31.x or 192.168.x), once a request has failed on that server's certificate, and pins its root certificate for that address only (never for public sites). From inside StartOS, another server's `.local` name resolves only if the network's DNS answers it: the service's resolver (10.0.3.1) forwards names it doesn't serve to the network's DNS, and the container has no mDNS. That server's LAN IP address works, since StartOS's certificate covers the address the client connects to; an address in 10.59.x.x is on StartTunnel's default WireGuard subnet, reached only through that VPN.
5. **Bitstamp refuses requests through Tor** (403, or its "Loading" challenge). With **Use Tor**, the hourly history download and every past price from Bitstamp fail safely: no request goes direct and no value becomes $0, and only the live price works (Kraken). Once Bitstamp has refused (`bitstamp_refused` in `GET /api/bitcoin/price/status`), the app asks once whether to download that history without Tor. The answer is stored in the app (`history_without_tor` in `GET /api/settings/network`, with when and where it was given), kept by an in-app restore, and changeable even while the action sets the choice (`PUT /api/settings/network/history-without-tor`, a login only). After a Yes, only Bitstamp's fixed-block history downloads go directly (the hourly year files, the newer hours after them, the daily history: `ohlc/btcusd/?step=…&limit=1000&start=<fixed>`), and the log says "Bitstamp's fixed blocks … go without Tor (agreed on …)"; after a No, nothing goes direct.

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
  - btctx # migrate oneshot + webui daemon, each through the image's entrypoint
  - cli-<command> # temporary, per action/init: the CLI through the entrypoint
user: btctx # uid/gid 10001; never root (every step keeps only CAP_NET_BIND_SERVICE)
volumes:
  main: /data
  startos: null # store.json, not mounted
file_models:
  - store.json # startos volume
  - .startos-wrapper.json # main volume, only on installs from before the startos volume; their update deletes it
startos_managed_env_vars:
  - DATABASE_FILE
  - LOG_LEVEL
  - BTCTX_PRICE_SOURCE # only once chosen in price-source
  - BTCTX_MEMPOOL_URL # http://<bridge>, left out while Mempool is missing
  - BTCTX_MEMPOOL_FALLBACK
  - BTCTX_PROXY_URL # socks5h://<bridge>:9050 with Tor
  - BTCTX_TOR_PROXY_URL # with Decide in BitcoinTX instead + Use Tor
  - BTCTX_HOST # startos
dependencies: # both optional, only while chosen
  mempool: { kind: running, health: webui, host: main, port: 8080 }
  tor: { kind: running, health: tor, host: socks, port: 9050 }
interfaces:
  webui: { type: ui, port: 80, path: / }
  mcp: { type: api, port: 80, path: /api }
actions:
  - price-source
  - connect-ai
  - recalculate-ledger
  - set-credentials
tasks:
  - { action: set-credentials, severity: critical }
  - { action: price-source, severity: critical } # install; important once after an update never asked, without a choice
  - { action: recalculate-ledger, severity: important } # once after an update that makes it due; again after a restore while it's due
health_checks:
  - webui # GET /api/health == 200
app_cli: python -m backend.cli {migrate|set-password [--if-default]|recalculate} # cwd /app
```
