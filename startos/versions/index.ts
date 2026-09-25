import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v0_8_0_0 } from './v0_8_0_0'
import { v0_9_0_0 } from './v0_9_0_0'

/**
 * Only versions whose migration does real work are declared; any older
 * installed version (0.3.x through 0.9.0:0) reaches `current` through them.
 */
export const versionGraph = VersionGraph.of({
  current,
  other: [v0_9_0_0, v0_8_0_0],
})
