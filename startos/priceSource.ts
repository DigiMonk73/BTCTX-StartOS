import { T } from '@start9labs/start-sdk'
import {
  mainHostId as mempoolHostId,
  uiPort as mempoolPort,
} from 'mempool-startos/startos/utils'
import { socksHostId, socksPort } from 'tor-startos/startos/utils'
import { PriceSource, storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

// The optional dependencies (dependencies.ts), reached over the
// StartOS bridge (10.0.3.1:<assigned port>, plain http inside the server):
// no certificate, no LAN address that can change. Host ids and internal
// ports come from their packages, the stable contract.
export const MEMPOOL = {
  packageId: 'mempool',
  hostId: mempoolHostId,
  port: mempoolPort,
}
export const TOR = { packageId: 'tor', hostId: socksHostId, port: socksPort }

export interface PriceChoice {
  source: PriceSource
  fallback: boolean
  tor: boolean
}

/** The Price Source & Privacy choice in store.json ('unset' until made). */
export function readChoice(s: {
  priceSource?: PriceSource
  mempoolFallback?: boolean
  useTor?: boolean
}): PriceChoice {
  return {
    source: s.priceSource ?? 'unset',
    fallback: s.mempoolFallback ?? false,
    tor: s.useTor ?? false,
  }
}

/** Whether BitcoinTX may ask public price sites with this choice. */
export function asksPublicSites(c: PriceChoice): boolean {
  return c.source === 'public' || (c.source === 'mempool' && c.fallback)
}

/** Whether the choice uses Tor on this server: public sites through it, or
 * "Decide in BitcoinTX" lending it to the app's own choice (#145). */
export function usesTor(c: PriceChoice): boolean {
  return c.tor && (asksPublicSites(c) || c.source === 'unset')
}

/** Whether Mempool is installed on this server: StartOS knows its bridge
 * address without contacting anything (the action's "recommended" label). */
export async function mempoolInstalled(effects: T.Effects): Promise<boolean> {
  const address = await sdk.host
    .getBridgeAddress(effects, {
      packageId: MEMPOOL.packageId,
      hostId: MEMPOOL.hostId,
      internalPort: MEMPOOL.port,
      ssl: false,
    })
    .once()
  return Boolean(address)
}

/** The store's choice; `watch` restarts the caller when it changes. */
export async function currentChoice(
  effects: T.Effects,
  watch: boolean,
): Promise<PriceChoice> {
  const read = storeJson.read((s) => readChoice(s))
  return (
    (watch ? await read.const(effects) : await read.once()) ?? readChoice({})
  )
}

/**
 * The app's price settings for this choice (backend/services/outbound.py
 * reads BTCTX_PRICE_SOURCE and co.). Nothing for 'unset': the app's own
 * Settings decide. `watch` (main): re-run when an address changes, e.g. once
 * Mempool is installed; an action reads a snapshot. While Mempool is missing
 * its address is left out (the app then says Mempool isn't available); Tor's
 * falls back to its fixed port, so requests fail rather than go out directly.
 */
export async function priceEnv(
  effects: T.Effects,
  choice: PriceChoice,
  watch: boolean,
): Promise<Record<string, string>> {
  if (choice.source === 'unset') {
    // The app's own choice decides; with Use Tor it gets this server's Tor,
    // locked on in its Settings (BTCTX_TOR_PROXY_URL, #145)
    return choice.tor
      ? { BTCTX_TOR_PROXY_URL: `socks5h://${await torAddress(effects, watch)}` }
      : {}
  }
  const env: Record<string, string> = {
    BTCTX_PRICE_SOURCE: choice.source,
    BTCTX_MEMPOOL_FALLBACK: choice.fallback ? 'on' : 'off',
  }
  if (choice.source === 'mempool') {
    const mempool = sdk.host.getBridgeAddress(effects, {
      packageId: MEMPOOL.packageId,
      hostId: MEMPOOL.hostId,
      internalPort: MEMPOOL.port,
      ssl: false, // an http binding publishes a plaintext and a TLS address
    })
    const address = watch ? await mempool.const() : await mempool.once()
    if (address) env.BTCTX_MEMPOOL_URL = `http://${address}`
  }
  if (choice.tor && asksPublicSites(choice)) {
    env.BTCTX_PROXY_URL = `socks5h://${await torAddress(effects, watch)}`
  }
  return env
}

/** Tor's SOCKS address on the bridge; its fixed port while Tor is missing,
 * so requests fail rather than go out directly. */
async function torAddress(effects: T.Effects, watch: boolean): Promise<string> {
  const socks = sdk.host.getBridgeAddress(effects, {
    packageId: TOR.packageId,
    hostId: TOR.hostId,
    internalPort: TOR.port,
    fallbackPort: TOR.port,
  })
  return (watch ? await socks.const() : await socks.once()) as string
}
