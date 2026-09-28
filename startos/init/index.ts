import { actions } from '../actions'
import { restoreInit } from '../backups'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { versionGraph } from '../versions'
import { defaultLogin } from './defaultLogin'
import { installCredentials } from './installCredentials'
import { priceSourceTask } from './priceSourceTask'
import { recalculateTask } from './recalculateTask'
import { seedStore } from './seedStore'

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
  installCredentials,
  defaultLogin,
  priceSourceTask,
  recalculateTask,
)

export const uninit = sdk.setupUninit(versionGraph)
