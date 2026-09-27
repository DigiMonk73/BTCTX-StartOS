import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.2:1',
  releaseNotes: {
    en_US: `BitcoinTX 1.0.2, package update: no change to BitcoinTX itself. The store listing and these notes are now also in Spanish, German, Polish and French (the app stays in English and produces US tax forms), the website link points to the BitcoinTX site, and the package documentation was tidied.`,
    es_ES: `BitcoinTX 1.0.2, actualización del paquete, sin cambios en BitcoinTX: la descripción de la tienda y estas notas están ahora también en español, alemán, polaco y francés (la aplicación sigue en inglés y genera formularios fiscales de EE. UU.), el enlace web apunta al sitio de BitcoinTX y se ha revisado la documentación del paquete.`,
    de_DE: `BitcoinTX 1.0.2, Paket-Update ohne Änderungen an BitcoinTX selbst: Die Store-Beschreibung und diese Hinweise gibt es jetzt auch auf Spanisch, Deutsch, Polnisch und Französisch (die App bleibt auf Englisch und erstellt US-Steuerformulare), der Website-Link führt zur BitcoinTX-Seite, und die Paketdokumentation wurde überarbeitet.`,
    pl_PL: `BitcoinTX 1.0.2, aktualizacja pakietu bez zmian w samym BitcoinTX: opis w sklepie i te informacje są teraz dostępne także po hiszpańsku, niemiecku, polsku i francusku (aplikacja pozostaje po angielsku i tworzy formularze podatkowe USA), link do strony prowadzi do witryny BitcoinTX, a dokumentacja pakietu została uporządkowana.`,
    fr_FR: `BitcoinTX 1.0.2, mise à jour du paquet, sans changement dans BitcoinTX : la description de la boutique et ces notes sont désormais aussi en espagnol, allemand, polonais et français (l’application reste en anglais et produit des formulaires fiscaux américains), le lien du site mène au site de BitcoinTX et la documentation du paquet a été revue.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
