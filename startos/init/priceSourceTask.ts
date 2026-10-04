import { PRICE_SOURCE_TASK_ID, priceSource } from '../actions/priceSource'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

/**
 * Point to Price Source & Privacy: an important task at install, an optional
 * one once after an update from before 1.2.0.
 */
export const priceSourceTask = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await sdk.action.createOwnTask(effects, priceSource, 'important', {
      reason: i18n(
        'Choose where BitcoinTX gets Bitcoin prices: your own Mempool, public sites (optionally over Tor), or nothing.',
      ),
      replayId: PRICE_SOURCE_TASK_ID,
    })
    return
  }
  const store = await storeJson
    .read((s) => ({ task: s.priceSourceTask, chosen: s.priceSource }))
    .once()
  if (!store?.task) return
  if (!store.chosen) {
    await sdk.action.createOwnTask(effects, priceSource, 'optional', {
      reason: i18n(
        'New: choose here where BitcoinTX gets Bitcoin prices. My Mempool on this server now works directly, without an https address.',
      ),
      replayId: PRICE_SOURCE_TASK_ID,
    })
  }
  await storeJson.merge(effects, { priceSourceTask: false })
})
