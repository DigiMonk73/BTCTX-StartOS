import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

const CHANGELOG =
  'https://github.com/DigiMonk73/BTCTX-MCP/blob/main/docs/CHANGELOG.md'

/**
 * 1.2.0 added the Price Source & Privacy action (an optional task introduces
 * it, init/priceSourceTask.ts) and retires logins still on the app's default
 * (init/defaultLogin.ts). Both run once, from init, after this migration.
 */
export const v_1_2_0_0 = VersionInfo.of({
  version: '1.2.0:0',
  releaseNotes: {
    en_US: `BitcoinTX 1.2.0: a new action, Price Source & Privacy, chooses where Bitcoin prices come from: My Mempool on this server, public price sites (optionally over Tor), off, or in the app as before. Your Mempool on the same server now just works: BitcoinTX reaches it inside StartOS, with no address to copy and no https certificate problem. If you set an https or .local mempool address in 1.1.0, run the action and pick My Mempool on this server. If your login was still the original admin / password, it gets a generated password now: copy it with Show Credentials. Actions and messages are now in Spanish, German, Polish and French too. Set up an AI app before AI keys (1.0.3)? Its configuration holds your password: replace BTCTX_USERNAME and BTCTX_PASSWORD with BTCTX_AI_KEY (create the key in Settings > Connect an AI Assistant), then run Reset Login Credentials. Everything: ${CHANGELOG}`,
    es_ES: `BitcoinTX 1.2.0: una nueva acción, Fuente de precios y privacidad, elige de dónde vienen los precios de bitcoin: Mi Mempool en este servidor, sitios públicos de precios (opcionalmente por Tor), desactivado, o en la aplicación como antes. Tu Mempool en el mismo servidor ahora funciona sin más: BitcoinTX lo alcanza dentro de StartOS, sin dirección que copiar ni problemas con el certificado https. Si en 1.1.0 pusiste una dirección de mempool https o .local, ejecuta la acción y elige Mi Mempool en este servidor. Si tu acceso seguía siendo el original admin / password, ahora recibe una contraseña generada: cópiala con Mostrar credenciales. Las acciones y los mensajes ahora también están en español, alemán, polaco y francés. ¿Configuraste una aplicación de IA antes de las claves de IA (1.0.3)? Su configuración guarda tu contraseña: sustituye BTCTX_USERNAME y BTCTX_PASSWORD por BTCTX_AI_KEY (crea la clave en Settings > Connect an AI Assistant) y luego ejecuta Restablecer credenciales de acceso. Todo: ${CHANGELOG}`,
    de_DE: `BitcoinTX 1.2.0: Eine neue Aktion, Kursquelle & Datenschutz, wählt, woher die Bitcoin-Kurse kommen: Mein Mempool auf diesem Server, öffentliche Kursseiten (wahlweise über Tor), aus, oder wie bisher in der App. Dein Mempool auf demselben Server funktioniert jetzt einfach: BitcoinTX erreicht ihn innerhalb von StartOS, ohne Adresse zum Kopieren und ohne https-Zertifikatsproblem. Hast du in 1.1.0 eine https- oder .local-Mempool-Adresse eingetragen, führe die Aktion aus und wähle Mein Mempool auf diesem Server. War deine Anmeldung noch das ursprüngliche admin / password, bekommt sie jetzt ein generiertes Passwort: Kopiere es mit Zugangsdaten anzeigen. Aktionen und Meldungen gibt es jetzt auch auf Spanisch, Deutsch, Polnisch und Französisch. Eine KI-App vor den KI-Schlüsseln (1.0.3) eingerichtet? Ihre Konfiguration enthält dein Passwort: Ersetze BTCTX_USERNAME und BTCTX_PASSWORD durch BTCTX_AI_KEY (den Schlüssel erstellst du unter Settings > Connect an AI Assistant) und führe dann Zugangsdaten zurücksetzen aus. Alles: ${CHANGELOG}`,
    pl_PL: `BitcoinTX 1.2.0: nowa akcja Źródło cen i prywatność wybiera, skąd pochodzą ceny bitcoina: Mój Mempool na tym serwerze, publiczne serwisy z cenami (opcjonalnie przez Tor), wyłączone albo jak dotąd w aplikacji. Twój Mempool na tym samym serwerze po prostu działa: BitcoinTX łączy się z nim wewnątrz StartOS, bez kopiowania adresu i bez problemu z certyfikatem https. Jeśli w 1.1.0 ustawiono adres mempool z https lub .local, uruchom akcję i wybierz Mój Mempool na tym serwerze. Jeśli logowanie wciąż było pierwotnym admin / password, dostaje teraz wygenerowane hasło: skopiuj je akcją Pokaż dane logowania. Akcje i komunikaty są teraz także po hiszpańsku, niemiecku, polsku i francusku. Aplikacja AI skonfigurowana przed kluczami AI (1.0.3)? Jej konfiguracja zawiera Twoje hasło: zastąp BTCTX_USERNAME i BTCTX_PASSWORD przez BTCTX_AI_KEY (klucz utworzysz w Settings > Connect an AI Assistant), a potem uruchom Zresetuj dane logowania. Wszystko: ${CHANGELOG}`,
    fr_FR: `BitcoinTX 1.2.0 : une nouvelle action, Source des prix et confidentialité, choisit d’où viennent les prix du bitcoin : Mon Mempool sur ce serveur, des sites publics de prix (éventuellement via Tor), désactivé, ou dans l’application comme avant. Votre Mempool sur le même serveur fonctionne désormais tout simplement : BitcoinTX le joint à l’intérieur de StartOS, sans adresse à copier ni problème de certificat https. Si vous aviez mis une adresse mempool en https ou .local en 1.1.0, lancez l’action et choisissez Mon Mempool sur ce serveur. Si votre connexion était encore l’originale admin / password, elle reçoit maintenant un mot de passe généré : copiez-le avec Afficher les identifiants. Les actions et les messages existent désormais aussi en espagnol, allemand, polonais et français. Une application d’IA configurée avant les clés IA (1.0.3) ? Sa configuration contient votre mot de passe : remplacez BTCTX_USERNAME et BTCTX_PASSWORD par BTCTX_AI_KEY (créez la clé dans Settings > Connect an AI Assistant), puis lancez Réinitialiser les identifiants. Tout : ${CHANGELOG}`,
  },
  migrations: {
    up: async ({ effects }) => {
      await storeJson.merge(effects, {
        checkDefaultLogin: true,
        priceSourceTask: true,
      })
    },
    down: IMPOSSIBLE,
  },
})
