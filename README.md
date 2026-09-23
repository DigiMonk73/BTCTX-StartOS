# BitcoinTX for StartOS

This repository contains the StartOS wrapper for [BitcoinTX (with MCP)](https://github.com/DigiMonk73/BTCTX-MCP), a self-hosted Bitcoin portfolio tracker with double-entry accounting and FIFO cost-basis tax reporting.

## Requirements

- StartOS 0.4.0 or later
- ARM64 (aarch64) or x86_64 architecture

## Building from Source

### Prerequisites

- [start-cli](https://github.com/Start9Labs/start-technologies/releases) 2.1.0+
- Node.js 22+, git, jq
- Docker

The package is built with start-sdk 2.0.9 and needs StartOS 0.4.0-beta.10 or later.

### Build

```bash
git clone https://github.com/DigiMonk73/BTCTX-StartOS.git
cd BTCTX-StartOS
npm ci
make universal
```

This produces `btctx.s9pk`, which can be sideloaded to StartOS.

### Development Commands

```bash
make universal    # Build btctx.s9pk (both architectures)
make              # Build one s9pk per architecture
make clean        # Remove build artifacts
npm run check     # Run TypeScript type checking
npm run prettier  # Format code
```

## Installation

1. Build the package or obtain `btctx.s9pk`
2. In StartOS, navigate to System > Sideload
3. Upload `btctx.s9pk`
4. Follow the installation prompts

## Features

- Web-based portfolio tracking interface
- Double-entry accounting for Bitcoin transactions
- FIFO cost-basis calculation
- IRS-compliant tax report generation (Form 8949, Schedule D)
- Local SQLite database with automatic backup support

## Architecture

The wrapper runs BitcoinTX as a single daemon:

- **Web UI**: FastAPI backend serving React frontend on port 80
- **Data**: SQLite database persisted in `/data` volume
- **Backups**: Full volume backup of all application data

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [BitcoinTX (with MCP) repository](https://github.com/DigiMonk73/BTCTX-MCP)
- [StartOS Documentation](https://docs.start9.com)
- [StartOS 0.4.0 Packaging Guide](https://staging.docs.start9.com/packaging-guide/index.html)
- [Start9 Labs](https://start9.com)
