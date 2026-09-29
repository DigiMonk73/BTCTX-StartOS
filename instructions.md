# BitcoinTX

## Documentation

- [What BitcoinTX does](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/README.md#features) — transactions, FIFO lots, Form 8949 and Schedule D, imports. (Its install and first-login sections are for Docker and the Mac app; on StartOS, follow this page.)
- [BitcoinTX on StartOS](https://github.com/DigiMonk73/BTCTX-StartOS/blob/main/README.md) — how this package works: volumes, actions, tasks, dependencies, backups.
- [BitcoinTX MCP server](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/mcp_server/README.md#configure) — connecting an AI assistant: the tools it gets and how to configure it.

## What you get on StartOS

- **Web UI**: the BitcoinTX app, behind your login.
- **MCP API**: the address an AI assistant (Claude Desktop, Claude Code or any MCP client) uses to read and add transactions for you. It is the same server as the web UI; the AI uses an AI key you create in BitcoinTX, never your password.
- **A generated login**: a random password replaces the app's default one at install.
- **Prices from your own Mempool**, if you run it on this server: no address to copy, no certificate, and nothing is contacted until you choose.
- **Backups**: your database, your login and BitcoinTX's own safety copies of the database are in every StartOS backup.

## Getting set up

1. Run **Show Credentials** when prompted and keep the username and password somewhere safe.
2. Run **Price Source & Privacy** when prompted: choose **My Mempool on this server** if you run Mempool here (or install it), **Public price sites** (optionally over Tor), **Off**, or **Choose in BitcoinTX** to decide in the app instead. See Privacy below.
3. Start the service and open the **Web UI**. Log in with those credentials.
4. In **Settings**, check the **Tax Timezone**: it decides which tax year a transaction late on December 31 belongs to.
5. Add your transactions by hand, import a River CSV or a generic CSV (a generic CSV only into an empty ledger), or connect an AI assistant (below).

You can change the username and password inside BitcoinTX (**Settings > Reset Username & Password**). Show Credentials keeps showing the generated password, so use yours after changing it.

## Using BitcoinTX

### Web interface

Record deposits, withdrawals, transfers, buys and sells. Every change recalculates the whole ledger, so backdated entries come out right. **Reports** produces Form 8949 and Schedule D as filled PDFs, a complete tax report and your transaction history. For 2025 and later, sales go into the Form 1099-DA boxes; if the 1099-DA your exchange sends shows something different for a sale, set **Broker form** on that transaction.

### Privacy and your own node

BitcoinTX sends your ledger nowhere, and it contacts nothing until you choose a price source with the **Price Source & Privacy** action (or in the app, **Settings > Privacy & Network**, if you pick **Choose in BitcoinTX**). A choice made in the action shows read-only in the app.

- **My Mempool on this server** (best): the live price, block height and past prices come from your Mempool service, reached inside StartOS, and no public site is contacted. StartOS lists Mempool as a dependency: install and start it if you haven't. Its past prices start from when it was installed; for older days, turn on **Fall back to public price sites** or type the value in. Mempool's own requests (its exchange rates) can go over Tor with its own setting.
- **Public price sites**: the sites see your server's IP address but never one of your transaction dates, because past prices come from one download of the whole history that is the same for every install. To hide the IP address, turn on **Reach public price sites over Tor** (needs the Tor service), or send BitcoinTX's traffic through a VPN with the StartOS **Set Outbound Gateway** action.
- **Off**: nothing is contacted; you type in USD values yourself.

BitcoinTX's log says where each download of past prices came from, so you can check that no public site was asked.

### Connecting an AI assistant

AI entry is optional: nothing uses the MCP API until you turn on AI access and create an AI key in BitcoinTX (**Settings > Connect an AI Assistant**). The key is not your password: it can read your ledger, add or change entries and make a backup, but it can't log in, change your password, restore or delete everything. Turn AI access off or revoke the key there at any time.

**Privacy first:** once connected, the AI's model reads your transactions, balances and gains, and anything you paste. With a cloud AI (Claude, Grok and most others) that data goes to the provider's servers. To keep it private, use an app that runs a local model, such as LM Studio or Goose with Ollama ([setup](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/mcp_server/README.md#privacy-cloud-or-local-model)).

The web UI's **Settings > Connect an AI Assistant** has the key, a setup prompt with this server's address filled in, and ready-made configurations. By hand:

1. In the web UI, **Settings > Connect an AI Assistant**: turn on **Let AI assistants use BitcoinTX** and click **Create AI key**. BitcoinTX shows it once; keep it for step 5.
2. Run **Connect an AI Assistant**. It shows the MCP address, the certificate your computer needs to trust this server, and a ready-to-paste configuration.
3. On the computer with your AI client, install [uv](https://docs.astral.sh/uv/).
4. Save the certificate as a file (the action tells you the name) and put its full path in `BTCTX_CA_BUNDLE`.
5. Paste the **Claude Desktop configuration** into Claude Desktop (**Settings > Developer > Edit Config**) or LM Studio (**Edit mcp.json**), replace `YOUR_BITCOINTX_AI_KEY` with your key, and restart it. The **Claude Code command** works too, but keeps the key in your shell history.
6. Ask the assistant to add a transaction, for example by pasting an exchange confirmation email. It shows you a preview and saves only after you confirm.

The configuration holds your AI key: anyone who can read it can do what the key allows until you revoke it in BitcoinTX.

If BitcoinTX's address changes (StartOS can give it a new port after you restore it from a backup), run **Connect an AI Assistant** again and update `BTCTX_URL` in your AI app.

### Actions

- **Show Credentials**: the username and the generated password.
- **Price Source & Privacy**: where BitcoinTX gets Bitcoin prices, as above. BitcoinTX restarts to apply it.
- **Connect an AI Assistant**: everything an AI client needs, as above.
- **Recalculate Ledger**: rebuilds every lot and gain from your transactions, like **Settings > Recalculate Ledger** in the app. Your transactions are not changed. Before running it after an update, open **Settings > Ledger Review** in the app: it lists every figure a recalculation would change.
- **Reset Login Credentials**: if you are locked out, sets the username back to `admin` with a new random password. Your transactions are not touched.

## Limitations

BitcoinTX is in English and produces US (IRS) tax forms. Beyond that:

- **BitcoinTX cannot be downgraded.** Each update may upgrade the database, and older versions refuse a newer database. BitcoinTX keeps copies of the database from before its last few upgrades in its `backups` folder; to go back, restore a StartOS backup.
