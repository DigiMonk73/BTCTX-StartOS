import { setupManifest } from '@start9labs/start-sdk'

/**
 * Here we define static properties of the package to be displayed in the Marketplace and used by StartOS.
 */
export const manifest = setupManifest({
  id: 'btctx',
  title: 'BitcoinTX',
  license: 'mit',
  packageRepo: 'https://github.com/DigiMonk73/BTCTX-StartOS',
  upstreamRepo: 'https://github.com/BitcoinTX-org/BTCTX-org',
  marketingUrl: 'https://github.com/BitcoinTX-org/BTCTX-org',
  donationUrl: null,
  description: {
    short: 'Self-hosted Bitcoin portfolio tracker with tax reporting',
    long: 'BitcoinTX is a local-first solution that tracks Bitcoin transactions using robust double-entry accounting and FIFO cost-basis to generate IRS-compliant tax reports including Form 8949 and Schedule D.',
  },
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerTag: 'b1ackswan/btctx:v0.7.0',
      },
      arch: ['aarch64', 'x86_64'],
    },
  },
  alerts: {
    install:
      'A unique admin password is generated for this install. Run the "Show Credentials" action to retrieve your login credentials.',
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
  hardwareRequirements: {},
})
