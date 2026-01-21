# Quality Amplification Workflow

Complete automated system for code quality improvement and learning from successful projects.

## 🎯 Overview

This workflow combines three powerful systems:
1. **Code Mirror** - Analyzes code quality against elite repositories
2. **Self-Improving** - Learns patterns from successful GitHub projects  
3. **Quality Pipeline** - Automated improvement workflow

## 📦 Quick Start

```bash
# Full quality check and improvement
npm run quality

# Individual commands
npm run mirror   # Code quality analysis only
npm run learn    # Learn from GitHub projects
npm run improve  # Run complete pipeline
```

## 🚀 What Each Command Does

### `npm run mirror`
- Scans your TypeScript codebase
- Analyzes 4 categories: error handling, type safety, performance, architecture
- Generates quality scores (0-100)
- Identifies gaps and suggests fixes
- Outputs: `logs/mirror-report.md`

### `npm run learn`
- Searches GitHub for successful repositories
- Extracts patterns in positioning, pricing, features, architecture
- Updates knowledge base with findings
- Provides confidence-scored recommendations
- Outputs: `logs/self-improve-report.md`

### `npm run improve`
- Runs Code Mirror analysis
- Learns from successful projects
- Cross-references findings
- Applies automatic fixes (when safe)
- Generates PR templates
- Outputs: `logs/quality-pipeline-report.json`

## 📊 Quality Dashboard

Access the visual dashboard at: `http://localhost:5173/quality`

**Features:**
- Real-time quality scores
- Category breakdowns (error handling, type safety, etc.)
- Learned patterns from elite repos
- Applied vs suggested improvements
- Quality history tracking
- Next steps recommendations

## 🔄 Automated Workflow

The system can run automatically via GitHub Actions:

```bash
# Manual trigger
gh workflow run self-improve.yml

# Runs automatically every Monday at 9 AM UTC
```

## 📁 File Structure

```
scripts/
├── run-mirror.ts         # Code quality analyzer
├── run-self-improve.ts   # GitHub learning system  
└── quality-pipeline.ts   # Complete workflow

src/
├── lib/
│   ├── code-mirror.ts         # Analysis engine
│   ├── self-improve.ts        # Learning engine
│   ├── mirror-standards.json  # Quality standards
│   └── knowledge-base/        # Learned patterns
│       ├── positioning.md
│       ├── pricing.md
│       ├── features.md
│       └── architecture.md
└── pages/
    └── QualityDashboard.tsx   # Visual dashboard

logs/
├── mirror-report.md              # Code analysis
├── self-improve-report.md        # Learning results
├── quality-pipeline-report.json  # Combined results
└── quality-pr-template.md        # PR template
```

## 🎓 Knowledge Base

Auto-updated markdown files that capture learned patterns:

- **positioning.md** - How successful projects communicate value
- **pricing.md** - Monetization strategies that work
- **features.md** - Priority features for adoption
- **architecture.md** - Code patterns that scale

Use these as reference when making product decisions!

## 🔧 Configuration

Edit pipeline settings in `scripts/quality-pipeline.ts`:

```typescript
const config = {
  targetDir: "src",           // Directory to analyze
  maxFiles: 30,               // Max files to scan
  learningNiche: "React TS",  // GitHub search niche
  minStars: 2000,             // Min repo stars
  qualityThreshold: 70,       // Pass/fail threshold
  autoApplyFixes: false,      // Auto-fix safe issues
  generatePR: false,          // Create PR branch
};
```

## 📈 Interpreting Scores

- **90-100**: Excellent - Elite level code
- **75-89**: Good - Professional quality
- **60-74**: Acceptable - Room for improvement
- **<60**: Needs work - Priority fixes required

## 🎯 Using Learned Patterns

When patterns are discovered with high confidence (>70%):
1. Review the pattern in knowledge base
2. Check evidence from source repos
3. Apply to your codebase
4. Track improvement in next run

## 🚨 Critical Issues

Pipeline fails if:
- Critical issues found (severity: critical)
- Quality score below threshold
- Learning system errors

Fix these immediately before merging PRs.

## 🔄 Continuous Improvement

Recommended workflow:
1. Run `npm run quality` before major features
2. Review dashboard weekly
3. Apply high-confidence patterns monthly
4. Learn from new niches quarterly

## 📚 Example Output

**Code Analysis:**
- Average Score: 99/100 ✅
- Files Analyzed: 20
- Critical Issues: 0
- Files Needing Work: 0

**Learning Results:**
- Patterns Discovered: 7
- High Confidence: 4
- Top Pattern: "TypeScript-first development" (85% confidence)

**Improvements:**
- Auto-Applied: 0
- Suggested: 1
- Next: "Apply 4 high-confidence patterns"

## 🎨 Dashboard Features

**Overview Tab:**
- Quality breakdown by category
- Progress bars with color coding
- Next steps checklist

**Patterns Tab:**
- Discovered success patterns
- Confidence scores
- Source repositories

**Improvements Tab:**
- Applied fixes ✅
- Suggested improvements 💡
- Learning recommendations

**History Tab:**
- Score trends over time
- Visual progress tracking

## 💡 Pro Tips

1. **Before big refactors:** Run mirror to establish baseline
2. **Stuck on architecture?** Check knowledge base for patterns
3. **Need validation?** Compare your patterns to learned ones
4. **Want faster learning?** Use GitHub token for higher rate limits
5. **Track team progress:** Share dashboard URL in standups

## 🔗 Integration

Works seamlessly with:
- GitHub Actions (automated runs)
- Git workflow (PR templates)
- VS Code (reports in logs/)
- Your existing CI/CD

## 📞 Troubleshooting

**No patterns found?**
- Check GitHub token is valid
- Try broader niche search
- Lower min-stars threshold

**Low quality score?**
- Review specific gaps in mirror report
- Apply suggested fixes one by one
- Re-run to track improvement

**Dashboard not loading?**
- Run pipeline first to generate data
- Check logs/ directory exists
- Verify JSON report is valid

## 🎯 Success Metrics

Track these over time:
- Overall quality score trend
- Critical issues count
- Patterns applied count
- Time to fix issues
- Community adoption of your patterns

---

**Built for:** Solo founders and small teams
**Philosophy:** Learn from the best, automate the rest
**Goal:** Elite-level code quality with zero infrastructure costs
