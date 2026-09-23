import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

/**
 * 0.8.0 corrected transfer fees, sale proceeds and the one-year holding
 * period. Updating from anything older raises the Recalculate Ledger task
 * (init/recalculateTask.ts) so the fixes reach existing transactions.
 */
export const v0_8_0_0 = VersionInfo.of({
  version: '0.8.0:0',
  releaseNotes: {
    en_US:
      'BitcoinTX 0.8.0: AI-assisted entry over MCP, Form 1099-DA boxes, tax timezone, calculation fixes.',
  },
  migrations: {
    up: async ({ effects }) => {
      await storeJson.merge(effects, { recalculateLedger: true })
    },
    down: IMPOSSIBLE,
  },
})
