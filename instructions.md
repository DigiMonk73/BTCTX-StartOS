# BitcoinTX

## Documentation

- [Using BitcoinTX](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/docs/USING.md) — what BitcoinTX does: transactions, lots, tax forms, imports, Ledger Review
- [BitcoinTX MCP server](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/mcp_server/README.md) — connecting an AI assistant

The MCP server page's Mac app, Docker and source steps don't apply here;
on StartOS, follow this page.

## What you get on StartOS

- **Web UI**: the BitcoinTX app, behind your login.
- **MCP API**: the address an AI assistant (Claude Desktop, Claude Code or any MCP client) uses to read and add transactions for you. It is the same server as the web UI; the AI uses an AI key you create in BitcoinTX, never your password.
- **A generated login**: StartOS creates your login with a random password; the app's default one never works.
- **Prices from your own Mempool**, if you run it on this server: no address to copy, no certificate, and nothing is contacted until you choose.
- **Backups**: your database, your login and BitcoinTX's own safety copies of the database are in every StartOS backup.

## Getting set up

1. Run **Set Login Credentials** when prompted. It shows the username and password once: keep them somewhere safe.
2. Run **Price Source & Privacy** when prompted. BitcoinTX starts once you've chosen who it asks for newer Bitcoin prices: **My Mempool on this server** if you run Mempool here (or install it), **Public price sites** (optionally through Tor), **Nobody**, or **Decide in BitcoinTX instead** to choose in the app. See Privacy below.
3. Start the service and open the **Web UI**. Log in with those credentials.
4. In **Settings**, check the **Tax Timezone**: it decides which tax year a transaction late on December 31 belongs to.
5. Add your transactions by hand, import a River CSV or a generic CSV (a generic CSV only into an empty ledger), or connect an AI assistant (below).

You can change the username and password inside BitcoinTX (**Settings > Reset Username & Password**).

## Using BitcoinTX

### Web interface

Record deposits, withdrawals, transfers, buys and sells. Every edit or deletion, and every entry dated before your latest one, recalculates the whole ledger, so backdated entries come out right. **Reports** produces Form 8949 and Schedule D as filled PDFs, a complete tax report and your transaction history. For 2025 and later, sales go into the Form 1099-DA boxes; if the 1099-DA your exchange sends shows something different for a sale, set **Broker form** on that transaction.

BitcoinTX is software, not tax, legal or financial advice. It works from the records you enter: check its figures with a tax professional before you file.

### Privacy and your own node

BitcoinTX sends your ledger nowhere, and it contacts nothing until you choose who it asks for newer prices, with the **Price Source & Privacy** action (or in the app, **Settings > Privacy & Network**, if you pick **Decide in BitcoinTX instead**). A choice made in the action shows read-only in the app.

BitcoinTX values a transaction at the price when its hour began. It records one price per hour, so it won't always match a chart of one exchange at another moment. Its hourly price history, from 2013, is downloaded once from Bitstamp when your choice allows public price sites. Each year is checked against a fingerprint that comes with BitcoinTX. The download is the same for every install, so it never names one of your dates. Once downloaded, it works offline whatever you choose. The card in **Settings > Privacy & Network** shows its progress.

- **My Mempool on this server** (most private): the live price, block height and newer hours come from your Mempool service, reached inside StartOS, and no public site is contacted. This is the Mempool service installed on this server: StartOS lists it as a dependency, so install and start it if you haven't (the action marks it "installed here, recommended" once it is). For a Mempool on another machine, choose **Decide in BitcoinTX instead** (below). It has hourly prices only from when it began recording. For older values, turn on **If Mempool can't answer, ask public price sites**, which also downloads the hourly history once (with **Use Tor**, only if you agree to download it without Tor: see below), or type them in. Mempool's own requests (its exchange rates) can go over Tor with its own setting.
- **Public price sites** (Bitstamp and Kraken for prices; Blockchain.info, Blockstream or mempool.space for the block height): the sites see your server's IP address and when BitcoinTX is open (it asks for the price every 2 minutes while a page is showing), but never one of your transaction dates. To hide the IP address, turn on **Use Tor** (needs the Tor service), or send BitcoinTX's traffic through a VPN with the StartOS **Set Outbound Gateway** action. Through Tor, Bitstamp currently refuses BitcoinTX's requests for the price history, so BitcoinTX's Dashboard asks once: **Download the price history once without Tor?** **Yes** lets only Bitstamp's history downloads go without Tor (the same for every install, naming none of your dates), so Bitstamp sees your server's IP address; the live price and everything else stay on Tor. **No** keeps everything on Tor: use your own Mempool for newer values, or type them. You can change the answer in **Settings > Privacy & Network**.
- **Nobody**: fully offline. Prices BitcoinTX already has still work; you type newer values yourself. To have the hourly history and then ask nobody, choose **Public price sites** until the download finishes, then **Nobody**.
- **Decide in BitcoinTX instead**: the app's own card decides. Choose it also for a Mempool on another machine, and type its address on the card. For Mempool on another StartOS server, use the `https://` LAN IP address that server lists in Mempool's **Interfaces** tab: the one on your home network (often 192.168.x.x), not a 10.59.x.x address, which belongs to a VPN and works only through it. From here, another server's `.local` name works only if your network's DNS knows it. When the card can't trust that server's certificate, it offers **Trust this server**, for that address only; do it only on your own home network. With **Use Tor** on, StartOS lends its Tor service to that choice: the app shows "Through Tor: Tor on this server", locked on.

