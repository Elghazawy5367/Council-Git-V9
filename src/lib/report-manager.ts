/**
 * Report Manager - Handles organization, archiving, and indexing of intelligence reports
 * 
 * Features:
 * - Organizes reports by feature/niche/date structure
 * - Archives reports older than 60 days
 * - Generates JSON indexes for fast searching
 * - Creates latest.md symlinks for each niche
 * - Tracks report quality metrics
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface ReportMetadata {
  feature: string;
  niche: string;
  date: string;
  path: string;
  size_bytes: number;
  quality_score: number;
  items_found: number;
  status: 'complete' | 'partial' | 'insufficient_data' | 'unknown';
}

export interface RegistryData {
  generated_at: string;
  total_reports: number;
  by_feature: Record<string, number>;
  by_niche: Record<string, number>;
  reports: ReportMetadata[];
}

export interface ArchiveIndexEntry {
  original_path: string;
  archived_path: string;
  archived_at: string;
  month: string;
}

export class ReportManager {
  private reportsDir: string;
  private archiveDir: string;
  private registryDir: string;
  private intelligenceDir: string;

  constructor(basePath?: string) {
    const base = basePath || process.cwd();
    this.reportsDir = path.join(base, 'data', 'reports');
    this.archiveDir = path.join(base, 'data', 'archive');
    this.registryDir = path.join(base, 'data', 'registry');
    this.intelligenceDir = path.join(base, 'data', 'intelligence');
  }

  /**
   * Create initial directory structure
   */
  ensureDirectories(): void {
    fs.mkdirSync(this.reportsDir, { recursive: true });
    fs.mkdirSync(this.archiveDir, { recursive: true });
    fs.mkdirSync(this.registryDir, { recursive: true });
    console.log('✅ Directory structure initialized');
  }

  /**
   * Archive reports older than 60 days
   */
  async archiveOldReports(dryRun = false): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 60);
    
    const allReports = this.findAllReports(this.reportsDir);
    let archivedCount = 0;
    const archiveIndex: ArchiveIndexEntry[] = [];
    
    for (const reportPath of allReports) {
      // Skip latest.md symlinks
      if (reportPath.endsWith('latest.md')) continue;
      
      const stats = fs.statSync(reportPath);
      if (stats.mtime < cutoffDate) {
        if (!dryRun) {
          const archived = await this.archiveReport(reportPath);
          if (archived) {
            archiveIndex.push(archived);
            archivedCount++;
          }
        } else {
          console.log(`[DRY RUN] Would archive: ${reportPath}`);
          archivedCount++;
        }
      }
    }
    
    if (!dryRun && archiveIndex.length > 0) {
      await this.updateArchiveIndex(archiveIndex);
    }
    
    console.log(`✅ Archiving complete: ${archivedCount} reports${dryRun ? ' (dry run)' : ''}`);
    return archivedCount;
  }

  /**
   * Move single report to archive
   */
  private async archiveReport(reportPath: string): Promise<ArchiveIndexEntry | null> {
    try {
      // Parse path: data/reports/stargazer/maritime-professionals/2026-01-15.md
      const relativePath = path.relative(this.reportsDir, reportPath);
      const parts = relativePath.split(path.sep);
      
      if (parts.length !== 3) {
        console.warn(`⚠️  Invalid path structure: ${reportPath}`);
        return null;
      }
      
      const [feature, niche, filename] = parts;
      const date = filename.replace('.md', '');
      const month = date.substring(0, 7); // 2026-01
      
      // Create archive path: data/archive/2026-01/stargazer/maritime-professionals/
      const archivePath = path.join(
        this.archiveDir,
        month,
        feature,
        niche,
        filename
      );
      
      fs.mkdirSync(path.dirname(archivePath), { recursive: true });
      fs.renameSync(reportPath, archivePath);
      
      console.log(`📦 Archived: ${feature}/${niche}/${filename} → archive/${month}/`);
      
      return {
        original_path: relativePath,
        archived_path: path.relative(this.archiveDir, archivePath),
        archived_at: new Date().toISOString(),
        month
      };
    } catch (error) {
      console.error(`❌ Error archiving ${reportPath}:`, error);
      return null;
    }
  }

  /**
   * Update archive index with newly archived reports
   */
  private async updateArchiveIndex(entries: ArchiveIndexEntry[]): Promise<void> {
    const indexPath = path.join(this.registryDir, 'archive-index.json');
    
    let existingIndex: ArchiveIndexEntry[] = [];
    if (fs.existsSync(indexPath)) {
      existingIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }
    
    const updatedIndex = [...existingIndex, ...entries];
    fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2));
    
    console.log(`📋 Archive index updated: ${entries.length} new entries`);
  }

  /**
   * Update latest.md symlinks for each niche
   */
  updateLatestSymlinks(): number {
    let symlinkCount = 0;
    
    // Check if reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      console.log('⚠️  Reports directory does not exist yet');
      return 0;
    }
    
    const features = fs.readdirSync(this.reportsDir);
    
    for (const feature of features) {
      const featurePath = path.join(this.reportsDir, feature);
      if (!fs.statSync(featurePath).isDirectory()) continue;
      
      const niches = fs.readdirSync(featurePath);
      for (const niche of niches) {
        const nichePath = path.join(featurePath, niche);
        if (!fs.statSync(nichePath).isDirectory()) continue;
        
        const reports = fs.readdirSync(nichePath)
          .filter(f => f.endsWith('.md') && f !== 'latest.md')
          .sort()
          .reverse();
        
        if (reports.length > 0) {
          const latest = reports[0];
          const latestPath = path.join(nichePath, 'latest.md');
          const targetPath = path.join(nichePath, latest);
          
          // Remove old symlink if exists
          if (fs.existsSync(latestPath)) {
            fs.unlinkSync(latestPath);
          }
          
          // Create new symlink (relative to preserve portability)
          fs.symlinkSync(latest, latestPath);
          console.log(`🔗 ${feature}/${niche}/latest.md → ${latest}`);
          symlinkCount++;
        }
      }
    }
    
    console.log(`✅ Symlinks updated: ${symlinkCount} latest.md files created`);
    return symlinkCount;
  }

  /**
   * Generate registry/current.json
   */
  generateRegistry(): RegistryData {
    const reports = this.findAllReports(this.reportsDir);
    const registry: ReportMetadata[] = [];
    
    for (const reportPath of reports) {
      // Skip symlinks
      if (reportPath.endsWith('latest.md')) continue;
      
      const metadata = this.extractMetadata(reportPath);
      if (metadata) {
        registry.push(metadata);
      }
    }
    
    // Sort by date descending
    registry.sort((a, b) => b.date.localeCompare(a.date));
    
    const output: RegistryData = {
      generated_at: new Date().toISOString(),
      total_reports: registry.length,
      by_feature: this.groupBy(registry, 'feature'),
      by_niche: this.groupBy(registry, 'niche'),
      reports: registry
    };
    
    fs.mkdirSync(this.registryDir, { recursive: true });
    fs.writeFileSync(
      path.join(this.registryDir, 'current.json'),
      JSON.stringify(output, null, 2)
    );
    
    console.log(`✅ Registry updated: ${registry.length} reports indexed`);
    return output;
  }

  /**
   * Find all .md files recursively
   */
  private findAllReports(dir: string): string[] {
    const results: string[] = [];
    
    if (!fs.existsSync(dir)) {
      return results;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        results.push(...this.findAllReports(fullPath));
      } else if (item.endsWith('.md')) {
        results.push(fullPath);
      }
    }
    
    return results;
  }

  /**
   * Extract metadata from report path and content
   */
  private extractMetadata(reportPath: string): ReportMetadata | null {
    try {
      const relativePath = path.relative(this.reportsDir, reportPath);
      const parts = relativePath.split(path.sep);
      
      if (parts.length !== 3) {
        console.warn(`⚠️  Invalid path structure: ${reportPath}`);
        return null;
      }
      
      const [feature, niche, filename] = parts;
      const date = filename.replace('.md', '');
      const content = fs.readFileSync(reportPath, 'utf8');
      const stats = fs.statSync(reportPath);
      
      // Parse frontmatter if exists
      const frontmatter = this.parseFrontmatter(content);
      
      // Determine status based on file size and content
      let status: ReportMetadata['status'] = 'unknown';
      if (stats.size < 300) {
        status = 'insufficient_data';
      } else if (stats.size > 1000) {
        status = 'complete';
      } else {
        status = 'partial';
      }
      
      return {
        feature,
        niche,
        date,
        path: relativePath,
        size_bytes: stats.size,
        quality_score: frontmatter.quality_score || this.calculateQualityScore(content, stats.size),
        items_found: frontmatter.items_found || this.countItems(content),
        status: frontmatter.status || status
      };
    } catch (error) {
      console.error(`❌ Error extracting metadata from ${reportPath}:`, error);
      return null;
    }
  }

  /**
   * Parse YAML frontmatter from markdown
   */
  private parseFrontmatter(content: string): any {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    try {
      return yaml.load(match[1]) || {};
    } catch {
      return {};
    }
  }

  /**
   * Calculate quality score based on content
   */
  private calculateQualityScore(content: string, size: number): number {
    if (size < 300) return 0;
    if (size < 1000) return 30;
    
    let score = 50;
    
    // Check for key sections
    if (content.includes('## ')) score += 10;
    if (content.includes('###')) score += 5;
    if (content.includes('- ') || content.includes('* ')) score += 10;
    if (content.match(/\*\*.*\*\*/)) score += 5;
    if (content.includes('http')) score += 5;
    if (size > 5000) score += 15;
    
    return Math.min(score, 100);
  }

  /**
   * Count items/repos/issues mentioned in report
   */
  private countItems(content: string): number {
    const lines = content.split('\n');
    let count = 0;
    
    for (const line of lines) {
      // Count list items
      if (line.trim().match(/^[-*]\s/)) count++;
      // Count numbered items
      if (line.trim().match(/^\d+\.\s/)) count++;
    }
    
    return count;
  }

  /**
   * Group array of objects by a key
   */
  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = item[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Get report statistics
   */
  getStatistics(): {
    total: number;
    byFeature: Record<string, number>;
    byNiche: Record<string, number>;
    byStatus: Record<string, number>;
    averageQuality: number;
  } {
    const reports = this.findAllReports(this.reportsDir);
    const metadata = reports
      .filter(r => !r.endsWith('latest.md'))
      .map(r => this.extractMetadata(r))
      .filter((m): m is ReportMetadata => m !== null);
    
    const byFeature = this.groupBy(metadata, 'feature');
    const byNiche = this.groupBy(metadata, 'niche');
    const byStatus = this.groupBy(metadata, 'status');
    
    const totalQuality = metadata.reduce((sum, m) => sum + m.quality_score, 0);
    const averageQuality = metadata.length > 0 ? Math.round(totalQuality / metadata.length) : 0;
    
    return {
      total: metadata.length,
      byFeature,
      byNiche,
      byStatus,
      averageQuality
    };
  }
}

// Export convenience functions
export async function archiveOldReports(dryRun = false): Promise<number> {
  const manager = new ReportManager();
  return manager.archiveOldReports(dryRun);
}

export function generateRegistry(): RegistryData {
  const manager = new ReportManager();
  return manager.generateRegistry();
}

export function updateLatestSymlinks(): number {
  const manager = new ReportManager();
  return manager.updateLatestSymlinks();
}
