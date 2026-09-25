import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.1:0',
  releaseNotes: {
    en_US: `BitcoinTX 0.9.1.

- Settings has a new "Connect an AI Assistant" section: a setup prompt to paste into your AI app, filled in with this server's address and your username, plus ready-made Claude Desktop and Claude Code configurations. Your password is never shown in it.
- River import: sales no longer subtract River's fee twice. Sales imported before this update keep the old proceeds; set each one's proceeds to River's Received Amount plus the fee.
- Editing a transaction no longer moves its time by your timezone's offset, and keeps the seconds. A new transaction's default time is now your local time.
- Income, Interest and Reward deposits entered without a cost basis are valued at that day's BTC price instead of $0, so they count as income. Opening and saving one that was saved at $0 fixes it.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
