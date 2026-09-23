import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { credentialsResult } from '../utils'

export const showCredentials = sdk.Action.withoutInput(
  'show-credentials',

  async () => ({
    name: i18n('Show Credentials'),
    description: i18n('The username and password for logging in to BitcoinTX.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async () => {
    const password = await storeJson.read((s) => s.adminPassword).once()

    return {
      version: '1',
      title: i18n('Login Credentials'),
      message: password
        ? i18n(
            'Log in to BitcoinTX with these. If you changed the password inside BitcoinTX, use that one instead; run Reset Login Credentials if you have lost it.',
          )
        : i18n(
            'This install predates generated passwords, so the original default login is shown. If you changed it inside BitcoinTX, use yours; run Reset Login Credentials if you have lost it.',
          ),
      result: credentialsResult(password ?? 'password'),
    }
  },
)
