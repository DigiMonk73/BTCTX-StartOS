import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { runAppCli } from '../utils'

export const RECALCULATE_TASK_ID = 'recalculate-after-0.8.0'

export const recalculateLedger = sdk.Action.withoutInput(
  'recalculate-ledger',

  async () => ({
    name: i18n('Recalculate Ledger'),
    description: i18n(
      'Rebuild every ledger entry, lot and gain from your transactions, the same as Settings > Recalculate Ledger in BitcoinTX. Run it once after an update that changes how gains are calculated.',
    ),
    warning: i18n(
      'This rebuilds all lots and gains from your transactions. Your transactions themselves are not changed. It can take a minute on a large ledger.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const output = await runAppCli(effects, ['recalculate'])
    await storeJson.merge(effects, { recalculateLedger: false })
    await sdk.action.clearTask(effects, RECALCULATE_TASK_ID)

    return {
      version: '1',
      title: i18n('Ledger Recalculated'),
      message: output.trim().split('\n').pop() ?? null,
      result: null,
    }
  },
)
