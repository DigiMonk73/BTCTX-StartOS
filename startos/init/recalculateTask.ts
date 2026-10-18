import {
  RECALCULATE_TASK_ID,
  recalculateLedger,
} from '../actions/recalculateLedger'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

/**
 * Prompt for Recalculate Ledger once after an update whose migration makes it
 * due (from before 0.8.0; to 1.2.8:0 for the spend fee fix, #157; to 1.2.9:0
 * for its cents, old withdrawals and leftover gains, #100, #297, #61, #342,
 * #487), and again after restoring a backup on which it is still due:
 * StartOS's tasks are not in a backup. StartOS keeps the task until the
 * action runs or the user dismisses it. Never raised at a container rebuild (every server
 * restart) or a second time for one update: raising the same replay key
 * again doesn't duplicate an open task (Start9's tasks.md, "Idempotency and
 * replayId"), but after a dismissal it brings the task back (#365).
 */
export const recalculateTask = sdk.setupOnInit(async (effects, kind) => {
  if (kind === null) return // a container rebuild: nothing new to ask
  const store = await storeJson
    .read((s) => ({ due: s.recalculateLedger, asked: s.recalculateAsked }))
    .once()
  if (!store?.due) return
  if (store.asked && kind !== 'restore') return // asked once for this update
  await sdk.action.createOwnTask(effects, recalculateLedger, 'important', {
    reason: i18n(
      'An update corrected how some gains are calculated. To see which figures change, open Settings > Ledger Review in BitcoinTX first; then run the Recalculate Ledger action here once so the corrections reach your existing transactions.',
    ),
    replayId: RECALCULATE_TASK_ID,
  })
  await storeJson.merge(effects, { recalculateAsked: true })
})
