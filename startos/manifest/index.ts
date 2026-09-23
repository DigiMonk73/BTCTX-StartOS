import { setupManifest } from '@start9labs/start-sdk'

/**
 * Here we define static properties of the package to be displayed in the Marketplace and used by StartOS.
 */
export const manifest = setupManifest({
  id: 'btctx',
  title: 'BitcoinTX',
  license: 'mit',
  packageRepo: 'https://github.com/DigiMonk73/BTCTX-StartOS',
  upstreamRepo: 'https://github.com/DigiMonk73/BTCTX-MCP',
  marketingUrl: 'https://github.com/DigiMonk73/BTCTX-MCP',
  donationUrl: null,
  description: {
    short: 'Self-hosted Bitcoin portfolio tracker with tax reporting',
    long: 'BitcoinTX is a local-first solution that tracks Bitcoin transactions using robust double-entry accounting and FIFO cost-basis to generate IRS-compliant tax reports including Form 8949 and Schedule D (with the Form 1099-DA boxes). Connect an AI assistant over MCP to enter transactions from pasted text or plain English.',
  },
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerTag: 'ghcr.io/digimonk73/btctx-mcp:v0.8.0',
      },
      arch: ['aarch64', 'x86_64'],
    },
  },
  dependencies: {},
  hardwareRequirements: {},
})
