/**
 * Organize Reports - Migrate existing flat structure to organized structure
 * 
 * Migrates reports from:
 *   data/reports/{feature}-{niche}-{date}.md
 * To:
 *   data/reports/{feature}/{niche}/{date}.md
 * 
 * Also handles Phantom Scout reports from data/intelligence/
 */

import fs from 'fs';
import path from 'path';
import { ReportManager } from '../src/lib/report-manager';

interface MigrationReport {
  totalFiles: number;
  migrated: number;
  skipped: number;
  errors: number;
  errorDetails: string[];
}

class ReportOrganizer {
  private reportsDir: string;
  private intelligenceDir: string;
  private backupDir: string;
  
  constructor(basePath?: string) {
    const base = basePath || process.cwd();
    this.reportsDir = path.join(base, 'data', 'reports');
    this.intelligenceDir = path.join(base, 'data', 'intelligence');
    this.backupDir = path.join(base, 'data', 'backup-' + Date.now());
  }

  /**
   * Create backup of all reports before migration
   */
  createBackup(): void {
    console.log('📦 Creating backup...');
    
    // Backup reports directory
    if (fs.existsSync(this.reportsDir)) {
      const backupReportsDir = path.join(this.backupDir, 'reports');
      fs.mkdirSync(backupReportsDir, { recursive: true });
      this.copyDirectory(this.reportsDir, backupReportsDir);
    }
    
    // Backup intelligence directory
    if (fs.existsSync(this.intelligenceDir)) {
      const backupIntelligenceDir = path.join(this.backupDir, 'intelligence');
      fs.mkdirSync(backupIntelligenceDir, { recursive: true });
      this.copyDirectory(this.intelligenceDir, backupIntelligenceDir);
    }
    
    console.log(`✅ Backup created at: ${this.backupDir}`);
  }

