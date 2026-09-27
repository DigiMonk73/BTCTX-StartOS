import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.2:0',
  releaseNotes: {
    en_US: `BitcoinTX 1.0.2: AI assistant privacy. BitcoinTX now says plainly that an AI assistant you connect reads your transactions, balances and gains, and that a cloud AI (Claude, Grok and most others) sends what it reads to its provider; a local model (LM Studio, Goose with Ollama) keeps it on your own computer. The Connect an AI Assistant action and the app's Settings carry this note. Connecting an AI still works as before, with your BitcoinTX username and password. Documentation updated throughout. No figures change.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
