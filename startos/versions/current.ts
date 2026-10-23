import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG =
  'https://github.com/DigiMonk73/BTCTX-MCP/blob/main/docs/CHANGELOG.md'

/**
 * 1.2.10:0, the first maintenance update of the stable version. The notes
 * cover everything since 1.2.9:0, which the community registry serves
 * (Start9's versions.md). No fix needs a recalculation, so it has no
 * migration of its own; 1.2.9:0's moved to v1.2.9_0.ts.
 */
export const current = VersionInfo.of({
  version: '1.2.10:0',
  releaseNotes: {
    en_US: `BitcoinTX 1.2.10 is a maintenance update of 1.2.9, the stable version of BitcoinTX 1.x. It fixes four bugs that could make a tax figure wrong (below, each with who could be affected and what to do), and every known issue 1.2.9 listed.

**What to do after updating**

- **Update your AI connector.** In your AI app's configuration, change the version after btctx-mcp== to 1.2.10 and restart the AI app. The connector now needs Python 3.11 or newer: if the computer running your AI app has only Python 3.10, it stops with "does not satisfy Python>=3.11"; run uv python install 3.13 once, then restart the AI app.
- **Reload BitcoinTX's page** in your browser.
- Then see the fixes below: most ledgers need nothing more. No recalculation is needed.

**Fixes that change tax figures**

- **The River import and the AI connector compared bitcoin amounts with dollar amounts.** Their duplicate checks compared a row's amount with a recorded transaction's as a bare number, without its currency. So a River bitcoin payout of 0.01 BTC at the minute of a $0.01 dollar deposit you'd recorded showed as already in the ledger, unticked, and was left out of the import unless you ticked it: its income missing. Versions 0.7.0 to 1.2.9, any tax year, only where a River row's bitcoin amount equals, to the last digit, a dollar amount you'd recorded nearby; in 1.2.9, the AI connector's preview only flagged such rows, and saved them. Now bitcoin is compared only with bitcoin, dollars only with dollars. What to do: preview each River file you imported again. A bitcoin row that now shows as New was missed before, unless you left it out yourself: import it (switching its type again if you had), after checking its preview.
- **A spend's network fee goes in the Form 8949 box its Broker form gives.** With Broker form set on a Spent bitcoin withdrawal (what your exchange's 1099-DA or 1099-B showed for it), its network fee's row still went in the boxes for what no broker reported, so a 1099-DA listing a spend and its fee couldn't be matched. Now the fee's rows follow the spend's setting. Only the box and its Schedule D line move: the fee's value, its gain and your total gain stay the same. Versions 0.9.2 to 1.2.9, any tax year, only for a Spent withdrawal with a network fee and Broker form set. What to do: if your exchange's 1099-DA lists a spend and its network fee, set Broker form on that spend to what the form shows; if you had already set it on a spend with a fee, make that year's Form 8949 and Schedule D again.
- **A save that failed could be saved later with the next one.** When a save had to wait more than 5 seconds for something reading the database (a backup or a report, on slow storage), it failed with an error (in 1.2.9, "Something unexpected went wrong"), but its change stayed pending and the next save made it too. So a transaction entered again after that error could be in the ledger twice, and an edit, a deletion or a Delete All that failed could take effect later. Versions 0.8.0 to 1.2.9, any tax year; rare. What to do: if you saw such an error and then entered the same transaction again, look in Transactions around its date for it listed twice, and delete the extra one (Ledger Review doesn't look for duplicates). If a Delete All failed that way and your transactions were gone later, restore your last backup.
- **With your own Mempool, a value priced while its history was downloading could take the day's price instead of the hour's.** With My Mempool as the price source, a price looked up while BitcoinTX was still downloading your Mempool's price history found nothing there: BitcoinTX could take the day's 00:00 UTC price instead (an income or rebate value, a spend's proceeds, a gift's value, a network fee's value), or refused the save until tried again. Now such a lookup waits for the download. Versions 1.2.8 and 1.2.9, only with your own Mempool as the price source; a value you typed is never affected. What to do: in Settings > Ledger Review, click Check again. "Values priced at the day's price that the hour would change" lists them by tax year: tick the ones listed, or a whole year, and apply them. A backup copy is made first. For a year you've already filed, whether to amend is a question for a tax professional.

**Other fixes** (no figure changes)

- A save made while BitcoinTX is busy with something else (a long import, an AI assistant adding many rows) now says "BitcoinTX was busy saving something else, and nothing was changed. Try again.", not "Something unexpected went wrong".
- The browser's Back button, with an unsaved transaction open, now asks "Discard changes?" first, and so does Logout.
- Settings says why the tax timezone wasn't saved.
- The import previews: the CSV preview counts each row once; River's import names the row and column of a cell it refuses; an error about the whole file no longer starts with "Row 0:"; the AI connector's note on a dollar row says dollars, not BTC.
- The Sats Converter counts exactly (a figure exactly halfway now goes to the even satoshi or cent, as BitcoinTX rounds saved values, so a few figures it shows differ by one), says whether it shows an hour's price or the day's, and writes absurdly large amounts whole. Nothing it shows is saved.
- With your own Mempool, the log says "Price history from your mempool server" at every download of its history.
- The CSV export's file name has your device's date, not UTC's.

**Security and updates**

- Updates for published security advisories: pypdf (fills the IRS forms), Pillow, certifi (the certificate authorities BitcoinTX trusts) and opentelemetry-api. ReportLab 5, which draws the reports: they come out the same, and still open no file and fetch nothing.
- The web pages are built with React 19 and Vite 8: the same screens and figures.

[Everything in 1.2.10](${CHANGELOG})`,
    es_ES: `BitcoinTX 1.2.10 es una actualización de mantenimiento de la 1.2.9, la versión estable de BitcoinTX 1.x. Corrige cuatro errores que podían falsear una cifra fiscal (abajo, cada uno con a quién pudo afectar y qué hacer), y todos los problemas conocidos que listaba la 1.2.9.

**Qué hacer después de actualizar**

- **Actualiza tu conector de IA.** En la configuración de tu aplicación de IA, cambia la versión que sigue a btctx-mcp== por 1.2.10 y reinicia la aplicación de IA. El conector necesita ahora Python 3.11 o posterior: si el ordenador donde funciona tu aplicación de IA solo tiene Python 3.10, se detiene con "does not satisfy Python>=3.11"; ejecuta uv python install 3.13 una vez y después reinicia la aplicación de IA.
- **Recarga la página de BitcoinTX** en tu navegador.
- Después mira las correcciones de abajo: a la mayoría de los libros contables no les hace falta nada más. No hace falta ningún recálculo.

**Correcciones que cambian cifras fiscales**

- **La importación de River y el conector de IA comparaban importes en bitcoin con importes en dólares.** Sus comprobaciones de duplicados comparaban el importe de una fila con el de una transacción registrada como un simple número, sin su moneda. Así, un pago de bitcoin de River de 0.01 BTC en el mismo minuto que un depósito en dólares de $0.01 que hubieras registrado aparecía como ya registrado en el libro contable, sin marcar, y quedaba fuera de la importación salvo que lo marcaras: faltaban sus ingresos. Versiones 0.7.0 a 1.2.9, cualquier año fiscal, solo cuando el importe en bitcoin de una fila de River es igual, hasta el último dígito, a un importe en dólares que hubieras registrado por las mismas fechas; en la 1.2.9, la vista previa del conector de IA solo señalaba esas filas, y las guardaba. Ahora el bitcoin solo se compara con bitcoin, y los dólares solo con dólares. Qué hacer: previsualiza de nuevo cada archivo de River que importaste. Una fila de bitcoin que ahora aparece como New se omitió antes, salvo que la dejaras fuera tú: impórtala (cambiando de nuevo su tipo si lo habías cambiado), tras revisar su vista previa.
- **La comisión de red de un gasto va en la casilla del Form 8949 que indica su Broker form.** Con Broker form fijado en un retiro de bitcoin Spent (lo que el 1099-DA o el 1099-B de tu exchange mostraba para él), la fila de su comisión de red seguía yendo en las casillas de lo que ningún broker declaró, así que un 1099-DA que listaba un gasto y su comisión no podía cuadrarse. Ahora las filas de la comisión siguen el ajuste del gasto. Solo cambian la casilla y su línea del Schedule D: el valor de la comisión, su ganancia y tu ganancia total siguen igual. Versiones 0.9.2 a 1.2.9, cualquier año fiscal, solo para un retiro Spent con comisión de red y Broker form fijado. Qué hacer: si el 1099-DA de tu exchange lista un gasto y su comisión de red, fija Broker form en ese gasto según lo que muestra el formulario; si ya lo habías fijado en un gasto con comisión, vuelve a generar el Form 8949 y el Schedule D de ese año.
- **Un guardado fallido podía guardarse después con el siguiente.** Cuando un guardado tenía que esperar más de 5 segundos a algo que leía la base de datos (una copia de seguridad o un informe, en un almacenamiento lento), fallaba con un error (en la 1.2.9, "Something unexpected went wrong"), pero su cambio quedaba pendiente y el siguiente guardado también lo hacía. Así, una transacción introducida de nuevo tras ese error podía estar dos veces en el libro contable, y una edición, un borrado o un Delete All que fallaron podían surtir efecto más tarde. Versiones 0.8.0 a 1.2.9, cualquier año fiscal; poco frecuente. Qué hacer: si viste un error así y después introdujiste de nuevo la misma transacción, busca en Transactions, en torno a su fecha, si aparece dos veces, y borra la sobrante (Ledger Review no busca duplicados). Si un Delete All falló así y tus transacciones desaparecieron después, restaura tu última copia de seguridad.
- **Con tu propio Mempool, un valor calculado con el precio mientras se descargaba su historial podía tomar el precio del día en lugar del de la hora.** Con My Mempool como fuente de precios, un precio consultado mientras BitcoinTX aún descargaba el historial de precios de tu Mempool no encontraba nada allí: BitcoinTX podía tomar en su lugar el precio del día a las 00:00 UTC (un valor de ingreso o de rebate, los ingresos de un gasto, el valor de un regalo, el valor de una comisión de red), o rechazaba el guardado hasta volver a intentarlo. Ahora esa consulta espera a la descarga. Versiones 1.2.8 y 1.2.9, solo con tu propio Mempool como fuente de precios; un valor que escribiste tú nunca se ve afectado. Qué hacer: en Settings > Ledger Review, haz clic en Check again. "Values priced at the day's price that the hour would change" los muestra por año fiscal: marca los listados, o un año entero, y aplícalos. Antes se hace una copia de seguridad. Para un año ya declarado, si conviene rectificar es una pregunta para un profesional fiscal.

**Otras correcciones** (ninguna cifra cambia)

- Guardar mientras BitcoinTX está ocupado con otra cosa (una importación larga, un asistente de IA que añade muchas filas) dice ahora "BitcoinTX was busy saving something else, and nothing was changed. Try again.", no "Something unexpected went wrong".
- El botón Atrás del navegador, con una transacción sin guardar abierta, pregunta ahora antes "Discard changes?", y Logout también.
- Settings dice por qué no se guardó la zona horaria fiscal.
- Las vistas previas de importación: la vista previa CSV cuenta cada fila una vez; la importación de River nombra la fila y la columna de una celda que rechaza; un error sobre todo el archivo ya no empieza por "Row 0:"; la nota del conector de IA sobre una fila en dólares dice dólares, no BTC.
- El Sats Converter cuenta con exactitud (una cifra justo a mitad de camino va ahora al satoshi o al centavo par, como BitcoinTX redondea los valores guardados, así que algunas cifras que muestra difieren en uno), dice si muestra el precio de una hora o el del día, y escribe completos los importes absurdamente grandes. Nada de lo que muestra se guarda.
- Con tu propio Mempool, el log dice "Price history from your mempool server" en cada descarga de su historial.
- El nombre de archivo de la exportación CSV lleva la fecha de tu dispositivo, no la de UTC.

**Seguridad y actualizaciones**

- Actualizaciones por avisos de seguridad publicados: pypdf (rellena los formularios del IRS), Pillow, certifi (las autoridades de certificación en las que confía BitcoinTX) y opentelemetry-api. ReportLab 5, que dibuja los informes: salen iguales, y siguen sin abrir ningún archivo ni descargar nada.
- Las páginas web se construyen con React 19 y Vite 8: las mismas pantallas y cifras.

[Todo lo de la 1.2.10](${CHANGELOG})`,
    de_DE: `BitcoinTX 1.2.10 ist ein Wartungsupdate von 1.2.9, der stabilen Version von BitcoinTX 1.x. Es behebt vier Fehler, die eine Steuerzahl verfälschen konnten (unten, jeweils mit wen sie betreffen konnten und was zu tun ist), und alle bekannten Probleme, die 1.2.9 aufgeführt hat.

**Was nach dem Update zu tun ist**

- **Aktualisiere deinen KI-Connector.** Ändere in der Konfiguration deiner KI-App die Version nach btctx-mcp== in 1.2.10 und starte die KI-App neu. Der Connector braucht jetzt Python 3.11 oder neuer: Hat der Computer, auf dem deine KI-App läuft, nur Python 3.10, bricht er mit "does not satisfy Python>=3.11" ab; führe einmal uv python install 3.13 aus und starte dann die KI-App neu.
- **Lade die Seite von BitcoinTX neu** in deinem Browser.
- Sieh dir dann die Korrekturen unten an: Die meisten Journale brauchen nichts weiter. Eine Neuberechnung ist nicht nötig.

**Korrekturen, die Steuerzahlen ändern**

- **Der River-Import und der KI-Connector verglichen Bitcoin-Beträge mit Dollarbeträgen.** Ihre Duplikatprüfungen verglichen den Betrag einer Zeile mit dem einer erfassten Transaktion als bloße Zahl, ohne ihre Währung. So erschien eine Bitcoin-Zahlung von River über 0.01 BTC in derselben Minute wie eine von dir erfasste Dollar-Einzahlung über $0.01 als bereits im Journal, nicht angehakt, und blieb beim Import außen vor, wenn du sie nicht angehakt hast: Ihr Einkommen fehlte. Versionen 0.7.0 bis 1.2.9, jedes Steuerjahr, nur wenn der Bitcoin-Betrag einer River-Zeile bis zur letzten Stelle einem Dollarbetrag gleicht, den du zeitnah erfasst hattest; in 1.2.9 markierte die Vorschau des KI-Connectors solche Zeilen nur und speicherte sie. Jetzt wird Bitcoin nur mit Bitcoin verglichen, Dollar nur mit Dollar. Was zu tun ist: Öffne die Vorschau jeder River-Datei, die du importiert hast, erneut. Eine Bitcoin-Zeile, die jetzt als New erscheint, wurde vorher ausgelassen, außer du hast sie selbst weggelassen: Importiere sie (und ändere ihren Typ erneut, falls du ihn geändert hattest), nachdem du ihre Vorschau geprüft hast.
- **Die Netzwerkgebühr einer Ausgabe kommt in das Kästchen von Form 8949, das ihr Broker form angibt.** War Broker form bei einer Bitcoin-Auszahlung mit dem Zweck Spent gesetzt (was das 1099-DA oder 1099-B deiner Börse dafür zeigte), kam die Zeile ihrer Netzwerkgebühr trotzdem in die Kästchen für das, was kein Broker gemeldet hat, sodass sich ein 1099-DA, das eine Ausgabe und ihre Gebühr aufführt, nicht abgleichen ließ. Jetzt folgen die Zeilen der Gebühr der Einstellung der Ausgabe. Nur das Kästchen und seine Zeile in Schedule D ändern sich: Der Wert der Gebühr, ihr Gewinn und dein Gesamtgewinn bleiben gleich. Versionen 0.9.2 bis 1.2.9, jedes Steuerjahr, nur bei einer Auszahlung mit dem Zweck Spent mit Netzwerkgebühr und gesetztem Broker form. Was zu tun ist: Führt das 1099-DA deiner Börse eine Ausgabe und ihre Netzwerkgebühr auf, setze Broker form bei dieser Ausgabe auf das, was das Formular zeigt; hattest du es bei einer Ausgabe mit Gebühr schon gesetzt, erstelle Form 8949 und Schedule D für dieses Jahr neu.
- **Ein fehlgeschlagenes Speichern konnte später mit dem nächsten gespeichert werden.** Musste ein Speichern länger als 5 Sekunden auf etwas warten, das die Datenbank las (eine Sicherung oder einen Bericht, auf langsamem Speicher), schlug es mit einem Fehler fehl (in 1.2.9 "Something unexpected went wrong"), doch seine Änderung blieb offen, und das nächste Speichern führte sie mit aus. So konnte eine nach diesem Fehler erneut eingegebene Transaktion doppelt im Journal stehen, und eine fehlgeschlagene Bearbeitung, Löschung oder ein fehlgeschlagenes Delete All konnte später wirksam werden. Versionen 0.8.0 bis 1.2.9, jedes Steuerjahr; selten. Was zu tun ist: Hast du einen solchen Fehler gesehen und dieselbe Transaktion dann erneut eingegeben, sieh unter Transactions um ihr Datum herum nach, ob sie doppelt aufgeführt ist, und lösche die zusätzliche (Ledger Review sucht nicht nach Duplikaten). Ist ein Delete All so fehlgeschlagen und waren deine Transaktionen später weg, stelle deine letzte Sicherung wieder her.
- **Mit deinem eigenen Mempool konnte ein Wert, der während des Downloads seines Verlaufs bewertet wurde, den Tageskurs statt des Stundenkurses bekommen.** Mit My Mempool als Kursquelle fand eine Kursabfrage, während BitcoinTX noch den Preisverlauf deines Mempool herunterlud, dort nichts: BitcoinTX konnte stattdessen den Tageskurs von 00:00 UTC nehmen (einen Einkommens- oder Rebate-Wert, den Erlös einer Ausgabe, den Wert eines Geschenks, den Wert einer Netzwerkgebühr) oder lehnte das Speichern ab, bis es erneut versucht wurde. Jetzt wartet eine solche Abfrage auf den Download. Versionen 1.2.8 und 1.2.9, nur mit deinem eigenen Mempool als Kursquelle; ein von dir eingegebener Wert ist nie betroffen. Was zu tun ist: Klicke in Settings > Ledger Review auf Check again. "Values priced at the day's price that the hour would change" listet sie nach Steuerjahr: Hake die aufgeführten an, oder ein ganzes Jahr, und übernimm sie. Vorher wird eine Sicherungskopie angelegt. Ob eine Erklärung für ein schon erklärtes Jahr berichtigt werden soll, ist eine Frage für einen Steuerberater.

**Weitere Korrekturen** (keine Zahl ändert sich)

- Ein Speichern, während BitcoinTX mit etwas anderem beschäftigt ist (ein langer Import, ein KI-Assistent, der viele Zeilen hinzufügt), meldet jetzt "BitcoinTX was busy saving something else, and nothing was changed. Try again.", nicht "Something unexpected went wrong".
- Die Zurück-Taste des Browsers fragt bei einer offenen, ungespeicherten Transaktion jetzt zuerst "Discard changes?", und Logout ebenso.
- Settings sagt, warum die Steuer-Zeitzone nicht gespeichert wurde.
- Die Import-Vorschauen: Die CSV-Vorschau zählt jede Zeile einmal; der River-Import nennt Zeile und Spalte einer Zelle, die er ablehnt; ein Fehler zur ganzen Datei beginnt nicht mehr mit "Row 0:"; der Hinweis des KI-Connectors zu einer Dollar-Zeile sagt Dollar, nicht BTC.
- Der Sats Converter rechnet genau (ein Betrag genau in der Mitte geht jetzt zum geraden Satoshi oder Cent, so wie BitcoinTX gespeicherte Werte rundet, daher weichen einige angezeigte Zahlen um eins ab), sagt, ob er den Kurs einer Stunde oder den des Tages zeigt, und schreibt absurd große Beträge vollständig aus. Nichts, was er zeigt, wird gespeichert.
- Mit deinem eigenen Mempool steht im Log bei jedem Download seines Verlaufs "Price history from your mempool server".
- Der Dateiname des CSV-Exports trägt das Datum deines Geräts, nicht das von UTC.

**Sicherheit und Updates**

- Updates zu veröffentlichten Sicherheitshinweisen: pypdf (füllt die IRS-Formulare aus), Pillow, certifi (die Zertifizierungsstellen, denen BitcoinTX vertraut) und opentelemetry-api. ReportLab 5, das die Berichte zeichnet: Sie kommen gleich heraus, öffnen weiterhin keine Datei und rufen nichts ab.
- Die Webseiten werden mit React 19 und Vite 8 gebaut: dieselben Bildschirme und Zahlen.

[Alles in 1.2.10](${CHANGELOG})`,
    pl_PL: `BitcoinTX 1.2.10 to aktualizacja serwisowa wersji 1.2.9, stabilnej wersji BitcoinTX 1.x. Naprawia cztery błędy, które mogły zafałszować wartość podatkową (niżej, przy każdym: kogo mógł dotyczyć i co zrobić), oraz wszystkie znane problemy wymienione w 1.2.9.

**Co zrobić po aktualizacji**

- **Zaktualizuj łącznik AI.** W konfiguracji aplikacji AI zmień wersję po btctx-mcp== na 1.2.10 i uruchom aplikację AI ponownie. Łącznik wymaga teraz Pythona 3.11 lub nowszego: jeśli komputer, na którym działa aplikacja AI, ma tylko Pythona 3.10, łącznik zatrzymuje się z komunikatem "does not satisfy Python>=3.11"; uruchom raz uv python install 3.13, a potem ponownie uruchom aplikację AI.
- **Odśwież stronę BitcoinTX** w przeglądarce.
- Potem przejrzyj poprawki poniżej: większość ksiąg nie potrzebuje niczego więcej. Przeliczenie nie jest potrzebne.

**Poprawki, które zmieniają wartości podatkowe**

- **Import River i łącznik AI porównywały kwoty w bitcoinach z kwotami w dolarach.** Ich sprawdzanie duplikatów porównywało kwotę wiersza z kwotą zapisanej transakcji jako samą liczbę, bez waluty. Dlatego wypłata bitcoinów z River na 0.01 BTC w tej samej minucie co zapisana przez Ciebie wpłata dolarów na $0.01 była pokazywana jako już zapisana w księdze, nieoznaczona, i pomijana przy imporcie, jeśli jej nie zaznaczono: brakowało jej dochodu. Wersje 0.7.0 do 1.2.9, każdy rok podatkowy, tylko gdy kwota w bitcoinach z wiersza River jest równa, co do ostatniej cyfry, kwocie w dolarach zapisanej mniej więcej w tym samym czasie; w 1.2.9 podgląd łącznika AI tylko oznaczał takie wiersze i je zapisywał. Teraz bitcoiny porównywane są tylko z bitcoinami, a dolary tylko z dolarami. Co zrobić: otwórz ponownie podgląd każdego zaimportowanego pliku River. Wiersz bitcoinowy, który teraz jest oznaczony jako New, został wcześniej pominięty, chyba że pominięto go celowo: zaimportuj go (ponownie zmieniając jego typ, jeśli go zmieniono) po sprawdzeniu podglądu.
- **Opłata sieciowa wydatku trafia do pola Form 8949 wskazanego przez jego Broker form.** Gdy przy wypłacie bitcoina z celem Spent ustawiono Broker form (to, co pokazywał dla niej 1099-DA lub 1099-B Twojej giełdy), wiersz jej opłaty sieciowej i tak trafiał do pól dla tego, czego żaden broker nie zgłosił, więc 1099-DA wymieniającego wydatek i jego opłatę nie dało się dopasować. Teraz wiersze opłaty idą za ustawieniem wydatku. Zmienia się tylko pole i jego wiersz w Schedule D: wartość opłaty, jej zysk i Twój łączny zysk pozostają takie same. Wersje 0.9.2 do 1.2.9, każdy rok podatkowy, tylko dla wypłaty Spent z opłatą sieciową i ustawionym Broker form. Co zrobić: jeśli 1099-DA Twojej giełdy wymienia wydatek i jego opłatę sieciową, ustaw w tym wydatku Broker form zgodnie z tym, co pokazuje formularz; jeśli było już ustawione przy wydatku z opłatą, wygeneruj ponownie Form 8949 i Schedule D za ten rok.
- **Nieudany zapis mógł zostać zapisany później razem z następnym.** Gdy zapis musiał czekać ponad 5 sekund na coś, co czytało bazę danych (kopię zapasową lub raport, na wolnym nośniku), kończył się błędem (w 1.2.9 "Something unexpected went wrong"), ale jego zmiana pozostawała oczekująca i następny zapis wprowadzał ją również. Dlatego transakcja wpisana ponownie po tym błędzie mogła znaleźć się w księdze dwa razy, a nieudana edycja, usunięcie lub Delete All mogły zadziałać później. Wersje 0.8.0 do 1.2.9, każdy rok podatkowy; rzadko. Co zrobić: jeśli pojawił się taki błąd, a potem wpisano tę samą transakcję ponownie, sprawdź w Transactions w okolicy jej daty, czy nie jest wymieniona dwa razy, i usuń zbędną (Ledger Review nie szuka duplikatów). Jeśli Delete All nie powiodło się w ten sposób, a transakcje później zniknęły, przywróć ostatnią kopię zapasową.
- **Przy własnym Mempoolu wartość wyceniana w trakcie pobierania jego historii mogła dostać cenę dnia zamiast ceny godziny.** Przy My Mempool jako źródle cen zapytanie o cenę wysłane, gdy BitcoinTX wciąż pobierał historię cen z Twojego Mempoola, nic tam nie znajdowało: BitcoinTX mógł wziąć zamiast tego cenę dnia z 00:00 UTC (wartość dochodu lub rebate, przychód z wydatku, wartość prezentu, wartość opłaty sieciowej) albo odrzucał zapis do ponownej próby. Teraz takie zapytanie czeka na pobranie. Wersje 1.2.8 i 1.2.9, tylko z własnym Mempoolem jako źródłem cen; wpisana przez Ciebie wartość nigdy nie jest dotknięta. Co zrobić: w Settings > Ledger Review kliknij Check again. "Values priced at the day's price that the hour would change" pokazuje je według roku podatkowego: zaznacz wymienione albo cały rok i zatwierdź je. Najpierw powstaje kopia zapasowa. Czy korygować zeznanie za rok już rozliczony, to pytanie do doradcy podatkowego.

**Inne poprawki** (żadna wartość się nie zmienia)

- Zapis w czasie, gdy BitcoinTX jest zajęty czymś innym (długim importem, asystentem AI dodającym wiele wierszy), kończy się teraz komunikatem "BitcoinTX was busy saving something else, and nothing was changed. Try again.", a nie "Something unexpected went wrong".
- Przycisk Wstecz w przeglądarce przy otwartej niezapisanej transakcji najpierw pyta teraz "Discard changes?", podobnie Logout.
- Settings mówi, dlaczego podatkowa strefa czasowa nie została zapisana.
- Podglądy importu: podgląd CSV liczy każdy wiersz raz; import River podaje wiersz i kolumnę komórki, którą odrzuca; błąd dotyczący całego pliku nie zaczyna się już od "Row 0:"; uwaga łącznika AI o wierszu w dolarach mówi o dolarach, nie o BTC.
- Sats Converter liczy dokładnie (wartość dokładnie w połowie trafia teraz do parzystego satoshi lub centa, tak jak BitcoinTX zaokrągla zapisane wartości, więc kilka pokazywanych wartości różni się o jeden), mówi, czy pokazuje cenę z godziny, czy z dnia, i wypisuje w całości absurdalnie duże kwoty. Nic z tego, co pokazuje, nie jest zapisywane.
- Przy własnym Mempoolu log przy każdym pobraniu jego historii podaje "Price history from your mempool server".
- Nazwa pliku eksportu CSV zawiera datę Twojego urządzenia, a nie UTC.

**Bezpieczeństwo i aktualizacje**

- Aktualizacje w związku z opublikowanymi biuletynami bezpieczeństwa: pypdf (wypełnia formularze IRS), Pillow, certifi (urzędy certyfikacji, którym ufa BitcoinTX) i opentelemetry-api. ReportLab 5, który rysuje raporty: wychodzą takie same i nadal nie otwierają żadnego pliku ani niczego nie pobierają.
- Strony internetowe są budowane z React 19 i Vite 8: te same ekrany i wartości.

[Wszystko w 1.2.10](${CHANGELOG})`,
    fr_FR: `BitcoinTX 1.2.10 est une mise à jour de maintenance de la 1.2.9, la version stable de BitcoinTX 1.x. Elle corrige quatre bugs qui pouvaient fausser un montant fiscal (ci-dessous, chacun avec qui a pu être touché et que faire), et tous les problèmes connus que listait la 1.2.9.

**Que faire après la mise à jour**

- **Mettez à jour votre connecteur IA.** Dans la configuration de votre application d’IA, remplacez la version après btctx-mcp== par 1.2.10 et redémarrez l’application d’IA. Le connecteur demande désormais Python 3.11 ou plus récent : si l’ordinateur où tourne votre application d’IA n’a que Python 3.10, il s’arrête avec "does not satisfy Python>=3.11" ; lancez une fois uv python install 3.13, puis redémarrez l’application d’IA.
- **Rechargez la page de BitcoinTX** dans votre navigateur.
- Consultez ensuite les corrections ci-dessous : la plupart des registres n’ont besoin de rien d’autre. Aucun recalcul n’est nécessaire.

**Corrections qui changent des montants fiscaux**

- **L’import River et le connecteur IA comparaient des montants en bitcoins à des montants en dollars.** Leurs vérifications de doublons comparaient le montant d’une ligne à celui d’une transaction enregistrée comme un simple nombre, sans sa devise. Ainsi, un paiement en bitcoins de River de 0.01 BTC à la minute d’un dépôt en dollars de $0.01 que vous aviez enregistré apparaissait comme déjà dans le registre, non coché, et restait hors de l’import sauf si vous le cochiez : son revenu manquait. Versions 0.7.0 à 1.2.9, toute année fiscale, seulement quand le montant en bitcoins d’une ligne River est égal, au dernier chiffre près, à un montant en dollars que vous aviez enregistré à peu près au même moment  ; dans la 1.2.9, l’aperçu du connecteur IA ne faisait que signaler ces lignes, et les enregistrait. Désormais, les bitcoins ne sont comparés qu’aux bitcoins, les dollars qu’aux dollars. Que faire : prévisualisez de nouveau chaque fichier River que vous avez importé. Une ligne en bitcoins qui apparaît maintenant comme New avait été manquée, sauf si vous l’aviez laissée de côté vous-même : importez-la (en changeant de nouveau son type si vous l’aviez changé), après avoir vérifié son aperçu.
- **Les frais de réseau d’une dépense vont dans la case du Form 8949 que donne son Broker form.** Avec Broker form réglé sur un retrait de bitcoins de motif Spent (ce que le 1099-DA ou le 1099-B de votre plateforme indiquait pour lui), la ligne de ses frais de réseau allait toujours dans les cases de ce qu’aucun broker n’a déclaré, si bien qu’un 1099-DA listant une dépense et ses frais ne pouvait pas être rapproché. Désormais, les lignes des frais suivent le réglage de la dépense. Seules la case et sa ligne du Schedule D changent : la valeur des frais, leur gain et votre gain total restent les mêmes. Versions 0.9.2 à 1.2.9, toute année fiscale, seulement pour un retrait Spent avec des frais de réseau et Broker form réglé. Que faire : si le 1099-DA de votre plateforme liste une dépense et ses frais de réseau, réglez Broker form sur cette dépense selon ce qu’indique le formulaire ; si vous l’aviez déjà réglé sur une dépense avec des frais, générez de nouveau le Form 8949 et le Schedule D de cette année.
- **Un enregistrement qui avait échoué pouvait être enregistré plus tard avec le suivant.** Quand un enregistrement devait attendre plus de 5 secondes quelque chose qui lisait la base de données (une sauvegarde ou un rapport, sur un stockage lent), il échouait avec une erreur (dans la 1.2.9, "Something unexpected went wrong"), mais sa modification restait en attente et l’enregistrement suivant l’effectuait aussi. Ainsi, une transaction saisie de nouveau après cette erreur pouvait figurer deux fois dans le registre, et une modification, une suppression ou un Delete All qui avait échoué pouvait prendre effet plus tard. Versions 0.8.0 à 1.2.9, toute année fiscale ; rare. Que faire : si vous avez vu une telle erreur puis saisi de nouveau la même transaction, regardez dans Transactions, autour de sa date, si elle figure deux fois, et supprimez celle en trop (Ledger Review ne cherche pas les doublons). Si un Delete All a échoué ainsi et que vos transactions ont disparu plus tard, restaurez votre dernière sauvegarde.
- **Avec votre propre Mempool, une valeur évaluée pendant le téléchargement de son historique pouvait prendre le prix du jour au lieu de celui de l’heure.** Avec My Mempool comme source des prix, un prix recherché pendant que BitcoinTX téléchargeait encore l’historique des prix de votre Mempool n’y trouvait rien : BitcoinTX pouvait prendre à la place le prix du jour à 00:00 UTC (une valeur de revenu ou de rebate, le produit d’une dépense, la valeur d’un don, la valeur de frais de réseau), ou refusait l’enregistrement jusqu’à un nouvel essai. Désormais, une telle recherche attend la fin du téléchargement. Versions 1.2.8 et 1.2.9, seulement avec votre propre Mempool comme source des prix ; une valeur que vous avez saisie n’est jamais touchée. Que faire : dans Settings > Ledger Review, cliquez sur Check again. "Values priced at the day's price that the hour would change" les liste par année fiscale : cochez celles listées, ou une année entière, et appliquez-les. Une copie de sauvegarde est faite d’abord. Pour une année déjà déclarée, corriger ou non la déclaration est une question pour un professionnel de la fiscalité.

**Autres corrections** (aucun chiffre ne change)

- Un enregistrement fait pendant que BitcoinTX est occupé à autre chose (un long import, un assistant IA qui ajoute de nombreuses lignes) affiche désormais "BitcoinTX was busy saving something else, and nothing was changed. Try again.", et non "Something unexpected went wrong".
- Le bouton Précédent du navigateur, avec une transaction non enregistrée ouverte, demande désormais d’abord "Discard changes?", tout comme Logout.
- Settings dit pourquoi le fuseau horaire fiscal n’a pas été enregistré.
- Les aperçus d’import : l’aperçu CSV compte chaque ligne une fois ; l’import River nomme la ligne et la colonne d’une cellule qu’il refuse ; une erreur portant sur tout le fichier ne commence plus par "Row 0:" ; la note du connecteur IA sur une ligne en dollars parle de dollars, pas de BTC.
- Le Sats Converter compte exactement (un montant tombant exactement à mi-chemin va désormais au satoshi ou au cent pair, comme BitcoinTX arrondit les valeurs enregistrées, si bien que quelques chiffres qu’il affiche diffèrent d’une unité), dit s’il affiche le prix d’une heure ou celui du jour, et écrit en entier les montants absurdement grands. Rien de ce qu’il affiche n’est enregistré.
- Avec votre propre Mempool, le journal indique "Price history from your mempool server" à chaque téléchargement de son historique.
- Le nom du fichier de l’export CSV porte la date de votre appareil, et non celle d’UTC.

**Sécurité et mises à jour**

- Mises à jour liées à des avis de sécurité publiés : pypdf (remplit les formulaires de l’IRS), Pillow, certifi (les autorités de certification auxquelles BitcoinTX fait confiance) et opentelemetry-api. ReportLab 5, qui dessine les rapports : ils sortent identiques, et n’ouvrent toujours aucun fichier ni ne récupèrent rien.
- Les pages web sont construites avec React 19 et Vite 8 : les mêmes écrans et les mêmes chiffres.

[Tout ce que contient la 1.2.10](${CHANGELOG})`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
