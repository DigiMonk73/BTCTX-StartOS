import { mempoolDescription, torDescription } from './manifest/i18n'
import { asksPublicSites, currentChoice } from './priceSource'
import { sdk } from './sdk'

/**
 * Both optional, and only while the Price Source & Privacy action uses them:
 * Mempool for "My Mempool on this server", Tor for public price sites over
 * Tor. Nothing else is ever required. Ranges and health check ids follow
 * mempool-startos and tor-startos (as Am I Exposed uses them).
 */
const mempool = sdk.Dependency.optional('mempool', {
  description: mempoolDescription,
  metadata: {
    title: 'Mempool',
    icon: 'https://raw.githubusercontent.com/Start9Labs/mempool-startos/58ef0d5b4f29577baa65da7a4a4987621d88c0e7/icon.svg',
  },
  versionRange: '>=3.3.1:18',
  kind: 'running',
  healthChecks: ['webui'],
  enabled: async ({ effects }) =>
    (await currentChoice(effects, true)).source === 'mempool',
})

const tor = sdk.Dependency.optional('tor', {
  description: torDescription,
  metadata: {
    title: 'Tor',
    icon: 'https://raw.githubusercontent.com/Start9Labs/tor-startos/65faea17febc739d910e8c26ff4e61f6333487a8/icon.svg',
  },
  versionRange: '>=0.4.9.11:4',
  kind: 'running',
  healthChecks: ['tor'],
  enabled: async ({ effects }) => {
    const choice = await currentChoice(effects, true)
    return choice.tor && asksPublicSites(choice)
  },
})

export const dependencies = sdk.Dependencies.of()
  .addDependency(mempool)
  .addDependency(tor)
