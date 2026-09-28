import { T } from '@start9labs/start-sdk'
import {
  mainHostId as mempoolHostId,
  uiPort as mempoolPort,
} from 'mempool-startos/startos/utils'
import { socksHostId, socksPort } from 'tor-startos/startos/utils'
import { PriceSource, storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

// The optional dependencies (manifest `dependencies`), reached over the
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
  if (choice.source === 'unset') return {}
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
    const socks = sdk.host.getBridgeAddress(effects, {
      packageId: TOR.packageId,
      hostId: TOR.hostId,
      internalPort: TOR.port,
      fallbackPort: TOR.port,
    })
    const address = watch ? await socks.const() : await socks.once()
    env.BTCTX_PROXY_URL = `socks5h://${address}`
  }
  return env
}
