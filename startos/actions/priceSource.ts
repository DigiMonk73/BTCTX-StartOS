import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { currentChoice } from '../priceSource'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const PRICE_SOURCE_TASK_ID = 'choose-price-source'

const inputSpec = InputSpec.of({
  source: Value.select({
    name: i18n('Price source'),
    description: i18n(
      'Where BitcoinTX gets the Bitcoin price, the block height and past prices. Your ledger itself is never sent anywhere. Public price sites (Kraken, CoinGecko, Blockchain.info, Blockstream, mempool.space, Bitstamp, Coinbase) see your IP address and when BitcoinTX is open, never your transaction dates.',
    ),
    default: 'unset',
    values: {
      mempool: i18n('My Mempool on this server'),
      public: i18n('Public price sites'),
      off: i18n('Off: contact nothing'),
      unset: i18n('Choose in BitcoinTX (Settings > Privacy & Network)'),
    },
  }),
  fallback: Value.toggle({
    name: i18n('Fall back to public price sites'),
    description: i18n(
      "With My Mempool: when it doesn't answer, or doesn't have a past day's price, ask the public sites instead. Off: nothing goes to a public site.",
    ),
    default: false,
  }),
  tor: Value.toggle({
    name: i18n('Reach public price sites over Tor'),
    description: i18n(
      'Needs the Tor service on this server. The public sites then never see your IP address. Used with Public price sites, or with the fallback on.',
    ),
    default: false,
  }),
})

export const priceSource = sdk.Action.withInput(
  'price-source',

  async () => ({
    name: i18n('Price Source & Privacy'),
    description: i18n(
      'Choose where BitcoinTX gets Bitcoin prices: your own Mempool on this server, public price sites (optionally over Tor), or nothing at all.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const choice = await currentChoice(effects, false)
    return { source: choice.source, fallback: choice.fallback, tor: choice.tor }
  },

  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      priceSource: input.source,
      mempoolFallback: input.fallback,
      useTor: input.tor,
      priceSourceTask: false,
    })
    await sdk.action.clearTask(effects, PRICE_SOURCE_TASK_ID)

    const publicSites =
      input.source === 'public' ||
      (input.source === 'mempool' && input.fallback)
    const messages = {
      mempool: i18n(
        'BitcoinTX restarts and asks your Mempool service. If Mempool is not installed yet, install and start it: until then BitcoinTX has no prices unless the fallback is on.',
      ),
      public: i18n('BitcoinTX restarts and asks the public price sites.'),
      off: i18n(
        'BitcoinTX restarts and contacts nothing. Prices it already stored still work; for anything else, type the USD value in.',
      ),
      unset: i18n(
        "BitcoinTX's own Settings > Privacy & Network decide again. It restarts if it was set here before.",
      ),
    }
    const tor =
      input.tor && publicSites
        ? ' ' +
          i18n(
            'Public sites are reached over Tor: install and start the Tor service if it is not running, or those requests fail.',
          )
        : ''

    return {
      version: '1',
      title: i18n('Price Source Saved'),
      message: messages[input.source] + tor,
      result: null,
    }
  },
)
