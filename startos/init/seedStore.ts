import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

/** Create store.json on every init so reads never find it missing. */
export const seedStore = sdk.setupOnInit(async (effects) => {
  await storeJson.merge(effects, {})
})
