import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

const CHANGELOG =
  'https://github.com/DigiMonk73/BTCTX-MCP/blob/main/docs/CHANGELOG.md'

/**
 * 1.2.8:0: prices at the hour (#144), the price-source redesign (#145, the
 * package's price step and its update task in init/priceSourceTask.ts),
 * inherited bitcoin and consolidation fees (#163), the spend fee fix (#157)
 * and the #134 privacy fix, and the security review's fixes (#151). The
 * migration raises Recalculate Ledger once (init/recalculateTask.ts): #157's
 * corrected figures reach existing transactions only through a recalculation.
 */
export const current = VersionInfo.of({
  version: '1.2.8:0',
  releaseNotes: {
    en_US: `BitcoinTX 1.2.8 values bitcoin at the hour of each transaction, makes where prices come from one clear choice, adds inherited bitcoin and consolidation fees, stops a spend's network fee from counting twice, and brings the fixes of a security review.

**What to do after updating**

- **Recalculate Ledger.** A task asks for it until you run it. First open Settings > Ledger Review in BitcoinTX: it lists each spend whose figures change, old and new. Then run the StartOS action Recalculate Ledger, or Settings > Recalculate Ledger in BitcoinTX.
- **Confirm where prices come from.** Unless the action Price Source & Privacy sets it, BitcoinTX's Dashboard asks once to confirm your price choice, and asks nobody until you do. If you never made a choice in that action, a task asks once.
- **Log in again.** After this update everyone logs in once more.
- **Update your AI connector.** In your AI app's configuration, change the version after btctx-mcp== to 1.2.8 and restart the AI app. It now lists a sale's or spend's gross proceeds beside the after-fee figure; an older connector could take the fee off twice when it edited one.

**Fixes that change tax figures**

- **A spend's network fee counted twice in its gain.** When you spent bitcoin (a Withdrawal, purpose Spent) with a BTC network fee, the fee was counted as its own disposal but not taken off the spend's proceeds, so the gain came out too high by the fee's value, usually a few dollars. Versions 0.9.2 to 1.2.7, every tax year; it only ever showed more tax, never less. What to do: Ledger Review, then Recalculate Ledger, as above. Whether to amend a filed return over a few dollars is for you or your tax professional to decide.

- **Inherited bitcoin.** Recorded as My BTC or Gift, as earlier versions offered, it could print wrong figures: a sale within a year of the death came out short-term, or a Gift's basis was the person's own cost. All earlier versions, every tax year with such a sale. What to do: edit each such deposit to the new Source Inherited, with the date of death and its value that day. A deposit saved before 1.1.0 with the source "inherited" follows the rules from the next recalculation; Ledger Review lists any without a date of death.

- **A price under one cent was stored as $0.** A day's price a site gave under one cent was kept as $0.00, and a value filled in from it was $0. Versions 0.9.2 to 1.2.7, any tax year; no such price is known. What to do: nothing, unless you ever saw a value "From the price" at $0.00: type that value (a day already stored at $0.00 stays).

**Privacy: a price choice made without asking (fixed)**

- Who could be affected: in 1.2.0 to 1.2.7, owners who switched Price Source & Privacy to Decide in BitcoinTX instead (called Choose in BitcoinTX before) after it had been set to Off, Public price sites or My Mempool, or who ran Set Login Credentials or a hand-run command while it was set, if BitcoinTX had stored prices meanwhile. It could then save Public price sites as your choice in the app without asking, and use it after a switch.
- What could have been sent: requests from your server's address to public sites for Bitcoin's price (CoinGecko, Kraken, Bitstamp or Coinbase) and the block height (Blockchain.info, Blockstream or mempool.space). Never dates, amounts or anything from your ledger. The action's Tor setting no longer applied after the switch: only a proxy set in BitcoinTX's own Settings hid your address.
- What to do: confirm or change the choice when BitcoinTX asks once after this update (above), or check Settings > Privacy & Network.

**New**

- **Prices at the hour.** Values BitcoinTX fills in from the BTC price (a blank income or rebate value, a Spent's proceeds, a network fee's value) now use the price when the transaction's hour began: the IRS values bitcoin at the date and time. When your choice allows public price sites, BitcoinTX downloads Bitstamp's hourly prices from 2013 once (about 3 MB), each year checked against a fingerprint that comes with this version. Nothing already saved changes: Ledger Review lists, by tax year, values priced at the day that the hour would change, and changes only the ones you apply.
- **One price choice.** Price Source & Privacy now offers My Mempool on this server, Public price sites, Nobody, or Decide in BitcoinTX instead, with Use Tor and, for Mempool, a backup of public price sites. A new install asks before it starts. In the app, one price card says where prices come from and when the last one arrived, and the Dashboard, the sidebar and the transaction form say which price a value used. Coinbase and CoinGecko are no longer asked.
- **Inherited bitcoin.** A new deposit source, Inherited: its cost basis is its value on the date of death, and every sale of those coins is long-term, marked INHERITED on Form 8949.
- **Consolidations.** A transfer within the same wallet (or between exchanges BitcoinTX counts as one) records only its network fee, a disposal of your oldest coins.
- **Trust this server.** With Decide in BitcoinTX instead, a Mempool on another home server at its https address can be trusted from the price card.

**Known limitation**

- **Through Tor, Bitstamp currently refuses BitcoinTX's requests:** the hourly history and past prices don't download; only the live price works. Choose Public price sites without Tor to download them (once checked, the hourly history stays), use your own Mempool for newer values, or type them. Nothing is sent without Tor instead, and no value becomes $0. A fix is planned.

**Security and smaller fixes**

- From a security review: logging out ends that session for every copy of its cookie (if the database is busy at that moment, a copy lasts until it expires); other people's failed logins no longer slow down a browser that has logged in before; a restore brings back a backup's data and keeps this install's login, AI key and price settings, or changes nothing; every request has limits on size and time; an edit or deletion by the AI connector keeps a backup copy first, and its imports are kept short. The details are published once this version is available.
- Restarting BitcoinTX while it is still starting stops every process of the previous run (from Start9's 1.2.7:1).
- An edit can no longer save a negative fee value.

[Everything in 1.2.8](${CHANGELOG})`,
    es_ES: `BitcoinTX 1.2.8 valora el bitcoin a la hora de cada transacción, convierte el origen de los precios en una sola elección clara, añade el bitcoin heredado y las comisiones de consolidación, evita que la comisión de red de un gasto cuente dos veces e incluye las correcciones de una revisión de seguridad.

**Qué hacer después de actualizar**

- **Recalcular el libro contable.** Una tarea lo pide hasta que ejecutes la acción. Primero abre Settings > Ledger Review en BitcoinTX: muestra cada gasto cuyas cifras cambian, con las anteriores y las nuevas. Después ejecuta la acción de StartOS Recalcular el libro contable, o Settings > Recalculate Ledger en BitcoinTX.
- **Confirma de dónde vienen los precios.** Salvo que la acción Fuente de precios y privacidad lo fije, el Dashboard de BitcoinTX pide una vez que confirmes tu elección de precios, y no pregunta a nadie hasta que lo hagas. Si nunca elegiste nada en esa acción, una tarea lo pide una vez.
- **Vuelve a iniciar sesión.** Después de esta actualización todos inician sesión una vez más.
- **Actualiza tu conector de IA.** En la configuración de tu aplicación de IA, cambia la versión que sigue a btctx-mcp== por 1.2.8 y reinicia la aplicación. Ahora muestra los ingresos brutos de una venta o un gasto junto a la cifra tras la comisión; un conector anterior podía restar la comisión dos veces al editar uno.

**Correcciones que cambian cifras fiscales**

- **La comisión de red de un gasto contaba dos veces en su ganancia.** Al gastar bitcoin (un Withdrawal con propósito Spent) con una comisión de red en BTC, la comisión se contaba como una disposición propia pero no se restaba de los ingresos del gasto, así que la ganancia salía más alta por el valor de la comisión, normalmente unos pocos dólares. Versiones 0.9.2 a 1.2.7, todos los años fiscales; solo mostraba más impuesto, nunca menos. Qué hacer: Ledger Review y después Recalcular el libro contable, como arriba. Decidir si rectificar una declaración ya presentada por unos pocos dólares te corresponde a ti o a tu profesional fiscal.

- **Bitcoin heredado.** Registrado como My BTC o Gift, como permitían las versiones anteriores, podía dar cifras erróneas: una venta en el año siguiente al fallecimiento salía a corto plazo, o el coste base de un Gift era el de la propia persona. Todas las versiones anteriores, cada año fiscal con una venta así. Qué hacer: edita cada depósito así al nuevo origen Inherited, con la fecha del fallecimiento y su valor ese día. Un depósito guardado antes de la 1.1.0 con el origen "inherited" sigue las reglas desde el siguiente recálculo; Ledger Review muestra los que no tienen fecha de fallecimiento.

- **Un precio inferior a un centavo se guardaba como 0 $.** El precio de un día que un sitio daba por debajo de un centavo se guardaba como 0,00 $, y un valor rellenado con él era 0 $. Versiones 0.9.2 a 1.2.7, cualquier año fiscal; no se conoce ninguno. Qué hacer: nada, salvo que alguna vez vieras un valor "From the price" de 0,00 $: escribe ese valor (un día ya guardado a 0,00 $ se queda así).

**Privacidad: una elección de precios hecha sin preguntar (corregido)**

- A quién pudo afectar: en las versiones 1.2.0 a 1.2.7, a quienes cambiaron Fuente de precios y privacidad a Decidir en BitcoinTX en su lugar (antes Elegir en BitcoinTX) después de tenerla en Desactivado, Sitios públicos de precios o Mi Mempool, o ejecutaron Establecer credenciales de acceso o un comando a mano mientras estaba así, si BitcoinTX había guardado precios entretanto. Podía entonces guardar Public price sites como tu elección en la aplicación sin preguntar y usarla tras el cambio.
- Qué pudo enviarse: peticiones desde la dirección de tu servidor a sitios públicos, para el precio del bitcoin (CoinGecko, Kraken, Bitstamp o Coinbase) y la altura de bloque (Blockchain.info, Blockstream o mempool.space). Nunca fechas, cantidades ni nada de tu libro contable. Tras el cambio, el Tor de la acción ya no se aplicaba: solo un proxy configurado en los propios Settings de BitcoinTX ocultaba tu dirección.
- Qué hacer: confirma o cambia la elección cuando BitcoinTX lo pida una vez tras esta actualización (arriba), o revisa Settings > Privacy & Network.

**Novedades**

- **Precios por hora.** Los valores que BitcoinTX rellena con el precio del BTC (un valor de ingreso o de rebate en blanco, los ingresos de un Spent, el valor de una comisión de red) usan ahora el precio del inicio de la hora de la transacción: el IRS valora el bitcoin en la fecha y la hora. Cuando tu elección permite los sitios públicos de precios, BitcoinTX descarga una vez los precios por hora de Bitstamp desde 2013 (unos 3 MB) y comprueba cada año con una huella que viene con esta versión. Nada de lo ya guardado cambia: Ledger Review muestra, por año fiscal, los valores con el precio del día que la hora cambiaría, y solo cambia los que apliques.
- **Una sola elección de precios.** Fuente de precios y privacidad ofrece ahora Mi Mempool en este servidor, Sitios públicos de precios, Nadie o Decidir en BitcoinTX en su lugar, con Tor y, para Mempool, los sitios públicos como respaldo. Una instalación nueva lo pregunta antes de arrancar. En la aplicación, una sola tarjeta de precios dice de dónde vienen los precios y cuándo llegó el último, y el Dashboard, la barra lateral y el formulario de transacción dicen qué precio usó cada valor. Ya no se pregunta a Coinbase ni a CoinGecko.
- **Bitcoin heredado.** Un nuevo origen de depósito, Inherited: su coste base es su valor en la fecha del fallecimiento, y toda venta de esas monedas es a largo plazo, marcada INHERITED en el Form 8949.
- **Consolidaciones.** Una transferencia dentro del mismo monedero (o entre exchanges que BitcoinTX cuenta como uno) registra solo su comisión de red, como disposición de tus monedas más antiguas.
- **Trust this server.** Con Decidir en BitcoinTX en su lugar, un Mempool en otro servidor doméstico con dirección https puede marcarse como de confianza desde la tarjeta de precios.

**Limitación conocida**

- **Por Tor, Bitstamp rechaza ahora las peticiones de BitcoinTX:** el historial por hora y los precios pasados no se descargan; solo funciona el precio en vivo. Elige Sitios públicos de precios sin Tor para descargarlos (una vez comprobado, el historial por hora se conserva), usa tu propio Mempool para los valores más recientes o escríbelos. Nunca se envía nada sin Tor en su lugar, y ningún valor pasa a ser 0 $. Hay una corrección prevista.

**Seguridad y correcciones menores**

- De una revisión de seguridad: cerrar sesión termina esa sesión para toda copia de su cookie (si la base de datos está ocupada en ese momento, una copia dura hasta que caduca); los inicios de sesión fallidos de otros ya no frenan a un navegador que ya inició sesión antes; una restauración trae los datos de la copia y conserva el acceso, la clave de IA y los ajustes de precios de esta instalación, o no cambia nada; cada petición tiene límites de tamaño y de tiempo; una edición o un borrado del conector de IA guarda antes una copia, y sus importaciones son cortas. Los detalles se publican cuando esta versión esté disponible.
- Reiniciar BitcoinTX mientras aún se está iniciando detiene todos los procesos de la ejecución anterior (de la 1.2.7:1 de Start9).
- Una edición ya no puede guardar un valor de comisión negativo.

[Todo lo de la 1.2.8](${CHANGELOG})`,
    de_DE: `BitcoinTX 1.2.8 bewertet Bitcoin zur Stunde jeder Transaktion, macht die Herkunft der Kurse zu einer klaren Wahl, ergänzt geerbte Bitcoin und Konsolidierungsgebühren, verhindert, dass die Netzwerkgebühr einer Ausgabe doppelt zählt, und bringt die Korrekturen einer Sicherheitsprüfung.

**Was nach dem Update zu tun ist**

- **Journal neu berechnen.** Eine Aufgabe erinnert daran, bis du die Aktion ausführst. Öffne zuerst Settings > Ledger Review in BitcoinTX: Dort steht jede Ausgabe, deren Zahlen sich ändern, alt und neu. Führe dann die StartOS-Aktion Journal neu berechnen aus, oder Settings > Recalculate Ledger in BitcoinTX.
- **Bestätige, woher die Kurse kommen.** Sofern die Aktion Kursquelle & Datenschutz es nicht festlegt, bittet das Dashboard von BitcoinTX einmal darum, deine Kurswahl zu bestätigen, und fragt bis dahin niemanden. Hast du in jener Aktion nie etwas gewählt, fragt eine Aufgabe einmal danach.
- **Melde dich erneut an.** Nach diesem Update melden sich alle noch einmal an.
- **Aktualisiere deinen KI-Connector.** Ändere in der Konfiguration deiner KI-App die Version nach btctx-mcp== in 1.2.8 und starte die App neu. Er zeigt jetzt den Bruttoerlös eines Verkaufs oder einer Ausgabe neben dem Betrag nach Gebühr; ein älterer Connector konnte die Gebühr beim Bearbeiten doppelt abziehen.

**Korrekturen, die Steuerzahlen ändern**

- **Die Netzwerkgebühr einer Ausgabe zählte doppelt im Gewinn.** Wurde Bitcoin ausgegeben (eine Withdrawal mit dem Zweck Spent) und eine Netzwerkgebühr in BTC gezahlt, zählte die Gebühr als eigene Veräußerung, wurde aber nicht vom Erlös der Ausgabe abgezogen; der Gewinn war also um den Wert der Gebühr zu hoch, meist ein paar Dollar. Versionen 0.9.2 bis 1.2.7, jedes Steuerjahr; es ergab immer nur mehr Steuer, nie weniger. Was zu tun ist: Ledger Review, dann Journal neu berechnen, wie oben. Ob eine bereits abgegebene Erklärung wegen ein paar Dollar berichtigt wird, entscheidest du oder dein Steuerberater.

- **Geerbte Bitcoin.** Als My BTC oder Gift erfasst, wie es frühere Versionen anboten, konnten sie falsche Zahlen ergeben: Ein Verkauf innerhalb eines Jahres nach dem Todestag galt als kurzfristig, oder die Anschaffungskosten eines Gift waren die eigenen Kosten der Person. Alle früheren Versionen, jedes Steuerjahr mit einem solchen Verkauf. Was zu tun ist: Stelle jede solche Einzahlung auf die neue Quelle Inherited um, mit dem Todestag und ihrem Wert an dem Tag. Eine vor 1.1.0 mit der Quelle "inherited" gespeicherte Einzahlung folgt den Regeln ab der nächsten Neuberechnung; Ledger Review listet jede ohne Todestag auf.

- **Ein Kurs unter einem Cent wurde als 0 $ gespeichert.** Gab eine Seite den Kurs eines Tages unter einem Cent an, wurde er als 0,00 $ gespeichert, und ein daraus eingesetzter Wert war 0 $. Versionen 0.9.2 bis 1.2.7, jedes Steuerjahr; kein solcher Kurs ist bekannt. Was zu tun ist: nichts, außer du hast je einen Wert "From the price" mit 0,00 $ gesehen: Gib diesen Wert ein (ein schon mit 0,00 $ gespeicherter Tag bleibt so).

**Datenschutz: eine Kurswahl ohne Nachfrage (behoben)**

- Wer betroffen sein konnte: in 1.2.0 bis 1.2.7, wer Kursquelle & Datenschutz auf Stattdessen in BitcoinTX entscheiden (früher In BitcoinTX wählen) umgestellt hat, nachdem sie auf Aus, Öffentliche Kursseiten oder Mein Mempool stand, oder wer Zugangsdaten festlegen oder einen Befehl von Hand ausgeführt hat, während sie so stand, sofern BitcoinTX in der Zeit Kurse gespeichert hatte. BitcoinTX konnte dann ohne Nachfrage Public price sites als deine Wahl in der App speichern und nach der Umstellung verwenden.
- Was gesendet worden sein kann: Anfragen von der Adresse deines Servers an öffentliche Seiten, nach dem Bitcoin-Kurs (CoinGecko, Kraken, Bitstamp oder Coinbase) und der Blockhöhe (Blockchain.info, Blockstream oder mempool.space). Nie Daten, Beträge oder etwas aus deinem Journal. Nach der Umstellung galt das Tor der Aktion nicht mehr: Nur ein Proxy in den eigenen Settings von BitcoinTX verbarg deine Adresse.
- Was zu tun ist: Bestätige oder ändere die Wahl, wenn BitcoinTX nach diesem Update einmal fragt (oben), oder prüfe Settings > Privacy & Network.

**Neu**

- **Kurse zur Stunde.** Werte, die BitcoinTX aus dem BTC-Kurs einsetzt (ein leerer Einkommens- oder Rebate-Wert, der Erlös eines Spent, der Wert einer Netzwerkgebühr), verwenden jetzt den Kurs zu Beginn der Stunde der Transaktion: Der IRS bewertet Bitcoin nach Datum und Uhrzeit. Erlaubt deine Wahl öffentliche Preisseiten, lädt BitcoinTX die Stundenkurse von Bitstamp ab 2013 einmal herunter (etwa 3 MB) und prüft jedes Jahr gegen einen Fingerabdruck, der mit dieser Version kommt. Nichts bereits Gespeichertes ändert sich: Ledger Review listet nach Steuerjahr die Werte zum Tageskurs auf, die die Stunde ändern würde, und ändert nur die, die du übernimmst.
- **Eine Kurswahl.** Kursquelle & Datenschutz bietet jetzt Mein Mempool auf diesem Server, Öffentliche Preisseiten, Niemand oder Stattdessen in BitcoinTX entscheiden, mit Tor und, für Mempool, öffentlichen Preisseiten als Ersatz. Eine neue Installation fragt vor dem Start. In der App sagt eine Kurskarte, woher die Kurse kommen und wann der letzte kam, und Dashboard, Seitenleiste und Transaktionsformular zeigen, welchen Kurs ein Wert verwendet hat. Coinbase und CoinGecko werden nicht mehr gefragt.
- **Geerbte Bitcoin.** Eine neue Einzahlungsquelle, Inherited: Ihre Anschaffungskosten sind ihr Wert am Todestag, und jeder Verkauf dieser Coins ist langfristig, in Form 8949 mit INHERITED vermerkt.
- **Konsolidierungen.** Ein Transfer innerhalb derselben Wallet (oder zwischen Börsen, die BitcoinTX als eine zählt) erfasst nur seine Netzwerkgebühr, als Veräußerung deiner ältesten Coins.
- **Trust this server.** Mit Stattdessen in BitcoinTX entscheiden kann ein Mempool auf einem anderen Heimserver mit https-Adresse über die Kurskarte als vertrauenswürdig markiert werden.

**Bekannte Einschränkung**

- **Über Tor lehnt Bitstamp die Anfragen von BitcoinTX derzeit ab:** Der stündliche Preisverlauf und vergangene Kurse werden nicht heruntergeladen; nur der Live-Kurs funktioniert. Wähle Öffentliche Preisseiten ohne Tor, um sie herunterzuladen (einmal geprüft, bleibt der stündliche Preisverlauf), nutze deinen eigenen Mempool für neuere Werte oder gib sie ein. Stattdessen wird nie etwas ohne Tor gesendet, und kein Wert wird 0 $. Eine Korrektur ist geplant.

**Sicherheit und kleinere Korrekturen**

- Aus einer Sicherheitsprüfung: Abmelden beendet diese Sitzung für jede Kopie ihres Cookies (ist die Datenbank in dem Moment beschäftigt, gilt eine Kopie bis zu ihrem Ablauf); fehlgeschlagene Anmeldungen anderer bremsen einen Browser nicht mehr, der sich schon einmal angemeldet hat; eine Wiederherstellung bringt die Daten einer Sicherung zurück und behält Anmeldung, KI-Schlüssel und Kurseinstellungen dieser Installation, oder ändert nichts; jede Anfrage hat Grenzen für Größe und Zeit; eine Änderung oder Löschung durch den KI-Connector legt vorher eine Sicherungskopie an, und seine Importe bleiben kurz. Die Einzelheiten werden veröffentlicht, sobald diese Version verfügbar ist.
- Ein Neustart von BitcoinTX, während es noch startet, beendet alle Prozesse des vorherigen Laufs (aus Start9s 1.2.7:1).
- Eine Änderung kann keinen negativen Gebührenwert mehr speichern.

[Alles in 1.2.8](${CHANGELOG})`,
    pl_PL: `BitcoinTX 1.2.8 wycenia bitcoina według godziny każdej transakcji, sprowadza źródło cen do jednego jasnego wyboru, dodaje odziedziczone bitcoiny i opłaty za konsolidację, sprawia, że opłata sieciowa wydatku nie liczy się podwójnie, i wprowadza poprawki z przeglądu bezpieczeństwa.

**Co zrobić po aktualizacji**

- **Przelicz księgę.** Zadanie przypomina o tym, dopóki nie uruchomisz akcji. Najpierw otwórz Settings > Ledger Review w BitcoinTX: pokazuje każdy wydatek, którego wartości się zmieniają, stare i nowe. Potem uruchom akcję StartOS Przelicz księgę albo Settings > Recalculate Ledger w BitcoinTX.
- **Potwierdź, skąd pochodzą ceny.** Jeśli akcja Źródło cen i prywatność tego nie ustawia, Dashboard BitcoinTX raz poprosi o potwierdzenie wyboru źródła cen i do tego czasu nikogo nie pyta. Jeśli w tamtej akcji nigdy niczego nie wybrano, raz poprosi o to zadanie.
- **Zaloguj się ponownie.** Po tej aktualizacji wszyscy logują się jeszcze raz.
- **Zaktualizuj łącznik AI.** W konfiguracji aplikacji AI zmień wersję po btctx-mcp== na 1.2.8 i uruchom aplikację ponownie. Łącznik pokazuje teraz przychód brutto ze sprzedaży lub wydatku obok kwoty po opłacie; starszy łącznik mógł przy edycji odjąć opłatę dwa razy.

**Poprawki, które zmieniają wartości podatkowe**

- **Opłata sieciowa wydatku liczyła się podwójnie w zysku.** Przy wydaniu bitcoina (Withdrawal z celem Spent) z opłatą sieciową w BTC opłata liczyła się jako osobne zbycie, ale nie była odejmowana od przychodu z wydatku, więc zysk wychodził za wysoki o wartość opłaty, zwykle o kilka dolarów. Wersje 0.9.2 do 1.2.7, każdy rok podatkowy; zawsze dawało to wyższy podatek, nigdy niższy. Co zrobić: Ledger Review, potem Przelicz księgę, jak wyżej. Czy korygować złożone już zeznanie z powodu kilku dolarów, decydujesz Ty lub Twój doradca podatkowy.

- **Odziedziczone bitcoiny.** Zapisane jako My BTC lub Gift, jak pozwalały wcześniejsze wersje, mogły dawać błędne wartości: sprzedaż w ciągu roku od śmierci wychodziła jako krótkoterminowa, lub koszt nabycia Gift był kosztem samej osoby. Wszystkie wcześniejsze wersje, każdy rok podatkowy z taką sprzedażą. Co zrobić: zmień każdą taką wpłatę na nowe źródło Inherited, z datą śmierci i jej wartością z tego dnia. Wpłata zapisana przed 1.1.0 ze źródłem "inherited" podlega tym zasadom od następnego przeliczenia; Ledger Review pokazuje te bez daty śmierci.

- **Cena poniżej jednego centa była zapisywana jako 0 $.** Cena dnia podana przez serwis poniżej jednego centa była zapisywana jako 0,00 $, a wartość uzupełniona z niej wynosiła 0 $. Wersje 0.9.2 do 1.2.7, każdy rok podatkowy; żadna taka cena nie jest znana. Co zrobić: nic, chyba że kiedyś pojawiła się wartość "From the price" równa 0,00 $: wpisz tę wartość (dzień już zapisany z 0,00 $ taki zostaje).

**Prywatność: wybór źródła cen bez pytania (naprawione)**

- Kogo mogło to dotyczyć: w wersjach 1.2.0 do 1.2.7 tych, którzy przełączyli Źródło cen i prywatność na Zamiast tego zdecyduj w BitcoinTX (wcześniej Wybierz w BitcoinTX) po ustawieniu jej na Wyłączone, Publiczne serwisy z cenami lub Mój Mempool, albo uruchomili Ustaw dane logowania lub polecenie ręcznie przy takim ustawieniu, jeśli BitcoinTX zapisał w tym czasie ceny. Mógł wtedy bez pytania zapisać Public price sites jako Twój wybór w aplikacji i użyć go po przełączeniu.
- Co mogło zostać wysłane: zapytania z adresu Twojego serwera do publicznych serwisów o cenę bitcoina (CoinGecko, Kraken, Bitstamp lub Coinbase) i wysokość bloku (Blockchain.info, Blockstream lub mempool.space). Nigdy daty, kwoty ani nic z Twojej księgi. Po przełączeniu Tor z akcji już nie działał: Twój adres ukrywało tylko proxy ustawione w samych Settings BitcoinTX.
- Co zrobić: potwierdź lub zmień wybór, gdy BitcoinTX raz o to zapyta po tej aktualizacji (wyżej), albo sprawdź Settings > Privacy & Network.

**Nowości**

- **Ceny według godziny.** Wartości, które BitcoinTX uzupełnia z ceny BTC (pusta wartość dochodu lub rebate, przychód ze Spent, wartość opłaty sieciowej), używają teraz ceny z początku godziny transakcji: IRS wycenia bitcoina według daty i godziny. Gdy Twój wybór dopuszcza publiczne serwisy cenowe, BitcoinTX raz pobiera godzinowe ceny Bitstamp od 2013 r. (około 3 MB) i sprawdza każdy rok odciskiem dołączonym do tej wersji. Nic już zapisanego się nie zmienia: Ledger Review pokazuje według roku podatkowego wartości wycenione ceną dnia, które godzina by zmieniła, i zmienia tylko te, które zatwierdzisz.
- **Jeden wybór źródła cen.** Źródło cen i prywatność oferuje teraz Mój Mempool na tym serwerze, Publiczne serwisy cenowe, Nikt albo Zamiast tego zdecyduj w BitcoinTX, z Torem i, dla Mempoola, publicznymi serwisami jako zapasem. Nowa instalacja pyta o to przed uruchomieniem. W aplikacji jedna karta cen mówi, skąd pochodzą ceny i kiedy przyszła ostatnia, a Dashboard, pasek boczny i formularz transakcji pokazują, jakiej ceny użyła dana wartość. Coinbase i CoinGecko nie są już pytane.
- **Odziedziczone bitcoiny.** Nowe źródło wpłaty, Inherited: koszt nabycia to wartość w dniu śmierci, a każda sprzedaż tych monet jest długoterminowa, oznaczona INHERITED w Form 8949.
- **Konsolidacje.** Transfer w obrębie tego samego portfela (lub między giełdami, które BitcoinTX liczy jako jedną) zapisuje tylko opłatę sieciową, jako zbycie Twoich najstarszych monet.
- **Trust this server.** Przy Zamiast tego zdecyduj w BitcoinTX Mempool na innym serwerze domowym pod adresem https można oznaczyć jako zaufany na karcie cen.

**Znane ograniczenie**

- **Przez Tor Bitstamp obecnie odrzuca zapytania BitcoinTX:** historia godzinowa i ceny z przeszłości nie są pobierane; działa tylko bieżąca cena. Wybierz Publiczne serwisy cenowe bez Tora, aby je pobrać (raz sprawdzona historia godzinowa zostaje), użyj własnego Mempoola dla nowszych wartości albo je wpisz. Nic nie jest wtedy wysyłane bez Tora, a żadna wartość nie staje się 0 $. Poprawka jest planowana.

**Bezpieczeństwo i mniejsze poprawki**

- Z przeglądu bezpieczeństwa: wylogowanie kończy tę sesję dla każdej kopii jej ciasteczka (jeśli baza danych jest w tej chwili zajęta, kopia działa do wygaśnięcia); nieudane logowania innych osób nie spowalniają już przeglądarki, która logowała się wcześniej; przywracanie przywraca dane z kopii i zachowuje logowanie, klucz AI i ustawienia cen tej instalacji albo niczego nie zmienia; każde zapytanie ma limity rozmiaru i czasu; edycja lub usunięcie przez łącznik AI najpierw zapisuje kopię zapasową, a jego importy są krótkie. Szczegóły zostaną opublikowane, gdy ta wersja będzie dostępna.
- Ponowne uruchomienie BitcoinTX w trakcie uruchamiania zatrzymuje wszystkie procesy poprzedniego uruchomienia (z wersji 1.2.7:1 od Start9).
- Edycja nie może już zapisać ujemnej wartości opłaty.

[Wszystko w 1.2.8](${CHANGELOG})`,
    fr_FR: `BitcoinTX 1.2.8 évalue le bitcoin à l’heure de chaque transaction, fait de l’origine des prix un seul choix clair, ajoute les bitcoins hérités et les frais de consolidation, empêche les frais de réseau d’une dépense de compter deux fois et apporte les corrections d’un audit de sécurité.

**Que faire après la mise à jour**

- **Recalculer le registre.** Une tâche le rappelle jusqu’à ce que vous lanciez l’action. Ouvrez d’abord Settings > Ledger Review dans BitcoinTX : il liste chaque dépense dont les chiffres changent, anciens et nouveaux. Lancez ensuite l’action StartOS Recalculer le registre, ou Settings > Recalculate Ledger dans BitcoinTX.
- **Confirmez d’où viennent les prix.** Sauf si l’action Source des prix et confidentialité le fixe, le Dashboard de BitcoinTX demande une fois de confirmer votre choix de prix, et n’interroge personne d’ici là. Si vous n’avez jamais fait de choix dans cette action-là, une tâche le demande une fois.
- **Reconnectez-vous.** Après cette mise à jour, tout le monde se reconnecte une fois.
- **Mettez à jour votre connecteur IA.** Dans la configuration de votre application d’IA, remplacez la version après btctx-mcp== par 1.2.8 et redémarrez l’application. Il affiche désormais le produit brut d’une vente ou d’une dépense à côté du montant après frais ; un connecteur plus ancien pouvait retirer les frais deux fois en en modifiant une.

**Corrections qui changent des montants fiscaux**

- **Les frais de réseau d’une dépense comptaient deux fois dans son gain.** Quand vous dépensiez des bitcoins (un Withdrawal de motif Spent) avec des frais de réseau en BTC, les frais comptaient comme une cession à part mais n’étaient pas déduits du produit de la dépense : le gain était trop élevé de la valeur des frais, en général quelques dollars. Versions 0.9.2 à 1.2.7, toutes les années fiscales ; cela ne donnait jamais que plus d’impôt, jamais moins. Que faire : Ledger Review, puis Recalculer le registre, comme ci-dessus. Corriger ou non une déclaration déjà déposée pour quelques dollars relève de vous ou de votre professionnel de la fiscalité.

- **Bitcoins hérités.** Saisis en My BTC ou Gift, comme le proposaient les versions antérieures, ils pouvaient donner des chiffres faux : une vente dans l’année suivant le décès sortait à court terme, ou le coût d’acquisition d’un Gift était celui de la personne elle-même. Toutes les versions antérieures, chaque année fiscale avec une telle vente. Que faire : passez chaque dépôt de ce type à la nouvelle source Inherited, avec la date du décès et sa valeur ce jour-là. Un dépôt enregistré avant la 1.1.0 avec la source "inherited" suit ces règles dès le prochain recalcul ; Ledger Review liste ceux qui n’ont pas de date de décès.

- **Un prix inférieur à un cent était enregistré à 0 $.** Le prix d’un jour qu’un site donnait sous un cent était gardé à 0,00 $, et une valeur remplie à partir de lui valait 0 $. Versions 0.9.2 à 1.2.7, toute année fiscale ; aucun n’est connu. Que faire : rien, sauf si vous avez déjà vu une valeur "From the price" à 0,00 $ : saisissez cette valeur (un jour déjà enregistré à 0,00 $ le reste).

**Confidentialité : un choix de prix fait sans demander (corrigé)**

- Qui a pu être concerné : de la 1.2.0 à la 1.2.7, ceux qui ont passé Source des prix et confidentialité à Décider plutôt dans BitcoinTX (auparavant Choisir dans BitcoinTX) après l’avoir mise sur Désactivé, Sites publics de prix ou Mon Mempool, ou qui ont lancé Définir les identifiants ou une commande à la main pendant ce réglage, si BitcoinTX avait enregistré des prix entre-temps. Il pouvait alors enregistrer Public price sites comme votre choix dans l’application sans demander, et s’en servir après le changement.
- Ce qui a pu être envoyé : des requêtes depuis l’adresse de votre serveur vers des sites publics, pour le prix du bitcoin (CoinGecko, Kraken, Bitstamp ou Coinbase) et la hauteur de bloc (Blockchain.info, Blockstream ou mempool.space). Jamais de dates, de montants ni rien de votre registre. Après le changement, le Tor de l’action ne s’appliquait plus : seul un proxy réglé dans les Settings de BitcoinTX lui-même masquait votre adresse.
- Que faire : confirmez ou changez le choix quand BitcoinTX le demande une fois après cette mise à jour (ci-dessus), ou vérifiez Settings > Privacy & Network.

**Nouveautés**

- **Des prix à l’heure.** Les valeurs que BitcoinTX remplit à partir du prix du BTC (une valeur de revenu ou de rebate laissée vide, le produit d’un Spent, la valeur de frais de réseau) utilisent désormais le prix au début de l’heure de la transaction : l’IRS évalue le bitcoin à la date et à l’heure. Quand votre choix autorise les sites publics de prix, BitcoinTX télécharge une fois les prix horaires de Bitstamp depuis 2013 (environ 3 Mo) et vérifie chaque année avec une empreinte fournie avec cette version. Rien de ce qui est déjà enregistré ne change : Ledger Review liste, par année fiscale, les valeurs au prix du jour que l’heure changerait, et ne change que celles que vous appliquez.
- **Un seul choix de prix.** Source des prix et confidentialité propose désormais Mon Mempool sur ce serveur, Sites publics de prix, Personne ou Décider plutôt dans BitcoinTX, avec Tor et, pour Mempool, les sites publics en secours. Une nouvelle installation le demande avant de démarrer. Dans l’application, une seule carte de prix dit d’où viennent les prix et quand est arrivé le dernier, et le Dashboard, la barre latérale et le formulaire de transaction indiquent quel prix une valeur a utilisé. Coinbase et CoinGecko ne sont plus interrogés.
- **Bitcoins hérités.** Une nouvelle source de dépôt, Inherited : son coût d’acquisition est sa valeur à la date du décès, et toute vente de ces bitcoins est à long terme, marquée INHERITED sur le Form 8949.
- **Consolidations.** Un transfert au sein du même portefeuille (ou entre plateformes que BitcoinTX compte comme une seule) n’enregistre que ses frais de réseau, une cession de vos bitcoins les plus anciens.
- **Trust this server.** Avec Décider plutôt dans BitcoinTX, un Mempool sur un autre serveur domestique à une adresse https peut être approuvé depuis la carte de prix.

**Limite connue**

- **Via Tor, Bitstamp refuse actuellement les requêtes de BitcoinTX :** l’historique horaire et les prix passés ne se téléchargent pas ; seul le prix en direct fonctionne. Choisissez Sites publics de prix sans Tor pour les télécharger (une fois vérifié, l’historique horaire est conservé), utilisez votre propre Mempool pour les valeurs récentes, ou saisissez-les. Rien n’est alors envoyé sans Tor, et aucune valeur ne devient 0 $. Une correction est prévue.

**Sécurité et corrections mineures**

- D’un audit de sécurité : se déconnecter met fin à cette session pour toute copie de son cookie (si la base de données est occupée à ce moment, une copie dure jusqu’à son expiration) ; les échecs de connexion des autres ne ralentissent plus un navigateur qui s’est déjà connecté ; une restauration rapporte les données d’une sauvegarde et garde l’identifiant, la clé IA et les réglages de prix de cette installation, ou ne change rien ; chaque requête a des limites de taille et de durée ; une modification ou suppression par le connecteur IA fait d’abord une copie de sauvegarde, et ses imports restent courts. Les détails seront publiés quand cette version sera disponible.
- Redémarrer BitcoinTX pendant son démarrage arrête tous les processus de l’exécution précédente (de la 1.2.7:1 de Start9).
- Une modification ne peut plus enregistrer une valeur de frais négative.

[Tout ce que contient la 1.2.8](${CHANGELOG})`,
  },
  migrations: {
    up: async ({ effects }) => {
      await storeJson.merge(effects, { recalculateLedger: true })
    },
    down: IMPOSSIBLE,
  },
})
