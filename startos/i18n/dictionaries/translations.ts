import { LangDict } from './default'

// English (en_US) only for now: BitcoinTX produces US tax forms. Add a locale
// by mapping every id in default.ts to its translation, e.g.
//   es_ES: { 0: '¡Iniciando BitcoinTX!', ... },
export default {} satisfies Record<string, LangDict>
