import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  credentialsResult,
  generatePassword,
  setAppCredentials,
} from '../utils'

export const resetCredentials = sdk.Action.withoutInput(
  'reset-credentials',

  async () => ({
    name: i18n('Reset Login Credentials'),
    description: i18n(
      'Set the username back to "admin" and generate a new random password. Use this if you are locked out.',
    ),
    warning: i18n(
      'This replaces your current username and password. Your transactions are not touched.',
    ),
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = generatePassword()
    // The app first, so the store never shows a password that doesn't work.
    await setAppCredentials(effects, password)
    await storeJson.merge(effects, { adminPassword: password })

    return {
      version: '1',
      title: i18n('Credentials Reset'),
      message: i18n(
        'Log in to BitcoinTX with these. Show Credentials displays them again later.',
      ),
      result: credentialsResult(password),
    }
  },
)
