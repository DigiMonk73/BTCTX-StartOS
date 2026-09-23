import { T } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { hostId, mcpInterfaceId } from '../interfaces'
import { sdk } from '../sdk'
import { ADMIN_USERNAME, uiPort } from '../utils'
import { current } from '../versions/current'

const CA_FILE = 'btctx-root-ca.crt'

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

function single(name: string, value: string, masked = false) {
  return {
    type: 'single' as const,
    name,
    description: null,
    value,
    copyable: true,
    masked,
    qr: false,
  }
}

export const connectAi = sdk.Action.withoutInput(
  'connect-ai',

  async () => ({
    name: i18n('Connect an AI Assistant'),
    description: i18n(
      'Everything an AI assistant such as Claude Desktop or Claude Code needs to add transactions for you: the address, your login, the certificate to trust, and a ready-to-paste configuration.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const urls = await mcpUrls(effects)
    const url = urls[0] ?? 'https://your-server.local/api'
    const stored = await storeJson.read((s) => s.adminPassword).once()
    const password = stored ?? 'your-bitcointx-password'
    const ca = await rootCa(effects)
    const release = `v${current.options.version.split(':')[0]}`
    const source = `git+https://github.com/DigiMonk73/BTCTX-MCP.git@${release}#subdirectory=mcp_server`

    const env: Record<string, string> = {
      BTCTX_URL: url,
      BTCTX_USERNAME: ADMIN_USERNAME,
      BTCTX_PASSWORD: password,
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
      single(i18n('Username'), ADMIN_USERNAME),
      single(i18n('Password'), password, true),
      ...(ca ? [single(i18n('Root CA certificate'), ca)] : []),
      single(i18n('Claude Desktop configuration'), desktopConfig, true),
      single(i18n('Claude Code command'), claudeCode, true),
    ]

    return {
      version: '1',
      title: i18n('Connect an AI Assistant'),
      message: [
        i18n(
          'The BitcoinTX MCP server runs on the computer with your AI client and needs uv (https://docs.astral.sh/uv/) installed there.',
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
          'Then paste the Claude Desktop configuration into Settings > Developer > Edit Config, or run the Claude Code command.',
        ),
        stored
          ? i18n(
              'If you changed your password inside BitcoinTX, replace it in the configuration.',
            )
          : i18n(
              'Replace your-bitcointx-password with the password you log in with.',
            ),
      ].join(' '),
      result: { type: 'group', value },
    }
  },
)