  /**
   * Copy directory recursively
   */
  private copyDirectory(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });
    const items = fs.readdirSync(src);
    
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  /**
   * Migrate reports from flat structure to organized structure
   */
  async migrateReports(dryRun = false): Promise<MigrationReport> {
    const report: MigrationReport = {
      totalFiles: 0,
      migrated: 0,
      skipped: 0,
      errors: 0,
      errorDetails: []
    };
    
    console.log(`\n🔄 Starting migration${dryRun ? ' (DRY RUN)' : ''}...\n`);
    
    // Migrate reports from data/reports/
    await this.migrateFlatReports(dryRun, report);
    
    // Migrate Phantom Scout reports from data/intelligence/
    await this.migratePhantomScoutReports(dryRun, report);
    
    console.log('\n📊 Migration Summary:');
    console.log(`   Total files processed: ${report.totalFiles}`);
    console.log(`   ✅ Migrated: ${report.migrated}`);
    console.log(`   ⏭️  Skipped: ${report.skipped}`);
    console.log(`   ❌ Errors: ${report.errors}`);
    
    if (report.errors > 0) {
      console.log('\n❌ Errors encountered:');
      report.errorDetails.forEach(err => console.log(`   - ${err}`));
    }
    
    return report;
  }

  /**
   * Migrate flat reports: {feature}-{niche}-{date}.md → {feature}/{niche}/{date}.md
   */
  private async migrateFlatReports(dryRun: boolean, report: MigrationReport): Promise<void> {
    if (!fs.existsSync(this.reportsDir)) {
      console.log('⚠️  Reports directory does not exist');
      return;
    }
    
    const files = fs.readdirSync(this.reportsDir);
    
    for (const filename of files) {
      const filePath = path.join(this.reportsDir, filename);
      const stat = fs.statSync(filePath);
      
      // Skip directories (already organized) and non-markdown files
      if (stat.isDirectory() || !filename.endsWith('.md')) {
        continue;
      }
      
      report.totalFiles++;
      
      try {
        // Parse filename: stargazer-maritime-professionals-2026-02-16.md
        const parsed = this.parseFilename(filename);
        
        if (!parsed) {
          report.skipped++;
          console.log(`⏭️  Skipped (unparseable): ${filename}`);
          continue;
        }
        
        const { feature, niche, date } = parsed;
        
        // Create new path: data/reports/stargazer/maritime-professionals/2026-02-16.md
        const newPath = path.join(
          this.reportsDir,
          feature,
          niche,
          `${date}.md`
        );
        
        if (dryRun) {
          console.log(`[DRY RUN] Would move: ${filename} → ${feature}/${niche}/${date}.md`);
          report.migrated++;
        } else {
          // Create directory structure
          fs.mkdirSync(path.dirname(newPath), { recursive: true });
          
          // Move file
          fs.renameSync(filePath, newPath);
          
          console.log(`✅ Migrated: ${filename} → ${feature}/${niche}/${date}.md`);
          report.migrated++;
        }
      } catch (error) {
        report.errors++;
        const errorMsg = `Error migrating ${filename}: ${error}`;
        report.errorDetails.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
  }

  /**
   * Migrate Phantom Scout reports: blue-ocean-{date}.md → phantom-scout/blue-ocean/{date}.md
   */
  private async migratePhantomScoutReports(dryRun: boolean, report: MigrationReport): Promise<void> {
    if (!fs.existsSync(this.intelligenceDir)) {
      console.log('⚠️  Intelligence directory does not exist');
      return;
    }
    
    const files = fs.readdirSync(this.intelligenceDir);
    
    for (const filename of files) {
      const filePath = path.join(this.intelligenceDir, filename);
      const stat = fs.statSync(filePath);
      
      // Only process blue-ocean markdown files
      if (stat.isDirectory() || !filename.startsWith('blue-ocean-') || !filename.endsWith('.md')) {
        continue;
      }
      
      report.totalFiles++;
      
      try {
        // Parse filename: blue-ocean-2026-02-16.md
        const dateMatch = filename.match(/blue-ocean-(\d{4}-\d{2}-\d{2})\.md/);
        
        if (!dateMatch) {
          report.skipped++;
          console.log(`⏭️  Skipped (unparseable): ${filename}`);
          continue;
        }
        
        const date = dateMatch[1];
        
        // Create new path: data/reports/phantom-scout/blue-ocean/2026-02-16.md
        const newPath = path.join(
          this.reportsDir,
          'phantom-scout',
          'blue-ocean',
          `${date}.md`
        );
        
        if (dryRun) {
          console.log(`[DRY RUN] Would move: ${filename} → phantom-scout/blue-ocean/${date}.md`);
          report.migrated++;
        } else {
          // Create directory structure
          fs.mkdirSync(path.dirname(newPath), { recursive: true });
          
          // Move file
          fs.renameSync(filePath, newPath);
          
          console.log(`✅ Migrated: ${filename} → phantom-scout/blue-ocean/${date}.md`);
          report.migrated++;
        }
      } catch (error) {
        report.errors++;
        const errorMsg = `Error migrating ${filename}: ${error}`;
        report.errorDetails.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
  }

  /**
   * Parse flat filename into components
   * Format: {feature}-{niche}-{date}.md
   * Example: stargazer-maritime-professionals-2026-02-16.md
   */
  private parseFilename(filename: string): { feature: string; niche: string; date: string } | null {
    // Remove .md extension
    const nameWithoutExt = filename.replace('.md', '');
    
    // Split by hyphens
    const parts = nameWithoutExt.split('-');
    
    // Need at least 5 parts: feature-niche-YYYY-MM-DD
    if (parts.length < 5) {
      return null;
    }
    
    // Last 3 parts are date (YYYY-MM-DD)
    const date = parts.slice(-3).join('-');
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return null;
    }
    
    // Everything except last 3 parts
    const remaining = parts.slice(0, -3);
    
    // Try to identify feature (first part or first two parts)
    const knownFeatures = [
      'stargazer',
      'fork-evolution',
      'goldmine-detector',
      'mining-drill',
      'reddit-sniper',
      'reddit-pain-points',
      'viral-radar',
      'hackernews',
      'hackernews-intelligence',
      'github-trending',
      'market-gap-identifier',
      'phantom-scout'
    ];
    
    let feature = '';
    let niche = '';
    
    // Try two-word features first
    const twoWordFeature = remaining.slice(0, 2).join('-');
    if (knownFeatures.includes(twoWordFeature)) {
      feature = twoWordFeature;
      niche = remaining.slice(2).join('-');
    } else if (knownFeatures.includes(remaining[0])) {
      feature = remaining[0];
      niche = remaining.slice(1).join('-');
    } else {
      // Assume first part is feature, rest is niche
      feature = remaining[0];
      niche = remaining.slice(1).join('-');
    }
    
    // Convert hackernews to hackernews-intelligence for consistency
    if (feature === 'hackernews') {
      feature = 'hackernews-intelligence';
    }
    
    return { feature, niche, date };
  }

  /**
   * Post-migration tasks: create symlinks and generate registry
   */
  async postMigration(): Promise<void> {
    console.log('\n🔧 Running post-migration tasks...\n');
    
    const manager = new ReportManager();
    
    // Create directory structure
    manager.ensureDirectories();
    
    // Update latest.md symlinks
    console.log('📎 Creating latest.md symlinks...');
    manager.updateLatestSymlinks();
    
    // Generate registry
    console.log('\n📋 Generating registry...');
    manager.generateRegistry();
    
    // Show statistics
    console.log('\n📊 Final statistics:');
    const stats = manager.getStatistics();
    console.log(`   Total reports: ${stats.total}`);
    console.log(`   Average quality: ${stats.averageQuality}/100`);
    console.log(`   By feature:`, stats.byFeature);
    console.log(`   By status:`, stats.byStatus);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipBackup = args.includes('--skip-backup');
  
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Report Organization Migration Tool    ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const organizer = new ReportOrganizer();
  
  // Create backup (unless skipped)
  if (!skipBackup && !dryRun) {
    organizer.createBackup();
  }
  
  // Run migration
  const report = await organizer.migrateReports(dryRun);
  
  // Post-migration tasks (only if not dry run and no errors)
  if (!dryRun && report.errors === 0) {
    await organizer.postMigration();
  }
  
  console.log('\n✅ Migration complete!\n');
  
  if (dryRun) {
    console.log('ℹ️  This was a dry run. Run without --dry-run to actually migrate files.');
  }
  
  process.exit(report.errors > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { ReportOrganizer };
