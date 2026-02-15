import { runMarketGapIdentifier } from '../src/lib/market-gap-identifier';

async function main() {
  try {
    await runMarketGapIdentifier();
    process.exit(0);
  } catch (error) {
    console.error('❌ Market Gap Identifier failed:', error);
    process.exit(1);
  }
}

main();
