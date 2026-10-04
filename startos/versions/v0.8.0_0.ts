import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

/**
 * 0.8.0 corrected transfer fees, sale proceeds and the one-year holding
 * period. Updating from anything older raises the Recalculate Ledger task
 * (init/recalculateTask.ts) so the fixes reach existing transactions.
 */
export const v_0_8_0_0 = VersionInfo.of({
  version: '0.8.0:0',
  releaseNotes: {
    en_US:
      'BitcoinTX 0.8.0: AI-assisted entry over MCP, Form 1099-DA boxes, tax timezone, calculation fixes.',
    es_ES:
      'BitcoinTX 0.8.0: registro asistido por IA mediante MCP, casillas del formulario 1099-DA, zona horaria fiscal y correcciones de cálculo.',
    de_DE:
      'BitcoinTX 0.8.0: KI-gestützte Erfassung über MCP, Felder für Formular 1099-DA, Steuer-Zeitzone und Berechnungskorrekturen.',
    pl_PL:
      'BitcoinTX 0.8.0: wprowadzanie wspomagane przez AI przez MCP, pola formularza 1099-DA, strefa czasowa podatku i poprawki obliczeń.',
    fr_FR:
      'BitcoinTX 0.8.0 : saisie assistée par IA via MCP, cases du formulaire 1099-DA, fuseau horaire fiscal et corrections de calcul.',
  },
  migrations: {
    up: async ({ effects }) => {
      await storeJson.merge(effects, { recalculateLedger: true })
    },
    down: IMPOSSIBLE,
  },
})
