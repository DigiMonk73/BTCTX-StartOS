import { VersionInfo } from '@start9labs/start-sdk'

/**
 * v0.8.0:1 — same app as 0.8.0:0, repackaged with start-sdk 2.0.9.
 */
export const v0_8_0_1 = VersionInfo.of({
  version: '0.8.0:1',
  releaseNotes:
    'Packaging update: rebuilt with the current StartOS SDK (start-sdk 2.0.9). Requires StartOS 0.4.0-beta.10 or later. No changes to BitcoinTX itself or your data. If you are updating from 0.7.0, see the 0.8.0 notes: the database upgrades itself on first start, then open Settings and click Recalculate Ledger once.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
