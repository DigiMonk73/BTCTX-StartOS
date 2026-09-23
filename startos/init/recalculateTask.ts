import {
  RECALCULATE_TASK_ID,
  recalculateLedger,
} from '../actions/recalculateLedger'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

/** Prompt for Recalculate Ledger after an update from before 0.8.0. */
export const recalculateTask = sdk.setupOnInit(async (effects) => {
  const needed = await storeJson.read((s) => s.recalculateLedger).const(effects)
  if (!needed) return
  await sdk.action.createOwnTask(effects, recalculateLedger, 'important', {
    reason: i18n(
      'This update corrects how transfer fees, sale proceeds and the one-year holding period are calculated. Recalculate once so the corrections reach your existing transactions.',
    ),
    replayId: RECALCULATE_TASK_ID,
  })
})
