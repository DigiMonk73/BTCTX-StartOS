# Updating and releasing

This package is developed in `startos/` of
[DigiMonk73/BTCTX-MCP](https://github.com/DigiMonk73/BTCTX-MCP), together with
the app it runs. One `VERSION` file (repository root) versions the app, the
Docker image, the macOS app and this package.

## Releasing a new version

1. On a branch, bump the version everywhere it is written (the tests fail
   until all agree):
   - `VERSION` and the two `CFBundle…Version` values in `desktop/BitcoinTX.spec`
   - `dockerTag` in `startos/startos/manifest/index.ts`:
     `ghcr.io/digimonk73/btctx-mcp:v<VERSION>`
   - the package version (next section)
2. Move the `## [Unreleased]` section of `docs/CHANGELOG.md` to
   `## [vX.Y.Z] - <date> - <summary>`.
3. Merge to `main`. `.github/workflows/image.yml` publishes the image
   `ghcr.io/digimonk73/btctx-mcp:vX.Y.Z`.
4. Push a branch `release/vX.Y.Z` from that commit. `.github/workflows/release.yml`
   then builds the image (if `main` hasn't yet), the macOS `.dmg` and `.zip`
   and `btctx.s9pk`, creates the tag and one GitHub release with all three,
   and mirrors `startos/` to BTCTX-StartOS (when `MIRROR_TOKEN` exists).

A package-only fix (no app change) keeps `VERSION` and raises the package
revision instead (`0.9.0:0` → `0.9.0:1`, next section). Release it the same
way with the tag `vX.Y.Z-N`: a `## [v0.9.0-1]` CHANGELOG section and a branch
`release/v0.9.0-1`. The image is reused; the macOS app is rebuilt unchanged.

## The package version

`startos/startos/versions/current.ts` holds `version: '<VERSION>:<revision>'`,
its release notes (what StartOS shows before updating) and its migration.

- **New `VERSION`:** if the old `current.ts` has an `up` migration that does
  real work, first copy it to `vX_Y_Z_N.ts` (renaming the export), add it to
  `other` in `versions/index.ts`, then write the new `current.ts` with an empty
  `up` and `down: IMPOSSIBLE`. A migration belongs to the version that
  introduced it; overwriting it in place would skip it for installs that
  haven't run it yet. If the old `up` is empty, just edit `current.ts`.
- **Revision only** (package change, same app): bump the number after the `:`.
- `down` is always `IMPOSSIBLE`: an older BitcoinTX refuses a database a newer
  one has migrated.
- Release notes are user-facing: what changed for them, in plain language.

Checks: `npm run check && npm run lint && npm run build && node scripts/check-manifest.mjs`
(also run by the pre-push hook and CI), and `backend/tests/test_versions_agree.py`.

## Bumping the SDK

`.github/workflows/startos-sdk-check.yml` opens an issue when npm has a newer
`@start9labs/start-sdk`. To adopt it:

1. Read its CHANGELOG (in `node_modules/@start9labs/start-sdk/` after
   installing) for breaking changes and the minimum StartOS version.
2. `npm install --save-exact @start9labs/start-sdk@<version>`
3. Update `START_CLI_VERSION` in `.github/workflows/ci.yml`,
   `.github/workflows/release.yml` and `startos/.github/workflows/release.yml`
   to the start-cli release that matches the SDK.
4. Run the checks, bump the package revision, release.

## Building locally

Needs Docker (with the containerd image store for multi-arch images),
`squashfs-tools`, `jq`, Node 22 and
[start-cli](https://docs.start9.com/packaging/environment-setup.html). start-cli
packs only inside a *packaging workspace*: a directory above the package that
holds `.startos/build.key.pem`. Create it above the repository, not inside it:

```sh
cd startos
npm ci
start-cli s9pk init-workspace ../..   # or: DEV_KEY="$(cat key.pem)" scripts/signing-key.sh ../..
docker pull --platform linux/amd64 ghcr.io/digimonk73/btctx-mcp:v$(cat ../VERSION)
docker pull --platform linux/arm64 ghcr.io/digimonk73/btctx-mcp:v$(cat ../VERSION)
make universal                          # btctx.s9pk; `make x86` for one arch
```

Sideload the result in StartOS (**Sideload** in the top bar).

## One-time setup: the two secrets

Until these exist, releases still work: each `btctx.s9pk` is signed with a
new throwaway key and the mirror is not updated automatically.

### DEV_KEY: the package signing key

Every s9pk is signed. A registry (Start9's community registry, or your own)
accepts a package only from its authorized signer, so all releases should be
signed with one key that you keep.

1. Create the key on your own computer (Ed25519, PEM):

   ```sh
   openssl genpkey -algorithm ed25519 -out btctx-dev.key.pem
   openssl pkey -in btctx-dev.key.pem -pubout    # prints the public key
   ```

   If macOS's built-in `openssl` refuses `ed25519`, use Homebrew's:
   `brew install openssl` then `$(brew --prefix openssl)/bin/openssl genpkey …`.
2. Keep `btctx-dev.key.pem` safe and offline (a password manager is fine).
   Never commit it. Losing it means changing the package's signer on every
   registry that lists it.
3. On GitHub, open **DigiMonk73/BTCTX-MCP → Settings → Secrets and variables →
   Actions → New repository secret**. Name: `DEV_KEY`. Secret: the whole file,
   including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   lines. **Add secret.**
   (With the GitHub CLI instead: `gh secret set DEV_KEY -R DigiMonk73/BTCTX-MCP < btctx-dev.key.pem`.)
4. Add the same secret to **DigiMonk73/BTCTX-StartOS** if you ever build
   releases there.
5. Check: the next release run's "Signing key" step prints "Signing with
   DEV_KEY" and the public key from step 1.

### MIRROR_TOKEN: pushing to BTCTX-StartOS

The release workflow copies `startos/` to DigiMonk73/BTCTX-StartOS. It needs a
token that can push there, including workflow files.

1. On GitHub: your profile picture → **Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → Generate new token**.
2. Name `btctx-mirror`; expiration up to a year (note the date: the mirror
   step stops working when it expires). Resource owner: **DigiMonk73**.
3. **Repository access: Only select repositories → DigiMonk73/BTCTX-StartOS.**
4. **Repository permissions:** **Contents: Read and write** and **Workflows:
   Read and write** (the mirror carries `.github/workflows/`). Leave the rest.
5. **Generate token** and copy it.
6. In **DigiMonk73/BTCTX-MCP → Settings → Secrets and variables → Actions →
   New repository secret**: name `MIRROR_TOKEN`, paste the token, **Add secret**.
7. Check: the next release run's "mirror" job pushes a commit "Sync from
   DigiMonk73/BTCTX-MCP@…" and a tag `v<upstream>_<revision>` to BTCTX-StartOS.

Without the token, sync by hand from a clone of BTCTX-MCP:

```sh
scripts/sync-startos-mirror.sh           # clones the mirror to a temp dir, commits, doesn't push
scripts/sync-startos-mirror.sh --push    # same, then pushes the commit and tag
```
