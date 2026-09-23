import { VersionGraph } from '@start9labs/start-sdk'
import { v0_1_0_0 } from './v0_1_0_0'
import { v0_3_0_0 } from './v0_3_0_0'
import { v0_3_1_0 } from './v0_3_1_0'
import { v0_3_2_0 } from './v0_3_2_0'
import { v0_4_0_0 } from './v0_4_0_0'
import { v0_5_1_0 } from './v0_5_1_0'
import { v0_5_1_1 } from './v0_5_1_1'
import { v0_5_2_0 } from './v0_5_2_0'
import { v0_5_3_0 } from './v0_5_3_0'
import { v0_5_4_0 } from './v0_5_4_0'
import { v0_5_5_0 } from './v0_5_5_0'
import { v0_6_0_0 } from './v0_6_0_0'
import { v0_6_0_1 } from './v0_6_0_1'
import { v0_7_0_0 } from './v0_7_0_0'
import { v0_8_0_0 } from './v0_8_0_0'

/**
 * Here we list every version in sequential order.
 * The current version must be the FIRST argument.
 */
export const versions = VersionGraph.of({
  current: v0_8_0_0,
  other: [
    v0_7_0_0,
    v0_6_0_1,
    v0_6_0_0,
    v0_5_5_0,
    v0_5_4_0,
    v0_5_3_0,
    v0_5_2_0,
    v0_5_1_1,
    v0_5_1_0,
    v0_4_0_0,
    v0_3_2_0,
    v0_3_1_0,
    v0_3_0_0,
    v0_1_0_0,
  ],
})
