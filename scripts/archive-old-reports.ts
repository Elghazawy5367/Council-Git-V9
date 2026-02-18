/**
 * Archive Old Reports - Automated archiving of reports older than 60 days
 * 
 * Run daily via GitHub Actions or cron to move old reports to archive/
 */

import { ReportManager } from '../src/lib/report-manager';

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  console.log('╔════════════════════════════════════════╗');
  console.log('║    Automated Report Archiving Tool     ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const manager = new ReportManager();
  
  console.log(`🗓️  Archiving reports older than 60 days${dryRun ? ' (DRY RUN)' : ''}...\n`);
  
  const archivedCount = await manager.archiveOldReports(dryRun);
  
  if (archivedCount > 0) {
    console.log(`\n📦 ${archivedCount} report(s) archived${dryRun ? ' (would be)' : ''}`);
    
    // Update registry after archiving (only if not dry run)
    if (!dryRun) {
      console.log('\n📋 Updating registry...');
      manager.generateRegistry();
    }
  } else {
    console.log('\n✨ No reports to archive');
  }
  
  console.log('\n✅ Archiving complete!\n');
  
  if (dryRun) {
    console.log('ℹ️  This was a dry run. Run without --dry-run to actually archive files.');
  }
}

// Run
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
