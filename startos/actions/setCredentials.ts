import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  ADMIN_USERNAME,
  alertOnFailure,
  generatePassword,
  setAppCredentials,
} from '../utils'

export const setCredentials = sdk.Action.withoutInput(
  'set-credentials',

  async ({ effects }) => ({
    name: i18n('Set Login Credentials'),
    description: i18n(
      'Generate a random password for logging in to BitcoinTX, with the username "admin". Run it again if you lose the password.',
    ),
    warning: (await storeJson.read((s) => !!s.loginSet).const(effects))
      ? i18n(
          'This replaces your current username and password. Your transactions are not touched.',
        )
      : null,
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = generatePassword()
    // The app first, so the store never says a login is set that isn't. Only
    // that is kept: the password is shown once, below (#212).
    await alertOnFailure(setAppCredentials(effects, password), (detail) =>
      i18n('BitcoinTX could not set the password: ${detail}', { detail }),
    )
    await storeJson.merge(effects, { loginSet: true })

    return {
      version: '1',
      title: i18n('Login Credentials'),
      message: i18n(
        'Log in to BitcoinTX with these and keep them somewhere safe: they are shown only now. If you lose them, run this action again.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: ADMIN_USERNAME,
            copyable: true,
            masked: false,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            copyable: true,
            masked: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
