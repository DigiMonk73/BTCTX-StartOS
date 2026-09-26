import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.1:0',
  releaseNotes: {
    en_US: `BitcoinTX 1.0.1: fixes the Settings layout on wide windows. "Your own mempool server", "Proxy for outside requests" and Reset Username & Password now show their text first and the fields below it, instead of squeezing the text or floating above the row. Nothing else changes; no figures change.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
