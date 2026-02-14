/**
 * Unit test for Goldmine Detector
 * Verifies function signatures and configuration without API calls
 */

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

interface NicheConfig {
  id: string;
  name: string;
  monitoring?: {
    github_topics?: string[];
    keywords?: string[];
  };
  github_topics?: string[];
  keywords?: string[];
}

interface YamlConfig {
  niches: NicheConfig[];
}

async function verifyGoldmineDetector(): Promise<void> {
  console.log('🧪 Verifying Goldmine Detector Implementation...\n');

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 1. Verify config file exists and is readable
    console.log('1️⃣ Checking config file...');
    const configPath = path.join(process.cwd(), 'config', 'target-niches.yaml');
    if (!fs.existsSync(configPath)) {
      errors.push('Config file not found: config/target-niches.yaml');
    } else {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const config = yaml.load(fileContent) as YamlConfig;
      
      if (!config.niches || config.niches.length === 0) {
        errors.push('No niches found in config');
      } else {
        console.log(`   ✅ Config loaded: ${config.niches.length} niches`);
        
        // Verify each niche has required fields
        let nicheIssues = 0;
        config.niches.forEach((niche, i) => {
          const topics = niche.monitoring?.github_topics || niche.github_topics || [];
          if (topics.length === 0) {
            nicheIssues++;
            if (nicheIssues <= 2) {
              warnings.push(`Niche "${niche.id}" has no GitHub topics configured`);
            }
          }
        });
        
        if (nicheIssues > 0) {
          console.log(`   ⚠️  ${nicheIssues} niches missing GitHub topics`);
        }
      }
    }

    // 2. Verify implementation file exists
    console.log('\n2️⃣ Checking implementation file...');
    const implPath = path.join(process.cwd(), 'src', 'lib', 'goldmine-detector.ts');
    if (!fs.existsSync(implPath)) {
      errors.push('Implementation file not found: src/lib/goldmine-detector.ts');
    } else {
      const implContent = fs.readFileSync(implPath, 'utf8');
      
      // Verify required functions exist
      const requiredFunctions = [
        'runGoldmineDetector',
        'calculateGoldmineScore',
        'searchAbandonedRepos',
        'analyzeGoldmine',
        'generateReport'
      ];
      
      requiredFunctions.forEach(fn => {
        if (!implContent.includes(`function ${fn}`) && !implContent.includes(`async function ${fn}`)) {
          errors.push(`Missing required function: ${fn}`);
        }
      });
      
      // Verify interfaces exist
      const requiredInterfaces = [
        'interface Goldmine',
        'interface NicheConfig',
        'interface RebuildOpportunity',
        'interface MonetizationStrategy'
      ];
      
      requiredInterfaces.forEach(iface => {
        if (!implContent.includes(iface)) {
          warnings.push(`Missing interface: ${iface}`);
        }
      });
      
      console.log('   ✅ Implementation file exists and contains required functions');
    }

    // 3. Verify wrapper script exists
    console.log('\n3️⃣ Checking wrapper script...');
    const scriptPath = path.join(process.cwd(), 'scripts', 'detect-goldmines.ts');
    if (!fs.existsSync(scriptPath)) {
      errors.push('Wrapper script not found: scripts/detect-goldmines.ts');
    } else {
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      if (!scriptContent.includes('runGoldmineDetector')) {
        errors.push('Wrapper script does not call runGoldmineDetector');
      }
      console.log('   ✅ Wrapper script exists');
    }

    // 4. Verify workflow file exists
    console.log('\n4️⃣ Checking workflow file...');
    const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'goldmine-detector.yml');
    if (!fs.existsSync(workflowPath)) {
      errors.push('Workflow file not found: .github/workflows/goldmine-detector.yml');
    } else {
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      
      // Verify key workflow elements
      const requiredElements = [
        'name: Goldmine Detector',
        'scripts/detect-goldmines.ts',
        'GITHUB_TOKEN',
        'data/reports/goldmine-'
      ];
      
      requiredElements.forEach(elem => {
        if (!workflowContent.includes(elem)) {
          warnings.push(`Workflow missing element: ${elem}`);
        }
      });
      
      // Check for weekly schedule
      if (workflowContent.includes('cron:') && workflowContent.includes('* * 3')) {
        console.log('   ✅ Workflow configured for weekly run (Wednesday)');
      } else {
        warnings.push('Workflow schedule may not be set for Wednesday');
      }
      
      console.log('   ✅ Workflow file exists');
    }

    // 5. Verify package.json script
    console.log('\n5️⃣ Checking package.json script...');
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      errors.push('package.json not found');
    } else {
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      if (!packageContent.scripts || !packageContent.scripts.goldmine) {
        errors.push('package.json missing "goldmine" script');
      } else if (!packageContent.scripts.goldmine.includes('detect-goldmines')) {
        warnings.push('goldmine script may not point to correct file');
      } else {
        console.log('   ✅ package.json has "goldmine" script');
      }
    }

    // 6. Verify reports directory
    console.log('\n6️⃣ Checking reports directory...');
    const reportsDir = path.join(process.cwd(), 'data', 'reports');
    if (!fs.existsSync(reportsDir)) {
      console.log('   ℹ️  Reports directory will be created on first run');
    } else {
      console.log('   ✅ Reports directory exists');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('\n✅ All checks passed! Goldmine Detector is ready to use.');
      console.log('\n💡 To run: npm run goldmine');
      console.log('💡 Requires: GITHUB_TOKEN environment variable');
    } else {
      if (errors.length > 0) {
        console.log('\n❌ ERRORS:');
        errors.forEach(err => console.log(`   - ${err}`));
      }
      
      if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        warnings.forEach(warn => console.log(`   - ${warn}`));
      }
      
      if (errors.length > 0) {
        console.log('\n❌ Fix errors before running.');
        process.exit(1);
      } else {
        console.log('\n⚠️  Implementation ready but has warnings.');
      }
    }

  } catch (error: any) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyGoldmineDetector();
