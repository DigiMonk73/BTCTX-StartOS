import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.2:0',
  releaseNotes: {
    en_US: `BitcoinTX 0.9.2.

Before you upgrade: upgrading changes no stored figure, but two fixes change figures the next time the ledger is recalculated (Recalculate Ledger, or any add, edit or delete): Lost withdrawals no longer count as a loss, and a withdrawal's BTC network fee becomes its own small disposal, so a spend's proceeds no longer have the fee taken out. Back up, then open Settings → Ledger review: it lists every transaction whose figures would change, old → new, without changing anything.

- Past BTC prices come from a price history stored in BitcoinTX: never today's price, never $0. A network fee's dollar value is stored when you save it, and you can type it.
- Ledger review in Settings (and for AI assistants): transactions worth a second look, including transfer fees that were priced at the live price (fixed only when you press Fix these).
- A BTC deposit that isn't income now needs its cost basis (type 0 if unknown). A Spent withdrawal with blank proceeds is valued at that day's price instead of $0.
- Settings → Privacy & network: turn live data off, use your own mempool server, or send every outside request through a proxy such as Tor. Fonts are now part of the app (nothing is loaded from Google).
- Stricter input checks with clear messages, stronger backups (restore older ones as before), and security fixes: backup and restore now require a login, and changing the password ends other sessions.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
