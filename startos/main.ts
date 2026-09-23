import { sdk } from './sdk'
import { uiPort } from './interfaces'
import { mainMounts } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting BitcoinTX!')

  /**
   * Create the subcontainer for BitcoinTX
   */
  const subcontainer = sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    mainMounts(),
    'btctx',
  )

  /**
   * ======================== Daemons ========================
   *
   * BitcoinTX runs a single daemon: FastAPI backend serving React frontend on port 80.
   */
  return sdk.Daemons.of(effects).addDaemon('webui', {
    subcontainer,
    exec: {
      command: [
        'uvicorn',
        'backend.main:app',
        '--host',
        '0.0.0.0',
        '--port',
        '80',
      ],
      env: {
        DATABASE_FILE: '/data/btctx.db',
      },
    },
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkWebUrl(effects, `http://localhost:${uiPort}`, {
          timeout: 5000,
          successMessage: 'BitcoinTX is ready',
          errorMessage: 'BitcoinTX is not responding',
        }),
    },
    requires: [],
  })
})
