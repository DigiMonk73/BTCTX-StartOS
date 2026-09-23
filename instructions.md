# BitcoinTX Instructions

## Getting Started

After installation, click the "Launch UI" button to open the BitcoinTX web interface.

## Logging In

A unique admin password is generated when the service is installed. To retrieve your credentials, run the **Show Credentials** action from the service's Actions menu.

If you are ever locked out, stop the service and run the **Reset Login Credentials** action to generate a new password.

## Features

### Portfolio Tracking

BitcoinTX tracks your Bitcoin holdings using double-entry accounting principles. Each transaction is recorded with proper debits and credits to maintain an accurate ledger.

### Adding Transactions

Use the web interface to add:

- Purchases (fiat to Bitcoin)
- Sales (Bitcoin to fiat)
- Transfers between wallets
- Income received in Bitcoin
- Fees and expenses

### Cost Basis Calculation

BitcoinTX uses FIFO (First In, First Out) accounting to calculate your cost basis. This method assigns the cost of your earliest purchases to your sales first.

### Tax Reports

Generate IRS-compliant tax documents:

- **Form 8949**: Sales and Other Dispositions of Capital Assets
- **Schedule D**: Capital Gains and Losses

Export reports for your tax year to include with your filing. Sales are placed
in the Form 1099-DA boxes for 2025 and later. If the 1099-DA your exchange
sends shows something different for a sale, set "Broker form" on that
transaction.

Set your **Tax Timezone** in Settings: it decides which tax year a late-night
December 31 transaction belongs to.

### Adding Transactions with an AI (MCP)

BitcoinTX includes an MCP server, so an AI assistant (Claude Desktop, Claude
Code, or any MCP client) can add transactions from pasted exchange emails,
wallet history, or plain English, with a preview before anything is saved.
It runs on your computer and connects to this service's LAN address
(`https://….local`). Setup, including how to trust your server's certificate:
https://github.com/DigiMonk73/BTCTX-MCP/blob/main/mcp_server/README.md

## Data Storage

All data is stored locally in a SQLite database. Your financial information never leaves your server.

## Backups

BitcoinTX data is included in StartOS backups. Regular backups are recommended to protect your transaction history.

When an update changes the database, BitcoinTX first saves a copy of it in a
`backups` folder on the service's volume, so an update can always be undone.

## Updating to 0.8.0

The database upgrades itself on first start. Afterwards, open **Settings** and
click **Recalculate Ledger** once: this release corrects how transfer fees,
sale proceeds and the one-year holding period are calculated.

## Support

For issues with the BitcoinTX application, visit:
https://github.com/DigiMonk73/BTCTX-MCP/issues

For issues with the StartOS wrapper, visit:
https://github.com/DigiMonk73/BTCTX-StartOS/issues
