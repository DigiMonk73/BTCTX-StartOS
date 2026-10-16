export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'BitcoinTX is not responding': 0,
  'BitcoinTX is ready': 1,
  'The database is not ready: ${detail}': 2,
  'Starting BitcoinTX': 3,
  'Web Interface': 4,

  // interfaces.ts
  'Web UI': 5,
  'The BitcoinTX web interface': 6,
  'MCP API': 7,

  // actions/setCredentials.ts
  Username: 9,
  Password: 10,

  // actions/connectAi.ts
  'Connect an AI Assistant': 11,
  'MCP address (BTCTX_URL)': 13,
  'Other address': 14,
  'Root CA certificate': 15,
  'Claude Desktop configuration': 16,
  'Claude Code command': 17,
  'The BitcoinTX MCP server runs on the computer with your AI client and needs uv (https://docs.astral.sh/uv/) installed there. Privacy: the model behind your AI app reads your transactions, balances and gains. With a cloud AI (Claude, Grok and most others) that goes to the provider; a local model (LM Studio, Goose with Ollama) keeps it on your own computer.': 18,
  'Save the Root CA certificate below as ${file} and put its full path in BTCTX_CA_BUNDLE.': 19,
  'Download your server Root CA (System > About this Server), save it as ${file} and put its full path in BTCTX_CA_BUNDLE.': 20,

  // actions/recalculateLedger.ts
  'Recalculate Ledger': 24,
  'Rebuild every ledger entry, lot and gain from your transactions, the same as Settings > Recalculate Ledger in BitcoinTX. Run it once after an update that changes how gains are calculated.': 25,
  'This rebuilds all lots and gains from your transactions. Your transactions themselves are not changed. It can take a minute on a large ledger.': 26,
  'Ledger Recalculated': 27,

  // init/recalculateTask.ts
  'This update corrects how some gains are calculated. To see which figures change, open Settings > Ledger Review in BitcoinTX first; then recalculate once so the corrections reach your existing transactions.': 40,

  // AI key (interfaces.ts, actions/connectAi.ts)
  'The address for AI assistants (MCP clients), which use an AI key you create in BitcoinTX Settings, never your password. Optional: nothing uses it until you set up an AI app. Run the Connect an AI Assistant action for a ready-made configuration.': 41,
  'Everything an AI assistant such as Claude Desktop, Claude Code or LM Studio needs to add transactions for you: the address, the certificate to trust, and a ready-to-paste configuration for the AI key you create in BitcoinTX.': 42,
  'First create an AI key in BitcoinTX: open the Web UI, go to Settings > Connect an AI Assistant, turn on Let AI assistants use BitcoinTX, then click Create AI key. BitcoinTX shows the key once.': 43,
  'Then paste the Claude Desktop configuration into Settings > Developer > Edit Config (or mcp.json in LM Studio) and replace ${placeholder} with your AI key. The Claude Code command works too, but keeps the key in your shell history, so prefer the configuration file.': 44,

  // actions/priceSource.ts
  'Newer prices from': 46,
  "BitcoinTX's hourly price history (2013 on) is downloaded once from Bitstamp, checked against fingerprints that come with this version, when your choice allows public price sites. Your ledger is never sent anywhere.\n- My Mempool on this server: the most private; asks your Mempool service, which must be installed and running. It has hourly prices only from when it began recording: for older values, turn on the option below that asks public price sites when Mempool can't answer, or type them.\n- Public price sites: Bitstamp and Kraken for prices; Blockchain.info, Blockstream or mempool.space for the block height. They see your IP address and when BitcoinTX is open, never your transaction dates.\n- Nobody: fully offline. Prices BitcoinTX already has still work; type newer values yourself.\n- Decide in BitcoinTX instead: the app's own Settings > Privacy & Network decide, for example for a Mempool on another machine.": 47,
  'My Mempool on this server': 48,
  'My Mempool on this server (recommended: installed)': 74,
  'Public price sites': 49,
  'Nobody: fully offline': 50,
  'Decide in BitcoinTX instead': 51,
  "If Mempool can't answer, ask public price sites": 52,
  "With My Mempool: when it doesn't answer, or has no price for an hour, ask public price sites instead; the hourly history is then downloaded once from Bitstamp. Off: nothing goes to a public site.": 53,
  'Use Tor (the Tor service on this server)': 54,
  "Needs the Tor service on this server. Public price sites then never see your IP address. Used with Public price sites, with My Mempool when it may ask public price sites, and with Decide in BitcoinTX instead, where BitcoinTX shows it as Tor on this server. Through Tor, Bitstamp currently refuses BitcoinTX's requests, so the hourly history and past prices don't download; only the live price works. Choose Public price sites without Tor to download them (once checked, the hourly history stays), use My Mempool on this server for newer values, or type them.": 55,
  'Price Source & Privacy': 56,
  'Choose who BitcoinTX asks for newer Bitcoin prices: your own Mempool on this server, public price sites (optionally over Tor), nobody, or decide in BitcoinTX.': 57,
  "BitcoinTX restarts and asks your Mempool service. If Mempool is not installed yet, install and start it: until then BitcoinTX has no newer prices, unless it may ask public price sites when Mempool can't answer.": 58,
  'BitcoinTX restarts and asks the public price sites.': 59,
  'BitcoinTX restarts and contacts nothing. Prices it already stored still work; for anything else, type the USD value in.': 60,
  "BitcoinTX's own Settings > Privacy & Network decide again. It restarts if it was set here before.": 61,
  'Public sites are reached over Tor: install and start the Tor service if it is not running, or those requests fail.': 62,
  'Price Source Saved': 63,
  "BitcoinTX's own choice can use the Tor service on this server: install and start it if it is not running.": 75,

  // init/priceSourceTask.ts
  'Choose who BitcoinTX asks for newer Bitcoin prices, or nobody': 64,
  'Prices are now hourly. Check who BitcoinTX asks for newer ones.': 65,

  // actions/setCredentials.ts, init/watchCredentials.ts, init/defaultLogin.ts
  'This replaces your current username and password. Your transactions are not touched.': 30,
  'Login Credentials': 35,
  'Set Login Credentials': 68,
  'Generate a random password for logging in to BitcoinTX, with the username "admin". Run it again if you lose the password.': 69,
  'Log in to BitcoinTX with these and keep them somewhere safe: they are shown only now. If you lose them, run this action again.': 70,
  'Create your BitcoinTX login before starting the service': 71,
  'Your BitcoinTX login was still the original admin / password, so it has been locked. Set a new login before starting the service.': 72,

  // actions/recalculateLedger.ts
  'Transactions recalculated: ${count}': 73,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
