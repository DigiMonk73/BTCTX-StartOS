import { setupManifest } from '@start9labs/start-sdk'
import { long, mempoolDescription, short, torDescription } from './i18n'

export const manifest = setupManifest({
  id: 'btctx',
  title: 'BitcoinTX',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/BTCTX-StartOS',
  upstreamRepo: 'https://github.com/DigiMonk73/BTCTX-MCP',
  marketingUrl: 'https://digimonk73.github.io/btctx-site/',
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
        dockerTag: 'ghcr.io/digimonk73/btctx-mcp:v1.2.4',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  // Optional, used only when chosen in the Price Source & Privacy action
  // (dependencies.ts); icons pinned as Am I Exposed pins them.
  dependencies: {
    mempool: {
      description: mempoolDescription,
      optional: true,
      metadata: {
        title: 'Mempool',
        icon: 'https://raw.githubusercontent.com/Start9Labs/mempool-startos/58ef0d5b4f29577baa65da7a4a4987621d88c0e7/icon.svg',
      },
    },
    tor: {
      description: torDescription,
      optional: true,
      metadata: {
        title: 'Tor',
        icon: 'https://raw.githubusercontent.com/Start9Labs/tor-startos/65faea17febc739d910e8c26ff4e61f6333487a8/icon.svg',
      },
    },
  },
})
