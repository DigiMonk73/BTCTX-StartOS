import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_1_2_0_0 } from './v1.2.0_0'
import { v_0_8_0_0 } from './v0.8.0_0'
import { v_0_9_0_0 } from './v0.9.0_0'

/**
 * Only versions whose migration does real work are declared; any older
 * installed version (0.3.x through 1.2.0:0) reaches `current` through them.
 */
export const versionGraph = VersionGraph.of({
  current,
  other: [v_1_2_0_0, v_0_9_0_0, v_0_8_0_0],
})
