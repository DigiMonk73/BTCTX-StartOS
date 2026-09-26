import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'btctx',
  title: 'BitcoinTX',
  license: 'MIT',
  packageRepo: 'https://github.com/DigiMonk73/BTCTX-StartOS',
  upstreamRepo: 'https://github.com/DigiMonk73/BTCTX-MCP',
  marketingUrl: 'https://github.com/DigiMonk73/BTCTX-MCP',
  donationUrl: null,
  description: { short, long },
  // main: the app's data at /data. startos: this package's store.json, never
  // mounted into the app.
  volumes: ['main', 'startos'],
  images: {
    main: {
      source: {
        // Must be v<VERSION> of the repository root (checked by
        // backend/tests/test_versions_agree.py); published by image.yml.
        dockerTag: 'ghcr.io/digimonk73/btctx-mcp:v0.9.2',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
