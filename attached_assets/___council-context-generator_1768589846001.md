# Tab 1

// council-context-generator.ts  
// Tailored for Council project structure  
// Run: npx tsx council-context-generator.ts \[command\] \[feature\]

import \* as fs from 'fs';  
import \* as path from 'path';

interface CouncilFeature {  
  id: string;  
  name: string;  
  route: string;  
  mainComponent: string;  
  relatedFiles: string\[\];  
  configStore?: string;  
  hooks?: string\[\];  
  apis?: string\[\];  
}

// Based on your actual file structure  
const COUNCIL\_FEATURES: CouncilFeature\[\] \= \[  
  {  
    id: 'council',  
    name: 'AI Council (Main Page)',  
    route: '/',  
    mainComponent: 'src/pages/Index.tsx',  
    relatedFiles: \[  
      'src/features/council/components/ControlPanel.tsx',  
      'src/features/council/components/ExpertCard.tsx',  
      'src/features/council/components/SynthesisCard.tsx',  
      'src/features/council/components/VerdictPanel.tsx',  
      'src/features/council/components/Header.tsx',  
    \],  
    configStore: 'src/features/council/store/feature-config-store.ts',  
    hooks: \[  
      'src/features/council/hooks/use-council-queries.ts',  
      'src/features/council/hooks/use-streaming-synthesis.ts',  
    \],  
  },  
  {  
    id: 'dashboard',  
    name: 'Command Center Dashboard',  
    route: '/dashboard',  
    mainComponent: 'src/pages/Dashboard.tsx',  
    relatedFiles: \[  
      'src/features/council/components/MiningDrillPanel.tsx',  
      'src/features/council/components/GoldmineDetector.tsx',  
      'src/features/council/components/FeatureConfigModal.tsx',  
    \],  
    configStore: 'src/features/council/store/feature-config-store.ts',  
  },  
  {  
    id: 'features-dashboard',  
    name: 'Features Dashboard',  
    route: '/features',  
    mainComponent: 'src/pages/FeaturesDashboard.tsx',  
    relatedFiles: \[  
      'src/features/automation/components/FeatureCard.tsx',  
      'src/features/automation/components/FeatureConfigModal.tsx',  
      'src/features/automation/components/ReportsViewer.tsx',  
    \],  
    configStore: 'src/features/automation/store/features-store.ts',  
  },  
  {  
    id: 'quality',  
    name: 'Quality Dashboard',  
    route: '/quality',  
    mainComponent: 'src/pages/QualityDashboard.tsx',  
    relatedFiles: \[\],  
  },  
  {  
    id: 'scout-config',  
    name: 'Scout Configuration',  
    route: '/features/scout',  
    mainComponent: 'src/pages/features/ScoutConfig.tsx',  
    relatedFiles: \[  
      'src/lib/scout.ts',  
      'src/hooks/useGitHub.ts',  
    \],  
  },  
\];

// Intelligence tools from your lib directory  
const INTELLIGENCE\_TOOLS \= \[  
  { id: 'scout', file: 'src/lib/scout.ts', name: 'Phantom Scout' },  
  { id: 'mirror', file: 'src/lib/code-mirror.ts', name: 'Code Mirror' },  
  { id: 'goldmine', file: 'src/lib/goldmine-detector.ts', name: 'Goldmine Detector' },  
  { id: 'mining-drill', file: 'src/lib/mining-drill.ts', name: 'Mining Drill' },  
  { id: 'reddit-sniper', file: 'src/lib/reddit-sniper.ts', name: 'Reddit Sniper' },  
  { id: 'viral-radar', file: 'src/lib/viral-radar.ts', name: 'Viral Radar' },  
  { id: 'twin-mimicry', file: 'src/lib/twin-mimicry.ts', name: 'Twin Mimicry' },  
  { id: 'self-improve', file: 'src/lib/self-improve.ts', name: 'Self-Improving Loop' },  
  { id: 'fork-evolution', file: 'src/lib/fork-evolution.ts', name: 'Fork Evolution' },  
\];

class CouncilContextGenerator {  
  private estimateFileTokens(filePath: string): number {  
    if (\!fs.existsSync(filePath)) return 0;  
    const content \= fs.readFileSync(filePath, 'utf-8');  
    return Math.ceil(content.length / 4);  
  }

