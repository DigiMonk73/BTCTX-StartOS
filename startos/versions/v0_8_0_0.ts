import { VersionInfo } from '@start9labs/start-sdk'

/**
 * v0.8.0:0 — first release built from DigiMonk73/BTCTX-MCP
 * (image ghcr.io/digimonk73/btctx-mcp) instead of the upstream Docker Hub image.
 */
export const v0_8_0_0 = VersionInfo.of({
  version: '0.8.0:0',
  releaseNotes:
    'BitcoinTX v0.8.0. AI-assisted entry: connect an AI assistant over MCP and paste exchange emails or describe transactions in plain English; it previews and saves them after you confirm. Form 1099-DA support: sales land in the new Form 8949 boxes for 2025 and 2026, with a per-transaction override when your broker form differs. Tax timezone setting. Fixes to transfer-fee lots, sale proceeds, the one-year holding period, empty Form 8949 checkboxes and year-end balances. Security: every account route now requires login and each install gets its own session key. The database upgrades itself on first start (a copy is kept in the backups folder). After updating, open Settings and click Recalculate Ledger once.',
  migrations: {
    up: async ({ effects }) => {
      // The app migrates its own database at startup (Alembic), backing it up
      // to /data/backups/ first. Nothing for the wrapper to do.
    },
    down: async ({ effects }) => {
      // Downgrading to 0.7.0 is not supported for the database: restore the
      // pre-upgrade copy in /data/backups/ or a StartOS backup instead.
    },
  },
})
