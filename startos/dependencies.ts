import { asksPublicSites, currentChoice } from './priceSource'
import { sdk } from './sdk'

/**
 * Both optional, and only while the Price Source & Privacy action uses them:
 * Mempool for "My Mempool on this server", Tor for public price sites over
 * Tor. Nothing else is ever required. Ranges and health check ids follow
 * mempool-startos and tor-startos (as Am I Exposed uses them).
 */
export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const choice = await currentChoice(effects, true)
  return {
    ...(choice.source === 'mempool'
      ? {
          mempool: {
            kind: 'running' as const,
            versionRange: '>=3.3.1:18',
            healthChecks: ['webui'],
          },
        }
      : {}),
    ...(choice.tor && asksPublicSites(choice)
      ? {
          tor: {
            kind: 'running' as const,
            versionRange: '>=0.4.9.11:4',
            healthChecks: ['tor'],
          },
        }
      : {}),
  }
})
