import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'
import {
  LEGACY_WRAPPER_STORE,
  legacyWrapperStore,
} from '../fileModels/legacyWrapperStore'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

/**
 * 0.9.0 moved the generated login out of the app's volume into package
 * storage. Installs updating from 0.8.0:1 or older run this on the way up.
 */
export const v0_9_0_0 = VersionInfo.of({
  version: '0.9.0:0',
  releaseNotes: {
    en_US: `BitcoinTX 0.9.0.

- New action "Connect an AI Assistant": the address, login and certificate your AI client needs, with a ready-to-paste Claude Desktop config and Claude Code command.
- New action "Recalculate Ledger".
- The MCP address is listed under Interfaces as "MCP API".
- Startup runs the database upgrade as its own step, and the health check confirms the database is ready, not just that the page loads.
- Quieter logs (INFO instead of DEBUG).
- Only the newest 5 automatic database copies are kept in the backups folder.
- Your generated login moved out of the app's volume into package storage.
- Downgrading to an earlier version is no longer offered: it would start an older BitcoinTX on a database it cannot read. Restore a backup instead.`,
  },
  migrations: {
    up: async ({ effects }) => {
      // 0.8.0:1 and older kept the generated password in the app's volume.
      const legacy = await legacyWrapperStore.read().once()
      const stored = await storeJson.read((s) => s.adminPassword).once()
      await storeJson.merge(effects, {
        adminPassword: stored ?? legacy?.adminPassword,
      })
      await rm(sdk.volumes.main.subpath(LEGACY_WRAPPER_STORE), { force: true })
    },
    down: IMPOSSIBLE,
  },
})
