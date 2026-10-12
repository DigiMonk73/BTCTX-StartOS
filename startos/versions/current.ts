import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG =
  'https://github.com/DigiMonk73/BTCTX-MCP/blob/main/docs/CHANGELOG.md'

/** 1.2.7:0: a Rebates line on the dashboard; Ledger Review's missing original dates as a folded reminder (#128). Its notes keep 1.2.6's, which StartOS users coming from 1.2.5:0 never saw: the 2026 report fixes (income values after edits, the date originally acquired, the Rebate source, the IRS forms' format, the preparer's page), one wallet stated plainly, the disclaimer; nothing for the package to migrate. */
export const current = VersionInfo.of({
  version: '1.2.7:1',
  releaseNotes: {
    en_US:
      'Restarting BitcoinTX while it is still starting stops every process of the previous run.',
    es_ES:
      'Reiniciar BitcoinTX mientras aún se está iniciando detiene todos los procesos de la ejecución anterior.',
    de_DE:
      'Ein Neustart von BitcoinTX, während es noch startet, beendet alle Prozesse des vorherigen Laufs.',
    pl_PL:
      'Ponowne uruchomienie BitcoinTX w trakcie uruchamiania zatrzymuje wszystkie procesy poprzedniego uruchomienia.',
    fr_FR:
      "Redémarrer BitcoinTX pendant son démarrage arrête tous les processus de l'exécution précédente.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
