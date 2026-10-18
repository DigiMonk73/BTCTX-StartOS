import { setCredentials } from '../actions/setCredentials'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const watchCredentials = sdk.setupOnInit(async (effects) => {
  const unset = await storeJson.read((s) => !s.loginSet).const(effects)
  if (!unset) return
  await sdk.action.createOwnTask(effects, setCredentials, 'critical', {
    reason: i18n('Create your BitcoinTX login before starting the service'),
  })
})
