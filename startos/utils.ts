import { T, utils } from '@start9labs/start-sdk'
import { i18n } from './i18n'
import { currentChoice, priceEnv } from './priceSource'
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
 * so this works on an empty volume. Throws on a non-zero exit. `prices`: pass
 * the Price Source & Privacy choice, for a command that may look up a price.
 */
export async function runAppCli(
  effects: T.Effects,
  args: string[],
  opts: { input?: string; prices?: boolean } = {},
): Promise<string> {
  const env = opts.prices
    ? {
        ...appEnv,
        ...(await priceEnv(
          effects,
          await currentChoice(effects, false),
          false,
        )),
      }
    : appEnv
  return sdk.SubContainer.withTemp(
    effects,
    { imageId: 'main' },
    mainMounts(),
    `cli-${args[0]}`,
    async (sub) => {
      const res = await sub.execFail(
        ['python', '-m', 'backend.cli', ...args],
        { cwd: '/app', env, input: opts.input },
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
    { input: `${password}\n` },
  )
}

/**
 * Give a login still on the app's shipped default (admin / password) this
 * password. True if it was the default (and now isn't).
 */
export async function replaceDefaultLogin(
  effects: T.Effects,
  password: string,
): Promise<boolean> {
  const out = await runAppCli(
    effects,
    ['set-password', '--if-default', '--password-stdin'],
    { input: `${password}\n` },
  )
  return out.includes('Password set for user')
}

/** Action result group with the login credentials (the username alone without a password). */
export function credentialsResult(password: string | null) {
  const username = {
    type: 'single' as const,
    name: i18n('Username'),
    description: null,
    value: ADMIN_USERNAME,
    copyable: true,
    masked: false,
    qr: false,
  }
  if (password === null) return { type: 'group' as const, value: [username] }
  return {
    type: 'group' as const,
    value: [
      username,
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
