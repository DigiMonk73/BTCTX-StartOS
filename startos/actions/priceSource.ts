import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { currentChoice, mempoolInstalled } from '../priceSource'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const PRICE_SOURCE_TASK_ID = 'choose-price-source'

const inputSpec = InputSpec.of({
  // A dynamic select, so the Mempool line can say it's installed (StartOS
  // knows without contacting anything, #145 plan 2.4). Nothing is
  // preselected until a choice was made: the owner picks, Nobody included.
  source: Value.dynamicSelect(async ({ effects }) => {
    const stored = await storeJson.read((s) => s.priceSource).once()
    const installed = await mempoolInstalled(effects)
    return {
      name: i18n('Newer prices from'),
      description: i18n(
        "BitcoinTX's hourly price history (2013 on) is downloaded once from Bitstamp, checked against fingerprints that come with this version, when your choice allows public price sites. Your ledger is never sent anywhere.\n- My Mempool on this server: the most private; asks the Mempool service installed on this server, which must be running. It has hourly prices only from when it began recording: for older values, turn on the option below that asks public price sites when Mempool can't answer, or type them.\n- Public price sites: Bitstamp and Kraken for prices; Blockchain.info, Blockstream or mempool.space for the block height. They see your IP address and when BitcoinTX is open, never your transaction dates.\n- Nobody: fully offline. Prices BitcoinTX already has still work; type newer values yourself.\n- Decide in BitcoinTX instead: the app's own Settings > Privacy & Network decide. Choose it also for a Mempool on another machine, and type its address there.",
      ),
      default: stored ?? null,
      values: {
        mempool: installed
          ? i18n('My Mempool on this server (installed here, recommended)')
          : i18n('My Mempool on this server (install Mempool here first)'),
        public: i18n('Public price sites'),
        off: i18n('Nobody: fully offline'),
        unset: i18n(
          'Decide in BitcoinTX instead (also for a Mempool on another machine)',
        ),
      },
    }
  }),
  fallback: Value.toggle({
    name: i18n("If Mempool can't answer, ask public price sites"),
    description: i18n(
      "With My Mempool: when it doesn't answer, or has no price for an hour, ask public price sites instead; the hourly history is then downloaded once from Bitstamp. Off: nothing goes to a public site.",
    ),
    default: false,
  }),
  tor: Value.toggle({
    name: i18n('Use Tor (the Tor service on this server)'),
    description: i18n(
      "Needs the Tor service on this server. Public price sites then never see your IP address, unless you let BitcoinTX download Bitstamp's price history without Tor. Used with Public price sites, with My Mempool when it may ask public price sites, and with Decide in BitcoinTX instead, where BitcoinTX shows it as Tor on this server. Through Tor, Bitstamp currently refuses BitcoinTX's requests for the price history, so BitcoinTX's Dashboard asks once whether to download it without Tor: only Bitstamp's history downloads, the same for every install and naming none of your dates; the live price stays on Tor. You can change the answer in Settings > Privacy & Network. With No, use My Mempool on this server for newer values, or type them.",
    ),
    default: false,
  }),
})

export const priceSource = sdk.Action.withInput(
  'price-source',

  async () => ({
    name: i18n('Price Source & Privacy'),
    description: i18n(
      'Choose who BitcoinTX asks for newer Bitcoin prices: your own Mempool on this server, public price sites (optionally over Tor), nobody, or decide in BitcoinTX.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const choice = await currentChoice(effects, false)
    const stored = await storeJson.read((s) => s.priceSource).once()
    // Never chosen: nothing preselected (the select's default is null then)
    return {
      ...(stored ? { source: choice.source } : {}),
      fallback: choice.fallback,
      tor: choice.tor,
    }
  },

  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      priceSource: input.source,
      mempoolFallback: input.fallback,
      useTor: input.tor,
    })
    await sdk.action.clearTask(effects, PRICE_SOURCE_TASK_ID)

    const publicSites =
      input.source === 'public' ||
      (input.source === 'mempool' && input.fallback)
    const messages = {
      mempool: i18n(
        "BitcoinTX restarts and asks the Mempool service on this server. If Mempool is not installed here yet, install and start it: until then BitcoinTX has no newer prices, unless it may ask public price sites when Mempool can't answer.",
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
        : input.tor && input.source === 'unset'
          ? ' ' +
            i18n(
              "BitcoinTX's own choice can use the Tor service on this server: install and start it if it is not running.",
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
