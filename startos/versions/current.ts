import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:0',
  releaseNotes: {
    en_US: `BitcoinTX 1.0.0: a calmer, cleaner look. No figures change and there is nothing to recalculate.

- Numbers have thousands separators and signs ($80,000.00, −$1,373.21, +$1,983.00).
- Transactions is one easy-to-scan list: an icon for each type, the time, source and fee underneath, the gain written out, and the BTC that moved with its dollar value.
- Reports: pick the tax year from a list. Years without IRS forms in this version can't be chosen for the IRS Reports.
- One set of buttons and fields everywhere, one gold button per section, nothing jumps when you move the mouse, and colors pass accessibility contrast checks.
- Works in small windows and on a phone.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
