import { T, utils } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import { currentChoice, priceEnv } from './priceSource'
import { sdk } from './sdk'

export const uiPort = 80
export const ADMIN_USERNAME = 'admin'

/** Environment for every process that runs BitcoinTX code. */
export const appEnv = {
  DATABASE_FILE: '/data/btctx.db',
  LOG_LEVEL: 'INFO',
  // Where BitcoinTX runs: its words name StartOS's action (#145)
  BTCTX_HOST: 'startos',
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

/**
 * For a migration whose calculation fixes reach existing transactions only
 * through a recalculation: Recalculate Ledger becomes due, and the next init
 * asks for it once (init/recalculateTask.ts).
 */
export async function makeRecalculationDue(effects: T.Effects) {
  await storeJson.merge(effects, {
    recalculateLedger: true,
    recalculateAsked: false,
  })
}

/**
 * For 1.2.9:0's migration (#212): releases before it kept the password Set
 * Login Credentials generated in store.json, though only whether a login was
 * set is ever needed (Start9's recipe-web-ui.md, "Authentication": persist
 * only the hash, which the app keeps). Records that as `loginSet` and deletes
 * the password: store.json is a z.looseObject, so a key goes only when it is
 * merged as undefined (file-models.md, "Unknown Key Preservation"). Safe to
 * repeat.
 */
export async function forgetStoredPassword(effects: T.Effects) {
  const hadPassword = await storeJson.read((s) => !!s.adminPassword).once()
  await storeJson.merge(effects, {
    adminPassword: undefined,
    ...(hadPassword ? { loginSet: true } : {}),
  })
}

export function generatePassword(): string {
  return utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 24 })
}

/**
 * Run `python -m backend.cli <args>` (backend/cli.py) in a temporary
 * subcontainer on the app's volume, through the image's start-up script as at
 * every start (main.ts): it runs the command as the app's user, giving it the
 * volume first when needed, since an action or init may run before the first
 * start after an update or a restore. Every command migrates the database
 * first, so this works on an empty volume. Throws the SDK's report on a
 * non-zero exit: an action shows `alertOnFailure`'s alert instead, and init
 * logs `lastWords`, a plain diagnostic. `prices`: pass the Price Source &
 * Privacy choice, for a command that may look up a price.
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
      // The image's ENTRYPOINT (the Dockerfile), as root, the image's user:
      // execFail takes no sdk.useEntrypoint(). No time limit: the script may
      // walk the whole volume, the migration copies the database before a
      // schema change, and Recalculate Ledger replays every transaction and
      // may download prices, so the data sets how long it takes (main.md,
      // "Commands That Run Longer Than 30 Seconds").
      const res = await sub.execFail(
        ['docker-entrypoint.sh', 'python', '-m', 'backend.cli', ...args],
        { env, input: opts.input, timeout: null },
      )
      return res.stdout.toString()
    },
  )
}

/**
 * For an action that runs a BitcoinTX command: the command's failure becomes
 * `alert(detail)`, which the action translates, since StartOS shows what an
 * action throws as its alert (actions.md, "Wrap User-Facing Strings in
 * `i18n()`"); `detail` is the command's own words, in English as everywhere
 * in BitcoinTX. The SDK's whole report is neither shown nor logged: below
 * backend/cli.py's `error:` line it can carry the SQL's values, such as a
 * password's hash or a transaction's figures.
 */
export async function alertOnFailure<T>(
  step: Promise<T>,
  alert: (detail: string) => string,
): Promise<T> {
  try {
    return await step
  } catch (e) {
    throw new Error(alert(lastWords(e)))
  }
}

/**
 * What a failed BitcoinTX command said, in one line without the SQL's
 * values: backend/cli.py's last `error: <what went wrong>`; else the start-up
 * script's refusal (`BitcoinTX: …`, before its advice for Docker); else the
 * signal that stopped it, since its stderr then ends with log lines; else its
 * last line on stderr that is neither a log line nor a database error's SQL
 * (a Python traceback's names the exception); else its exit code. The SDK's
 * ExitError, which carries stderr, isn't exported: read as its fields.
 */
export function lastWords(e: unknown): string {
  const failed = e as {
    result?: {
      stderr?: string | Buffer
      exitSignal?: string | null
      exitCode?: number | null
    }
  } | null
  const lines = String(failed?.result?.stderr ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reverse()
  const said = lines.find((line) => /^error:/.test(line))
  if (said) return said.replace(/^error:\s*/, '') || said
  const refused = lines.find((line) => line.startsWith('BitcoinTX: '))
  if (refused) return refused.slice('BitcoinTX: '.length)
  const signal = failed?.result?.exitSignal
  if (signal) return `terminated with signal ${signal}`
  const last = lines.find(
    (line) =>
      !/^(DEBUG|INFO|WARNING):|^\[(SQL|parameters): |^\(Background on this error/.test(
        line,
      ),
  )
  if (last) return last
  const code = failed?.result?.exitCode
  if (code != null) return `exit code ${code}`
  return e instanceof Error ? e.message : String(e)
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
