import { showCredentials } from '../actions/showCredentials'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { generatePassword, setAppCredentials } from '../utils'

/**
 * Fresh install: create the database, replace the app's shipped default login
 * (admin / password) with a random password, and make collecting it the first
 * thing the user does.
 */
export const installCredentials = sdk.setupOnInit(
  async (effects, kind, progress) => {
    if (kind !== 'install') return

    const phase = progress.addPhase(i18n('Creating the BitcoinTX database'))
    phase.start()
    const password = generatePassword()
    await setAppCredentials(effects, password)
    await storeJson.merge(effects, { adminPassword: password })
    phase.complete()

    await sdk.action.createOwnTask(effects, showCredentials, 'critical', {
      reason: i18n('Copy your BitcoinTX login before starting the service'),
    })
  },
)
