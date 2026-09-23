import { sdk } from './sdk'

/**
 * StartOS stops the service before a backup, so the SQLite file is copied at
 * rest. `main` holds the database, its session key and the app's own
 * pre-upgrade copies (backups/); `startos` holds store.json.
 */
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main', 'startos'),
)
