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

  // utils.ts
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

  // actions/resetCredentials.ts
  'Reset Login Credentials': 28,
  'Set the username back to "admin" and generate a new random password. Use this if you are locked out.': 29,
  'This replaces your current username and password. Your transactions are not touched.': 30,
  'Credentials Reset': 31,
  'Log in to BitcoinTX with these. Show Credentials displays them again later.': 32,

  // actions/showCredentials.ts
  'Show Credentials': 33,
  'The username and password for logging in to BitcoinTX.': 34,
  'Login Credentials': 35,
  'Log in to BitcoinTX with these. If you changed the password inside BitcoinTX, use that one instead; run Reset Login Credentials if you have lost it.': 36,
  'This install predates generated passwords, so the original default login is shown. If you changed it inside BitcoinTX, use yours; run Reset Login Credentials if you have lost it.': 37,

  // init/installCredentials.ts
  'Creating the BitcoinTX database': 38,
  'Copy your BitcoinTX login before starting the service': 39,

  // init/recalculateTask.ts
  'This update corrects how transfer fees, sale proceeds and the one-year holding period are calculated. Recalculate once so the corrections reach your existing transactions.': 40,

  // AI key (interfaces.ts, actions/connectAi.ts)
  'The address for AI assistants (MCP clients), which use an AI key you create in BitcoinTX Settings, never your password. Optional: nothing uses it until you set up an AI app. Run the Connect an AI Assistant action for a ready-made configuration.': 41,
  'Everything an AI assistant such as Claude Desktop, Claude Code or LM Studio needs to add transactions for you: the address, the certificate to trust, and a ready-to-paste configuration for the AI key you create in BitcoinTX.': 42,
  'First create an AI key in BitcoinTX: open the Web UI, go to Settings > Connect an AI Assistant, turn on Let AI assistants use BitcoinTX, then click Create AI key. BitcoinTX shows the key once.': 43,
  'Then paste the Claude Desktop configuration into Settings > Developer > Edit Config (or mcp.json in LM Studio) and replace ${placeholder} with your AI key. The Claude Code command works too, but keeps the key in your shell history, so prefer the configuration file.': 44,
  'Set up an AI app before this update? Its configuration holds your BitcoinTX password: replace BTCTX_USERNAME and BTCTX_PASSWORD there with BTCTX_AI_KEY, then run Reset Login Credentials (or change your password in BitcoinTX).': 45,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
