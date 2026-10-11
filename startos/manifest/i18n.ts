// The listing is translated; BitcoinTX itself is English-only and produces US
// (IRS) tax forms, which each long description says.
export const short = {
  en_US:
    'Bitcoin tax tracker for one wallet and one exchange, optional AI-assisted entry',
  es_ES:
    'Impuestos de Bitcoin para un monedero y un exchange, registro opcional con IA',
  de_DE:
    'Bitcoin-Steuer-Tracker für eine Wallet und eine Börse, optional mit KI-Erfassung',
  pl_PL:
    'Podatki od Bitcoina: jeden portfel i jedna giełda, opcjonalne wprowadzanie z AI',
  fr_FR:
    'Suivi fiscal Bitcoin pour un portefeuille et une plateforme, saisie IA en option',
}

export const long = {
  en_US:
    'BitcoinTX is a minimalist Bitcoin tax tracker for one self-custody wallet and one exchange account. Since 2025, IRS rules require cost basis to be figured wallet by wallet and account by account, so if you use several wallets or exchange accounts, its gains can differ from what the rules give. It keeps double-entry books with per-account FIFO cost basis and fills IRS Form 8949 and Schedule D, including the Form 1099-DA boxes. Connect an AI assistant over MCP to enter transactions from pasted exchange emails, wallet history or plain English, with a preview before anything is saved. The AI assistant is optional; BitcoinTX sends your ledger nowhere, and a local model keeps AI entry on your own hardware too (a cloud AI sends what it reads to its provider). Prices can come from your own mempool server, and nothing is contacted until you choose. The app is in English and produces US (IRS) tax forms. BitcoinTX is software, not tax, legal or financial advice. It works from the records you enter: check its figures with a tax professional before you file.',
  es_ES:
    'BitcoinTX es una herramienta fiscal minimalista de Bitcoin para un monedero de autocustodia y una cuenta en un exchange. Desde 2025, las normas del IRS exigen calcular el coste base monedero por monedero y cuenta por cuenta, así que si usas varios monederos o cuentas de exchange, las ganancias que calcula pueden diferir de lo que dan las normas. Lleva la contabilidad por partida doble, con coste base FIFO por cuenta, y rellena el formulario 8949 y el Schedule D del IRS, incluidas las casillas del formulario 1099-DA. Puedes conectar un asistente de IA mediante MCP para registrar transacciones a partir de correos de exchanges que pegues, historiales de monederos o texto libre, con una vista previa antes de guardar nada. El asistente es opcional: BitcoinTX no envía tu libro contable a ninguna parte, y un modelo local mantiene también el registro por IA en tu propio hardware (una IA en la nube envía lo que lee a su proveedor). Los precios pueden venir de tu propio servidor mempool, y no se contacta nada hasta que elijas. La aplicación está en inglés y genera formularios fiscales de EE. UU. (IRS). BitcoinTX es software, no asesoramiento fiscal, legal ni financiero. Trabaja con los registros que introduces: revisa sus cifras con un profesional fiscal antes de presentar tu declaración.',
  de_DE:
    'BitcoinTX ist ein minimalistischer Bitcoin-Steuer-Tracker für eine Self-Custody-Wallet und ein Börsenkonto. Seit 2025 verlangen die IRS-Regeln, die Anschaffungskosten Wallet für Wallet und Konto für Konto zu ermitteln; wenn du mehrere Wallets oder Börsenkonten nutzt, können die berechneten Gewinne daher von dem abweichen, was die Regeln ergeben. Es nutzt doppelte Buchführung mit FIFO-Anschaffungskosten pro Konto und füllt IRS-Formular 8949 und Schedule D aus, einschließlich der Felder für Formular 1099-DA. Über MCP kannst du einen KI-Assistenten anbinden, der Transaktionen aus eingefügten Börsen-E-Mails, Wallet-Verläufen oder freiem Text erfasst und vor dem Speichern eine Vorschau zeigt. Der Assistent ist optional: BitcoinTX sendet dein Journal nirgendwohin, und mit einem lokalen Modell bleibt auch die KI-Erfassung auf deiner eigenen Hardware (eine Cloud-KI sendet, was sie liest, an ihren Anbieter). Kurse können von deinem eigenen mempool-Server kommen, und nichts wird kontaktiert, bevor du wählst. Die App ist auf Englisch und erstellt US-Steuerformulare (IRS). BitcoinTX ist Software, keine Steuer-, Rechts- oder Finanzberatung. Es arbeitet mit den Daten, die du eingibst: Lass seine Zahlen vor der Abgabe von einem Steuerberater prüfen.',
  pl_PL:
    'BitcoinTX to minimalistyczne narzędzie do rozliczania podatków od Bitcoina dla jednego portfela niekustodialnego i jednego konta na giełdzie. Od 2025 r. przepisy IRS wymagają ustalania kosztu nabycia osobno dla każdego portfela i każdego konta, więc jeśli używasz kilku portfeli lub kont na giełdach, obliczone przez nie zyski mogą się różnić od tego, co wynika z przepisów. Prowadzi ewidencję metodą podwójnego zapisu, z kosztem nabycia FIFO dla każdego konta, i wypełnia formularz IRS 8949 oraz Schedule D, w tym pola formularza 1099-DA. Przez MCP możesz podłączyć asystenta AI, który wprowadza transakcje z wklejonych e-maili z giełd, historii portfeli lub zwykłego tekstu i przed zapisaniem pokazuje podgląd. Asystent jest opcjonalny: BitcoinTX nigdzie nie wysyła Twojej księgi, a model lokalny sprawia, że także wprowadzanie przez AI odbywa się na Twoim sprzęcie (AI w chmurze wysyła to, co czyta, do swojego dostawcy). Ceny mogą pochodzić z Twojego własnego serwera mempool i nic nie jest kontaktowane, dopóki nie wybierzesz. Aplikacja jest w języku angielskim i tworzy formularze podatkowe USA (IRS). BitcoinTX to oprogramowanie, a nie porada podatkowa, prawna ani finansowa. Działa na podstawie wprowadzonych przez Ciebie danych: przed złożeniem zeznania sprawdź jego wyliczenia z doradcą podatkowym.',
  fr_FR:
    'BitcoinTX est un outil fiscal Bitcoin minimaliste pour un portefeuille en auto-garde et un compte sur une plateforme d’échange. Depuis 2025, les règles de l’IRS imposent de calculer le coût d’acquisition portefeuille par portefeuille et compte par compte : si vous utilisez plusieurs portefeuilles ou comptes de plateforme, les gains qu’il calcule peuvent donc différer de ce que donnent les règles. Il tient une comptabilité en partie double, avec un coût d’acquisition FIFO par compte, et remplit le formulaire 8949 et le Schedule D de l’IRS, y compris les cases du formulaire 1099-DA. Via MCP, vous pouvez connecter un assistant IA qui saisit les transactions à partir d’e-mails de plateformes d’échange que vous collez, d’historiques de portefeuille ou de texte libre, avec un aperçu avant tout enregistrement. L’assistant est facultatif : BitcoinTX n’envoie votre registre nulle part, et un modèle local garde aussi la saisie par IA sur votre propre matériel (une IA dans le cloud envoie ce qu’elle lit à son fournisseur). Les prix peuvent venir de votre propre serveur mempool, et rien n’est contacté avant votre choix. L’application est en anglais et produit des formulaires fiscaux américains (IRS). BitcoinTX est un logiciel, pas un conseil fiscal, juridique ou financier. Il s’appuie sur les données que vous saisissez : faites vérifier ses chiffres par un professionnel de la fiscalité avant de déclarer.',
}

