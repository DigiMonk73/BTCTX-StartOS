import { actions } from '../actions'
import { restoreInit } from '../backups'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { versionGraph } from '../versions'
import { defaultLogin } from './defaultLogin'
import { priceSourceTask } from './priceSourceTask'
import { recalculateTask } from './recalculateTask'
import { seedStore } from './seedStore'
import { watchCredentials } from './watchCredentials'

/**
 * Runs in this order on install, update, restore and container rebuild.
 * Handlers that raise tasks come after `actions`.
 */
export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  seedStore,
  setInterfaces,
  setDependencies,
  actions,
  defaultLogin,
  watchCredentials,
  priceSourceTask,
  recalculateTask,
)

export const uninit = sdk.setupUninit(versionGraph)
