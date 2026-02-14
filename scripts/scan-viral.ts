import { runViralRadar } from '../src/lib/viral-radar';

async function main(): Promise<void> {
  try {
    await runViralRadar();
    process.exit(0);
  } catch (error) {
    console.error('❌ Viral Radar failed:', error);
    process.exit(1);
  }
}

main();
