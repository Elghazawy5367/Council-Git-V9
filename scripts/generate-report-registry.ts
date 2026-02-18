/**
 * Generate Report Registry - Create/update current.json index
 * 
 * Generates a comprehensive index of all active reports for fast searching
 */

import { ReportManager } from '../src/lib/report-manager';

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║    Report Registry Generator           ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const manager = new ReportManager();
  
  // Ensure directories exist
  manager.ensureDirectories();
  
  console.log('📋 Generating report registry...\n');
  
  const registry = manager.generateRegistry();
  
  console.log('\n📊 Registry Summary:');
  console.log(`   Total reports indexed: ${registry.total_reports}`);
  console.log(`   Generated at: ${registry.generated_at}`);
  console.log('\n   Reports by feature:');
  Object.entries(registry.by_feature)
    .sort((a, b) => b[1] - a[1])
    .forEach(([feature, count]) => {
      console.log(`      ${feature.padEnd(25)} ${count}`);
    });
  
  console.log('\n   Reports by niche:');
  Object.entries(registry.by_niche)
    .sort((a, b) => b[1] - a[1])
    .forEach(([niche, count]) => {
      console.log(`      ${niche.padEnd(30)} ${count}`);
    });
  
  // Update latest symlinks
  console.log('\n🔗 Updating latest.md symlinks...');
  const symlinkCount = manager.updateLatestSymlinks();
  console.log(`   Created ${symlinkCount} symlinks`);
  
  // Show statistics
  console.log('\n📈 Quality Statistics:');
  const stats = manager.getStatistics();
  console.log(`   Average quality score: ${stats.averageQuality}/100`);
  console.log(`   Status breakdown:`);
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`      ${status.padEnd(20)} ${count}`);
  });
  
  console.log('\n✅ Registry generation complete!');
  console.log(`\n📄 Registry saved to: data/registry/current.json\n`);
}

// Run
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
