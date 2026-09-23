import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v0_8_0_0 } from './v0_8_0_0'

/**
 * Only versions whose migration does real work are declared; any older
 * installed version (0.3.x through 0.8.0:1) reaches `current` through them.
 */
export const versionGraph = VersionGraph.of({
  current,
  other: [v0_8_0_0],
})