The card's status line says where newer prices came from and when, or why there's none. BitcoinTX's log says where each download of past prices came from, so you can check that no public site was asked.

### Connecting an AI assistant

AI entry is optional: nothing uses the MCP API until you turn on AI access and create an AI key in BitcoinTX (**Settings > Connect an AI Assistant**). The key is not your password: it can read your ledger, add, change or delete single entries and make a backup, but it can't log in, change your password, restore or delete everything. Turn AI access off or revoke the key there at any time.

**Privacy first:** once connected, the AI's model reads your transactions, balances and gains, and anything you paste. With a cloud AI (Claude, Grok and most others) that data goes to the provider's servers. To keep it private, use an app that runs a local model, such as LM Studio or Goose with Ollama ([setup](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/mcp_server/README.md#privacy-cloud-or-local-model)).

The web UI's **Settings > Connect an AI Assistant** has the key, a setup prompt with this server's address filled in, and ready-made configurations. By hand:

1. In the web UI, **Settings > Connect an AI Assistant**: turn on **Let AI assistants use BitcoinTX** and click **Create AI key**. BitcoinTX shows it once; keep it for step 5.
2. Run **Connect an AI Assistant**. It shows the MCP address, the certificate your computer needs to trust this server, and a ready-to-paste configuration.
3. On the computer with your AI client, install [uv](https://docs.astral.sh/uv/).
4. Download the certificate from the action (or save it as a file under the name the action tells you) and put its full path in `BTCTX_CA_BUNDLE`.
5. Paste the **Claude Desktop configuration** into Claude Desktop (**Settings > Developer > Edit Config**) or LM Studio (**Edit mcp.json**), replace `YOUR_BITCOINTX_AI_KEY` with your key, and restart it. The **Claude Code command** works too, but keeps the key in your shell history.
6. Ask the assistant to add a transaction, for example by pasting an exchange confirmation email. It shows you a preview and saves only after you confirm.

The configuration holds your AI key: anyone who can read it can do what the key allows until you revoke it in BitcoinTX.

If BitcoinTX's address changes (StartOS can give it a new port after you restore it from a backup), run **Connect an AI Assistant** again and update `BTCTX_URL` in your AI app.

The connector's version, after `btctx-mcp==` in your AI app's configuration, should match your BitcoinTX's: **Connect an AI Assistant** shows it. When they differ, the assistant's replies say which version to set; change it in your AI app's configuration and restart the AI app. Your AI key stays the same; don't paste the action's whole configuration over yours, since it has placeholders for the key and the certificate path. Where to change it in each AI app: [Updating](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/mcp_server/README.md#updating).

### Actions

- **Price Source & Privacy**: where BitcoinTX gets Bitcoin prices, as above. BitcoinTX restarts to apply it.
- **Connect an AI Assistant**: everything an AI client needs, as above.
- **Recalculate Ledger**: rebuilds every lot and gain from your transactions, like **Settings > Recalculate Ledger** in the app. Your transactions are not changed. Before you run it, open **Settings > Ledger Review** in the app: it lists every figure a recalculation would change. When an update changes how BitcoinTX calculates some gains, StartOS asks for it under **Tasks** on BitcoinTX's page, once (and again after a restore, until you have run it). If you recalculated in the app instead, dismiss the task there: its trash icon, then **Dismiss**.
- **Set Login Credentials**: if you are locked out, stop BitcoinTX and run it: it sets the username back to `admin` with a new random password. Your transactions are not touched.

## Limitations

BitcoinTX is in English and produces US (IRS) tax forms. Beyond that:

- **One wallet and one exchange.** BitcoinTX tracks one self-custody Wallet and one Exchange. Since 2025, IRS rules require cost basis to be figured wallet by wallet and account by account, so if you use several wallets or exchange accounts, BitcoinTX's gains can differ from what the rules give. Keep separate records for each, or ask your tax preparer.
- **BitcoinTX cannot be downgraded.** Each update may upgrade the database, and older versions refuse a newer database. BitcoinTX keeps copies of the database from before its last few upgrades in its `backups` folder. To go back, uninstall BitcoinTX, which deletes its data (those copies too), then restore a StartOS backup made before the update. Anything you entered after that backup is lost.
