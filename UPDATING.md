# Updating and releasing

This package is developed in `startos/` of
[DigiMonk73/BTCTX-MCP](https://github.com/DigiMonk73/BTCTX-MCP), together with
the app it runs. One `VERSION` file (repository root) versions the app, the
Docker image, the macOS app and this package. It is mirrored as-is to
[DigiMonk73/BTCTX-StartOS](https://github.com/DigiMonk73/BTCTX-StartOS), the
repository Start9 forks into Start9-Community for its community registry.

## Determining the upstream version

The upstream is the BitcoinTX app, released from DigiMonk73/BTCTX-MCP as
`vX.Y.Z` together with its image `ghcr.io/digimonk73/btctx-mcp:vX.Y.Z`:

```sh
gh release view -R DigiMonk73/BTCTX-MCP --json tagName -q .tagName
```

The current pin is `images.main.source.dockerTag` in
`startos/manifest/index.ts` (`ghcr.io/digimonk73/btctx-mcp:v<version>`).

## Applying the bump

Upstream releases bring their own package changes, so a bump normally arrives
as a pull request from DigiMonk73/BTCTX-StartOS. By hand:

- Bump `dockerTag` in `startos/manifest/index.ts` to
  `ghcr.io/digimonk73/btctx-mcp:v<new version>`.
- Set `version` in `startos/versions/current.ts` to `<new version>:0`, with
  release notes; move the old `current.ts` to its own file first if its `up`
  migration does work (see "The package version" below).

## Releasing a new version

Branches (`CLAUDE.md`, "Branches"): work happens on `develop`; `main` holds
released code only and moves by fast-forwarding to `develop`.

1. On `develop`, bump the version everywhere it is written (the tests fail
   until all agree):
   - `VERSION` and the two `CFBundle…Version` values in `desktop/BitcoinTX.spec`
   - `version` in `mcp_server/pyproject.toml` (the AI connector)
   - `dockerTag` in `startos/startos/manifest/index.ts`:
     `ghcr.io/digimonk73/btctx-mcp:v<VERSION>`
   - the package version (next section)
2. Move the `## [Unreleased]` section of `docs/CHANGELOG.md` to
   `## [vX.Y.Z] - <date> - <summary>`.
3. Push `develop` and wait for CI. Run the agent release tests
   (`docs/AGENT-TESTS.md`) on that commit's CI artifacts; a blocker FAIL
   stops the release. Then fast-forward `main` to it
   (`git checkout main && git merge --ff-only develop && git push`).
   `.github/workflows/image.yml` publishes the image
   `ghcr.io/digimonk73/btctx-mcp:vX.Y.Z`.
4. Push a branch `release/vX.Y.Z` from that commit on `main` (the release
   workflow refuses a commit that isn't on `main`). `.github/workflows/release.yml`
   then builds the image (if `main` hasn't yet), the macOS `.dmg` and `.zip`
   and `btctx.s9pk`, creates the tag and one GitHub release with all three,
   publishes the AI connector to PyPI (`btctx-mcp==X.Y.Z`, not for `-N`
   revisions), and pushes `startos/` to BTCTX-StartOS's `main` (when
   `MIRROR_TOKEN` exists). There, Start9's **Tag and Release** workflow
   tags it `v<upstream>_<revision>` and creates the release with its own
   build (it needs `DEV_KEY` and `REFERENCE_REGISTRY`, below). Delete the
   `release/…` branch afterwards.
5. Once Start9 has forked the mirror: open a pull request from
   DigiMonk73/BTCTX-StartOS `main` to their fork (below).

## After Start9 forks the mirror

Start9 forks DigiMonk73/BTCTX-StartOS into Start9-Community; from then on
their fork is the package's upstream for the registry. They change it too:
template updates about monthly (their `syncNext` workflow keeps a `next`
branch), SDK bumps and review fixes, by pull requests on their fork.

- **Before each sync, take their changes:** on `develop`, run
  `scripts/start9-pull.sh` to see what they changed since they last took
  ours, then `scripts/start9-pull.sh --apply`, review, run the checks and
  commit. The mirror sync replaces the mirror's contents with `startos/`,
  so anything not brought back here would be undone.
- **Contribute each release:** after the release workflow has updated the
  mirror, open a pull request from DigiMonk73/BTCTX-StartOS `main` to the
  fork's default branch (`gh pr create -R Start9-Community/BTCTX-StartOS
  --head DigiMonk73:main`). Start9 reviews and merges it (usually within a
  day) and publishes to the community registry.
- The fork's name may differ: `START9_FORK=Owner/Repo scripts/start9-pull.sh`.

A package-only fix (no app change) keeps `VERSION` and raises the package
revision instead (`0.9.0:0` → `0.9.0:1`, next section). Release it the same
way with the tag `vX.Y.Z-N`: a `## [v0.9.0-1]` CHANGELOG section and a branch
`release/v0.9.0-1`. The image is reused; the macOS app is rebuilt unchanged.

## The package version

`startos/startos/versions/current.ts` holds `version: '<VERSION>:<revision>'`,
its release notes (what StartOS shows before updating) and its migration.

- **New `VERSION`:** if the old `current.ts` has an `up` migration that does
  real work, first copy it to `vX.Y.Z_N.ts` exporting `v_X_Y_Z_N` (Start9's
  naming, e.g. `v1.2.0_0.ts` exports `v_1_2_0_0`), add it to `other` in
  `versions/index.ts`, then write the new `current.ts` with an empty `up`
  and `down: IMPOSSIBLE`. A migration belongs to the version that
  introduced it; overwriting it in place would skip it for installs that
  haven't run it yet. If the old `up` is empty, just edit `current.ts`.
- **Revision only** (package change, same app): bump the number after the
  `:`, moving the old `current.ts` to its own file first in the same way if
  its `up` does real work (1.2.0:0's does), or installs already on it would
  run it again.
- `down` is always `IMPOSSIBLE`: an older BitcoinTX refuses a database a newer
  one has migrated.
- Release notes are user-facing: what changed for them, in plain language,
  in `en_US`, `es_ES`, `de_DE`, `pl_PL` and `fr_FR`, each ending with the
  CHANGELOG link. One-time instructions for updating users belong there, not
  in `instructions.md` or action messages.

Checks: `npm run check && npm run lint && npm run build && node scripts/check-manifest.mjs && npx prettier --check startos`
(also run by the pre-push hook and CI), and `backend/tests/test_versions_agree.py`.

## Bumping the SDK

`.github/workflows/startos-sdk-check.yml` opens an issue when npm has a newer
`@start9labs/start-sdk`. To adopt it:

1. Read its CHANGELOG (in `node_modules/@start9labs/start-sdk/` after
   installing) for breaking changes and the minimum StartOS version.
2. `npm install --save-exact @start9labs/start-sdk@<version>`, then
   `npm update mempool-startos tor-startos` (the packages the dependency
   constants come from; `overrides` keeps one SDK copy)
3. Update `START_CLI_VERSION` in `.github/workflows/ci.yml` and
   `.github/workflows/release.yml` to the start-cli release that matches the
   SDK. (The mirror's workflows call Start9's shared ones, which pick their
   own.) Once Start9 has forked the mirror, they may bump the SDK there
   first: take it with `scripts/start9-pull.sh` instead.
4. If the new SDK's typescript-eslint accepts a newer TypeScript, raise the
   `typescript` limit for `/startos` in `.github/dependabot.yml`.
5. Run the checks, bump the package revision, release.

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

## One-time setup: secrets and a variable

Until these exist, releases still work: each `btctx.s9pk` is signed with a
new throwaway key and the mirror is not updated (or released) automatically.

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
4. Add the same secret to **DigiMonk73/BTCTX-StartOS** (Settings → Secrets
   and variables → Actions → New repository secret, name `DEV_KEY`), where
   Start9's Tag and Release workflow signs its build:
   `gh secret set DEV_KEY -R DigiMonk73/BTCTX-StartOS < btctx-dev.key.pem`.
5. Check: the next release run's "Signing key" step prints "Signing with
   DEV_KEY" and the public key from step 1.

### REFERENCE_REGISTRY: the mirror's release check

Start9's Tag and Release workflow first asks a registry whether this version
is already published there, and skips the release if so. In
**DigiMonk73/BTCTX-StartOS → Settings → Secrets and variables → Actions →
Variables → New repository variable**: name `REFERENCE_REGISTRY`, value
`https://community-registry.start9.com` (Start9's community registry). Or:
`gh variable set REFERENCE_REGISTRY -R DigiMonk73/BTCTX-StartOS -b https://community-registry.start9.com`.
Leave `RELEASE_REGISTRY` unset: the mirror then only makes a GitHub release,
and Start9 publishes to its registries from its own fork.

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
   DigiMonk73/BTCTX-MCP@…" to BTCTX-StartOS, whose Tag and Release workflow
   then tags and releases it.

Without the token, sync by hand from a clone of BTCTX-MCP:

```sh
scripts/sync-startos-mirror.sh           # clones the mirror to a temp dir, commits, doesn't push
scripts/sync-startos-mirror.sh --push    # same, then pushes the commit
```

If the mirror's Tag and Release workflow can't run (no `DEV_KEY` or
`REFERENCE_REGISTRY` there yet), release it with this repository's package:

```sh
gh release download vX.Y.Z -p btctx.s9pk -D /tmp/pkg
scripts/mirror-startos-release.sh vX.Y.Z /tmp/pkg/btctx.s9pk   # tag + release on the mirror
```
