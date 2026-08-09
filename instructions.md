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

Export reports for your tax year to include with your filing.

## Data Storage

All data is stored locally in a SQLite database. Your financial information never leaves your server.

## Backups

BitcoinTX data is included in StartOS backups. Regular backups are recommended to protect your transaction history.

## Support

For issues with the BitcoinTX application, visit:
https://github.com/BitcoinTX-org/BTCTX-org/issues

For issues with the StartOS wrapper, visit:
https://github.com/DigiMonk73/BTCTX-StartOS/issues