  private extractFileInfo(filePath: string) {  
    if (\!fs.existsSync(filePath)) {  
      return { exists: false, lines: 0, exports: \[\], imports: \[\] };  
    }

    const content \= fs.readFileSync(filePath, 'utf-8');  
    const lines \= content.split('\\n').length;

    // Extract exports  
    const exportMatches \= content.matchAll(/export\\s+(?:default\\s+)?(?:const|function|class|interface|type)\\s+(\\w+)/g);  
    const exports \= Array.from(exportMatches).map(m \=\> m\[1\]);

    // Extract imports  
    const importMatches \= content.matchAll(/import\\s+.\*?from\\s+\['"\](.\*)\['"\]/g);  
    const imports \= Array.from(importMatches).map(m \=\> m\[1\]);

    return { exists: true, lines, exports, imports };  
  }

  async generateFeatureContext(featureId: string): Promise\<string\> {  
    const feature \= COUNCIL\_FEATURES.find(f \=\> f.id \=== featureId);  
    if (\!feature) {  
      return \`❌ Feature '${featureId}' not found. Available features:\\n${COUNCIL\_FEATURES.map(f \=\> \`  \- ${f.id}: ${f.name}\`).join('\\n')}\`;  
    }

    let context \= \`\# Council Feature Context: ${feature.name}\\n\\n\`;  
    context \+= \`\#\# Overview\\n\`;  
    context \+= \`- \*\*Route:\*\* \\\`${feature.route}\\\`\\n\`;  
    context \+= \`- \*\*Main Component:\*\* \\\`${feature.mainComponent}\\\`\\n\\n\`;

    // Analyze main component  
    const mainInfo \= this.extractFileInfo(feature.mainComponent);  
    if (mainInfo.exists) {  
      context \+= \`\#\# Main Component Analysis\\n\`;  
      context \+= \`- \*\*File:\*\* \\\`${feature.mainComponent}\\\`\\n\`;  
      context \+= \`- \*\*Lines:\*\* ${mainInfo.lines}\\n\`;  
      context \+= \`- \*\*Exports:\*\* ${mainInfo.exports.join(', ') || 'Default export'}\\n\`;  
      context \+= \`- \*\*Key Imports:\*\*\\n\`;  
      mainInfo.imports.slice(0, 10).forEach(imp \=\> {  
        context \+= \`  \- \\\`${imp}\\\`\\n\`;  
      });  
      context \+= \`\\n\`;  
    }

    // Related files  
    if (feature.relatedFiles.length \> 0\) {  
      context \+= \`\#\# Related Components\\n\\n\`;  
      let totalTokens \= 0;

      for (const file of feature.relatedFiles) {  
        const info \= this.extractFileInfo(file);  
        if (info.exists) {  
          const tokens \= this.estimateFileTokens(file);  
          totalTokens \+= tokens;  
          context \+= \`\#\#\# \\\`${file}\\\`\\n\`;  
          context \+= \`- \*\*Lines:\*\* ${info.lines} (\~${tokens} tokens)\\n\`;  
          context \+= \`- \*\*Exports:\*\* ${info.exports.slice(0, 3).join(', ') || 'Default export'}\\n\`;  
          context \+= \`\\n\`;  
        }  
      }

      context \+= \`\*\*Total context size:\*\* \~${totalTokens} tokens\\n\\n\`;  
    }

    // Store info  
    if (feature.configStore) {  
      context \+= \`\#\# Configuration Store\\n\`;  
      context \+= \`- \*\*File:\*\* \\\`${feature.configStore}\\\`\\n\`;  
      const storeInfo \= this.extractFileInfo(feature.configStore);  
      if (storeInfo.exists) {  
        context \+= \`- \*\*Lines:\*\* ${storeInfo.lines}\\n\`;  
        context \+= \`- \*\*Exports:\*\* ${storeInfo.exports.join(', ')}\\n\`;  
      }  
      context \+= \`\\n\`;  
    }

    // Hooks  
    if (feature.hooks && feature.hooks.length \> 0\) {  
      context \+= \`\#\# Custom Hooks\\n\`;  
      feature.hooks.forEach(hook \=\> {  
        const hookInfo \= this.extractFileInfo(hook);  
        if (hookInfo.exists) {  
          context \+= \`- \\\`${hook}\\\` \- ${hookInfo.exports.join(', ')}\\n\`;  
        }  
      });  
      context \+= \`\\n\`;  
    }

    // Usage example  
    context \+= \`\#\# Quick Start\\n\\n\`;  
    context \+= \`\\\`\\\`\\\`typescript\\n\`;  
    context \+= \`// Navigate to this feature\\n\`;  
    context \+= \`// Route: ${feature.route}\\n\\n\`;  
    context \+= \`// Main component location\\n\`;  
    context \+= \`import Component from '@/${feature.mainComponent.replace('src/', '').replace('.tsx', '')}';\\n\`;  
    context \+= \`\\\`\\\`\\\`\\n\\n\`;

    return context;  
  }

  async generateIntelligenceToolContext(toolId: string): Promise\<string\> {  
    const tool \= INTELLIGENCE\_TOOLS.find(t \=\> t.id \=== toolId);  
    if (\!tool) {  
      return \`❌ Tool '${toolId}' not found. Available tools:\\n${INTELLIGENCE\_TOOLS.map(t \=\> \`  \- ${t.id}: ${t.name}\`).join('\\n')}\`;  
    }

    let context \= \`\# Intelligence Tool: ${tool.name}\\n\\n\`;  
      
    const info \= this.extractFileInfo(tool.file);  
    if (\!info.exists) {  
      return \`❌ File not found: ${tool.file}\`;  
    }

    context \+= \`\#\# Implementation\\n\`;  
    context \+= \`- \*\*File:\*\* \\\`${tool.file}\\\`\\n\`;  
    context \+= \`- \*\*Lines:\*\* ${info.lines}\\n\`;  
    context \+= \`- \*\*Tokens:\*\* \~${this.estimateFileTokens(tool.file)}\\n\\n\`;

    context \+= \`\#\# Exported Functions\\n\`;  
    info.exports.forEach(exp \=\> {  
      context \+= \`- \\\`${exp}\\\`\\n\`;  
    });  
    context \+= \`\\n\`;

    context \+= \`\#\# Dependencies\\n\`;  
    info.imports.slice(0, 10).forEach(imp \=\> {  
      context \+= \`- \\\`${imp}\\\`\\n\`;  
    });  
    context \+= \`\\n\`;

    // Check if it's used in feature configs  
    const configPath \= 'src/features/council/store/feature-config-store.ts';  
    if (fs.existsSync(configPath)) {  
      const configContent \= fs.readFileSync(configPath, 'utf-8');  
      if (configContent.includes(tool.id)) {  
        context \+= \`\#\# Feature Configuration\\n\`;  
        context \+= \`This tool is integrated in the feature configuration store.\\n\`;  
        context \+= \`Check \\\`${configPath}\\\` for configuration options.\\n\\n\`;  
      }  
    }

    return context;  
  }

  async generateRouteComparison(): Promise\<string\> {  
    let comparison \= \`\# Council Routes Comparison\\n\\n\`;  
    comparison \+= \`\*\*Problem:\*\* Users on \\\`/\\\` route expect features from \\\`/dashboard\\\`\\n\\n\`;

    comparison \+= \`\#\# Route Breakdown\\n\\n\`;

    COUNCIL\_FEATURES.forEach(feature \=\> {  
      comparison \+= \`\#\#\# ${feature.name}\\n\`;  
      comparison \+= \`- \*\*Route:\*\* \\\`${feature.route}\\\`\\n\`;  
      comparison \+= \`- \*\*Component:\*\* \\\`${feature.mainComponent}\\\`\\n\`;  
        
      const info \= this.extractFileInfo(feature.mainComponent);  
      if (info.exists) {  
        comparison \+= \`- \*\*Size:\*\* ${info.lines} lines\\n\`;  
      }  
        
      comparison \+= \`\\n\`;  
    });

    comparison \+= \`\#\# Key Differences\\n\\n\`;  
    comparison \+= \`| Route | Purpose | Automation Features | Analytics |\\n\`;  
    comparison \+= \`|-------|---------|-------------------|----------|\\n\`;  
    comparison \+= \`| \\\`/\\\` | Real-time AI Council execution | ❌ | ❌ |\\n\`;  
    comparison \+= \`| \\\`/dashboard\\\` | Command Center with all features | ✅ | ✅ |\\n\`;  
    comparison \+= \`| \\\`/features\\\` | Focused automation dashboard | ✅ | ✅ |\\n\`;  
    comparison \+= \`| \\\`/quality\\\` | Quality metrics | ❌ | ✅ |\\n\\n\`;

    comparison \+= \`\#\# Recommendation\\n\\n\`;  
    comparison \+= \`Users looking for automation features should navigate to:\\n\`;  
    comparison \+= \`- \*\*\\\`/dashboard\\\`\*\* \- Full command center\\n\`;  
    comparison \+= \`- \*\*\\\`/features\\\`\*\* \- Automation-focused view\\n\\n\`;

    return comparison;  
  }

  async generateOrphanedComponentsReport(): Promise\<string\> {  
    let report \= \`\# Orphaned Components Report\\n\\n\`;

    // Known orphaned files from analysis  
    const orphanedFiles \= \[  
      'src/features/council/components/SettingsModal.tsx',  
      'src/new-structure/features/council/components/CouncilFeature.tsx',  
      'src/new-structure/features/council/components/CouncilFeature.tsx.backup',  
      'src/old-structure/components/ExpertLegacy.tsx',  
    \];

    report \+= \`\#\# Files to Remove\\n\\n\`;  
    orphanedFiles.forEach(file \=\> {  
      const exists \= fs.existsSync(file);  
      report \+= \`- \\\`${file}\\\` ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}\\n\`;  
    });

    report \+= \`\\n\#\# Recommended Actions\\n\\n\`;  
    report \+= \`1. \*\*Remove \\\`src/new-structure/\\\`\*\* \- Incomplete migration, not imported anywhere\\n\`;  
    report \+= \`2. \*\*Remove \\\`src/old-structure/\\\`\*\* \- Legacy code, not used\\n\`;  
    report \+= \`3. \*\*Remove duplicate SettingsModal\*\* \- Use \\\`src/features/settings/components/SettingsModal.tsx\\\` only\\n\\n\`;

    report \+= \`\#\# Cleanup Commands\\n\\n\`;  
    report \+= \`\\\`\\\`\\\`bash\\n\`;  
    report \+= \`\# Remove orphaned directories\\n\`;  
    report \+= \`rm \-rf src/new-structure/\\n\`;  
    report \+= \`rm \-rf src/old-structure/\\n\\n\`;  
    report \+= \`\# Remove duplicate SettingsModal\\n\`;  
    report \+= \`rm src/features/council/components/SettingsModal.tsx\\n\`;  
    report \+= \`\\\`\\\`\\\`\\n\\n\`;

    return report;  
  }

  async generateNavigationGuide(): Promise\<string\> {  
    let guide \= \`\# Council Project Navigation Guide\\n\\n\`;  
    guide \+= \`\*\*Project:\*\* Council Intelligence Platform\\n\`;  
    guide \+= \`\*\*Size:\*\* 280+ files, \~100k lines\\n\\n\`;

    guide \+= \`\#\# Quick Navigation\\n\\n\`;

    guide \+= \`\#\#\# Main Routes\\n\`;  
    COUNCIL\_FEATURES.forEach(f \=\> {  
      guide \+= \`- \*\*${f.route}\*\* → ${f.name}\\n\`;  
    });  
    guide \+= \`\\n\`;

    guide \+= \`\#\#\# Intelligence Tools\\n\`;  
    INTELLIGENCE\_TOOLS.forEach(t \=\> {  
      guide \+= \`- \*\*${t.name}\*\* → \\\`${t.file}\\\`\\n\`;  
    });  
    guide \+= \`\\n\`;

    guide \+= \`\#\# Directory Structure\\n\\n\`;  
    guide \+= \`\\\`\\\`\\\`\\n\`;  
    guide \+= \`src/\\n\`;  
    guide \+= \`├── components/          \# Reusable UI components\\n\`;  
    guide \+= \`│   └── primitives/      \# shadcn/ui components\\n\`;  
    guide \+= \`├── features/            \# Feature modules\\n\`;  
    guide \+= \`│   ├── automation/      \# Automation features\\n\`;  
    guide \+= \`│   ├── council/         \# AI Council core\\n\`;  
    guide \+= \`│   ├── dashboard/       \# Dashboard analytics\\n\`;  
    guide \+= \`│   └── settings/        \# Settings management\\n\`;  
    guide \+= \`├── hooks/               \# Custom React hooks\\n\`;  
    guide \+= \`├── lib/                 \# Intelligence tools & utilities\\n\`;  
    guide \+= \`└── pages/               \# Route components\\n\`;  
    guide \+= \`\\\`\\\`\\\`\\n\\n\`;

    guide \+= \`\#\# Feature Store Locations\\n\\n\`;  
    guide \+= \`- \*\*Feature Config:\*\* \\\`src/features/council/store/feature-config-store.ts\\\` (18 features)\\n\`;  
    guide \+= \`- \*\*Automation Store:\*\* \\\`src/features/automation/store/features-store.ts\\\`\\n\`;  
    guide \+= \`- \*\*Settings Store:\*\* \\\`src/features/settings/store/settings-store.ts\\\`\\n\\n\`;

    guide \+= \`\#\# Working with AI Assistants\\n\\n\`;  
    guide \+= \`Generate context for specific areas:\\n\`;  
    guide \+= \`\\\`\\\`\\\`bash\\n\`;  
    guide \+= \`\# Main AI Council page\\n\`;  
    guide \+= \`npx tsx council-context-generator.ts feature council\\n\\n\`;  
    guide \+= \`\# Command Center dashboard\\n\`;  
    guide \+= \`npx tsx council-context-generator.ts feature dashboard\\n\\n\`;  
    guide \+= \`\# Intelligence tool\\n\`;  
    guide \+= \`npx tsx council-context-generator.ts tool scout\\n\\n\`;  
    guide \+= \`\# Route comparison\\n\`;  
    guide \+= \`npx tsx council-context-generator.ts routes\\n\`;  
    guide \+= \`\\\`\\\`\\\`\\n\\n\`;

    return guide;  
  }  
}

// CLI  
async function main() {  
  const \[command, arg\] \= process.argv.slice(2);  
  const generator \= new CouncilContextGenerator();

  switch (command) {  
    case 'feature':  
      if (\!arg) {  
        console.log('Available features:');  
        COUNCIL\_FEATURES.forEach(f \=\> console.log(\`  ${f.id}: ${f.name}\`));  
        console.log('\\nUsage: npx tsx council-context-generator.ts feature \<feature-id\>');  
        process.exit(1);  
      }  
      const featureContext \= await generator.generateFeatureContext(arg);  
      console.log(featureContext);  
      fs.writeFileSync(\`./context-${arg}.md\`, featureContext);  
      console.log(\`\\n✅ Saved to context-${arg}.md\`);  
      break;

    case 'tool':  
      if (\!arg) {  
        console.log('Available tools:');  
        INTELLIGENCE\_TOOLS.forEach(t \=\> console.log(\`  ${t.id}: ${t.name}\`));  
        console.log('\\nUsage: npx tsx council-context-generator.ts tool \<tool-id\>');  
        process.exit(1);  
      }  
      const toolContext \= await generator.generateIntelligenceToolContext(arg);  
      console.log(toolContext);  
      fs.writeFileSync(\`./context-tool-${arg}.md\`, toolContext);  
      console.log(\`\\n✅ Saved to context-tool-${arg}.md\`);  
      break;

    case 'routes':  
      const routeComparison \= await generator.generateRouteComparison();  
      console.log(routeComparison);  
      fs.writeFileSync('./ROUTE\_COMPARISON.md', routeComparison);  
      console.log('\\n✅ Saved to ROUTE\_COMPARISON.md');  
      break;

    case 'orphaned':  
      const orphanedReport \= await generator.generateOrphanedComponentsReport();  
      console.log(orphanedReport);  
      fs.writeFileSync('./ORPHANED\_COMPONENTS.md', orphanedReport);  
      console.log('\\n✅ Saved to ORPHANED\_COMPONENTS.md');  
      break;

    case 'guide':  
      const guide \= await generator.generateNavigationGuide();  
      console.log(guide);  
      fs.writeFileSync('./COUNCIL\_NAVIGATION\_GUIDE.md', guide);  
      console.log('\\n✅ Saved to COUNCIL\_NAVIGATION\_GUIDE.md');  
      break;

    case 'all':  
      console.log('🚀 Generating all context files...\\n');  
        
      // Generate feature contexts  
      for (const feature of COUNCIL\_FEATURES) {  
        const ctx \= await generator.generateFeatureContext(feature.id);  
        fs.writeFileSync(\`./context-${feature.id}.md\`, ctx);  
        console.log(\`✅ Generated context-${feature.id}.md\`);  
      }

      // Generate tool contexts  
      for (const tool of INTELLIGENCE\_TOOLS) {  
        const ctx \= await generator.generateIntelligenceToolContext(tool.id);  
        fs.writeFileSync(\`./context-tool-${tool.id}.md\`, ctx);  
        console.log(\`✅ Generated context-tool-${tool.id}.md\`);  
      }

      // Generate guides  
      fs.writeFileSync('./ROUTE\_COMPARISON.md', await generator.generateRouteComparison());  
      fs.writeFileSync('./ORPHANED\_COMPONENTS.md', await generator.generateOrphanedComponentsReport());  
      fs.writeFileSync('./COUNCIL\_NAVIGATION\_GUIDE.md', await generator.generateNavigationGuide());

      console.log('\\n✅ All context files generated\!');  
      break;

    default:  
      console.log('Council Context Generator\\n');  
      console.log('Usage: npx tsx council-context-generator.ts \<command\> \[arg\]\\n');  
      console.log('Commands:');  
      console.log('  feature \<id\>   Generate context for a specific feature');  
      console.log('  tool \<id\>      Generate context for an intelligence tool');  
      console.log('  routes         Compare all routes');  
      console.log('  orphaned       Report orphaned components');  
      console.log('  guide          Generate navigation guide');  
      console.log('  all            Generate all context files');  
      console.log('\\nExamples:');  
      console.log('  npx tsx council-context-generator.ts feature council');  
      console.log('  npx tsx council-context-generator.ts tool scout');  
      console.log('  npx tsx council-context-generator.ts routes');  
      console.log('  npx tsx council-context-generator.ts all');  
  }  
}

main().catch(console.error);

# Tab 2

# **🎯 Council Project \- Quick Reference**

**For Your Specific 280-File Codebase**

---

## **📍 Where Your Features Actually Are**

### **Route Confusion Solved**

| What You See | Where It Actually Is | Route |
| ----- | ----- | ----- |
| AI Council execution | ✅ Main page | `/` |
| **Automation features** | ⚠️ **Dashboard page** | `/dashboard` |
| Feature configurations | ⚠️ **Dashboard page** | `/dashboard` |
| Analytics & reports | ⚠️ **Features page** | `/features` |

**🚨 Common Mistake:** Users on `/` expecting to see automation features that are actually on `/dashboard`

---

## **🗺️ Your Actual File Structure**

src/  
├── pages/                    \# Route components  
│   ├── Index.tsx            \# Route: / (AI Council)  
│   ├── Dashboard.tsx        \# Route: /dashboard (Command Center)  
│   ├── FeaturesDashboard.tsx \# Route: /features  
│   ├── QualityDashboard.tsx \# Route: /quality  
│   └── features/  
│       └── ScoutConfig.tsx  \# Route: /features/scout  
│  
├── features/                 \# Feature modules  
│   ├── council/             \# AI Council core  
│   │   ├── components/      \# 16 components  
│   │   ├── store/           \# 5 stores  
│   │   ├── hooks/           \# 2 custom hooks  
│   │   └── lib/             \# Core logic  
│   ├── automation/          \# Automation features  
│   │   ├── components/      \# 4 components  
│   │   ├── store/           \# 2 stores  
│   │   └── lib/             \# Execution engine  
│   ├── dashboard/           \# Dashboard analytics  
│   └── settings/            \# Settings management  
│  
└── lib/                     \# Intelligence tools (29 files)  
    ├── scout.ts             \# Phantom Scout  
    ├── goldmine-detector.ts \# Goldmine Detector  
    ├── mining-drill.ts      \# Mining Drill  
    ├── reddit-sniper.ts     \# Reddit Sniper  
    └── ... (25 more tools)

---

## **⚡ Quick Commands**

### **Generate Context (Tailored to Your Project)**

\# Main AI Council page (/)  
npx tsx council-context-generator.ts feature council

\# Command Center (/dashboard) \- where automation lives  
npx tsx council-context-generator.ts feature dashboard

\# Automation features dashboard (/features)  
npx tsx council-context-generator.ts feature features-dashboard

\# Specific intelligence tool  
npx tsx council-context-generator.ts tool scout

\# Compare all routes  
npx tsx council-context-generator.ts routes

\# Find orphaned files  
npx tsx council-context-generator.ts orphaned

\# Generate everything  
npx tsx council-context-generator.ts all

---

## **🧩 Your 18 Features (Not 15\!)**

### **Core Intelligence Tools**

1. **scout** \- Phantom Scout  
2. **mirror** \- Code Mirror System  
3. **quality** \- QUALITY Amplification Pipeline  
4. **selfImprove** \- Self-Improving Loop  
5. **stargazerAnalysis** \- Stargazer Analysis  
6. **githubTrending** \- GitHub Trending  
7. **marketGap** \- Market Gap Identifier  
8. **redditSniper** \- Reddit Sniper  
9. **redditPainPoints** \- Reddit Pain Points  
10. **agentOrchestration** \- Agent Orchestration

### **Backend/Infrastructure (No UI)**

11. **dataFetching** \- Data Fetching  
12. **typeSafeForms** \- Type-Safe Forms  
13. **errorHandling** \- Error Handling  
14. **authSecurity** \- Auth & Security  
15. **mobileDrawers** \- Mobile Drawers  
16. **virtualizedLists** \- Virtualized Lists  
17. **streamingAI** \- Streaming AI Responses  
18. **localDatabase** \- Local Database

---

## **🔍 Key Store Locations**

// Feature configurations (18 features)  
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';

// Automation features  
import { useFeaturesStore } from '@/features/automation/store/features-store';

// User settings  
import { useSettingsStore } from '@/features/settings/store/settings-store';

// Execution state  
import { useExecutionStore } from '@/features/council/store/execution-store';

// Control panel state  
import { useControlPanelStore } from '@/features/council/store/control-panel-store';

---

## **🧹 Cleanup Needed**

### **Orphaned Files to Remove**

\# Incomplete migration \- not used anywhere  
rm \-rf src/new-structure/

\# Legacy code \- not imported  
rm \-rf src/old-structure/

\# Duplicate SettingsModal (use settings/components version)  
rm src/features/council/components/SettingsModal.tsx

---

## **🎯 AI Assistant Workflow**

### **For Adding Dashboard Feature**

\# 1\. Generate dashboard context  
npx tsx council-context-generator.ts feature dashboard

\# 2\. Output file: context-dashboard.md (\~2,500 tokens)

\# 3\. Share with AI:  
"""  
I'm working on the Council Command Center dashboard.

\[Paste context-dashboard.md\]

Task: Add new analytics card showing feature execution history  
"""

### **For Modifying Intelligence Tool**

\# 1\. Generate tool context  
npx tsx council-context-generator.ts tool scout

\# 2\. Output file: context-tool-scout.md (\~1,500 tokens)

\# 3\. Share with AI:  
"""  
I need to modify the Scout tool to filter by language.

\[Paste context-tool-scout.md\]

Task: Add language filter parameter to scout function  
"""

---

## **📊 Token Budget for Your Files**

| File Type | Typical Size | Tokens |
| ----- | ----- | ----- |
| Page component | 300-600 lines | 1,500-3,000 |
| Feature component | 150-400 lines | 750-2,000 |
| Intelligence tool | 200-800 lines | 1,000-4,000 |
| Store file | 100-300 lines | 500-1,500 |
| Config file | 200-500 lines | 1,000-2,500 |

**Context Budget:** Stay under 6,000 tokens per AI session

* Feature context: \~2,000 tokens  
* Related files: \~3,000 tokens  
* Task description: \~1,000 tokens

---

## **🔧 Common Tasks**

### **Adding New Feature to Dashboard**

**Files to modify:**

1. `src/features/council/store/feature-config-store.ts` \- Add config  
2. `src/pages/Dashboard.tsx` \- Add UI card  
3. `src/lib/<new-tool>.ts` \- Implement logic

**Context needed:**

npx tsx council-context-generator.ts feature dashboard  
cat context-dashboard.md  
\# Share \~2,500 tokens with AI

### **Fixing Bug in Intelligence Tool**

**Files to check:**

1. `src/lib/<tool>.ts` \- Tool implementation  
2. `src/features/automation/lib/execution-engine.ts` \- Execution  
3. `src/features/automation/store/features-store.ts` \- State

**Context needed:**

npx tsx council-context-generator.ts tool \<tool-name\>  
\# Share \~1,500 tokens with AI

### **Adding UI Component**

**Files to modify:**

1. `src/features/council/components/<Component>.tsx` \- New component  
2. `src/pages/Index.tsx` or `Dashboard.tsx` \- Use component

**Context needed:**

npx tsx council-context-generator.ts feature council  
\# Share component patterns doc (\~1,000 tokens)

---

## **🚨 Critical Findings from Your Analysis**

### **✅ What's Working**

* No 0-byte files  
* No broken imports  
* No circular dependencies  
* Clean routing structure  
* Well-organized feature modules

### **⚠️ Known Issues**

1. **Route confusion** \- Features split across `/`, `/dashboard`, `/features`  
2. **Orphaned files** \- `new-structure/`, `old-structure/`, duplicate SettingsModal  
3. **Documentation mismatch** \- Says 15 features, actually 18

### **🎯 Recommendations**

1. Consider consolidating automation features to one route  
2. Remove orphaned directories  
3. Update documentation to reflect 18 features  
4. Add route navigation hints in UI

---

## **📚 Your Specific Module Sizes**

### **Largest Files (Lines)**

* `src/lib/scout.ts` \- 29,109 lines  
* `src/features/council/components/FeatureConfigModal.tsx` \- 45,047 lines  
* `src/features/automation/components/FeatureConfigModal.tsx` \- 25,748 lines  
* `src/features/council/api/ai-client.ts` \- 27,359 lines

### **Key Insight**

Your largest files are **FeatureConfigModal** and **ai-client**. When working on these with AI:

* Don't paste the entire file  
* Extract specific sections (50-100 lines)  
* Reference the rest by line numbers

---

## **🎓 Next Steps**

**Run context generator:**

 npx tsx council-context-generator.ts all

1. 

**Clean up orphaned files:**

 bash cleanup-orphaned.sh

2. 

**Generate navigation guide:**

 npx tsx council-context-generator.ts guide

3.   
4. **Start working with AI** using targeted contexts\!

---

**Print this card** and keep it handy while developing\! 📌

# Tab 3

\#\!/bin/bash  
\# cleanup-orphaned.sh  
\# Removes orphaned and duplicate files from Council project  
\# Based on file analysis findings

set \-e

echo "🧹 Council Project Cleanup"  
echo "=========================="  
echo ""

\# Colors  
RED='\\033\[0;31m'  
GREEN='\\033\[0;32m'  
YELLOW='\\033\[1;33m'  
BLUE='\\033\[0;34m'  
NC='\\033\[0m' \# No Color

\# Safety check  
if \[ \! \-f "package.json" \]; then  
    echo \-e "${RED}❌ Error: Not in project root (package.json not found)${NC}"  
    exit 1  
fi

if \[ \! \-d "src" \]; then  
    echo \-e "${RED}❌ Error: src directory not found${NC}"  
    exit 1  
fi

echo \-e "${YELLOW}⚠️  This script will remove orphaned files and directories.${NC}"  
echo \-e "${YELLOW}   Make sure you have committed your work or created a backup\!${NC}"  
echo ""  
read \-p "Continue? (y/n) " \-n 1 \-r  
echo  
if \[\[ \! $REPLY \=\~ ^\[Yy\]$ \]\]; then  
    echo "Cancelled."  
    exit 1  
fi

echo ""

\# Create backup  
BACKUP\_DIR="backup-$(date \+%Y%m%d-%H%M%S)"  
echo \-e "${BLUE}📦 Creating backup...${NC}"

mkdir \-p "$BACKUP\_DIR"

\# Backup orphaned directories  
if \[ \-d "src/new-structure" \]; then  
    cp \-r src/new-structure "$BACKUP\_DIR/"  
    echo "  ✓ Backed up src/new-structure"  
fi

if \[ \-d "src/old-structure" \]; then  
    cp \-r src/old-structure "$BACKUP\_DIR/"  
    echo "  ✓ Backed up src/old-structure"  
fi

\# Backup duplicate SettingsModal  
if \[ \-f "src/features/council/components/SettingsModal.tsx" \]; then  
    mkdir \-p "$BACKUP\_DIR/council-components"  
    cp src/features/council/components/SettingsModal.tsx "$BACKUP\_DIR/council-components/"  
    echo "  ✓ Backed up duplicate SettingsModal"  
fi

echo \-e "${GREEN}✓ Backup created in: $BACKUP\_DIR${NC}"  
echo ""

\# Remove orphaned directories  
echo \-e "${BLUE}🗑️  Removing orphaned directories...${NC}"

if \[ \-d "src/new-structure" \]; then  
    rm \-rf src/new-structure  
    echo \-e "${GREEN}  ✓ Removed src/new-structure/${NC}"  
else  
    echo \-e "${YELLOW}  ⊘ src/new-structure/ not found (already removed?)${NC}"  
fi

if \[ \-d "src/old-structure" \]; then  
    rm \-rf src/old-structure  
    echo \-e "${GREEN}  ✓ Removed src/old-structure/${NC}"  
else  
    echo \-e "${YELLOW}  ⊘ src/old-structure/ not found (already removed?)${NC}"  
fi

echo ""

\# Remove duplicate SettingsModal  
echo \-e "${BLUE}🗑️  Removing duplicate components...${NC}"

if \[ \-f "src/features/council/components/SettingsModal.tsx" \]; then  
    rm src/features/council/components/SettingsModal.tsx  
    echo \-e "${GREEN}  ✓ Removed duplicate SettingsModal from council/components${NC}"  
    echo \-e "     (Keeping the one in features/settings/components/)${NC}"  
else  
    echo \-e "${YELLOW}  ⊘ Duplicate SettingsModal not found (already removed?)${NC}"  
fi

echo ""

\# Verify imports  
echo \-e "${BLUE}🔍 Checking for broken imports...${NC}"

\# Check if any remaining files import from removed directories  
BROKEN\_IMPORTS=0

if grep \-r "from.\*new-structure" src/ 2\>/dev/null; then  
    echo \-e "${RED}  ❌ Found imports from new-structure (need to fix)${NC}"  
    BROKEN\_IMPORTS=1  
else  
    echo \-e "${GREEN}  ✓ No imports from new-structure${NC}"  
fi

if grep \-r "from.\*old-structure" src/ 2\>/dev/null; then  
    echo \-e "${RED}  ❌ Found imports from old-structure (need to fix)${NC}"  
    BROKEN\_IMPORTS=1  
else  
    echo \-e "${GREEN}  ✓ No imports from old-structure${NC}"  
fi

\# Check for imports of the removed SettingsModal  
if grep \-r "from.\*council/components/SettingsModal" src/ 2\>/dev/null; then  
    echo \-e "${RED}  ❌ Found imports of removed SettingsModal (need to fix)${NC}"  
    echo \-e "     Update to: import from '@/features/settings/components/SettingsModal'${NC}"  
    BROKEN\_IMPORTS=1  
else  
    echo \-e "${GREEN}  ✓ No imports of removed SettingsModal${NC}"  
fi

echo ""

\# Summary  
echo "=========================="  
echo \-e "${GREEN}✅ Cleanup Complete\!${NC}"  
echo "=========================="  
echo ""  
echo "Removed:"  
echo "  • src/new-structure/ (incomplete migration)"  
echo "  • src/old-structure/ (legacy code)"  
echo "  • src/features/council/components/SettingsModal.tsx (duplicate)"  
echo ""  
echo "Backup location: $BACKUP\_DIR"  
echo ""

if \[ $BROKEN\_IMPORTS \-eq 1 \]; then  
    echo \-e "${YELLOW}⚠️  Warning: Some files still import from removed directories${NC}"  
    echo "   You need to fix these imports manually."  
    echo ""  
    echo "   Search for broken imports:"  
    echo "     grep \-r 'new-structure\\\\|old-structure\\\\|council/components/SettingsModal' src/"  
    echo ""  
else  
    echo \-e "${GREEN}✓ No broken imports detected${NC}"  
    echo ""  
fi

\# Offer to update .gitignore  
if \[ \-f ".gitignore" \]; then  
    if \! grep \-q "backup-" .gitignore; then  
        echo \-e "${BLUE}💡 Tip: Add backup directories to .gitignore${NC}"  
        read \-p "   Add 'backup-\*/' to .gitignore? (y/n) " \-n 1 \-r  
        echo  
        if \[\[ $REPLY \=\~ ^\[Yy\]$ \]\]; then  
            echo "" \>\> .gitignore  
            echo "\# Cleanup backups" \>\> .gitignore  
            echo "backup-\*/" \>\> .gitignore  
            echo \-e "${GREEN}   ✓ Updated .gitignore${NC}"  
        fi  
    fi  
fi

echo ""  
echo "Next steps:"  
echo "  1\. Run tests: npm test"  
echo "  2\. Check the app: npm run dev"  
echo "  3\. If everything works, delete backup: rm \-rf $BACKUP\_DIR"  
echo "  4\. Commit changes: git add . && git commit \-m 'Clean up orphaned files'"  
echo ""  
echo "Done\! 🎉"

# Tab 4

# **🎯 Council Project \- Complete AI Development Guide**

**Your Custom Guide for 280 Files, 100k Lines**

Based on your actual file structure and analysis findings.

---

## **🚨 Critical Discovery: Route Confusion**

### **The Problem**

Users visit your app and see different things depending on the route:

| Route | What Users See | What They Expect |
| ----- | ----- | ----- |
| `/` | AI Council execution interface | ✅ Correct |
| `/dashboard` | **Command Center with ALL automation features** | ⚠️ Users don't know this exists |
| `/features` | Focused automation dashboard | ⚠️ Users don't know this exists |

**Issue:** Most users land on `/` and never discover `/dashboard` where all the automation magic happens\!

### **The Solution**

**Option 1: Add Navigation (Quick Fix)**

// In src/pages/Index.tsx, add a prominent button  
\<Button   
  onClick={() \=\> navigate('/dashboard')}  
  className="w-full"  
\>  
  🚀 View All Automation Features →  
\</Button\>

**Option 2: Consolidate Routes (Better UX)** Move automation features from `/dashboard` to `/` as tabs

---

## **📁 Your Actual File Structure**

src/  
├── App.tsx                  \# Main app, routing setup  
├── main.tsx                 \# Entry point  
│  
├── pages/                   \# 🎯 ROUTE COMPONENTS  
│   ├── Index.tsx           \# / \- AI Council execution  
│   ├── Dashboard.tsx       \# /dashboard \- Command Center ⭐  
│   ├── FeaturesDashboard.tsx \# /features \- Automation  
│   ├── QualityDashboard.tsx  \# /quality \- Quality metrics  
│   └── features/  
│       └── ScoutConfig.tsx  \# /features/scout  
│  
├── features/                \# 🎨 FEATURE MODULES  
│   ├── council/            \# AI Council core  
│   │   ├── components/     \# 16 components  
│   │   │   ├── ControlPanel.tsx       \# Main control UI  
│   │   │   ├── ExpertCard.tsx         \# Expert display  
│   │   │   ├── FeatureConfigModal.tsx \# Config UI ⭐  
│   │   │   ├── GoldmineDetector.tsx   \# Goldmine UI  
│   │   │   ├── MiningDrillPanel.tsx   \# Mining Drill UI  
│   │   │   └── ...  
│   │   ├── store/          \# 5 Zustand stores  
│   │   │   ├── feature-config-store.ts \# 18 features ⭐  
│   │   │   ├── execution-store.ts  
│   │   │   └── ...  
│   │   ├── hooks/          \# Custom hooks  
│   │   └── lib/            \# Core logic  
│   │  
│   ├── automation/         \# Automation system  
│   │   ├── components/  
│   │   ├── store/  
│   │   │   └── features-store.ts  
│   │   └── lib/  
│   │       └── execution-engine.ts  
│   │  
│   ├── dashboard/          \# Dashboard analytics  
│   └── settings/           \# Settings management  
│  
├── lib/                    \# 🧠 INTELLIGENCE TOOLS (29 files)  
│   ├── scout.ts           \# Phantom Scout (29k lines\!)  
│   ├── goldmine-detector.ts  
│   ├── mining-drill.ts  
│   ├── reddit-sniper.ts  
│   ├── viral-radar.ts  
│   ├── twin-mimicry.ts  
│   ├── self-improve.ts  
│   ├── fork-evolution.ts  
│   └── ... (21 more)  
│  
├── hooks/                  \# Custom React hooks  
│   ├── useGitHub.ts  
│   ├── useCommunityIntelligence.ts  
│   └── use-toast.ts  
│  
└── components/             \# Reusable UI components  
    ├── primitives/         \# shadcn/ui (58 components)  
    └── ...

---

## **🎯 Your 18 Features Explained**

### **Fully Integrated (UI \+ Backend)**

1. **scout** \- Phantom Scout

   * File: `src/lib/scout.ts` (29k lines\!)  
   * UI: Dashboard \+ Features pages  
   * Config: ✅ Full configuration available  
2. **mirror** \- Code Mirror System

   * File: `src/lib/code-mirror.ts`  
   * UI: Dashboard \+ Features pages  
   * Purpose: Analyze code quality  
3. **quality** \- QUALITY Amplification Pipeline

   * UI: Quality Dashboard (`/quality`)  
   * Purpose: Enhance output quality  
4. **selfImprove** \- Self-Improving Loop

   * File: `src/lib/self-improve.ts`  
   * Purpose: Continuous improvement system  
5. **stargazerAnalysis** \- Stargazer Analysis

   * Purpose: Analyze GitHub stargazers  
6. **githubTrending** \- GitHub Trending

   * Purpose: Track trending repositories  
7. **marketGap** \- Market Gap Identifier

   * File: `src/lib/goldmine-detector.ts`  
   * Purpose: Find market opportunities  
8. **redditSniper** \- Reddit Sniper

   * File: `src/lib/reddit-sniper.ts`  
   * UI: Quick access button in ControlPanel  
9. **redditPainPoints** \- Reddit Pain Points

   * Purpose: Extract pain points from Reddit  
10. **agentOrchestration** \- Agent Orchestration

    * Purpose: Coordinate multiple agents

### **Backend Only (No UI)**

11-18: Infrastructure features (dataFetching, typeSafeForms, errorHandling, authSecurity, mobileDrawers, virtualizedLists, streamingAI, localDatabase)

---

## **⚡ Quick Commands**

### **1\. Generate Context for Your Project**

\# Install if needed  
npm install \--save-dev tsx

\# Make executable  
chmod \+x council-context-generator.ts

\# Generate contexts  
npx tsx council-context-generator.ts feature council  
npx tsx council-context-generator.ts feature dashboard  
npx tsx council-context-generator.ts tool scout  
npx tsx council-context-generator.ts routes  
npx tsx council-context-generator.ts guide  
npx tsx council-context-generator.ts all

### **2\. Clean Up Orphaned Files**

\# Make executable  
chmod \+x cleanup-orphaned.sh

\# Run cleanup  
./cleanup-orphaned.sh

**Removes:**

* `src/new-structure/` \- Incomplete migration  
* `src/old-structure/` \- Legacy code  
* Duplicate `SettingsModal.tsx`

### **3\. Analyze Your Codebase**

\# Original analysis tools still work  
npx tsx analyze-repo.ts  
./quick-analyze.sh

---

## **🧠 Working with AI Assistants**

### **Scenario 1: Adding Feature to Dashboard**

**Your Dashboard:** `src/pages/Dashboard.tsx` (16,677 bytes)

**Steps:**

\# 1\. Generate context  
npx tsx council-context-generator.ts feature dashboard

\# 2\. Output: context-dashboard.md (\~2,500 tokens)

\# 3\. Share with AI:

I'm working on the Council Command Center dashboard.

Project: Council Intelligence Platform (280 files, 100k lines)

\[Paste context-dashboard.md content here\]

Current Dashboard displays these "Core Experts":  
\- GitHub Trending  
\- Market Gap Identifier    
\- Stargazer Analysis  
\- (and 7 more...)

Task: Add new feature card for "Competitor Analysis" that:  
1\. Shows competitor activity  
2\. Has configure/trigger buttons like existing cards  
3\. Uses FeatureConfigModal for settings  
4\. Integrates with feature-config-store

Follow existing patterns in Dashboard.tsx.

**Token Usage:** \~3,500 tokens ✅

---

### **Scenario 2: Fixing Intelligence Tool Bug**

**Your Tool:** `src/lib/scout.ts` (29,109 lines\! 😱)

**DON'T:** Paste entire file (7,000+ tokens\!)

**DO:** Extract relevant section

\# 1\. Generate tool context  
npx tsx council-context-generator.ts tool scout

\# 2\. Share with AI:

I'm fixing a bug in the Phantom Scout tool.

Project: Council Intelligence Platform  
Tool: src/lib/scout.ts (29k lines)

\[Paste context-tool-scout.md \- shows exports and structure\]

Bug: Scout times out when scanning repos with 10k+ files

Relevant section (lines 450-520):  
\[Paste ONLY the function that's timing out\]

Task: Add timeout handling and progress callback

**Token Usage:** \~2,000 tokens ✅

---

### **Scenario 3: Modifying Feature Store**

**Your Store:** `src/features/council/store/feature-config-store.ts`

**Has:** 18 feature configurations

\# Generate context  
npx tsx council-context-generator.ts feature council

I need to add a new feature to the config store.

Project: Council Intelligence Platform  
Store: src/features/council/store/feature-config-store.ts

Currently has 18 features (not 15 as documented):  
\- scout, mirror, quality, selfImprove, etc.

\[Paste store structure from context\]

Task: Add new feature "competitorAnalysis" with config:  
\- enabled: boolean  
\- schedule: cron expression  
\- targets: string\[\]  
\- alertThreshold: number

Follow existing feature pattern.

**Token Usage:** \~2,000 tokens ✅

---

## **🎨 Common Development Patterns**

### **1\. Adding New Feature**

**Files to modify:**

// 1\. Add to feature config store  
// src/features/council/store/feature-config-store.ts  
export const FEATURE\_CONFIGS: Record\<string, FeatureConfig\> \= {  
  // ... existing 18 features  
  newFeature: {  
    id: 'newFeature',  
    name: 'New Feature',  
    enabled: false,  
    schedule: '0 9 \* \* \*',  
    config: { /\* ... \*/ }  
  }  
};

// 2\. Create implementation  
// src/lib/new-feature.ts  
export async function executeNewFeature(config: any) {  
  // Implementation  
}

// 3\. Add to Dashboard  
// src/pages/Dashboard.tsx  
const newFeatureConfig \= features.newFeature;  
// Add card to UI

### **2\. Adding UI Component**

// 1\. Create component  
// src/features/council/components/NewComponent.tsx  
export const NewComponent \= () \=\> {  
  const { feature } \= useFeatureConfigStore();  
  return (/\* JSX \*/);  
};

// 2\. Use in page  
// src/pages/Dashboard.tsx  
import { NewComponent } from '@/features/council/components/NewComponent';

// Add to render  
\<NewComponent /\>

### **3\. Adding Custom Hook**

// Create hook  
// src/hooks/useNewFeature.ts  
export const useNewFeature \= () \=\> {  
  const \[data, setData\] \= useState();  
  const \[loading, setLoading\] \= useState(false);  
    
  const execute \= async () \=\> {  
    setLoading(true);  
    // Logic  
    setLoading(false);  
  };  
    
  return { data, loading, execute };  
};

// Use in component  
import { useNewFeature } from '@/hooks/useNewFeature';

const { data, loading, execute } \= useNewFeature();

---

## **🔍 Finding Things Quickly**

### **Where Is...?**

\# Feature configuration  
src/features/council/store/feature-config-store.ts

\# Automation settings  
src/features/automation/store/features-store.ts

\# User settings  
src/features/settings/store/settings-store.ts

\# Main control panel  
src/features/council/components/ControlPanel.tsx

\# Feature config modal  
src/features/council/components/FeatureConfigModal.tsx

\# Intelligence tools  
src/lib/\*.ts (29 files)

\# Execution engine  
src/features/automation/lib/execution-engine.ts

### **Key Imports**

// Stores  
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';  
import { useFeaturesStore } from '@/features/automation/store/features-store';  
import { useSettingsStore } from '@/features/settings/store/settings-store';  
import { useExecutionStore } from '@/features/council/store/execution-store';

// Intelligence tools  
import { runScout } from '@/lib/scout';  
import { detectGoldmine } from '@/lib/goldmine-detector';  
import { executeMiningDrill } from '@/lib/mining-drill';

// Hooks  
import { useGitHub } from '@/hooks/useGitHub';  
import { useCommunityIntelligence } from '@/hooks/useCommunityIntelligence';

// Components  
import { ControlPanel } from '@/features/council/components/ControlPanel';  
import { ExpertCard } from '@/features/council/components/ExpertCard';

---

## **🎯 Token Budget Planning**

### **Your File Sizes**

| File | Lines | Tokens | Strategy |
| ----- | ----- | ----- | ----- |
| scout.ts | 29,109 | \~7,277 | ⚠️ Extract sections only |
| FeatureConfigModal.tsx | 45,047 | \~11,261 | ⚠️ Extract sections only |
| ai-client.ts | 27,359 | \~6,839 | ⚠️ Extract sections only |
| Dashboard.tsx | 16,677 | \~4,169 | ⚠️ May fit entirely |
| ControlPanel.tsx | 10,776 | \~2,694 | ✅ Can share whole file |

### **Budget Template (8,000 token window)**

Project context:        500 tokens  
Feature context:      2,000 tokens  
Code excerpt:         3,000 tokens  
Task description:       500 tokens  
Reserve for AI:       2,000 tokens  
\------------------------  
Total:                8,000 tokens ✅

---

## **🧹 Maintenance Tasks**

### **1\. Clean Up Orphaned Files**

./cleanup-orphaned.sh

Removes:

* ❌ `src/new-structure/` (incomplete migration)  
* ❌ `src/old-structure/` (legacy code)  
* ❌ Duplicate `SettingsModal.tsx`

### **2\. Update Documentation**

Current docs say "15 features" but you have **18**.

Update these files:

* README.md  
* Feature documentation  
* Configuration guides

### **3\. Consolidate Routes**

Consider moving automation features from `/dashboard` to main page (`/`) or adding clear navigation.

---

## **🚀 Next Steps**

### **Immediate (Today)**

**Run context generator:**

 npx tsx council-context-generator.ts all

1. 

**Clean up orphaned files:**

 ./cleanup-orphaned.sh

2. 

**Review route structure:**

 npx tsx council-context-generator.ts routes

3. 

### **Short-term (This Week)**

1. Add navigation from `/` to `/dashboard`  
2. Update documentation (15 → 18 features)  
3. Consider route consolidation  
4. Add feature discovery hints in UI

### **Long-term (This Month)**

1. Refactor large files (scout.ts, FeatureConfigModal.tsx)  
2. Add module documentation  
3. Create development onboarding guide  
4. Set up automated context generation in CI

---

## **🆘 Troubleshooting**

### **"AI doesn't understand my code"**

**Solution:** Generate targeted context

npx tsx council-context-generator.ts feature \<your-area\>

### **"Token limit exceeded"**

**Solution:** Extract smaller sections

* Don't paste entire large files  
* Share function signatures only  
* Reference full files by line numbers

### **"Features not showing up"**

**Solution:** Check route

* Features on `/` → AI Council execution  
* Features on `/dashboard` → Automation features  
* Features on `/features` → Subset of automation

### **"Imports breaking after cleanup"**

**Solution:** Run verification

\# Check for broken imports  
grep \-r "new-structure\\|old-structure" src/

---

## **📚 Resources**

### **Generated Files**

After running `council-context-generator.ts all`:

context-council.md              \# Main page context  
context-dashboard.md            \# Dashboard context  
context-features-dashboard.md   \# Features page context  
context-tool-scout.md          \# Scout tool context  
context-tool-goldmine.md       \# Goldmine tool context  
... (9 tool contexts)  
ROUTE\_COMPARISON.md            \# Route differences  
ORPHANED\_COMPONENTS.md         \# Cleanup guide  
COUNCIL\_NAVIGATION\_GUIDE.md    \# Navigation reference

### **Key Documentation**

* Your analysis: `project_files_analysis.md`  
* This guide: `COUNCIL_MASTER_GUIDE.md`  
* Quick ref: `COUNCIL_QUICK_REF.md`

---

## **✅ Success Checklist**

* \[ \] Context generator installed and working  
* \[ \] Orphaned files cleaned up  
* \[ \] Route comparison reviewed  
* \[ \] Navigation guide generated  
* \[ \] First feature context created  
* \[ \] Shared context with AI successfully  
* \[ \] Added new feature using AI assistance  
* \[ \] Updated documentation

---

**You're ready to develop efficiently with AI on your massive codebase\!** 🎉

Keep this guide handy and refer to it when working with AI assistants.

# Tab 5

# **🗺️ Council Routes \- Visual Comparison**

**What Users Actually See on Each Route**

---

## **Route 1: `/` (Index Page)**

### **What Users See**

╔════════════════════════════════════════════════════════════╗  
║  Council \- AI Expert System                           \[⚙️\]  ║  
╠════════════════════════════════════════════════════════════╣  
║                                                             ║  
║  📝 Task Input                                              ║  
║  ┌─────────────────────────────────────────────────────┐  ║  
║  │ What is your task or question?                      │  ║  
║  └─────────────────────────────────────────────────────┘  ║  
║                                                             ║  
║  Execution Mode: \[Parallel\] \[Consensus\] \[Adversarial\]      ║  
║  Active Experts: 5  \[────────●─\]                          ║  
║                                                             ║  
║  \[ Execute Council \]                                        ║  
║                                                             ║  
║  ┌─────────────────┐  ┌─────────────────┐                ║  
║  │ Expert 1        │  │ Expert 2        │                ║  
║  │ Technical       │  │ Creative        │                ║  
║  │ Analysis...     │  │ Brainstorm...   │                ║  
║  └─────────────────┘  └─────────────────┘                ║  
║                                                             ║  
║  📊 Synthesis                                              ║  
║  Final answer combining all expert opinions...             ║  
║                                                             ║  
╚════════════════════════════════════════════════════════════╝

### **Features Available**

✅ AI Council execution ✅ Expert opinions ✅ Synthesis display ✅ History sidebar ✅ Memory panel ✅ Settings

❌ **NO automation features** ❌ **NO scheduled tasks** ❌ **NO feature configuration** ❌ **NO analytics dashboard**

---

## **Route 2: `/dashboard` (Command Center) ⭐**

### **What Users See**

╔════════════════════════════════════════════════════════════╗  
║  Council Command Center                               \[⚙️\]  ║  
╠════════════════════════════════════════════════════════════╣  
║                                                             ║  
║  🎯 Core Experts (Automation Features)                     ║  
║                                                             ║  
║  ┌──────────────────────────────────────────────────────┐ ║  
║  │ 🔍 GitHub Trending              \[Active\] \[Schedule\]  │ ║  
║  │ Scan trending repos daily                            │ ║  
║  │ Schedule: 0 9 \* \* \*                                  │ ║  
║  │ \[Configure\] \[Trigger\] \[View Runs\]                    │ ║  
║  └──────────────────────────────────────────────────────┘ ║  
║                                                             ║  
║  ┌──────────────────────────────────────────────────────┐ ║  
║  │ 💎 Market Gap Identifier        \[Active\] \[Schedule\]  │ ║  
║  │ Find underserved markets                             │ ║  
║  │ Schedule: 0 10 \* \* 1                                 │ ║  
║  │ \[Configure\] \[Trigger\] \[View Runs\]                    │ ║  
║  └──────────────────────────────────────────────────────┘ ║  
║                                                             ║  
║  ... (8 more automation features)                          ║  
║                                                             ║  
║  🔧 MiningDrill Panel                                      ║  
║  ┌─────────────────────────────────────────────────────┐  ║  
║  │ Deep analysis of repositories                        │  ║  
║  │ \[Start Analysis\] \[View Results\]                      │  ║  
║  └─────────────────────────────────────────────────────┘  ║  
║                                                             ║  
║  💰 Goldmine Detector                                      ║  
║  ┌─────────────────────────────────────────────────────┐  ║  
║  │ High-value opportunities: 23 found                   │  ║  
║  │ \[View Details\] \[Export\]                              │  ║  
║  └─────────────────────────────────────────────────────┘  ║  
║                                                             ║  
║  📊 System Integrity: \[████████░░\] 85%                     ║  
║  📰 Intelligence Feed: Latest Reports                      ║  
║                                                             ║  
╚════════════════════════════════════════════════════════════╝

### **Features Available**

✅ **ALL 10 automation features** ✅ **Feature configuration** ✅ **Scheduling** ✅ **Trigger execution** ✅ **View run history** ✅ **MiningDrill panel** ✅ **Goldmine detector** ✅ **System analytics** ✅ **Intelligence feed**

**THIS IS WHERE THE MAGIC HAPPENS\!** 🎉

---

## **Route 3: `/features` (Automation Dashboard)**

### **What Users See**

╔════════════════════════════════════════════════════════════╗  
║  Automation Features Dashboard                        \[⚙️\]  ║  
╠════════════════════════════════════════════════════════════╣  
║                                                             ║  
║  Active Features: 7/18                                     ║  
║                                                             ║  
║  ┌──────────────────┐  ┌──────────────────┐              ║  
║  │ Code Mirror      │  │ QUALITY Pipeline │              ║  
║  │ \[Active\]         │  │ \[Active\]         │              ║  
║  │ Last run: 2h ago │  │ Last run: 1h ago │              ║  
║  │ \[Configure\]      │  │ \[Configure\]      │              ║  
║  └──────────────────┘  └──────────────────┘              ║  
║                                                             ║  
║  ┌──────────────────┐  ┌──────────────────┐              ║  
║  │ Self-Improve     │  │ Phantom Scout    │              ║  
║  │ \[Active\]         │  │ \[Disabled\]       │              ║  
║  │ Last run: 4h ago │  │ Never run        │              ║  
║  │ \[Configure\]      │  │ \[Configure\]      │              ║  
║  └──────────────────┘  └──────────────────┘              ║  
║                                                             ║  
║  📊 Latest Results                                         ║  
║  ┌─────────────────────────────────────────────────────┐  ║  
║  │ Scout found 15 opportunities                         │  ║  
║  │ Quality check: 92% passed                            │  ║  
║  │ Mirror analysis: 3 issues found                      │  ║  
║  └─────────────────────────────────────────────────────┘  ║  
║                                                             ║  
╚════════════════════════════════════════════════════════════╝

### **Features Available**

✅ Core automation features (subset) ✅ Feature cards ✅ Configuration ✅ Results feed ✅ Status overview

❌ No GitHub Trending ❌ No Market Gap ❌ Fewer features than /dashboard

---

## **Route 4: `/quality` (Quality Dashboard)**

### **What Users See**

╔════════════════════════════════════════════════════════════╗  
║  Quality Dashboard                                    \[⚙️\]  ║  
╠════════════════════════════════════════════════════════════╣  
║                                                             ║  
║  📊 Code Quality Metrics                                   ║  
║                                                             ║  
║  Overall Score: \[████████░░\] 85/100                        ║  
║                                                             ║  
║  Recent Checks:                                            ║  
║  ✅ TypeScript strict mode: Passed                         ║  
║  ⚠️  Test coverage: 67% (target: 80%)                      ║  
║  ✅ Linting: No errors                                     ║  
║  ❌ Bundle size: 2.4MB (target: 2MB)                       ║  
║                                                             ║  
║  📈 Trends (Last 7 Days)                                   ║  
║  \[Line chart showing quality over time\]                    ║  
║                                                             ║  
║  🎯 Quality Amplification Pipeline                         ║  
║  Status: Active | Last run: 1h ago                         ║  
║                                                             ║  
╚════════════════════════════════════════════════════════════╝

### **Features Available**

✅ Quality metrics ✅ Code analysis ✅ Trend charts ✅ Pipeline status

---

## **🎯 The Problem Visualized**

User Journey:

1\. User opens app → Lands on /  
   "Great\! AI Council is working"  
     
2\. User looks for automation features  
   ❌ Not visible on /  
   ❌ No button to /dashboard  
   ❌ User thinks features don't exist  
     
3\. User manually tries /dashboard  
   ✅ "Oh\! Here are all the features\!"  
   😕 "Why weren't these on the main page?"

---

## **💡 Solution Options**

### **Option 1: Add Navigation Button (Quick Fix)**

Add to `src/pages/Index.tsx`:

\<div className="mt-8 text-center"\>  
  \<Button   
    onClick={() \=\> navigate('/dashboard')}  
    size="lg"  
    className="gap-2"  
  \>  
    \<Zap className="w-4 h-4" /\>  
    View Automation Dashboard →  
  \</Button\>  
  \<p className="text-sm text-muted-foreground mt-2"\>  
    Access all 10 automation features and scheduling  
  \</p\>  
\</div\>

### **Option 2: Add Tab Navigation**

\<Tabs defaultValue="execution"\>  
  \<TabsList\>  
    \<TabsTrigger value="execution"\>AI Council\</TabsTrigger\>  
    \<TabsTrigger value="automation"\>Automation\</TabsTrigger\>  
    \<TabsTrigger value="analytics"\>Analytics\</TabsTrigger\>  
  \</TabsList\>  
    
  \<TabsContent value="execution"\>  
    {/\* Current Index.tsx content \*/}  
  \</TabsContent\>  
    
  \<TabsContent value="automation"\>  
    {/\* Dashboard.tsx content \*/}  
  \</TabsContent\>  
    
  \<TabsContent value="analytics"\>  
    {/\* Analytics content \*/}  
  \</TabsContent\>  
\</Tabs\>

### **Option 3: Unified Dashboard (Best Long-term)**

Consolidate everything into one view with sections:

/  
├─ AI Council Execution (top)  
├─ Automation Features (middle)  
└─ Analytics & Reports (bottom)

---

## **📊 Feature Distribution**

### **Current State**

| Route | AI Council | Automation | Analytics |
| ----- | ----- | ----- | ----- |
| `/` | ✅ | ❌ | ❌ |
| `/dashboard` | ❌ | ✅ (all 10\) | ✅ |
| `/features` | ❌ | ✅ (subset) | ✅ |
| `/quality` | ❌ | ❌ | ✅ |

### **Recommended State**

| Route | AI Council | Automation | Analytics |
| ----- | ----- | ----- | ----- |
| `/` | ✅ | ✅ (with nav) | ✅ (summary) |
| `/dashboard` | ✅ | ✅ | ✅ |

---

## **🚀 Implementation Priority**

### **High Priority (Fix This Week)**

1. **Add navigation from `/` to `/dashboard`**

   * Simple button or link  
   * Clear description of what's available

**Add breadcrumbs to all routes**

 Home / Dashboard / Features

2. 

**Update header navigation**

 \[Council\] \[Automation\] \[Quality\] \[Settings\]

3. 

### **Medium Priority (Fix This Month)**

1. **Add feature discovery hints**

   * Tooltip: "Automation features available on Dashboard →"  
   * First-time user onboarding  
2. **Consolidate feature listings**

   * Decide on single source of truth  
   * `/dashboard` vs `/features` \- pick one

### **Low Priority (Consider Later)**

1. **Full route consolidation**  
   * Single-page app with sections  
   * Everything accessible without navigation

---

## **🎯 Quick Test**

Open your app and check:

\# 1\. Open main page  
http://localhost:5173/

\# Can you see:  
\- ✅ AI Council execution? YES  
\- ❌ Automation features? NO  
\- ❌ Button to dashboard? NO

\# 2\. Open dashboard  
http://localhost:5173/dashboard

\# Can you see:  
\- ✅ All 10 automation features? YES  
\- ✅ Configuration options? YES  
\- ✅ Scheduling? YES

**Problem confirmed\!** Users on `/` never discover `/dashboard`

---

## **✅ Action Items**

1. \[ \] Run context generator: `npx tsx council-context-generator.ts routes`  
2. \[ \] Add navigation button to Index.tsx  
3. \[ \] Test user flow from `/` to `/dashboard`  
4. \[ \] Update documentation about routes  
5. \[ \] Consider long-term consolidation

---

**Bottom line:** Your automation features are hidden on a different route. Add navigation ASAP\! 🎯

