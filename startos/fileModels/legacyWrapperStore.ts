import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const LEGACY_WRAPPER_STORE = '.startos-wrapper.json'

/**
 * Where 0.8.0:1 and older kept the generated password: inside the app's own
 * volume. Read once by the 0.9.0:0 migration, which moves it to store.json and
 * deletes this file.
 */
export const legacyWrapperStore = FileHelper.json(
  { base: sdk.volumes.main, subpath: LEGACY_WRAPPER_STORE },
  z.object({ adminPassword: z.string().optional().catch(undefined) }),
)
