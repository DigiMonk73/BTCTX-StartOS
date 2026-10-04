import { setCredentials } from '../actions/setCredentials'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { generatePassword, replaceDefaultLogin } from '../utils'

/**
 * Once after an update (or restore) from before 1.2.0: installs from before
 * generated passwords may still have the app's default login, which BitcoinTX
 * 1.1.0 and later accept only with the setup code from the service log.
 * Lock it with a password nobody sees, and make Set Login Credentials the
 * first step.
 */
export const defaultLogin = sdk.setupOnInit(async (effects) => {
  const check = await storeJson.read((s) => s.checkDefaultLogin).once()
  if (!check) return
  const password = generatePassword()
  let replaced: boolean
  try {
    replaced = await replaceDefaultLogin(effects, password)
  } catch (e) {
    // Never fail the update or restore over this: the flag stays, so the
    // next start tries again (and main's migrate step shows a real problem).
    console.error(
      'Checking for the default login failed; retrying next start:',
      e,
    )
    return
  }
  if (replaced) {
    await sdk.action.createOwnTask(effects, setCredentials, 'critical', {
      reason: i18n(
        'Your BitcoinTX login was still the original admin / password, so it has been locked. Set a new login before starting the service.',
      ),
    })
  }
  await storeJson.merge(effects, { checkDefaultLogin: false })
})