export const mempoolDescription = {
  en_US:
    'Optional: your own source of Bitcoin prices and the block height, when you choose My Mempool on this server in Price Source & Privacy',
  es_ES:
    'Opcional: tu propia fuente de precios de bitcoin y de la altura de bloque, si eliges Mi Mempool en este servidor en Fuente de precios y privacidad',
  de_DE:
    'Optional: deine eigene Quelle für Bitcoin-Kurse und die Blockhöhe, wenn du unter Kursquelle & Datenschutz Mein Mempool auf diesem Server wählst',
  pl_PL:
    'Opcjonalnie: własne źródło cen bitcoina i wysokości bloku, gdy w Źródło cen i prywatność wybierzesz Mój Mempool na tym serwerze',
  fr_FR:
    'Facultatif : votre propre source de prix du bitcoin et de hauteur de bloc, si vous choisissez Mon Mempool sur ce serveur dans Source des prix et confidentialité',
}

export const torDescription = {
  en_US:
    'Optional: carries requests to public price sites when you turn on Tor in Price Source & Privacy, so they never see your IP address',
  es_ES:
    'Opcional: transporta las solicitudes a los sitios públicos de precios si activas Tor en Fuente de precios y privacidad, para que nunca vean tu dirección IP',
  de_DE:
    'Optional: leitet Anfragen an öffentliche Kursseiten weiter, wenn du Tor unter Kursquelle & Datenschutz einschaltest, sodass sie nie deine IP-Adresse sehen',
  pl_PL:
    'Opcjonalnie: przekazuje zapytania do publicznych serwisów z cenami, gdy włączysz Tor w Źródło cen i prywatność, więc nigdy nie widzą Twojego adresu IP',
  fr_FR:
    'Facultatif : achemine les requêtes vers les sites publics de prix quand vous activez Tor dans Source des prix et confidentialité, pour qu’ils ne voient jamais votre adresse IP',
}
