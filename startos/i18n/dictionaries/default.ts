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
  'The address for AI assistants (MCP clients). Run the Connect an AI Assistant action for a ready-made configuration.': 8,

  // utils.ts
  Username: 9,
  Password: 10,

  // actions/connectAi.ts
  'Connect an AI Assistant': 11,
  'Everything an AI assistant such as Claude Desktop or Claude Code needs to add transactions for you: the address, your login, the certificate to trust, and a ready-to-paste configuration.': 12,
  'MCP address (BTCTX_URL)': 13,
  'Other address': 14,
  'Root CA certificate': 15,
  'Claude Desktop configuration': 16,
  'Claude Code command': 17,
  'The BitcoinTX MCP server runs on the computer with your AI client and needs uv (https://docs.astral.sh/uv/) installed there.': 18,
  'Save the Root CA certificate below as ${file} and put its full path in BTCTX_CA_BUNDLE.': 19,
  'Download your server Root CA (System > About this Server), save it as ${file} and put its full path in BTCTX_CA_BUNDLE.': 20,
  'Then paste the Claude Desktop configuration into Settings > Developer > Edit Config, or run the Claude Code command.': 21,
  'If you changed your password inside BitcoinTX, replace it in the configuration.': 22,
  'Replace your-bitcointx-password with the password you log in with.': 23,

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
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
