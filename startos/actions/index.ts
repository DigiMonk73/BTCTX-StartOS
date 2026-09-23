import { sdk } from '../sdk'
import { connectAi } from './connectAi'
import { recalculateLedger } from './recalculateLedger'
import { resetCredentials } from './resetCredentials'
import { showCredentials } from './showCredentials'

export const actions = sdk.Actions.of()
  .addAction(showCredentials)
  .addAction(connectAi)
  .addAction(recalculateLedger)
  .addAction(resetCredentials)
