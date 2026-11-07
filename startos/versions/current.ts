import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG =
  'https://github.com/DigiMonk73/BTCTX-MCP/blob/v2.0.1/docs/CHANGELOG.md'

/**
 * 2.0.1:0, the first maintenance update of 2.0. 2.0.0:0's migration was empty,
 * so it is bumped in place (Start9's versions.md), with no migration of its
 * own. The notes cover everything since 2.0.0:0, which the community registry
 * serves: what to do after updating, the tax-figures fix with who could be
 * affected and what to do, the other changes and the known issues.
 */
export const current = VersionInfo.of({
  version: '2.0.1:0',
  releaseNotes: {
    en_US: `BitcoinTX 2.0.1 is a maintenance update of 2.0.0. It fixes one bug that could make a tax figure wrong, for the tax timezones of Manitoba, the Northwest Territories and Cuba from 1 November 2026 (below, with who could be affected and what to do), and adds a page to the Complete Tax Report for when a Form 1099-DA differs from BitcoinTX.

**Before you update**

- **Coming from 1.x?** Read [2.0.0's notes](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0) first. 2.0 changes how your ledger is stored, and StartOS can't undo it by itself: make a StartOS backup of BitcoinTX and keep it, as it's your way back to 1.x.

**What to do after updating**

- **Reload any BitcoinTX page left open** in a browser.
- **If you use an AI connector**, update it: in your AI app's configuration, change the version after btctx-mcp== to 2.0.1, then restart the AI app.
- Then see the fix below: most ledgers need nothing more.

**A fix that can change a figure**

- **Manitoba's, the Northwest Territories' and Cuba's time from 1 November 2026** (a tax-figures fix, #889). From that day those places stay on summer time, but BitcoinTX on StartOS still turned their clocks back an hour. It concerns the tax timezones America/Winnipeg, America/Rainy_River, America/Inuvik, America/Havana and Cuba, and an exchange file read in one of them, for transactions from 1 November 2026, in every version up to 2.0.0. Every other timezone gives the same dates as before.
  - With one of them as your tax timezone, a transaction in the first hour after midnight was given the previous day's date: on Form 8949, in its holding period (a sale one day past a year could show as short-term) and, at the year's end, in its tax year. That's fixed by itself, the holding period once the ledger is recalculated.
  - A transaction imported from a file, or added by the AI connector, with a time but no timezone, read in one of those zones, was saved an hour late: it shows an hour after the time written (a time written in the last hour before midnight, on the next day), a value BitcoinTX filled in from the price (income, a fee, a spend's proceeds) used the hour after, and importing the same file again proposes it again.
  - **What to do:** correct the time of each such imported or AI-added transaction, an hour earlier (a value BitcoinTX filled in from the price is then priced again, at the right hour; a value you typed stays), leave those rows out if you import their file again, then run Recalculate Ledger once.
- **A tax timezone saved before 1.2.9 as localtime** now counts as none chosen, and BitcoinTX uses UTC. **What to do:** if yours was localtime, choose yours in Settings > Account, which recalculates.

**Other changes** (no figure changes)

- **If your Form 1099-DA differs:** in a year with a sale in box G, H, J or K, the Complete Tax Report has a new page at the end of "Using these forms": what to compare, and how the IRS asks you to correct Form 8949 by hand (BitcoinTX's printed forms can't be edited). It also says how to move a network fee's row if your form lists one. The service's Instructions say the same.
- **Schedule D:** "Using these forms" now says the Schedule D lines BitcoinTX fills hold your bitcoin only: if you also sold stocks, have your preparer or tax software make Schedule D from all your Forms 8949.

**Known issues**

- Only on a ledger holding a row whose value is blank in the database, which in practice means blanked by hand, or left by an old version in a ledger not recalculated since (a new row can't be saved blank): the question before an earlier tax year's figures move, or the form's list of the coins a transaction moves, looks up that row's price and loses the answer. A save can need a second try. If the row is dated after the price history's last hour, it or another value priced in the next 10 minutes can take the day's price, marked, instead of the hour's (#824, #849). Ledger Review lists a saved value like that, and you can apply the hour's price there.
- A known limitation: BitcoinTX can't yet match a Form 1099-DA that lists a transfer's or a gift's network fee, or a fee without its withdrawal, on Form 8949; the new page says how to correct it by hand (#551).

[Everything in 2.0.1](${CHANGELOG})`,
    es_ES: `BitcoinTX 2.0.1 es una actualización de mantenimiento de la 2.0.0. Corrige un error que podía hacer incorrecta una cifra fiscal, en las zonas horarias fiscales de Manitoba, los Territorios del Noroeste y Cuba a partir del 1 de noviembre de 2026 (abajo, con a quién puede afectar y qué hacer), y añade al Complete Tax Report una página para cuando un Form 1099-DA no coincide con BitcoinTX.

**Antes de actualizar**

- **¿Vienes de la 1.x?** Lee antes [las notas de la 2.0.0](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0). La 2.0 cambia cómo se guarda tu libro contable, y StartOS no puede deshacerlo por sí solo: haz una copia de seguridad de BitcoinTX en StartOS y guárdala, porque es tu forma de volver a la 1.x.

**Después de actualizar**

- **Vuelve a cargar cualquier página de BitcoinTX que haya quedado abierta** en un navegador.
- **Si usas un conector de IA**, actualízalo: en la configuración de tu aplicación de IA, cambia la versión que sigue a btctx-mcp== por 2.0.1 y reinicia la aplicación de IA.
- Después mira la corrección de abajo: la mayoría de los libros contables no necesitan nada más.

**Una corrección que puede cambiar una cifra**

- **La hora de Manitoba, los Territorios del Noroeste y Cuba a partir del 1 de noviembre de 2026** (una corrección de cifras fiscales, #889). Desde ese día esos lugares se quedan en el horario de verano, pero BitcoinTX en StartOS aún retrasaba sus relojes una hora. Afecta a las zonas horarias fiscales America/Winnipeg, America/Rainy_River, America/Inuvik, America/Havana y Cuba, y a un archivo de exchange leído en una de ellas, para transacciones desde el 1 de noviembre de 2026, en todas las versiones hasta la 2.0.0. Todas las demás zonas horarias dan las mismas fechas que antes.
  - Con una de ellas como zona horaria fiscal, una transacción en la primera hora después de la medianoche recibía la fecha del día anterior: en el formulario 8949, en su periodo de tenencia (una venta un día después de cumplir un año podía aparecer como de corto plazo) y, al final del año, en su año fiscal. Eso se corrige solo; el periodo de tenencia, una vez recalculado el libro contable.
  - Una transacción importada de un archivo, o añadida por el conector de IA, con una hora pero sin zona horaria, leída en una de esas zonas, se guardaba una hora tarde: aparece una hora después de la hora escrita (una hora escrita en la última hora antes de la medianoche, al día siguiente), un valor que BitcoinTX rellenó a partir del precio (un ingreso, una comisión, el importe recibido de un gasto) usaba la hora siguiente, y al importar de nuevo el mismo archivo se vuelve a proponer.
  - **Qué hacer:** corrige la hora de cada transacción así importada o añadida por la IA, una hora antes (un valor que BitcoinTX rellenó a partir del precio se calcula entonces de nuevo, a la hora correcta; un valor que escribiste se mantiene), deja fuera esas filas si vuelves a importar su archivo, y después ejecuta Recalculate Ledger una vez.
- **Una zona horaria fiscal guardada antes de la 1.2.9 como localtime** cuenta ahora como no elegida, y BitcoinTX usa UTC. **Qué hacer:** si la tuya era localtime, elige la tuya en Settings > Account, lo que vuelve a calcular el libro contable.

**Otros cambios** (ninguna cifra cambia)

- **Si tu Form 1099-DA no coincide:** en un año con una venta en la casilla G, H, J o K, el Complete Tax Report tiene una página nueva al final de "Using these forms": qué comparar y cómo pide el IRS corregir a mano el formulario 8949 (los formularios impresos de BitcoinTX no se pueden editar). También dice cómo mover la fila de una comisión de red si tu formulario la incluye. Las instrucciones del servicio dicen lo mismo.
- **Schedule D:** "Using these forms" dice ahora que las líneas del Schedule D que rellena BitcoinTX contienen solo tu bitcoin: si también vendiste acciones, pide a tu asesor o a tu programa de impuestos que haga el Schedule D con todos tus formularios 8949.

**Problemas conocidos**

- Solo en un libro contable con una fila cuyo valor está vacío en la base de datos, lo que en la práctica significa vaciado a mano, o dejado por una versión antigua en un libro contable no recalculado desde entonces (una fila nueva no puede guardarse vacía): la pregunta antes de que cambien las cifras de un año fiscal anterior, o la lista del formulario de las monedas que mueve una transacción, busca el precio de esa fila y pierde la respuesta. Un guardado puede necesitar un segundo intento. Si la fila tiene fecha posterior a la última hora del historial de precios, ella u otro valor calculado en los 10 minutos siguientes puede tomar el precio del día, marcado, en lugar del de la hora (#824, #849). Ledger Review muestra un valor guardado así, y allí puedes aplicar el precio de la hora.
- Una limitación conocida: BitcoinTX aún no puede cuadrar en el formulario 8949 un Form 1099-DA que incluya la comisión de red de una transferencia o de un regalo, o una comisión sin su retirada; la página nueva dice cómo corregirlo a mano (#551).

[Todo lo que trae la 2.0.1](${CHANGELOG})`,
    de_DE: `BitcoinTX 2.0.1 ist ein Wartungsupdate von 2.0.0. Es behebt einen Fehler, der eine Steuerzahl falsch machen konnte, für die Steuerzeitzonen von Manitoba, den Nordwest-Territorien und Kuba ab dem 1. November 2026 (unten, mit Angaben dazu, wen es betreffen kann und was zu tun ist), und fügt dem Complete Tax Report eine Seite für den Fall hinzu, dass ein Form 1099-DA von BitcoinTX abweicht.

**Vor dem Update**

- **Du kommst von 1.x?** Lies zuerst [die Hinweise zu 2.0.0](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0). 2.0 ändert, wie dein Journal gespeichert wird, und StartOS kann das nicht von selbst rückgängig machen: Erstelle eine StartOS-Sicherung von BitcoinTX und bewahre sie auf, denn sie ist dein Weg zurück zu 1.x.

**Nach dem Update**

- **Lade jede in einem Browser offen gebliebene Seite von BitcoinTX neu.**
- **Wenn du einen KI-Connector nutzt**, aktualisiere ihn: Ändere in der Konfiguration deiner KI-App die Version nach btctx-mcp== in 2.0.1 und starte die KI-App neu.
- Dann sieh dir die Korrektur unten an: Die meisten Journale brauchen nichts weiter.

**Eine Korrektur, die eine Zahl ändern kann**

- **Die Uhrzeit von Manitoba, den Nordwest-Territorien und Kuba ab dem 1. November 2026** (eine Korrektur von Steuerzahlen, #889). Ab diesem Tag bleiben diese Orte bei der Sommerzeit, aber BitcoinTX auf StartOS stellte ihre Uhren noch eine Stunde zurück. Es betrifft die Steuerzeitzonen America/Winnipeg, America/Rainy_River, America/Inuvik, America/Havana und Cuba sowie eine Börsendatei, die in einer davon gelesen wird, für Transaktionen ab dem 1. November 2026, in jeder Version bis 2.0.0. Jede andere Zeitzone ergibt dieselben Daten wie bisher.
  - Mit einer davon als Steuerzeitzone bekam eine Transaktion in der ersten Stunde nach Mitternacht das Datum des Vortags: auf Formular 8949, in ihrer Haltedauer (ein Verkauf einen Tag nach Ablauf eines Jahres konnte als kurzfristig erscheinen) und am Jahresende in ihrem Steuerjahr. Das ist von selbst behoben, die Haltedauer nach einer Neuberechnung des Journals.
  - Eine aus einer Datei importierte oder vom KI-Connector hinzugefügte Transaktion mit einer Uhrzeit, aber ohne Zeitzone, in einer dieser Zonen gelesen, wurde eine Stunde zu spät gespeichert: Sie wird eine Stunde nach der geschriebenen Uhrzeit angezeigt (in der letzten Stunde vor Mitternacht geschrieben: am nächsten Tag), ein Wert, den BitcoinTX aus dem Preis ausgefüllt hat (Einkünfte, eine Gebühr, der Erlös einer Ausgabe), nahm die Stunde danach, und ein erneuter Import derselben Datei schlägt sie wieder vor.
  - **Was zu tun ist:** Stelle die Uhrzeit jeder solchen importierten oder von der KI hinzugefügten Transaktion eine Stunde früher (ein Wert, den BitcoinTX aus dem Preis ausgefüllt hat, wird dann zur richtigen Stunde neu bewertet; ein von dir getippter Wert bleibt), lass diese Zeilen weg, wenn du ihre Datei erneut importierst, und führe dann einmal Recalculate Ledger aus.
- **Eine vor 1.2.9 als localtime gespeicherte Steuerzeitzone** gilt jetzt als nicht gewählt, und BitcoinTX verwendet UTC. **Was zu tun ist:** Wenn deine localtime war, wähle deine in Settings > Account, was eine Neuberechnung auslöst.

**Weitere Änderungen** (keine Zahl ändert sich)

- **Wenn dein Form 1099-DA abweicht:** In einem Jahr mit einem Verkauf in Feld G, H, J oder K hat der Complete Tax Report am Ende von "Using these forms" eine neue Seite: was zu vergleichen ist und wie der IRS verlangt, Formular 8949 von Hand zu korrigieren (die gedruckten Formulare von BitcoinTX lassen sich nicht bearbeiten). Sie sagt auch, wie man die Zeile einer Netzwerkgebühr verschiebt, wenn dein Formular sie aufführt. Die Anleitung des Dienstes sagt dasselbe.
- **Schedule D:** "Using these forms" sagt jetzt, dass die Zeilen von Schedule D, die BitcoinTX ausfüllt, nur deine Bitcoin enthalten: Wenn du auch Aktien verkauft hast, lass deinen Steuerberater oder deine Steuersoftware Schedule D aus all deinen Formularen 8949 erstellen.

**Bekannte Probleme**

- Nur in einem Journal mit einer Zeile, deren Wert in der Datenbank leer ist, was in der Praxis heißt: von Hand geleert oder von einer alten Version hinterlassen, in einem seither nicht neu berechneten Journal (eine neue Zeile kann nicht leer gespeichert werden): Die Frage, bevor sich die Zahlen eines früheren Steuerjahres verschieben, oder die Liste des Formulars mit den Coins, die eine Transaktion bewegt, sucht den Preis dieser Zeile und verliert die Antwort. Ein Speichern kann einen zweiten Versuch brauchen. Liegt das Datum der Zeile nach der letzten Stunde der Preishistorie, kann sie oder ein anderer in den nächsten 10 Minuten bewerteter Wert den Tagespreis nehmen, markiert, statt des Stundenpreises (#824, #849). Ledger Review listet einen so gespeicherten Wert auf, und dort kannst du den Stundenpreis anwenden.
- Eine bekannte Einschränkung: BitcoinTX kann ein Form 1099-DA, das die Netzwerkgebühr eines Transfers oder eines Geschenks oder eine Gebühr ohne ihre Auszahlung aufführt, auf Formular 8949 noch nicht abgleichen; die neue Seite sagt, wie man es von Hand korrigiert (#551).

[Alles in 2.0.1](${CHANGELOG})`,
    pl_PL: `BitcoinTX 2.0.1 to aktualizacja serwisowa wersji 2.0.0. Poprawia jeden błąd, który mógł zafałszować wynik podatkowy, w podatkowych strefach czasowych Manitoby, Terytoriów Północno-Zachodnich i Kuby od 1 listopada 2026 r. (poniżej, z tym, kogo może dotyczyć i co zrobić), i dodaje do Complete Tax Report stronę na wypadek, gdy Form 1099-DA różni się od BitcoinTX.

**Przed aktualizacją**

- **Przechodzisz z 1.x?** Najpierw przeczytaj [informacje o 2.0.0](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0). Wersja 2.0 zmienia sposób zapisu Twojej księgi, a StartOS nie cofnie tego sam: zrób kopię zapasową BitcoinTX w StartOS i zachowaj ją, bo to Twoja droga powrotu do 1.x.

**Po aktualizacji**

- **Odśwież każdą stronę BitcoinTX pozostawioną otwartą** w przeglądarce.
- **Jeśli używasz łącznika AI**, zaktualizuj go: w konfiguracji aplikacji AI zmień wersję po btctx-mcp== na 2.0.1 i uruchom aplikację AI ponownie.
- Potem przeczytaj poprawkę poniżej: większość ksiąg nie potrzebuje niczego więcej.

**Poprawka, która może zmienić wynik**

- **Czas Manitoby, Terytoriów Północno-Zachodnich i Kuby od 1 listopada 2026 r.** (poprawka wyników podatkowych, #889). Od tego dnia te miejsca zostają przy czasie letnim, ale BitcoinTX na StartOS nadal cofał ich zegary o godzinę. Dotyczy to podatkowych stref czasowych America/Winnipeg, America/Rainy_River, America/Inuvik, America/Havana i Cuba oraz pliku giełdy odczytanego w jednej z nich, dla transakcji od 1 listopada 2026 r., we wszystkich wersjach do 2.0.0. Każda inna strefa czasowa daje te same daty co wcześniej.
  - Gdy jedna z nich jest Twoją podatkową strefą czasową, transakcja w pierwszej godzinie po północy dostawała datę poprzedniego dnia: na formularzu 8949, w okresie posiadania (sprzedaż dzień po upływie roku mogła wyglądać na krótkoterminową) i, na koniec roku, w roku podatkowym. To poprawia się samo; okres posiadania po przeliczeniu księgi.
  - Transakcja zaimportowana z pliku albo dodana przez łącznik AI, z godziną, ale bez strefy czasowej, odczytana w jednej z tych stref, była zapisywana o godzinę za późno: pokazuje się godzinę po podanej godzinie (podana w ostatniej godzinie przed północą: następnego dnia), wartość, którą BitcoinTX uzupełnił z ceny (dochód, opłata, przychód z wydatku), brała następną godzinę, a ponowny import tego samego pliku proponuje ją znowu.
  - **Co zrobić:** popraw godzinę każdej takiej transakcji zaimportowanej lub dodanej przez AI na godzinę wcześniej (wartość, którą BitcoinTX uzupełnił z ceny, jest wtedy wyceniana na nowo, o właściwej godzinie; wartość wpisana przez Ciebie zostaje), pomiń te wiersze, jeśli znowu importujesz ich plik, a potem raz uruchom Recalculate Ledger.
- **Podatkowa strefa czasowa zapisana przed 1.2.9 jako localtime** liczy się teraz jako niewybrana, a BitcoinTX używa UTC. **Co zrobić:** jeśli Twoja była localtime, wybierz swoją w Settings > Account, co przelicza księgę.

**Inne zmiany** (żaden wynik się nie zmienia)

- **Jeśli Twój Form 1099-DA się różni:** w roku ze sprzedażą w polu G, H, J lub K Complete Tax Report ma nową stronę na końcu "Using these forms": co porównać i jak IRS prosi o ręczną poprawkę formularza 8949 (drukowanych formularzy BitcoinTX nie można edytować). Mówi też, jak przenieść wiersz opłaty sieciowej, jeśli Twój formularz ją podaje. Instrukcje usługi mówią to samo.
- **Schedule D:** "Using these forms" mówi teraz, że wiersze Schedule D wypełniane przez BitcoinTX zawierają tylko Twój bitcoin: jeśli sprzedawałeś też akcje, niech doradca podatkowy lub program podatkowy sporządzi Schedule D ze wszystkich Twoich formularzy 8949.

**Znane problemy**

- Tylko w księdze z wierszem, którego wartość jest pusta w bazie danych, co w praktyce oznacza wyczyszczenie ręczne albo pozostałość po starej wersji w księdze nieprzeliczanej od tamtej pory (nowego wiersza nie można zapisać pustego): pytanie, zanim zmienią się wyniki wcześniejszego roku podatkowego, albo lista monet przenoszonych przez transakcję w formularzu, szuka ceny tego wiersza i gubi odpowiedź. Zapis może wymagać drugiej próby. Jeśli data wiersza jest późniejsza niż ostatnia godzina historii cen, on lub inna wartość wyceniona w ciągu następnych 10 minut może wziąć cenę dnia, oznaczoną, zamiast ceny godziny (#824, #849). Ledger Review wymienia tak zapisaną wartość i można tam zastosować cenę godziny.
- Znane ograniczenie: BitcoinTX nie potrafi jeszcze dopasować na formularzu 8949 Form 1099-DA, który podaje opłatę sieciową transferu lub prezentu albo opłatę bez jej wypłaty; nowa strona mówi, jak poprawić to ręcznie (#551).

[Wszystko w 2.0.1](${CHANGELOG})`,
    fr_FR: `BitcoinTX 2.0.1 est une mise à jour de maintenance de la 2.0.0. Elle corrige un bug qui pouvait fausser un chiffre fiscal, pour les fuseaux horaires fiscaux du Manitoba, des Territoires du Nord-Ouest et de Cuba à partir du 1er novembre 2026 (ci-dessous, avec qui peut être concerné et que faire), et ajoute au Complete Tax Report une page pour le cas où un Form 1099-DA diffère de BitcoinTX.

**Avant la mise à jour**

- **Vous venez de la 1.x ?** Lisez d’abord [les notes de la 2.0.0](https://github.com/DigiMonk73/BTCTX-MCP/releases/tag/v2.0.0). La 2.0 change la façon dont votre registre est enregistré, et StartOS ne peut pas l’annuler tout seul : faites une sauvegarde StartOS de BitcoinTX et gardez-la, car c’est votre chemin de retour vers la 1.x.

**Après la mise à jour**

- **Rechargez toute page de BitcoinTX restée ouverte** dans un navigateur.
- **Si vous utilisez un connecteur IA**, mettez-le à jour : dans la configuration de votre application d’IA, remplacez la version qui suit btctx-mcp== par 2.0.1, puis redémarrez l’application d’IA.
- Puis lisez la correction ci-dessous : la plupart des registres n’ont besoin de rien d’autre.

**Une correction qui peut changer un chiffre**

- **L’heure du Manitoba, des Territoires du Nord-Ouest et de Cuba à partir du 1er novembre 2026** (une correction de chiffres fiscaux, #889). Depuis ce jour, ces lieux restent à l’heure d’été, mais BitcoinTX sur StartOS reculait encore leurs horloges d’une heure. Cela concerne les fuseaux horaires fiscaux America/Winnipeg, America/Rainy_River, America/Inuvik, America/Havana et Cuba, ainsi qu’un fichier de plateforme lu dans l’un d’eux, pour les transactions à partir du 1er novembre 2026, dans toutes les versions jusqu’à la 2.0.0. Tous les autres fuseaux horaires donnent les mêmes dates qu’avant.
  - Avec l’un d’eux comme fuseau horaire fiscal, une transaction dans la première heure après minuit recevait la date de la veille : sur le formulaire 8949, dans sa durée de détention (une vente un jour après un an pouvait apparaître à court terme) et, en fin d’année, dans son année fiscale. Cela se corrige tout seul ; la durée de détention une fois le registre recalculé.
  - Une transaction importée d’un fichier, ou ajoutée par le connecteur IA, avec une heure mais sans fuseau horaire, lue dans l’un de ces fuseaux, était enregistrée une heure trop tard : elle apparaît une heure après l’heure écrite (une heure écrite dans la dernière heure avant minuit : le lendemain), une valeur que BitcoinTX a remplie à partir du prix (un revenu, des frais, le produit d’une dépense) prenait l’heure suivante, et réimporter le même fichier la propose de nouveau.
  - **Que faire :** corrigez l’heure de chaque transaction ainsi importée ou ajoutée par l’IA, une heure plus tôt (une valeur que BitcoinTX a remplie à partir du prix est alors réévaluée, à la bonne heure ; une valeur que vous avez saisie reste), laissez ces lignes de côté si vous réimportez leur fichier, puis lancez Recalculate Ledger une fois.
- **Un fuseau horaire fiscal enregistré avant la 1.2.9 comme localtime** compte désormais comme non choisi, et BitcoinTX utilise UTC. **Que faire :** si le vôtre était localtime, choisissez le vôtre dans Settings > Account, ce qui relance le calcul.

**Autres changements** (aucun chiffre ne change)

- **Si votre Form 1099-DA diffère :** dans une année avec une vente en case G, H, J ou K, le Complete Tax Report a une nouvelle page à la fin de "Using these forms" : quoi comparer et comment l’IRS demande de corriger le formulaire 8949 à la main (les formulaires imprimés de BitcoinTX ne se modifient pas). Elle dit aussi comment déplacer la ligne de frais de réseau si votre formulaire en indique. Les instructions du service disent la même chose.
- **Schedule D :** "Using these forms" dit désormais que les lignes du Schedule D que BitcoinTX remplit ne contiennent que vos bitcoins : si vous avez aussi vendu des actions, faites établir le Schedule D par votre préparateur ou votre logiciel fiscal à partir de tous vos formulaires 8949.

**Problèmes connus**

- Uniquement dans un registre avec une ligne dont la valeur est vide dans la base de données, ce qui revient en pratique à une valeur vidée à la main, ou laissée par une ancienne version dans un registre non recalculé depuis (une nouvelle ligne ne peut pas être enregistrée vide) : la question avant que les chiffres d’une année fiscale antérieure ne bougent, ou la liste du formulaire des bitcoins qu’une transaction déplace, cherche le prix de cette ligne et perd la réponse. Un enregistrement peut demander un second essai. Si la ligne est datée après la dernière heure de l’historique des prix, elle ou une autre valeur évaluée dans les 10 minutes suivantes peut prendre le prix du jour, marqué, au lieu de celui de l’heure (#824, #849). Ledger Review liste une valeur ainsi enregistrée, et vous pouvez y appliquer le prix de l’heure.
- Une limite connue : BitcoinTX ne peut pas encore rapprocher sur le formulaire 8949 un Form 1099-DA qui indique les frais de réseau d’un transfert ou d’un don, ou des frais sans leur retrait ; la nouvelle page dit comment le corriger à la main (#551).

[Tout ce que contient la 2.0.1](${CHANGELOG})`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
