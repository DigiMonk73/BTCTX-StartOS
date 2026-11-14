import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG =
  'https://github.com/DigiMonk73/BTCTX-MCP/blob/v2.0.2/docs/CHANGELOG.md'

/**
 * 2.0.2:0, the second maintenance update of 2.0. 2.0.1:0's migration was
 * empty, so it is bumped in place (Start9's versions.md), with no migration of
 * its own. The notes cover what changed since 2.0.1:0, which the community
 * registry serves: StartOS 0.4.1 or later first, what to do after updating,
 * the tax-figures fix with who could be affected and what to do, the other
 * fixes and the known issues. Start9's rule: what a user observes, never how
 * it was done.
 */
export const current = VersionInfo.of({
  version: '2.0.2:0',
  releaseNotes: {
    en_US: `BitcoinTX 2.0.2 is a maintenance update of 2.0.1, and needs StartOS 0.4.1 or later. It fixes one bug that could make a tax figure wrong, in a time your AI app changed, for a few places whose clock rules changed recently (below, with who could be affected and what to do), and four smaller bugs.

**Before you update**

- **Update StartOS to 0.4.1 or later first.** BitcoinTX 2.0.2 needs it: until then, BitcoinTX can update only as far as 2.0.1.
- **Coming from 1.x?** Read [2.0.0's notes](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0) first. 2.0 changes how your ledger is stored, and StartOS can't undo it by itself: make a StartOS backup of BitcoinTX and keep it, as it's your way back to 1.x.
- **Coming from 1.x or 2.0.0?** Read [2.0.1's notes](https://github.com/DigiMonk73/BTCTX-MCP/blob/v2.0.1/docs/CHANGELOG.md) too: its timezone fix, for Manitoba, the Northwest Territories and Cuba, can ask you to correct some times.

**What to do after updating**

- **Reload any BitcoinTX page left open** in a browser.
- **If you use an AI connector**, update it: in your AI app's configuration, change the version after btctx-mcp== to 2.0.2, as Settings > Connect an AI Assistant gives it, then restart the AI app.
- Then see the fix below: most ledgers need nothing more.

**A fix that can change a figure**

- **A time your AI app changed, in a place whose clock rules changed recently.** When the AI changed a transaction's time, or gave a date acquired with a time, the AI connector worked out that moment by the timezone data of the computer it runs on. Where that data was older than BitcoinTX's, the time was saved an hour off, for these tax timezones:
  - British Columbia, Alberta, Manitoba, the Northwest Territories and Cuba, from 1 November 2026: an hour late;
  - Morocco, from 20 September 2026: an hour early;
  - Moldova, since 2022: only a time from 03:00 to 04:00 on the last Sunday of March (an hour early) or of October (an hour late);
  - on a computer with data from 2024 or earlier, also Paraguay, from 23 March to 5 October 2025 and from 22 March to 4 October 2026: an hour late; with data from 2023 or earlier, also Kazakhstan (Almaty's and Kostanay's time), from 1 March 2024: an hour early; and older data misses other places' changes too.

  An hour off can move a transaction near midnight to another day: its date on Form 8949, its holding period (a sale about a year after its purchase could show short-term instead of long-term, or the other way round) and, at a year's end, its tax year (the end of 2026; in Kazakhstan, also of 2024 and 2025). A value BitcoinTX filled in from the price, or one the AI typed from its price lookup for such a time, could be another hour's, and a gain could change where the hour moved a sale past another transaction. A transaction the AI added keeps its time: BitcoinTX reads that itself.
  - **What to do:** update the AI connector (above). If your tax timezone is one of these, ask the AI to set again, as you first gave them, each time it changed from those dates and each date acquired (or of death) it gave with a time, and to value again each dollar value it typed from its price lookup for such a time. The updated connector saves the right moment, and one already right stays as it is. Go by the time you first gave, not by the screen: your device shows times by its own timezone data.

**Other fixes** (no figure changes)

- After a password change, another browser's next click goes to the sign-in page, instead of showing load errors.
- Settings > Wallets, exchanges and banks shows the new balances after Delete All Transactions, without a reload.
- On a phone, a transaction's fee moves whole to the next line instead of being cut off.
- The prompt from Settings > Connect an AI Assistant asks you to turn on AI access only while it's off.
- **Security:** BitcoinTX includes the latest security fixes of the software it's built on.

**Known issues**

- From 2.0.1: only on a ledger holding a row whose value is blank in the database (blanked by hand, or left by an old version in a ledger not recalculated since), a save can need a second try, and a value dated after the price history's last hour can take the day's price, marked, instead of the hour's. Ledger Review lists such a value, and you can apply the hour's price there. And BitcoinTX can't yet match a Form 1099-DA that lists a transfer's or a gift's network fee, or a fee without its withdrawal, on Form 8949: the Complete Tax Report says how to correct it by hand.
- Found since, each one can make a figure wrong; their fix is planned for 2.0.3:
  - coins acquired on 28 February (of 2011, 2015, 2019, 2023 or 2027) and sold on 29 February of the next year are reported long-term, but they're short-term (the same gain, in Form 8949's Part I, not Part II): until then, report such a sale as short-term by hand;
  - the AI connector's import orders rows that share a time by type (rows it's given with a date only all share noon), where a file import keeps the file's order, so a sale and a transfer out at the same time can use other coins, and give another gain, depending on how they were added: until then, add rows that share a time through a file import, or check which coins such a sale used;
  - BitcoinTX's own CSV import drops, with no error, every row after a cell whose quote is never closed: only a hand-edited file, so compare the preview's row count with your file's;
  - BitcoinTX's own CSV import, and River's, read a bitcoin amount written "1,234" as 1234 BTC: check the preview's amounts if your spreadsheet writes decimals with a comma;
  - on a device whose timezone data is older than BitcoinTX's, a time typed in the transaction form, in the places and periods of the fix above, can be saved an hour off, and the device shows it back as typed. Keep the device's system and browser up to date. Once it is, open each such transaction and compare its time with the receipt or record you typed it from. Where it's an hour off, type the receipt's time again.

[Everything in 2.0.2](${CHANGELOG})`,
    es_ES: `BitcoinTX 2.0.2 es una actualización de mantenimiento de la 2.0.1 y necesita StartOS 0.4.1 o posterior. Corrige un error que podía hacer incorrecta una cifra fiscal, en una hora que cambió tu aplicación de IA, para algunos lugares cuyas reglas horarias cambiaron hace poco (abajo, con a quién puede afectar y qué hacer), y cuatro errores menores.

**Antes de actualizar**

- **Actualiza primero StartOS a la 0.4.1 o posterior.** BitcoinTX 2.0.2 la necesita: hasta entonces, BitcoinTX solo puede actualizarse hasta la 2.0.1.
- **¿Vienes de la 1.x?** Lee antes [las notas de la 2.0.0](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0). La 2.0 cambia cómo se guarda tu libro contable, y StartOS no puede deshacerlo por sí solo: haz una copia de seguridad de BitcoinTX en StartOS y guárdala, porque es tu forma de volver a la 1.x.
- **¿Vienes de la 1.x o de la 2.0.0?** Lee también [las notas de la 2.0.1](https://github.com/DigiMonk73/BTCTX-MCP/blob/v2.0.1/docs/CHANGELOG.md): su corrección horaria, para Manitoba, los Territorios del Noroeste y Cuba, puede pedirte que corrijas algunas horas.

**Después de actualizar**

- **Vuelve a cargar cualquier página de BitcoinTX que haya quedado abierta** en un navegador.
- **Si usas un conector de IA**, actualízalo: en la configuración de tu aplicación de IA, cambia la versión que sigue a btctx-mcp== por 2.0.2, como la da Settings > Connect an AI Assistant, y reinicia la aplicación de IA.
- Después mira la corrección de abajo: la mayoría de los libros contables no necesitan nada más.

**Una corrección que puede cambiar una cifra**

- **Una hora que cambió tu aplicación de IA, en un lugar cuyas reglas horarias cambiaron hace poco.** Cuando la IA cambiaba la hora de una transacción, o daba una fecha de adquisición con una hora, el conector de IA calculaba ese momento con los datos de zona horaria del ordenador en el que se ejecuta. Si esos datos eran más antiguos que los de BitcoinTX, la hora se guardaba con una hora de diferencia, en estas zonas horarias fiscales:
  - Columbia Británica, Alberta, Manitoba, los Territorios del Noroeste y Cuba, desde el 1 de noviembre de 2026: una hora tarde;
  - Marruecos, desde el 20 de septiembre de 2026: una hora antes;
  - Moldavia, desde 2022: solo un momento entre las 03:00 y las 04:00 del último domingo de marzo (una hora antes) o de octubre (una hora tarde);
  - en un ordenador con datos de 2024 o anteriores, también Paraguay, del 23 de marzo al 5 de octubre de 2025 y del 22 de marzo al 4 de octubre de 2026: una hora tarde; con datos de 2023 o anteriores, también Kazajistán (la hora de Almaty y de Kostanái), desde el 1 de marzo de 2024: una hora antes; y con datos aún más antiguos faltan también los cambios de otros lugares.

  Una hora de diferencia puede llevar una transacción cercana a la medianoche a otro día: su fecha en el formulario 8949, su periodo de tenencia (una venta cerca de un año después de su compra podía aparecer a corto plazo en lugar de a largo plazo, o al revés) y, al final de un año, su año fiscal (el final de 2026; en Kazajistán, también el de 2024 y el de 2025). Un valor que BitcoinTX rellenó a partir del precio, o uno que la IA escribió a partir de su consulta de precio para esa hora, podía ser el de otra hora, y una ganancia podía cambiar donde la hora llevó una venta al otro lado de otra transacción. Una transacción que añadió la IA mantiene su hora: BitcoinTX la lee por sí mismo.
  - **Qué hacer:** actualiza el conector de IA (arriba). Si tu zona horaria fiscal es una de estas, pide a la IA que vuelva a fijar, tal como las diste al principio, cada hora que cambió desde esas fechas y cada fecha de adquisición (o de fallecimiento) que dio con una hora, y que vuelva a valorar cada valor en dólares que escribió a partir de su consulta de precio para esa hora. El conector actualizado guarda el momento correcto, y uno que ya era correcto se queda como está. Guíate por la hora que diste al principio, no por la pantalla: tu dispositivo muestra las horas con sus propios datos de zona horaria.

**Otras correcciones** (ninguna cifra cambia)

- Tras un cambio de contraseña, el siguiente clic en otro navegador lleva a la página de inicio de sesión, en lugar de mostrar errores de carga.
- Settings > Wallets, exchanges and banks muestra los nuevos saldos tras Delete All Transactions, sin volver a cargar.
- En un teléfono, la comisión de una transacción pasa entera a la línea siguiente en lugar de cortarse.
- El texto que da Settings > Connect an AI Assistant pide activar el acceso de IA solo mientras está desactivado.
- **Seguridad:** BitcoinTX incluye las últimas correcciones de seguridad del software sobre el que está construido.

**Problemas conocidos**

- De la 2.0.1: solo en un libro contable con una fila cuyo valor está vacío en la base de datos (vaciado a mano, o dejado por una versión antigua en un libro contable no recalculado desde entonces), un guardado puede necesitar un segundo intento, y un valor con fecha posterior a la última hora del historial de precios puede tomar el precio del día, marcado, en lugar del de la hora. Ledger Review muestra un valor así, y allí puedes aplicar el precio de la hora. Y BitcoinTX aún no puede cuadrar en el formulario 8949 un Form 1099-DA que incluya la comisión de red de una transferencia o de un regalo, o una comisión sin su retirada: el Complete Tax Report dice cómo corregirlo a mano.
- Encontrados desde entonces, cada uno puede hacer incorrecta una cifra; su corrección está prevista para la 2.0.3:
  - unos bitcoins adquiridos el 28 de febrero (de 2011, 2015, 2019, 2023 o 2027) y vendidos el 29 de febrero del año siguiente se declaran a largo plazo, pero son a corto plazo (la misma ganancia, en la parte I del formulario 8949, no en la parte II): hasta entonces, declara a mano una venta así a corto plazo;
  - la importación del conector de IA ordena por tipo las filas que comparten una hora (las que recibe solo con una fecha comparten todas el mediodía), mientras que una importación de archivo mantiene el orden del archivo, así que una venta y una transferencia de salida a la misma hora pueden usar otras monedas, y dar otra ganancia, según cómo se añadieron: hasta entonces, añade las filas que comparten una hora con una importación de archivo, o revisa qué monedas usó una venta así;
  - la importación CSV propia de BitcoinTX descarta, sin ningún error, todas las filas tras una celda cuyas comillas nunca se cierran: solo un archivo editado a mano, así que compara el número de filas de la vista previa con el de tu archivo;
  - la importación CSV propia de BitcoinTX, y la de River, leen una cantidad de bitcoin escrita "1,234" como 1234 BTC: revisa las cantidades de la vista previa si tu hoja de cálculo escribe los decimales con coma;
  - en un dispositivo cuyos datos de zona horaria son más antiguos que los de BitcoinTX, una hora escrita en el formulario de transacción, en los lugares y periodos de la corrección de arriba, puede guardarse con una hora de diferencia, y el dispositivo la muestra tal como se escribió. Mantén al día el sistema y el navegador del dispositivo. Cuando lo esté, abre cada una de esas transacciones y compara su hora con el recibo o el registro del que la copiaste. Si hay una hora de diferencia, vuelve a escribir la hora del recibo.

[Todo lo que trae la 2.0.2](${CHANGELOG})`,
    de_DE: `BitcoinTX 2.0.2 ist ein Wartungsupdate von 2.0.1 und braucht StartOS 0.4.1 oder neuer. Es behebt einen Fehler, der eine Steuerzahl falsch machen konnte, bei einer Uhrzeit, die deine KI-App geändert hat, für einige Orte, deren Uhrzeitregeln sich kürzlich geändert haben (unten, mit Angaben dazu, wen es betreffen kann und was zu tun ist), und vier kleinere Fehler.

**Vor dem Update**

- **Aktualisiere zuerst StartOS auf 0.4.1 oder neuer.** BitcoinTX 2.0.2 braucht es: Bis dahin lässt sich BitcoinTX nur bis 2.0.1 aktualisieren.
- **Du kommst von 1.x?** Lies zuerst [die Hinweise zu 2.0.0](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0). 2.0 ändert, wie dein Journal gespeichert wird, und StartOS kann das nicht von selbst rückgängig machen: Erstelle eine StartOS-Sicherung von BitcoinTX und bewahre sie auf, denn sie ist dein Weg zurück zu 1.x.
- **Du kommst von 1.x oder 2.0.0?** Lies auch [die Hinweise zu 2.0.1](https://github.com/DigiMonk73/BTCTX-MCP/blob/v2.0.1/docs/CHANGELOG.md): Die Zeitzonen-Korrektur von 2.0.1 für Manitoba, die Nordwest-Territorien und Kuba kann dich bitten, einige Uhrzeiten zu korrigieren.

**Nach dem Update**

- **Lade jede in einem Browser offen gebliebene Seite von BitcoinTX neu.**
- **Wenn du einen KI-Connector nutzt**, aktualisiere ihn: Ändere in der Konfiguration deiner KI-App die Version nach btctx-mcp== in 2.0.2, wie Settings > Connect an AI Assistant sie angibt, und starte die KI-App neu.
- Dann sieh dir die Korrektur unten an: Die meisten Journale brauchen nichts weiter.

**Eine Korrektur, die eine Zahl ändern kann**

- **Eine Uhrzeit, die deine KI-App geändert hat, an einem Ort, dessen Uhrzeitregeln sich kürzlich geändert haben.** Wenn die KI die Uhrzeit einer Transaktion änderte oder ein Erwerbsdatum mit einer Uhrzeit angab, berechnete der KI-Connector diesen Zeitpunkt mit den Zeitzonendaten des Computers, auf dem er läuft. Waren diese Daten älter als die von BitcoinTX, wurde die Uhrzeit um eine Stunde verschoben gespeichert, für diese Steuerzeitzonen:
  - British Columbia, Alberta, Manitoba, die Nordwest-Territorien und Kuba, ab dem 1. November 2026: eine Stunde zu spät;
  - Marokko, ab dem 20. September 2026: eine Stunde zu früh;
  - Moldau, seit 2022: nur eine Uhrzeit von 03:00 bis 04:00 am letzten Sonntag im März (eine Stunde zu früh) oder im Oktober (eine Stunde zu spät);
  - auf einem Computer mit Daten von 2024 oder älter auch Paraguay, vom 23. März bis 5. Oktober 2025 und vom 22. März bis 4. Oktober 2026: eine Stunde zu spät; mit Daten von 2023 oder älter auch Kasachstan (die Zeit von Almaty und Kostanai), ab dem 1. März 2024: eine Stunde zu früh; und noch ältere Daten kennen auch die Änderungen anderer Orte nicht.

  Eine Stunde Unterschied kann eine Transaktion nahe Mitternacht auf einen anderen Tag legen: ihr Datum auf Formular 8949, ihre Haltedauer (ein Verkauf etwa ein Jahr nach dem Kauf konnte als kurzfristig statt langfristig erscheinen oder umgekehrt) und an einem Jahresende ihr Steuerjahr (Ende 2026; in Kasachstan auch Ende 2024 und 2025). Ein Wert, den BitcoinTX aus dem Preis ausgefüllt hat, oder einer, den die KI aus ihrer Preisabfrage für eine solche Uhrzeit eingetragen hat, konnte der einer anderen Stunde sein, und ein Gewinn konnte sich ändern, wo die Stunde einen Verkauf auf die andere Seite einer anderen Transaktion verschob. Eine von der KI hinzugefügte Transaktion behält ihre Uhrzeit: BitcoinTX liest sie selbst.
  - **Was zu tun ist:** Aktualisiere den KI-Connector (oben). Ist deine Steuerzeitzone eine davon, bitte die KI, jede Uhrzeit, die sie ab den genannten Tagen geändert hat, und jedes Erwerbsdatum (oder Todesdatum), das sie mit einer Uhrzeit angegeben hat, noch einmal so zu setzen, wie du sie ursprünglich angegeben hast, und jeden Dollarwert, den sie aus ihrer Preisabfrage für eine solche Uhrzeit eingetragen hat, neu zu bewerten. Der aktualisierte Connector speichert den richtigen Zeitpunkt, und ein schon richtiger bleibt, wie er ist. Richte dich nach der Uhrzeit, die du ursprünglich angegeben hast, nicht nach dem Bildschirm: Dein Gerät zeigt Uhrzeiten mit seinen eigenen Zeitzonendaten.

**Weitere Korrekturen** (keine Zahl ändert sich)

- Nach einer Passwortänderung führt der nächste Klick in einem anderen Browser zur Anmeldeseite, statt Ladefehler zu zeigen.
- Settings > Wallets, exchanges and banks zeigt nach Delete All Transactions die neuen Salden, ohne Neuladen.
- Auf einem Telefon rückt die Gebühr einer Transaktion ganz in die nächste Zeile, statt abgeschnitten zu werden.
- Der Text von Settings > Connect an AI Assistant bittet nur dann darum, den KI-Zugriff einzuschalten, wenn er aus ist.
- **Sicherheit:** BitcoinTX enthält die neuesten Sicherheitskorrekturen der Software, auf der es aufbaut.

**Bekannte Probleme**

- Aus 2.0.1: Nur in einem Journal mit einer Zeile, deren Wert in der Datenbank leer ist (von Hand geleert oder von einer alten Version hinterlassen, in einem seither nicht neu berechneten Journal), kann ein Speichern einen zweiten Versuch brauchen, und ein Wert mit einem Datum nach der letzten Stunde der Preishistorie kann den Tagespreis nehmen, markiert, statt des Stundenpreises. Ledger Review listet einen solchen Wert auf, und dort kannst du den Stundenpreis anwenden. Und BitcoinTX kann ein Form 1099-DA, das die Netzwerkgebühr eines Transfers oder eines Geschenks oder eine Gebühr ohne ihre Auszahlung aufführt, auf Formular 8949 noch nicht abgleichen: Der Complete Tax Report sagt, wie man es von Hand korrigiert.
- Seitdem gefunden, jedes davon kann eine Zahl falsch machen; ihre Korrektur ist für 2.0.3 geplant:
  - Coins, die am 28. Februar (2011, 2015, 2019, 2023 oder 2027) erworben und am 29. Februar des nächsten Jahres verkauft wurden, werden als langfristig ausgewiesen, sind aber kurzfristig (derselbe Gewinn, in Teil I von Formular 8949, nicht in Teil II): Gib einen solchen Verkauf bis dahin von Hand als kurzfristig an;
  - der Import des KI-Connectors ordnet Zeilen mit derselben Uhrzeit nach Typ (Zeilen, die er nur mit einem Datum erhält, teilen sich alle die Mittagszeit), während ein Dateiimport die Reihenfolge der Datei beibehält, sodass ein Verkauf und ein Transfer nach außen zur selben Uhrzeit andere Coins nutzen und einen anderen Gewinn ergeben können, je nachdem, wie sie hinzugefügt wurden: Füge bis dahin Zeilen mit derselben Uhrzeit per Dateiimport hinzu, oder prüfe, welche Coins ein solcher Verkauf genutzt hat;
  - der eigene CSV-Import von BitcoinTX verwirft ohne Fehlermeldung jede Zeile nach einer Zelle, deren Anführungszeichen nie geschlossen wird: nur bei einer von Hand bearbeiteten Datei, also vergleiche die Zeilenzahl der Vorschau mit der deiner Datei;
  - der eigene CSV-Import von BitcoinTX und der von River lesen einen als "1,234" geschriebenen Bitcoin-Betrag als 1234 BTC: Prüfe die Beträge der Vorschau, wenn deine Tabellenkalkulation Dezimalstellen mit Komma schreibt;
  - auf einem Gerät, dessen Zeitzonendaten älter sind als die von BitcoinTX, kann eine im Transaktionsformular eingegebene Uhrzeit an den Orten und in den Zeiträumen der Korrektur oben um eine Stunde verschoben gespeichert werden, und das Gerät zeigt sie so an, wie sie eingegeben wurde. Halte System und Browser des Geräts aktuell. Sobald sie aktuell sind, öffne jede solche Transaktion und vergleiche ihre Uhrzeit mit dem Beleg oder der Aufzeichnung, aus der du sie abgetippt hast. Weicht sie um eine Stunde ab, gib die Uhrzeit des Belegs erneut ein.

[Alles in 2.0.2](${CHANGELOG})`,
    pl_PL: `BitcoinTX 2.0.2 to aktualizacja serwisowa wersji 2.0.1 i wymaga StartOS 0.4.1 lub nowszego. Poprawia jeden błąd, który mógł zafałszować wynik podatkowy, w godzinie zmienionej przez Twoją aplikację AI, dla kilku miejsc, których zasady czasu niedawno się zmieniły (poniżej, z tym, kogo może dotyczyć i co zrobić), oraz cztery mniejsze błędy.

**Przed aktualizacją**

- **Najpierw zaktualizuj StartOS do 0.4.1 lub nowszego.** BitcoinTX 2.0.2 go wymaga: do tego czasu BitcoinTX można zaktualizować najwyżej do 2.0.1.
- **Przechodzisz z 1.x?** Najpierw przeczytaj [informacje o 2.0.0](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0). Wersja 2.0 zmienia sposób zapisu Twojej księgi, a StartOS nie cofnie tego sam: zrób kopię zapasową BitcoinTX w StartOS i zachowaj ją, bo to Twoja droga powrotu do 1.x.
- **Przechodzisz z 1.x lub 2.0.0?** Przeczytaj też [informacje o 2.0.1](https://github.com/DigiMonk73/BTCTX-MCP/blob/v2.0.1/docs/CHANGELOG.md): jej poprawka stref czasowych, dla Manitoby, Terytoriów Północno-Zachodnich i Kuby, może poprosić Cię o poprawienie niektórych godzin.

**Po aktualizacji**

- **Odśwież każdą stronę BitcoinTX pozostawioną otwartą** w przeglądarce.
- **Jeśli używasz łącznika AI**, zaktualizuj go: w konfiguracji aplikacji AI zmień wersję po btctx-mcp== na 2.0.2, tak jak podaje ją Settings > Connect an AI Assistant, i uruchom aplikację AI ponownie.
- Potem przeczytaj poprawkę poniżej: większość ksiąg nie potrzebuje niczego więcej.

**Poprawka, która może zmienić wynik**

- **Godzina zmieniona przez Twoją aplikację AI, w miejscu, którego zasady czasu niedawno się zmieniły.** Gdy AI zmieniała godzinę transakcji albo podawała datę nabycia z godziną, łącznik AI wyliczał ten moment według danych stref czasowych komputera, na którym działa. Jeśli te dane były starsze niż dane BitcoinTX, godzina była zapisywana z przesunięciem o godzinę, w tych podatkowych strefach czasowych:
  - Kolumbia Brytyjska, Alberta, Manitoba, Terytoria Północno-Zachodnie i Kuba, od 1 listopada 2026 r.: o godzinę za późno;
  - Maroko, od 20 września 2026 r.: o godzinę za wcześnie;
  - Mołdawia, od 2022 r.: tylko moment od 03:00 do 04:00 w ostatnią niedzielę marca (o godzinę za wcześnie) lub października (o godzinę za późno);
  - na komputerze z danymi z 2024 r. lub starszymi także Paragwaj, od 23 marca do 5 października 2025 r. i od 22 marca do 4 października 2026 r.: o godzinę za późno; z danymi z 2023 r. lub starszymi także Kazachstan (czas Ałmaty i Kostanaju), od 1 marca 2024 r.: o godzinę za wcześnie; a jeszcze starszym danym brakuje też zmian w innych miejscach.

  Przesunięcie o godzinę może przenieść transakcję blisko północy na inny dzień: jej datę na formularzu 8949, okres posiadania (sprzedaż około roku po zakupie mogła zostać uznana za krótkoterminową zamiast długoterminowej lub odwrotnie) i, na koniec roku, rok podatkowy (koniec 2026 r.; w Kazachstanie także koniec 2024 i 2025 r.). Wartość, którą BitcoinTX uzupełnił z ceny, albo wartość wpisana przez AI na podstawie sprawdzonej przez nią ceny dla takiej godziny, mogła pochodzić z innej godziny, a zysk mógł się zmienić tam, gdzie godzina przesunęła sprzedaż na drugą stronę innej transakcji. Transakcja dodana przez AI zachowuje swoją godzinę: BitcoinTX odczytuje ją sam.
  - **Co zrobić:** zaktualizuj łącznik AI (powyżej). Jeśli Twoja podatkowa strefa czasowa jest jedną z tych, poproś AI, aby ponownie ustawiła, tak jak je pierwotnie podałeś, każdą godzinę, którą zmieniła od tych dat, i każdą datę nabycia (lub śmierci), którą podała z godziną, oraz aby ponownie wyceniła każdą wartość w dolarach wpisaną na podstawie sprawdzonej przez nią ceny dla takiej godziny. Zaktualizowany łącznik zapisuje właściwy moment, a moment już właściwy zostaje bez zmian. Kieruj się godziną, którą pierwotnie podałeś, a nie ekranem: Twoje urządzenie pokazuje godziny według własnych danych stref czasowych.

**Inne poprawki** (żaden wynik się nie zmienia)

- Po zmianie hasła następne kliknięcie w innej przeglądarce prowadzi do strony logowania, zamiast pokazywać błędy ładowania.
- Settings > Wallets, exchanges and banks pokazuje nowe salda po Delete All Transactions, bez odświeżania.
- Na telefonie opłata transakcji przechodzi w całości do następnej linii, zamiast być ucinana.
- Tekst z Settings > Connect an AI Assistant prosi o włączenie dostępu AI tylko wtedy, gdy jest wyłączony.
- **Bezpieczeństwo:** BitcoinTX zawiera najnowsze poprawki bezpieczeństwa oprogramowania, na którym jest zbudowany.

**Znane problemy**

- Z 2.0.1: tylko w księdze z wierszem, którego wartość jest pusta w bazie danych (wyczyszczona ręcznie albo pozostawiona przez starą wersję w księdze nieprzeliczanej od tamtej pory), zapis może wymagać drugiej próby, a wartość z datą późniejszą niż ostatnia godzina historii cen może wziąć cenę dnia, oznaczoną, zamiast ceny godziny. Ledger Review wymienia taką wartość i można tam zastosować cenę godziny. Ponadto BitcoinTX nie potrafi jeszcze dopasować na formularzu 8949 Form 1099-DA, który podaje opłatę sieciową transferu lub prezentu albo opłatę bez jej wypłaty: Complete Tax Report mówi, jak poprawić to ręcznie.
- Znalezione od tamtej pory, każdy z nich może zafałszować wynik; ich poprawka jest planowana w 2.0.3:
  - monety nabyte 28 lutego (2011, 2015, 2019, 2023 lub 2027 r.) i sprzedane 29 lutego następnego roku są wykazywane jako długoterminowe, a są krótkoterminowe (ten sam zysk, w części I formularza 8949, nie w części II): do tego czasu wykaż taką sprzedaż ręcznie jako krótkoterminową;
  - import łącznika AI porządkuje według typu wiersze o tej samej godzinie (wiersze podane mu tylko z datą mają wszystkie godzinę południa), podczas gdy import pliku zachowuje kolejność pliku, więc sprzedaż i transfer wychodzący o tej samej godzinie mogą użyć innych monet i dać inny zysk, zależnie od sposobu dodania: do tego czasu dodawaj wiersze o tej samej godzinie importem pliku albo sprawdź, których monet użyła taka sprzedaż;
  - własny import CSV BitcoinTX pomija bez żadnego błędu każdy wiersz po komórce, w której cudzysłów nigdy nie jest zamknięty: dotyczy to tylko pliku edytowanego ręcznie, więc porównaj liczbę wierszy w podglądzie z liczbą w swoim pliku;
  - własny import CSV BitcoinTX, a także import z River, odczytuje kwotę bitcoina zapisaną jako "1,234" jako 1234 BTC: sprawdź kwoty w podglądzie, jeśli Twój arkusz kalkulacyjny zapisuje ułamki dziesiętne przecinkiem;
  - na urządzeniu, którego dane stref czasowych są starsze niż dane BitcoinTX, godzina wpisana w formularzu transakcji, w miejscach i okresach z poprawki powyżej, może zostać zapisana z przesunięciem o godzinę, a urządzenie pokazuje ją tak, jak została wpisana. Aktualizuj system i przeglądarkę urządzenia. Gdy będą aktualne, otwórz każdą taką transakcję i porównaj jej godzinę z potwierdzeniem lub zapisem, z którego została przepisana. Jeśli różni się o godzinę, wpisz ponownie godzinę z potwierdzenia.

[Wszystko w 2.0.2](${CHANGELOG})`,
    fr_FR: `BitcoinTX 2.0.2 est une mise à jour de maintenance de la 2.0.1, et nécessite StartOS 0.4.1 ou plus récent. Elle corrige un bug qui pouvait fausser un chiffre fiscal, dans une heure modifiée par votre application d’IA, pour quelques lieux dont les règles horaires ont changé récemment (ci-dessous, avec qui peut être concerné et que faire), et quatre bugs mineurs.

**Avant la mise à jour**

- **Mettez d’abord StartOS à jour en 0.4.1 ou plus récent.** BitcoinTX 2.0.2 en a besoin : d’ici là, BitcoinTX ne peut se mettre à jour que jusqu’à la 2.0.1.
- **Vous venez de la 1.x ?** Lisez d’abord [les notes de la 2.0.0](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0). La 2.0 change la façon dont votre registre est enregistré, et StartOS ne peut pas l’annuler tout seul : faites une sauvegarde StartOS de BitcoinTX et gardez-la, car c’est votre chemin de retour vers la 1.x.
- **Vous venez de la 1.x ou de la 2.0.0 ?** Lisez aussi [les notes de la 2.0.1](https://github.com/DigiMonk73/BTCTX-MCP/blob/v2.0.1/docs/CHANGELOG.md) : sa correction des fuseaux horaires, pour le Manitoba, les Territoires du Nord-Ouest et Cuba, peut vous demander de corriger certaines heures.

**Après la mise à jour**

- **Rechargez toute page de BitcoinTX restée ouverte** dans un navigateur.
- **Si vous utilisez un connecteur IA**, mettez-le à jour : dans la configuration de votre application d’IA, remplacez la version qui suit btctx-mcp== par 2.0.2, comme l’indique Settings > Connect an AI Assistant, puis redémarrez l’application d’IA.
- Puis lisez la correction ci-dessous : la plupart des registres n’ont besoin de rien d’autre.

**Une correction qui peut changer un chiffre**

- **Une heure modifiée par votre application d’IA, dans un lieu dont les règles horaires ont changé récemment.** Quand l’IA modifiait l’heure d’une transaction, ou donnait une date d’acquisition avec une heure, le connecteur IA calculait ce moment avec les données de fuseaux horaires de l’ordinateur sur lequel il tourne. Si ces données étaient plus anciennes que celles de BitcoinTX, l’heure était enregistrée avec une heure d’écart, pour ces fuseaux horaires fiscaux :
  - la Colombie-Britannique, l’Alberta, le Manitoba, les Territoires du Nord-Ouest et Cuba, à partir du 1er novembre 2026 : une heure trop tard ;
  - le Maroc, à partir du 20 septembre 2026 : une heure trop tôt ;
  - la Moldavie, depuis 2022 : seulement un moment entre 03:00 et 04:00 le dernier dimanche de mars (une heure trop tôt) ou d’octobre (une heure trop tard) ;
  - sur un ordinateur dont les données datent de 2024 ou avant, aussi le Paraguay, du 23 mars au 5 octobre 2025 et du 22 mars au 4 octobre 2026 : une heure trop tard ; si elles datent de 2023 ou avant, aussi le Kazakhstan (l’heure d’Almaty et de Kostanaï), à partir du 1er mars 2024 : une heure trop tôt ; et des données plus anciennes encore ignorent aussi les changements d’autres lieux.

  Une heure d’écart peut faire passer une transaction proche de minuit à un autre jour : sa date sur le formulaire 8949, sa durée de détention (une vente environ un an après l’achat pouvait apparaître à court terme au lieu de long terme, ou l’inverse) et, en fin d’année, son année fiscale (fin 2026 ; au Kazakhstan, aussi fin 2024 et fin 2025). Une valeur que BitcoinTX a remplie à partir du prix, ou une valeur que l’IA a saisie d’après sa recherche de prix pour une telle heure, pouvait être celle d’une autre heure, et un gain pouvait changer là où l’heure faisait passer une vente de l’autre côté d’une autre transaction. Une transaction ajoutée par l’IA garde son heure : BitcoinTX la lit lui-même.
  - **Que faire :** mettez à jour le connecteur IA (ci-dessus). Si votre fuseau horaire fiscal est l’un de ceux-ci, demandez à l’IA de fixer à nouveau, telles que vous les aviez données, chaque heure qu’elle a modifiée depuis ces dates et chaque date d’acquisition (ou de décès) qu’elle a donnée avec une heure, et de réévaluer chaque valeur en dollars qu’elle a saisie d’après sa recherche de prix pour une telle heure. Le connecteur mis à jour enregistre le bon moment, et un moment déjà juste reste tel quel. Fiez-vous à l’heure que vous aviez donnée, pas à l’écran : votre appareil affiche les heures avec ses propres données de fuseaux horaires.

**Autres corrections** (aucun chiffre ne change)

- Après un changement de mot de passe, le clic suivant dans un autre navigateur mène à la page de connexion, au lieu d’afficher des erreurs de chargement.
- Settings > Wallets, exchanges and banks affiche les nouveaux soldes après Delete All Transactions, sans rechargement.
- Sur un téléphone, les frais d’une transaction passent entiers à la ligne suivante au lieu d’être coupés.
- Le texte donné par Settings > Connect an AI Assistant demande d’activer l’accès IA seulement tant qu’il est désactivé.
- **Sécurité :** BitcoinTX inclut les derniers correctifs de sécurité des logiciels sur lesquels il repose.

**Problèmes connus**

- De la 2.0.1 : uniquement dans un registre avec une ligne dont la valeur est vide dans la base de données (vidée à la main, ou laissée par une ancienne version dans un registre non recalculé depuis), un enregistrement peut demander un second essai, et une valeur datée après la dernière heure de l’historique des prix peut prendre le prix du jour, marqué, au lieu de celui de l’heure. Ledger Review liste une telle valeur, et vous pouvez y appliquer le prix de l’heure. Et BitcoinTX ne peut pas encore rapprocher sur le formulaire 8949 un Form 1099-DA qui indique les frais de réseau d’un transfert ou d’un don, ou des frais sans leur retrait : le Complete Tax Report dit comment le corriger à la main.
- Trouvés depuis, chacun peut fausser un chiffre ; leur correction est prévue pour la 2.0.3 :
  - des bitcoins acquis le 28 février (de 2011, 2015, 2019, 2023 ou 2027) et vendus le 29 février de l’année suivante sont déclarés à long terme, mais ils sont à court terme (le même gain, en partie I du formulaire 8949, pas en partie II) : d’ici là, déclarez une telle vente à court terme à la main ;
  - l’import du connecteur IA ordonne par type les lignes qui partagent une heure (celles qu’il reçoit avec une date seule sont toutes à midi), alors qu’un import de fichier garde l’ordre du fichier : une vente et un transfert sortant à la même heure peuvent donc utiliser d’autres bitcoins, et donner un autre gain, selon la façon dont ils ont été ajoutés : d’ici là, ajoutez les lignes qui partagent une heure par un import de fichier, ou vérifiez quels bitcoins une telle vente a utilisés ;
  - l’import CSV propre à BitcoinTX écarte, sans aucune erreur, chaque ligne après une cellule dont les guillemets ne sont jamais fermés : seulement un fichier modifié à la main, comparez donc le nombre de lignes de l’aperçu avec celui de votre fichier ;
  - l’import CSV propre à BitcoinTX, et celui de River, lisent un montant en bitcoin écrit "1,234" comme 1234 BTC : vérifiez les montants de l’aperçu si votre tableur écrit les décimales avec une virgule ;
  - sur un appareil dont les données de fuseaux horaires sont plus anciennes que celles de BitcoinTX, une heure saisie dans le formulaire de transaction, dans les lieux et périodes de la correction ci-dessus, peut être enregistrée avec une heure d’écart, et l’appareil la réaffiche telle que saisie. Tenez à jour le système et le navigateur de l’appareil. Une fois l’appareil à jour, ouvrez chacune de ces transactions et comparez son heure avec le reçu ou le relevé dont vous l’avez recopiée. S’il y a une heure d’écart, saisissez de nouveau l’heure du reçu.

[Tout ce que contient la 2.0.2](${CHANGELOG})`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
