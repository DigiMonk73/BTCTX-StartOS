import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

// Host and interface ids are unchanged since 0.3.x: renaming them would drop
// the domains and Tor addresses users attached to them.
export const hostId = 'ui-multi'
export const webUiInterfaceId = 'webui'
export const mcpInterfaceId = 'mcp'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const origin = await sdk.MultiHost.of(effects, hostId).bindPort(uiPort, {
    protocol: 'http',
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: webUiInterfaceId,
    description: i18n('The BitcoinTX web interface'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  // Same server and login as the web UI; listed separately so the address an
  // MCP client needs (BTCTX_URL) is one copy away.
  const mcp = sdk.createInterface(effects, {
    name: i18n('MCP API'),
    id: mcpInterfaceId,
    description: i18n(
      'The address for AI assistants (MCP clients). Run the Connect an AI Assistant action for a ready-made configuration.',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/api',
    query: {},
  })

  return [await origin.export([ui, mcp])]
})
