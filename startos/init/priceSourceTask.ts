import { PRICE_SOURCE_TASK_ID, priceSource } from '../actions/priceSource'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

/**
 * Point to Price Source & Privacy (#145, plan 2.6; Start9's tasks.md,
 * "Severity Levels": critical is for essential setup such as selecting a
 * backend):
 * - at install, a critical task right after Set Login Credentials (init
 *   order): BitcoinTX starts once a choice is made, Nobody and Decide in
 *   BitcoinTX included;
 * - after an update, never critical, so a running service never stops: when
 *   no choice was ever made in the action and the package never asked (an
 *   install from before hourly prices), an important task, once. A restore
 *   brings back the backup's own version (#323): a backup this version made
 *   was asked already, and an older one is asked at its next update.
 * The action clears it (same replay key as before: nothing is retired).
 */
export const priceSourceTask = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await sdk.action.createOwnTask(effects, priceSource, 'critical', {
      reason: i18n(
        'Choose who BitcoinTX asks for newer Bitcoin prices, or nobody',
      ),
      replayId: PRICE_SOURCE_TASK_ID,
    })
    await storeJson.merge(effects, { priceSourceAsked: true })
    return
  }
  if (kind === null) return // a container rebuild: nothing new to ask
  const store = await storeJson
    .read((s) => ({ chosen: s.priceSource, asked: s.priceSourceAsked }))
    .once()
  // Asked once: an install's critical task stays (raising the same replay key
  // again would replace it), and a later update doesn't ask again
  if (!store?.chosen && !store?.asked) {
    await sdk.action.createOwnTask(effects, priceSource, 'important', {
      reason: i18n(
        'Prices are now hourly. Check who BitcoinTX asks for newer ones.',
      ),
      replayId: PRICE_SOURCE_TASK_ID,
    })
  }
  await storeJson.merge(effects, { priceSourceAsked: true })
})
