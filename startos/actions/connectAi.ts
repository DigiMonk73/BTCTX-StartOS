import { T } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { hostId, mcpInterfaceId } from '../interfaces'
import { sdk } from '../sdk'
import { uiPort } from '../utils'
import { current } from '../versions/current'

const CA_FILE = 'btctx-root-ca.crt'
// The AI key is created in BitcoinTX (Settings) and shown only there, once.
// This action never reads or shows the login: no password goes to an AI app.
const KEY_PLACEHOLDER = 'YOUR_BITCOINTX_AI_KEY'

/** https addresses of the MCP API interface, .local first. */
async function mcpUrls(effects: T.Effects): Promise<string[]> {
  const host = await sdk.host.getOwn(effects, hostId).once()
  const info = host?.bindings[uiPort]?.interfaces[mcpInterfaceId]?.addressInfo
  if (!info) return []
  const rank = (h: T.HostnameInfo) =>
    h.metadata.kind === 'mdns' ? 0 : h.metadata.kind === 'ipv4' ? 1 : 2
  const hostnames = info.nonLocal.hostnames
    .filter((h) => h.ssl)
    .sort((a, b) => rank(a) - rank(b))
  return [...new Set(hostnames.map((h) => info.toUrl(h)))]
}

/** The StartOS root CA (last in the chain), or null if it can't be read. */
async function rootCa(effects: T.Effects): Promise<string | null> {
  try {
    const [, , root] = await sdk
      .getSslCertificate(effects, ['127.0.0.1'])
      .once()
    return root?.includes('BEGIN CERTIFICATE') ? root.trim() : null
  } catch (e) {
    console.warn('Connect an AI Assistant: no root CA:', e)
    return null
  }
}

function single(name: string, value: string) {
  return {
    type: 'single' as const,
    name,
    description: null,
    value,
    copyable: true,
    masked: false,
    qr: false,
  }
}

export const connectAi = sdk.Action.withoutInput(
  'connect-ai',

  async () => ({
    name: i18n('Connect an AI Assistant'),
    description: i18n(
      'Everything an AI assistant such as Claude Desktop, Claude Code or LM Studio needs to add transactions for you: the address, the certificate to trust, and a ready-to-paste configuration for the AI key you create in BitcoinTX.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const urls = await mcpUrls(effects)
    const url = urls[0] ?? 'https://your-server.local/api'
    const ca = await rootCa(effects)
    // Pinned to this package's release: the AI app runs exactly that code.
    const release = `v${current.options.version.split(':')[0]}`
    const source = `git+https://github.com/DigiMonk73/BTCTX-MCP.git@${release}#subdirectory=mcp_server`

    const env: Record<string, string> = {
      BTCTX_URL: url,
      BTCTX_AI_KEY: KEY_PLACEHOLDER,
      BTCTX_CA_BUNDLE: `/path/to/${CA_FILE}`,
    }
    const desktopConfig = JSON.stringify(
      {
        mcpServers: {
          bitcointx: {
            command: 'uvx',
            args: ['--from', source, 'btctx-mcp'],
            env,
          },
        },
      },
      null,
      2,
    )
    const q = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`
    const claudeCode = [
      'claude mcp add bitcointx',
      ...Object.entries(env).map(([k, v]) => `-e ${k}=${q(v)}`),
      `-- uvx --from ${q(source)} btctx-mcp`,
    ].join(' ')

    const value = [
      single(i18n('MCP address (BTCTX_URL)'), url),
      ...urls.slice(1).map((u) => single(i18n('Other address'), u)),
      ...(ca ? [single(i18n('Root CA certificate'), ca)] : []),
      single(i18n('Claude Desktop configuration'), desktopConfig),
      single(i18n('Claude Code command'), claudeCode),
    ]

    return {
      version: '1',
      title: i18n('Connect an AI Assistant'),
      message: [
        i18n(
          'The BitcoinTX MCP server runs on the computer with your AI client and needs uv (https://docs.astral.sh/uv/) installed there. Privacy: the model behind your AI app reads your transactions, balances and gains. With a cloud AI (Claude, Grok and most others) that goes to the provider; a local model (LM Studio, Goose with Ollama) keeps it on your own computer.',
        ),
        i18n(
          'First create an AI key in BitcoinTX: open the Web UI, go to Settings > Connect an AI Assistant, turn on Let AI assistants use BitcoinTX, then click Create AI key. BitcoinTX shows the key once.',
        ),
        ca
          ? i18n(
              'Save the Root CA certificate below as ${file} and put its full path in BTCTX_CA_BUNDLE.',
              { file: CA_FILE },
            )
          : i18n(
              'Download your server Root CA (System > About this Server), save it as ${file} and put its full path in BTCTX_CA_BUNDLE.',
              { file: CA_FILE },
            ),
        i18n(
          'Then paste the Claude Desktop configuration into Settings > Developer > Edit Config (or mcp.json in LM Studio) and replace ${placeholder} with your AI key. The Claude Code command works too, but keeps the key in your shell history, so prefer the configuration file.',
          { placeholder: KEY_PLACEHOLDER },
        ),
        i18n(
          'Set up an AI app before this update? Its configuration holds your BitcoinTX password: replace BTCTX_USERNAME and BTCTX_PASSWORD there with BTCTX_AI_KEY, then run Reset Login Credentials (or change your password in BitcoinTX).',
        ),
      ].join(' '),
      result: { type: 'group', value },
    }
  },
)
