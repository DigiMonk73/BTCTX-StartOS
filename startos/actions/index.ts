import { sdk } from '../sdk'
import { connectAi } from './connectAi'
import { priceSource } from './priceSource'
import { recalculateLedger } from './recalculateLedger'
import { setCredentials } from './setCredentials'

export const actions = sdk.Actions.of()
  .addAction(setCredentials)
  .addAction(priceSource)
  .addAction(connectAi)
  .addAction(recalculateLedger)
