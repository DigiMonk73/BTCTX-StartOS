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

Branches (BTCTX-MCP's `AGENTS.md`, "Branches"): work reaches `develop` by pull request;
`main` holds released code only and moves by fast-forwarding to `develop`.

1. In a pull request into `develop`, bump the version everywhere it is
   written (the tests fail until all agree):
   - `VERSION` and the two `CFBundle…Version` values in `desktop/BitcoinTX.spec`
   - `version` in `mcp_server/pyproject.toml` (the AI connector)
   - `dockerTag` in `startos/startos/manifest/index.ts`:
     `ghcr.io/digimonk73/btctx-mcp:v<VERSION>`
   - the package version (next section)

   In the same pull request, run `make prices` (online): it adds the hourly
   price history's new hours to `backend/assets/btc_prices/MANIFEST.csv`,
   cross-checked against a second exchange (that folder's README). The
   release refuses a history that ends more than 14 days before it.
2. Move the `## [Unreleased]` section of `docs/CHANGELOG.md` to
   `## [vX.Y.Z] - <date> - <summary>`, and remove the ticked items from
   `docs/ROADMAP.md` (the CHANGELOG has them now).
3. Once it has merged, wait for CI on `develop`. Run the agent release tests
   (`docs/AGENT-TESTS.md`) on that commit's CI artifacts; a blocker FAIL
   stops the release. Meanwhile, the docs check (BTCTX-MCP's `AGENTS.md`,
   "Releasing", step 1): anything stale is fixed by pull request first.
   Then, once CI is green on `develop`'s head (with those fixes),
   fast-forward `main` to it
   (`git fetch origin && git checkout main && git merge --ff-only origin/develop && git push`).
   `.github/workflows/image.yml` publishes the image
   `ghcr.io/digimonk73/btctx-mcp:vX.Y.Z`.
4. Push a branch `release/vX.Y.Z` from that commit on `main` (the release
   workflow refuses a commit that isn't on `main`). `.github/workflows/release.yml`
   then builds the image (if `main` hasn't yet), the macOS `.dmg` and `.zip`
   and `btctx.s9pk`, creates the tag and one GitHub release with all three
   (titled `vX.Y.Z · StartOS package X.Y.Z:N`, the version StartOS and the
   mirror show) and their `SHA256SUMS`, with a GitHub build provenance
   attestation of each (`gh attestation verify <file> -R DigiMonk73/BTCTX-MCP`),
   publishes the AI connector to PyPI (`btctx-mcp==X.Y.Z`,
   not for `-N` revisions), and pushes `startos/` to BTCTX-StartOS's `main`
   (when `MIRROR_TOKEN` exists). There, Start9's **Tag and Release** workflow
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

- **Before each sync, take their changes:** on a branch cut from `develop`,
  run `scripts/start9-pull.sh` to see what they changed since they last took
  ours, then `scripts/start9-pull.sh --apply`, review, run the checks,
  commit and open a pull request into `develop`. If what they changed moves
  a sibling in `package-lock.json`, save the bundle's list of sibling
  modules before `--apply` and compare it after ("Bumping the SDK", step 2).
  `--apply` also records their commit in BTCTX-MCP's `scripts/start9-taken`;
  commit it with the change, so later checks count only what they changed
  since. The mirror sync replaces the mirror's contents with `startos/`, so
  anything not brought back here would be undone. The sync runs
  `scripts/start9-pull.sh --check` first and stops if their changes aren't
  in `startos/`, and so does the release workflow, before publishing
  anything.
- **Contribute each release, only by a pull request:** from
  DigiMonk73/BTCTX-StartOS `main` to the fork's default branch. The sync
  first fast-forwards the mirror's `main` to the fork's branch, so the pull
  request shows only our changes. After the mirror push, the release
  workflow opens an issue in BTCTX-MCP, "Send vX.Y.Z to Start9: open the
  pull request", with a link that opens GitHub's pull-request page ready to
  create; or `gh pr create -R <fork> --head DigiMonk73:main`. Start9 reviews and merges it and publishes to the
  community registry. While a pull request of ours is still open there, the
  mirror push adds the new release to it, and no issue is opened.
- The script finds the fork itself (Start9 may rename it, and it keeps the
  mirror's default branch unless they change it): `scripts/start9-pull.sh
  --fork` prints it. If they made a new repository instead of a fork, set
  it in `START9_FORK=Owner/Repo`, and in BTCTX-MCP's repository variable
  `START9_FORK` for the release workflow.

A package-only fix (no app change) keeps `VERSION` and raises the package
revision instead (`0.9.0:0` → `0.9.0:1`, next section), once the community
registry serves the current version. Release a revision the same way with the
tag `vX.Y.Z-N`: a `## [v0.9.0-1]` CHANGELOG section and a branch
`release/v0.9.0-1`. The image is reused; the macOS app is rebuilt unchanged.

**Before the community registry serves the current version** (it is only on
Community Beta, as while the owner tests it there), Start9's rule keeps the
package version, so a revision isn't allowed (next section), and our release
workflow can't ship the same version again. Ship the package fix inside a
small app release instead: a new `VERSION` with a real app fix (never a bump
with nothing in it), its package version back at `:0`, released as in
"Releasing a new version" above, release tests and docs check included
(owner's rule, 2026-10-17). Its notes cover everything since the version the
community registry serves. If a package fix can't wait and no app fix is
ready, ask the owner: the rules change then.

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
- **Revision only** (package change, same app, once the community registry
  serves the current version; below): bump the number after the
  `:`, moving the old `current.ts` to its own file first in the same way if
  its `up` does real work (1.2.9:0's does), or installs already on it would
  run it again.
- `down` is always `IMPOSSIBLE`: an older BitcoinTX refuses a database a newer
  one has migrated.
- **A version is released once the community registry serves it** (Start9's
  `versions.md`). Start9's fork and the mirror both name
  `https://community-registry.start9.com` as `REFERENCE_REGISTRY`; their Tag
  and Release builds a version again, in place, on every push until that
  registry serves it (Community Beta doesn't count). Before choosing the
  version, see which one it serves
  (`start-cli -r https://community-registry.start9.com registry package get btctx short --format json`,
  the `best` key), and check the open pull requests on Start9's fork for one
  that already claims the version. Start9 keeps a package-only follow-up to
  a version it doesn't serve yet under that version, its notes added to the
  ones already there; our release workflow can't release a version again, so
  here such a fix rides in a small app release (above, at the end of "After
  Start9 forks the mirror").
- Release notes are user-facing: what changed for them, in plain language,
  in `en_US`, `es_ES`, `de_DE`, `pl_PL` and `fr_FR`, each ending with the
  CHANGELOG link. They cover every change since the version the community
  registry last served: a version that never reached it carries its notes
  into the next one.
- Release notes are the only home for what an update asks of the user
  (Start9's `versions.md`): a step before or after updating, a warning, and
  with every new `VERSION` the AI connector's new version (`btctx-mcp==` in
  the AI app's configuration). `instructions.md`, `README.md` and the action
  messages describe the package as it is, to someone who never ran an older
  version.

Checks: `rm -rf javascript && make javascript/index.js && node scripts/check-manifest.mjs`
(`make` type-checks, lints, format-checks and bundles), and `backend/tests/test_versions_agree.py`.

## Bumping the SDK

BTCTX-MCP's `.github/workflows/startos-sdk-check.yml` opens an issue when npm
has a newer `@start9labs/start-sdk`, or Start9 a newer start-cli. To adopt
them:

1. Read its CHANGELOG (in `node_modules/@start9labs/start-sdk/` after
   installing) for breaking changes and the minimum StartOS version.
2. First save the bundle's list of sibling modules, on the tree as it is
   (below). Then `npm install --save-exact @start9labs/start-sdk@<version>`,
   and run `npm install` again until `package-lock.json` stops changing
   (Start9's `maintaining-a-package.md`: the first install's lockfile isn't
   final). To move `mempool-startos` and `tor-startos` (the packages the
   dependency constants come from, pinned at `#next`) to their newest
   commits, delete every git-resolved entry from `package-lock.json`
   (`"resolved": "git+…"`: those two and the packages they bring, such as
   `bitcoin-core-startos`), and anything under them, and run `npm install`:
   `npm update` does nothing for a git dependency. Then check the lockfile
   holds one SDK, `node_modules/@start9labs/start-sdk` and no copy under
   another package (`overrides` keeps it so).

   A sibling's new commit can change what BitcoinTX ships (Start9's
   `maintaining-a-package.md`, "Read the lockfile diff as code review"):
   Mempool's `utils`, where two of the constants come from, imports
   Bitcoin Core's and LND's packages, so their manifests and SDK setup are
   in BitcoinTX's bundle and run when it loads. So whenever the lockfile
   moves a sibling (here, or in a change taken back from Start9's fork),
   list the bundle's sibling modules before the refresh and after it:

   ```sh
   rm -rf javascript && make javascript/index.js
   grep 'CONCATENATED MODULE: ./node_modules/[a-z-]*-startos' javascript/index.js | sort > /tmp/siblings-before
   # refresh, then the same two lines into /tmp/siblings-after
   diff /tmp/siblings-before /tmp/siblings-after
   ```

   Read what changed in the files of the second list between the
   lockfile's old and new commits
   (`https://github.com/Start9Labs/<package>/compare/<old>...<new>`). A
   file only the second list has is code BitcoinTX didn't ship before:
   name it in the pull request.
3. `START_CLI_VERSION` in BTCTX-MCP's `.github/workflows/ci.yml` and
   `release.yml` is Start9's newest start-cli, with `START_CLI_SHA256`, its
   `start-cli_x86_64-linux` SHA-256 from the release notes: the mirror's
   workflows call Start9's shared ones, which install the newest start-cli
   at each build, so Start9's package is packed with it. When the check
   reports a new start-cli, move both, with or without an SDK bump: read its
   release notes, then check CI's pack and a local pack installed on a test
   server. A start-cli bump alone changes only how BTCTX-MCP builds the
   package: it needs no package revision, and the next release uses it.
   Once Start9 has forked the mirror, they may bump the SDK there first:
   take it with `scripts/start9-pull.sh` instead of steps 1 and 2.
4. Run the checks, bump the package revision, release. While the community
   registry doesn't serve the current version, the bump rides in the next
   app release instead (the end of "After Start9 forks the mirror").

## Building locally

Needs Docker 28.1 or later (Start9's guide, `environment-setup.md`; start-cli
takes the image with Docker's `image save --platform`), with the containerd
image store for multi-arch images, `jq`, Node 24 and
[start-cli](https://docs.start9.com/packaging/environment-setup.html): the
release `START_CLI_VERSION` names in BTCTX-MCP's `.github/workflows/ci.yml`.
From 2.4, start-cli makes the SquashFS images itself, so the guide's
`squashfs-tools` aren't needed. start-cli packs only inside a *packaging
workspace*: a directory above the package that holds `.startos/build.key.pem`.
Create it above the repository, not inside it:

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
