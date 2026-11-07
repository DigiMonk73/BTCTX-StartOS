import { setupManifest } from '@start9labs/start-sdk'
import { backupsFirst, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'btctx',
  title: 'BitcoinTX',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/BTCTX-StartOS',
  upstreamRepo: 'https://github.com/DigiMonk73/BTCTX-MCP',
  marketingUrl: 'https://digimonk73.github.io/btctx-site/',
  donationUrl: 'https://strike.me/@digimonk73',
  description: { short, long },
  // Below every 2.0 pre-release, so a tester isn't asked for a backup that would
  // bring back a beta, not 1.x (checked by scripts/check-manifest.mjs).
  preDownloadAlert: {
    message: backupsFirst,
    when: { sourceVersion: '<2.0.0-alpha.0:0' },
  },
  // main: the app's data at /data. startos: this package's store.json, never
  // mounted into the app.
  volumes: ['main', 'startos'],
  images: {
    main: {
      source: {
        // Must be v<VERSION> of the repository root (checked by
        // backend/tests/test_versions_agree.py); published by image.yml.
        dockerTag: 'ghcr.io/digimonk73/btctx-mcp:v2.0.1',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
