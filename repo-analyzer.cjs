// repo-analyzer.js - Complete Repository Scanner
const fs = require('fs');
const path = require('path');

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.vscode',
  '.idea',
  'package-lock.json',
  'yarn.lock',
  '.DS_Store'
];

const ANALYSIS_CONFIG = {
  maxFileSize: 500000, // 500KB
  includeExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.md', '.html', '.env.example'],
  deepAnalysis: true
};

class RepoAnalyzer {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.fileTree = {};
    this.stats = {
      totalFiles: 0,
      totalLines: 0,
      filesByType: {},
      components: [],
      services: [],
      contexts: [],
      routes: [],
      apis: [],
      dependencies: {},
      errors: [],
      warnings: []
    };
  }

  shouldIgnore(filePath) {
    return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
  }

  getFileType(filePath) {
    const ext = path.extname(filePath);
    return ext || 'no-extension';
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const ext = this.getFileType(filePath);

      // Update stats
      this.stats.totalFiles++;
      this.stats.totalLines += lines.length;
      this.stats.filesByType[ext] = (this.stats.filesByType[ext] || 0) + 1;

      // Categorize file
      const fileName = path.basename(filePath);
      const relativePath = path.relative(this.rootPath, filePath);

      const analysis = {
        path: relativePath,
        name: fileName,
        type: ext,
        lines: lines.length,
        size: content.length,
        imports: this.extractImports(content),
        exports: this.extractExports(content),
        functions: this.extractFunctions(content),
        components: this.extractComponents(content),
        apiCalls: this.extractAPICalls(content),
        stateManagement: this.extractState(content),
        errors: this.findPotentialErrors(content, filePath),
        dependencies: this.extractDependencies(content)
      };

      // Categorize by type
      if (relativePath.includes('component')) {
        this.stats.components.push(analysis);
      }
      if (relativePath.includes('service')) {
        this.stats.services.push(analysis);
      }
      if (relativePath.includes('context')) {
        this.stats.contexts.push(analysis);
      }

      return analysis;
    } catch (error) {
      this.stats.errors.push({
        file: filePath,
        error: error.message
      });
      return null;
    }
  }

  extractImports(content) {
    const imports = [];
    const importRegex = /import\s+(?:{[^}]+}|[\w*]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    return imports;
  }

  extractExports(content) {
    const exports = [];
    const exportRegex = /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    return exports;
  }

  extractFunctions(content) {
    const functions = [];
    const funcRegex = /(?:function|const)\s+(\w+)\s*=\s*\(/g;
    let match;
    while ((match = funcRegex.exec(content)) !== null) {
      functions.push(match[1]);
    }
    return functions;
  }

  extractComponents(content) {
    const components = [];
    const componentRegex = /(?:function|const)\s+([A-Z]\w+)\s*=\s*\(/g;
    let match;
    while ((match = componentRegex.exec(content)) !== null) {
      components.push(match[1]);
    }
    return components;
  }

  extractAPICalls(content) {
    const apis = [];
    const apiRegex = /(?:fetch|axios|api)\s*\(\s*['"\`]([^'"\`]+)['"\`]/g;
    let match;
    while ((match = apiRegex.exec(content)) !== null) {
      apis.push(match[1]);
    }
    return apis;
  }

  extractState(content) {
    const state = {
      useState: (content.match(/useState/g) || []).length,
      useEffect: (content.match(/useEffect/g) || []).length,
      useContext: (content.match(/useContext/g) || []).length,
      useReducer: (content.match(/useReducer/g) || []).length
    };
    return state;
  }

  findPotentialErrors(content, filePath) {
    const errors = [];

    // Check for common issues
    if (content.includes('console.log') && !filePath.includes('test')) {
      errors.push({ type: 'warning', message: 'Contains console.log statements' });
    }

    if (content.includes('TODO') || content.includes('FIXME')) {
      errors.push({ type: 'warning', message: 'Contains TODO/FIXME comments' });
    }

    if (content.includes('any') && filePath.endsWith('.ts')) {
      errors.push({ type: 'warning', message: 'Uses TypeScript "any" type' });
    }

    // Check for potential bugs
    if (content.match(/if\s*\(([^)]*=[^=][^)]*)\)/)) {
      errors.push({ type: 'error', message: 'Potential assignment in condition (= instead of ==)' });
    }

    // Check for missing error handling
    if (content.includes('async') && !content.includes('try') && !content.includes('catch')) {
      errors.push({ type: 'warning', message: 'Async function without try/catch' });
    }

    return errors;
  }

  extractDependencies(content) {
    const deps = {
      react: content.includes('react'),
      openrouter: content.includes('openrouter') || content.includes('OPENROUTER'),
      localStorage: content.includes('localStorage'),
      fileReader: content.includes('FileReader')
    };
    return deps;
  }

  scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
        
      if (this.shouldIgnore(filePath)) {
        return;
      }

      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.scanDirectory(filePath);
      } else if (stat.isFile()) {
        const ext = this.getFileType(filePath);
        if (ANALYSIS_CONFIG.includeExtensions.includes(ext)) {
          const analysis = this.analyzeFile(filePath);
          if (analysis) {
            this.fileTree[analysis.path] = analysis;
          }
        }
      }
    });
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      repository: path.basename(this.rootPath),
      statistics: this.stats,
      architecture: this.analyzeArchitecture(),
      dependencies: this.analyzeDependencies(),
      issues: this.compileIssues(),
      recommendations: this.generateRecommendations(),
      fileTree: this.fileTree
    };

    return report;
  }

  analyzeArchitecture() {
    return {
      components: {
        count: this.stats.components.length,
        list: this.stats.components.map(c => ({
          name: c.name,
          path: c.path,
          functions: c.functions,
          imports: c.imports
        }))
      },
      services: {
        count: this.stats.services.length,
        list: this.stats.services.map(s => ({
          name: s.name,
          path: s.path,
          apis: s.apiCalls,
          exports: s.exports
        }))
      },
      contexts: {
        count: this.stats.contexts.length,
        list: this.stats.contexts.map(c => ({
          name: c.name,
          path: c.path,
          state: c.stateManagement
        }))
      }
    };
  }

  analyzeDependencies() {
    const packageJson = path.join(this.rootPath, 'package.json');
    if (fs.existsSync(packageJson)) {
      const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
      return {
        dependencies: pkg.dependencies || {},
        devDependencies: pkg.devDependencies || {},
        scripts: pkg.scripts || {}
      };
    }
    return null;
  }

  compileIssues() {
    const allIssues = [];
      
    Object.values(this.fileTree).forEach(file => {
      if (file.errors && file.errors.length > 0) {
        file.errors.forEach(error => {
          allIssues.push({
            file: file.path,
            severity: error.type,
            message: error.message
          });
        });
      }
    });

    return {
      total: allIssues.length,
      errors: allIssues.filter(i => i.severity === 'error'),
      warnings: allIssues.filter(i => i.severity === 'warning'),
      list: allIssues
    };
  }

  generateRecommendations() {
    const recommendations = [];

    // Check for missing error handling
    const asyncFilesWithoutTryCatch = Object.values(this.fileTree).filter(
      f => f.functions.some(fn => fn.includes('async')) && !f.errors.some(e => e.type === 'warning')
    );

    if (asyncFilesWithoutTryCatch.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'error-handling',
        message: `${asyncFilesWithoutTryCatch.length} async functions missing try/catch blocks`,
        files: asyncFilesWithoutTryCatch.map(f => f.path)
      });
    }

    // Check for console.logs
    const filesWithConsole = Object.values(this.fileTree).filter(
      f => f.errors.some(e => e.message.includes('console.log'))
    );

    if (filesWithConsole.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'code-quality',
        message: `${filesWithConsole.length} files contain console.log statements`,
        files: filesWithConsole.map(f => f.path)
      });
    }

    return recommendations;
  }

  generateMarkdownReport() {
    const report = this.generateReport();
      
    let markdown = `# Repository Analysis Report
Generated: ${report.timestamp}
Repository: ${report.repository}

---

## 📊 Statistics

- **Total Files:** ${report.statistics.totalFiles}
- **Total Lines:** ${report.statistics.totalLines.toLocaleString()}
- **Components:** ${report.architecture.components.count}
- **Services:** ${report.architecture.services.count}
- **Contexts:** ${report.architecture.contexts.count}

### Files by Type
${Object.entries(report.statistics.filesByType).map(([type, count]) => `- ${type}: ${count} files`).join('\n')}

---

## 🏗️ Architecture

### Components
${report.architecture.components.list.map(c => `
#### ${c.name}
- Path: \`${c.path}\`
- Functions: ${c.functions.length}
- Imports: ${c.imports.length}
`).join('\n')}

### Services
${report.architecture.services.list.map(s => `
#### ${s.name}
- Path: \`${s.path}\`
- API Calls: ${s.apis.length}
- Exports: ${s.exports.length}
`).join('\n')}

### State Management (Contexts)
${report.architecture.contexts.list.map(c => `
#### ${c.name}
- Path: \`${c.path}\`
- useState: ${c.state.useState}
- useEffect: ${c.state.useEffect}
- useContext: ${c.state.useContext}
`).join('\n')}

---

## ⚠️ Issues Found

**Total:** ${report.issues.total}
- Errors: ${report.issues.errors.length}
- Warnings: ${report.issues.warnings.length}

${report.issues.list.map(issue => `
### ${issue.severity.toUpperCase()}: ${issue.file}
${issue.message}
`).join('\n')}

---

## 💡 Recommendations

${report.recommendations.map(rec => `
### ${rec.priority.toUpperCase()}: ${rec.category}
${rec.message}

**Affected Files:**
${rec.files.map(f => `- ${f}`).join('\n')}
`).join('\n')}

---

## 📦 Dependencies

### Production
${report.dependencies ? Object.entries(report.dependencies.dependencies).map(([name, version]) => `- ${name}: ${version}`).join('\n') : 'No dependencies found'}

### Development
${report.dependencies ? Object.entries(report.dependencies.devDependencies).map(([name, version]) => `- ${name}: ${version}`).join('\n') : 'No dev dependencies found'}

---

## 📁 Complete File Tree

${Object.entries(report.fileTree).map(([path, file]) => `
### ${path}
- Lines: ${file.lines}
- Size: ${file.size} bytes
- Imports: ${file.imports.length}
- Functions: ${file.functions.length}
- Components: ${file.components.length}
`).join('\n')}
`;

    return markdown;
  }

  async analyze() {
    console.log('🔍 Starting deep repository analysis...');
    this.scanDirectory(this.rootPath);
      
    console.log('📊 Generating report...');
    const report = this.generateReport();
    const markdown = this.generateMarkdownReport();

    // Save reports
    fs.writeFileSync('repo-analysis.json', JSON.stringify(report, null, 2));
    fs.writeFileSync('repo-analysis.md', markdown);

    console.log('✅ Analysis complete!');
    console.log(`📄 Reports saved:`);
    console.log(`   - repo-analysis.json (detailed)`);
    console.log(`   - repo-analysis.md (human-readable)`);

    return report;
  }
}

// Run analysis
const analyzer = new RepoAnalyzer(process.cwd());
analyzer.analyze().then(report => {
  console.log('\n📊 Summary:');
  console.log(`   Files analyzed: ${report.statistics.totalFiles}`);
  console.log(`   Total lines: ${report.statistics.totalLines}`);
  console.log(`   Issues found: ${report.issues.total}`);
  console.log(`   Recommendations: ${report.recommendations.length}`);
});
