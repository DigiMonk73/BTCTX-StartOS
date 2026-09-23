import { T, utils } from '@start9labs/start-sdk'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const uiPort = 80
export const ADMIN_USERNAME = 'admin'

/** Environment for every process that runs BitcoinTX code. */
export const appEnv = {
  DATABASE_FILE: '/data/btctx.db',
  LOG_LEVEL: 'INFO',
}

/** The `main` volume at /data, as the app expects it. */
export function mainMounts() {
  return sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/data',
    readonly: false,
  })
}

export function generatePassword(): string {
  return utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 24 })
}

/**
 * Run `python -m backend.cli <args>` (backend/cli.py) in a temporary
 * subcontainer on the app's volume. Every command migrates the database first,
 * so this works on an empty volume. Throws on a non-zero exit.
 */
export async function runAppCli(
  effects: T.Effects,
  args: string[],
  input?: string,
): Promise<string> {
  return sdk.SubContainer.withTemp(
    effects,
    { imageId: 'main' },
    mainMounts(),
    `cli-${args[0]}`,
    async (sub) => {
      const res = await sub.execFail(
        ['python', '-m', 'backend.cli', ...args],
        { cwd: '/app', env: appEnv, input },
        10 * 60_000,
      )
      return res.stdout.toString()
    },
  )
}

/** Set the app's login to admin / `password`, through the app's own hashing. */
export async function setAppCredentials(
  effects: T.Effects,
  password: string,
): Promise<void> {
  await runAppCli(
    effects,
    ['set-password', '--username', ADMIN_USERNAME, '--password-stdin'],
    `${password}\n`,
  )
}

/** Action result group with the login credentials. */
export function credentialsResult(password: string) {
  return {
    type: 'group' as const,
    value: [
      {
        type: 'single' as const,
        name: i18n('Username'),
        description: null,
        value: ADMIN_USERNAME,
        copyable: true,
        masked: false,
        qr: false,
      },
      {
        type: 'single' as const,
        name: i18n('Password'),
        description: null,
        value: password,
        copyable: true,
        masked: true,
        qr: false,
      },
    ],
  }
}
