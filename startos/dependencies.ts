import { sdk } from './sdk'

/** BitcoinTX depends on no other StartOS service. */
export const setDependencies = sdk.setupDependencies(async () => ({}))
