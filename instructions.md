# BitcoinTX

## Documentation

- [BitcoinTX README](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/README.md) — what the app does: transactions, FIFO lots, Form 8949 and Schedule D, imports.
- [BitcoinTX MCP server](https://github.com/DigiMonk73/BTCTX-MCP/blob/main/mcp_server/README.md) — connecting an AI assistant: the tools it gets and how to configure it.

## What you get on StartOS

- **Web UI**: the BitcoinTX app, behind your login.
- **MCP API**: the address an AI assistant (Claude Desktop, Claude Code or any MCP client) uses to read and add transactions for you. It is the same server and the same login as the web UI.
- **A generated login**: a random password replaces the app's default one at install.
- **Backups**: your database, your login and BitcoinTX's own safety copies of the database are in every StartOS backup.

## Getting set up

1. Run **Show Credentials** when prompted and keep the username and password somewhere safe.
2. Start the service and open the **Web UI**. Log in with those credentials.
3. In **Settings**, check the **Tax Timezone**: it decides which tax year a transaction late on December 31 belongs to.
4. Add your transactions by hand, import a River or generic CSV, or connect an AI assistant (below).

You can change the username and password inside BitcoinTX (**Settings > Reset Username & Password**). Show Credentials keeps showing the generated password, so use yours after changing it.

## Using BitcoinTX

### Web interface

Record deposits, withdrawals, transfers, buys and sells. Every change recalculates the whole ledger, so backdated entries come out right. **Reports** produces Form 8949 and Schedule D as filled PDFs, a complete tax report and your transaction history. For 2025 and later, sales go into the Form 1099-DA boxes; if the 1099-DA your exchange sends shows something different for a sale, set **Broker form** on that transaction.

### Connecting an AI assistant

1. Run **Connect an AI Assistant**. It shows the MCP address, your login, the certificate your computer needs to trust this server, and a ready-to-paste configuration.
2. On the computer with your AI client, install [uv](https://docs.astral.sh/uv/).
3. Save the certificate as a file (the action tells you the name) and put its full path in `BTCTX_CA_BUNDLE`.
4. Paste the **Claude Desktop configuration** into Claude Desktop (**Settings > Developer > Edit Config**) and restart it, or run the **Claude Code command** in a terminal.
5. Ask the assistant to add a transaction, for example by pasting an exchange confirmation email. It shows you a preview and saves only after you confirm.

The configuration holds your password: anyone who can read it can log in to BitcoinTX.

### Actions

- **Show Credentials**: the username and the generated password.
- **Connect an AI Assistant**: everything an AI client needs, as above.
- **Recalculate Ledger**: rebuilds every lot and gain from your transactions, like **Settings > Recalculate Ledger** in the app. You are asked to run it once after updates that change how gains are calculated; your transactions are not changed.
- **Reset Login Credentials**: if you are locked out, sets the username back to `admin` with a new random password. Your transactions are not touched.

## Limitations

- **BitcoinTX cannot be downgraded.** Each update may upgrade the database, and older versions refuse a newer database. BitcoinTX keeps copies of the database from before its last few upgrades in its `backups` folder; to go back, restore a StartOS backup.
