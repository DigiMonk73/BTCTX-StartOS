import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'
import {
  LEGACY_WRAPPER_STORE,
  legacyWrapperStore,
} from '../fileModels/legacyWrapperStore'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

/**
 * 0.9.0 moved the generated login out of the app's volume into package
 * storage. Installs updating from 0.8.0:1 or older run this on the way up.
 */
export const v_0_9_0_0 = VersionInfo.of({
  version: '0.9.0:0',
  releaseNotes: {
    en_US: `BitcoinTX 0.9.0.

- New action "Connect an AI Assistant": the address, login and certificate your AI client needs, with a ready-to-paste Claude Desktop config and Claude Code command.
- New action "Recalculate Ledger".
- The MCP address is listed under Interfaces as "MCP API".
- Startup runs the database upgrade as its own step, and the health check confirms the database is ready, not just that the page loads.
- Quieter logs (INFO instead of DEBUG).
- Only the newest 5 automatic database copies are kept in the backups folder.
- Your generated login moved out of the app's volume into package storage.
- Downgrading to an earlier version is no longer offered: it would start an older BitcoinTX on a database it cannot read. Restore a backup instead.`,
    es_ES: `BitcoinTX 0.9.0.

- Nueva acción "Conectar un asistente de IA": la dirección, el acceso y el certificado que necesita tu cliente de IA, con una configuración de Claude Desktop y un comando de Claude Code listos para pegar.
- Nueva acción "Recalcular el libro contable".
- La dirección MCP aparece en Interfaces como "API MCP".
- El inicio ejecuta la actualización de la base de datos como un paso propio, y la comprobación de estado confirma que la base de datos está lista, no solo que la página carga.
- Registros más discretos (INFO en lugar de DEBUG).
- Solo se conservan las 5 copias automáticas más recientes de la base de datos en la carpeta backups.
- Tu acceso generado se trasladó del volumen de la aplicación al almacenamiento del paquete.
- Ya no se ofrece volver a una versión anterior: arrancaría un BitcoinTX antiguo sobre una base de datos que no puede leer. Restaura una copia de seguridad en su lugar.`,
    de_DE: `BitcoinTX 0.9.0.

- Neue Aktion "KI-Assistenten verbinden": Adresse, Anmeldung und Zertifikat, die dein KI-Client braucht, mit fertiger Claude-Desktop-Konfiguration und Claude-Code-Befehl zum Einfügen.
- Neue Aktion "Journal neu berechnen".
- Die MCP-Adresse steht unter Interfaces als "MCP-API".
- Beim Start läuft das Datenbank-Upgrade als eigener Schritt, und die Zustandsprüfung bestätigt, dass die Datenbank bereit ist, nicht nur, dass die Seite lädt.
- Ruhigere Logs (INFO statt DEBUG).
- Im Ordner backups werden nur die 5 neuesten automatischen Datenbankkopien behalten.
- Deine generierte Anmeldung wurde vom Volume der App in den Paketspeicher verschoben.
- Ein Downgrade wird nicht mehr angeboten: Es würde ein älteres BitcoinTX auf einer Datenbank starten, die es nicht lesen kann. Stelle stattdessen ein Backup wieder her.`,
    pl_PL: `BitcoinTX 0.9.0.

- Nowa akcja "Połącz asystenta AI": adres, dane logowania i certyfikat potrzebne klientowi AI, z gotową do wklejenia konfiguracją Claude Desktop i poleceniem Claude Code.
- Nowa akcja "Przelicz księgę".
- Adres MCP jest widoczny w Interfaces jako "API MCP".
- Przy starcie aktualizacja bazy danych jest osobnym krokiem, a kontrola stanu potwierdza, że baza jest gotowa, a nie tylko że strona się ładuje.
- Cichsze logi (INFO zamiast DEBUG).
- W folderze backups zachowywanych jest tylko 5 najnowszych automatycznych kopii bazy danych.
- Wygenerowane dane logowania przeniesiono z wolumenu aplikacji do pamięci pakietu.
- Powrót do wcześniejszej wersji nie jest już oferowany: uruchomiłby starszy BitcoinTX na bazie danych, której nie potrafi odczytać. Zamiast tego przywróć kopię zapasową.`,
    fr_FR: `BitcoinTX 0.9.0.

- Nouvelle action « Connecter un assistant IA » : l’adresse, les identifiants et le certificat dont votre client IA a besoin, avec une configuration Claude Desktop et une commande Claude Code prêtes à coller.
- Nouvelle action « Recalculer le registre ».
- L’adresse MCP apparaît dans Interfaces sous le nom « API MCP ».
- Au démarrage, la mise à jour de la base de données est une étape à part, et le contrôle d’état confirme que la base est prête, pas seulement que la page se charge.
- Journaux plus discrets (INFO au lieu de DEBUG).
- Seules les 5 copies automatiques les plus récentes de la base de données sont gardées dans le dossier backups.
- Vos identifiants générés ont quitté le volume de l’application pour le stockage du paquet.
- Le retour à une version antérieure n’est plus proposé : il lancerait un BitcoinTX plus ancien sur une base de données qu’il ne sait pas lire. Restaurez plutôt une sauvegarde.`,
  },
  migrations: {
    up: async ({ effects }) => {
      // 0.8.0:1 and older kept the generated password in the app's volume.
      const legacy = await legacyWrapperStore.read().once()
      const stored = await storeJson.read((s) => s.adminPassword).once()
      await storeJson.merge(effects, {
        adminPassword: stored ?? legacy?.adminPassword,
      })
      await rm(sdk.volumes.main.subpath(LEGACY_WRAPPER_STORE), { force: true })
    },
    down: IMPOSSIBLE,
  },
})
