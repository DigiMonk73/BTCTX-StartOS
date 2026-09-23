# CLAUDE.md

## Project Overview

StartOS wrapper for BitcoinTX, a self-hosted Bitcoin portfolio tracker with double-entry accounting and FIFO cost-basis tax reporting.

## Build Commands

```bash
# Build the s9pk package (requires start-cli)
export PATH="$HOME/.cargo/bin:$PATH" && make

# TypeScript type checking
npm run check

# Format code
npm run prettier

# Clean build artifacts
make clean
```

**Important:** `start-cli` is installed in `~/.cargo/bin/` which may not be in PATH by default. Always prepend the PATH when running make commands.

## Project Structure

```
startos/
├── index.ts             # Main exports (manifest built via buildManifest)
├── sdk.ts               # SDK initialization
├── main.ts              # Daemon setup (uvicorn command, env vars)
├── interfaces.ts        # Network interface setup (port 80)
├── backups.ts           # Backup configuration
├── dependencies.ts      # Service dependencies (none)
├── utils.ts             # Shared utilities
├── manifest/
│   └── index.ts         # Package metadata, Docker image reference
├── init/
│   └── index.ts         # Initialization plumbing
├── actions/             # User-facing actions
│   ├── index.ts
│   ├── showCredentials.ts
│   └── resetCredentials.ts
├── fileModels/          # Wrapper-managed files on the data volume
└── versions/            # Version migration files
    ├── index.ts         # Version graph
    └── v*.ts            # Individual version migrations
```

## Key Configuration

- **Docker image:** `ghcr.io/digimonk73/btctx-mcp:vX.Y.Z` (version tag pinned in `startos/manifest/index.ts`), built from [DigiMonk73/BTCTX-MCP](https://github.com/DigiMonk73/BTCTX-MCP) by its `image.yml` workflow (amd64 + arm64). Since v0.8.0:0; earlier versions used the upstream `b1ackswan/btctx` image from Docker Hub.
- **Architecture:** aarch64, x86_64
- **Port:** 80 (HTTP)
- **Database path:** `/data/btctx.db`
- **Volume mount:** `/data`
- **Start command:** `uvicorn backend.main:app --host 0.0.0.0 --port 80`
- **Credentials:** username `admin`; a unique password is generated on install (stored in `/.startos-wrapper.json` on the `main` volume, retrievable via the Show Credentials action). This behavior is unchanged through v0.8.0:0. Installs predating v0.6.0:1 may still use the upstream default `admin` / `password`.

## Common Workflows

### "Docker image updated"

When the user indicates the upstream Docker image has been updated, this typically means:
1. Update the pinned `dockerTag` in `startos/manifest/index.ts` to the new version tag (e.g. `ghcr.io/digimonk73/btctx-mcp:v0.8.0`)
2. Create a new version migration file with the bumped version and release notes
3. Set it as current in the versions index
4. Build and package the new .s9pk

**Important:** The image is pinned to a version tag in the manifest, so builds are reproducible. When building locally, pull the pinned tag first (e.g. `docker pull ghcr.io/digimonk73/btctx-mcp:v0.8.0`). The release CI workflow reads the pinned tag from the manifest automatically.

Follow the version bumping checklist below.

## Version Format

StartOS 0.4.0 uses Extended Version format: `upstream_version:wrapper_revision`

Example: `0.5.1:0`
- **`0.5.1`** - Upstream BTCTX app version
- **`:0`** - Wrapper revision (first packaging of this version)

**When to increment what:**
- Bump **upstream version** (`0.5.1` → `0.5.2`) when the Docker image/app changes
- Bump **wrapper revision** (`:0` → `:1`) when only wrapper code changes but upstream app is the same

**Important:** Always bump some part of the version for each release. Same-version sideloads trigger "reinstall" instead of "update", which may not preserve user data.

## Version Bumping Checklist

When updating for a new upstream release:

1. Update the pinned `dockerTag` in the manifest and pull it: `docker pull ghcr.io/digimonk73/btctx-mcp:vX.Y.Z`
2. Create new version file in `startos/versions/v*_*_*_*.ts` with the new `version` and `releaseNotes`
3. Update `startos/versions/index.ts` to set new version as current (previous current moves to `other`)
4. Run `npm run check` to verify TypeScript
5. Build with `make`

Note: Since start-sdk 1.x, the version, release notes, and migration ranges
(`canMigrateTo`/`canMigrateFrom`) are derived from the versions graph — they
no longer exist in the manifest (`startos/manifest/index.ts`).

## Database Path

The upstream app uses `/data/btctx.db` (also the image's default). Since
v0.8.0 the app migrates its own schema at startup and keeps pre-upgrade copies
in `/data/backups/`; `backend.database.create_tables()` (used by
`setCredentialsScript`) runs those migrations and seeds defaults. This is configured in:
- `startos/main.ts` (DATABASE_FILE env var)
- `startos/actions/resetCredentials.ts` (sqlite3 connection)

## Git Remotes & Releases

**Since v0.8.0:0 this repo (DigiMonk73) packages the BTCTX-MCP fork image;
the org repo still packages the upstream app. Don't push fork releases to
`org` unless the org decides to adopt the fork.**

Historically this repo was pushed to two remotes:
- **origin** → `https://github.com/DigiMonk73/BTCTX-StartOS.git`
- **org** → `https://github.com/BitcoinTX-org/BTCTX-StartOS.git`

When pushing changes, always sync both:

```bash
# Push commits and tags to both remotes
git push origin master --tags
git push org master --tags
```

**Releases are automated.** Pushing a `v*` tag triggers the Release workflow
(`.github/workflows/release.yml`) on each repo, which builds the s9pk in CI
and publishes a GitHub release with the `btctx.s9pk` asset. The release title
and notes are derived from the current version in the versions graph. So to
cut a release, just tag and push to both remotes:

```bash
git tag v0.7.0
git push origin master --tags
git push org master --tags
```

Do NOT also run `gh release create` — the workflow does it, and a manually
created release would collide with it. If a workflow run fails on one repo,
re-run it (`gh run rerun <run-id> --repo <repo>`) or use the workflow's
`workflow_dispatch` trigger with the tag as input.

Verify afterwards that both releases exist with the asset attached:

```bash
gh release view <tag> --repo DigiMonk73/BTCTX-StartOS --json name,assets
gh release view <tag> --repo BitcoinTX-org/BTCTX-StartOS --json name,assets
```

## Resources

- [StartOS 0.4.0 Packaging Guide](https://staging.docs.start9.com/packaging-guide/index.html) - Official documentation for building StartOS packages
- [Vaultwarden StartOS Wrapper](https://github.com/Start9Labs/vaultwarden-startos/tree/update/040) - Reference implementation (use `update/040` branch, not master)
