# Goldmine Detector - Documentation

## Overview

The **Goldmine Detector** is a passive income intelligence feature that identifies high-value abandoned GitHub repositories across multiple niches. A "goldmine" is a popular, validated repository that has been abandoned, representing **proven demand + no competition**.

## What is a Goldmine?

### Definition
A **goldmine** is a repository with:
- **High stars** (>1,000) = Proven demand
- **Abandoned** (>180 days no commits) = No competition
- **Open issues** (>20) = Clear gaps
- **Active forks** = Ongoing need
- **Permissive license** = Can rebuild

### Example Goldmine
- **Repository:** invoiceninja/invoiceninja
- **Stars:** 7,234 (validated demand)
- **Last commit:** 456 days ago (abandoned)
- **Open issues:** 234 (unmet needs)
- **Active forks:** 47 (ongoing demand)
- **License:** MIT (can rebuild)
- **Opportunity:** Build modern invoicing tool with features from issues → $2,900-9,900/month potential

## Features

### 1. Multi-Niche Configuration
- Reads from `config/target-niches.yaml`
- Processes all enabled niches
- Supports nested monitoring structure
- Backward compatible with flat structure

### 2. Goldmine Scoring System (0-100)

#### Value Score (0-40 points)
- **Stars:** Indicates proven demand
  - >10,000 stars: 20 points
  - >5,000 stars: 15 points
  - >2,000 stars: 10 points
  - >1,000 stars: 5 points
- **Documentation:** Has wiki or pages: +5 points
- **Description:** Quality description: +5 points
- **Maturity:** Age of project: up to +10 points

#### Abandonment Score (0-30 points)
- **Time inactive:**
  - >2 years: 30 points
  - 1-2 years: 20 points
  - 6-12 months: 10 points
- **No responses:** No recent commits in 6 months

#### Demand Score (0-30 points)
- **Active forks:**
  - >500 forks: 10 points
  - >200 forks: 7 points
  - >50 forks: 5 points
- **Open issues:**
  - >100 issues: 10 points
  - >50 issues: 7 points
  - >20 issues: 5 points
- **Recent activity:** Recent issues in last 6 months: up to +10 points

### 3. Rebuild Opportunity Analysis

Four rebuild types identified:

1. **Direct Modernization**
   - Same purpose, modern tech
   - Difficulty: Easy
   - Time: 4-6 weeks

2. **Improved Alternative**
   - Same function, better UX + requested features
   - Difficulty: Medium
   - Time: 6-10 weeks

3. **SaaS Version**
   - Take open-source, build hosted cloud version
   - Difficulty: Medium-Hard
   - Time: 6-10 weeks

4. **Niche Focus**
   - Take general tool, specialize for industry
   - Difficulty: Easy-Medium
   - Time: 4-8 weeks

### 4. Monetization Strategies

For each goldmine, generates:
- **Freemium SaaS:** $29-99/month pricing
- **One-time License:** $149-499 lifetime
- **Enterprise Support:** $999-4,999/month (for repos >5k stars)
- **Estimated MRR:** Based on 1% conversion of stargazers
- **Target customer count**

### 5. Unmet Needs Extraction

Analyzes top issues to identify:
- Most commented issues (high demand)
- Recent feature requests
- Common pain points
- Quick wins for rebuild

## Usage

### Command Line
```bash
# Run goldmine detector for all niches
npm run goldmine

# Or using tsx directly
npx tsx scripts/detect-goldmines.ts
```

### Requirements
- **GITHUB_TOKEN** environment variable must be set
- Node.js 18+ with TypeScript support
- Dependencies installed (`npm install`)

### Configuration
Edit `config/target-niches.yaml` to:
- Add/remove niches
- Configure GitHub topics for each niche
- Enable/disable specific niches

Example niche configuration:
```yaml
- id: "freelancer-scope-creep"
  name: "Freelancer Scope Creep Prevention Tools"
  enabled: true
  monitoring:
    github_topics:
      - "freelance"
      - "project-management"
      - "invoicing"
```

## Output

### Report Location
Reports are saved to: `data/reports/goldmine-{niche-id}-{date}.md`

### Report Structure
Each report includes:
1. **Header:** Niche name, date, goldmine count
2. **Top 15 Goldmines** with:
   - Goldmine score (0-100) with visual indicators (💎)
   - Repository metrics (stars, forks, issues, language)
   - Score breakdown (value, abandonment, demand)
   - Top unmet needs from issues
   - Rebuild opportunity recommendation
   - Monetization strategies with MRR estimates
   - Direct link to repository
3. **Summary:**
   - Top 3 goldmines highlighted
   - Average goldmine score
   - Total stars represented
   - Recommended action plan

### Example Report Section
```markdown
## 1. invoiceninja/invoiceninja

**Goldmine Score:** 85/100 💎💎💎

Open-source invoicing platform for freelancers and small businesses

**Repository Metrics:**
- ⭐ Stars: 7,234
- 📅 Last Update: 456 days ago
- 🐛 Open Issues: 234
- 🍴 Active Forks: 47
- 💻 Language: PHP
- 📜 License: MIT

**Score Breakdown:**
- Value Score: 35/40 (stars, docs, maturity)
- Abandonment Score: 30/30 (time inactive)
- Demand Score: 20/30 (forks, issues)

**Top Unmet Needs:**
- Recurring billing support (45 comments)
- Multi-currency conversion (32 comments)
- Time tracking integration (28 comments)

**Rebuild Opportunity (saas-version):**
Convert to hosted SaaS version with managed infrastructure and support

- **Difficulty:** medium
- **Time Estimate:** 6-10 weeks
- **Tech Stack:** TypeScript, Vite, React, Tailwind CSS

**Monetization Strategies:**
- **Freemium SaaS:** $29-99/month
  - Estimated MRR: $2,097-$6,291
  - Target: 72 paying users (1% of stargazers)
- **One-time License:** $149-499 lifetime
  - Estimated MRR: $448/month (amortized)
  - Target: 36 buyers
- **Enterprise Support:** $999-4,999/month
  - Estimated MRR: $3,000-15,000
  - Target: 3-5 enterprise customers

🔗 **Repository:** https://github.com/invoiceninja/invoiceninja
```

## Automation

### GitHub Workflow
Workflow file: `.github/workflows/goldmine-detector.yml`

**Schedule:**
- Runs weekly on Wednesday at 2 PM UTC
- Cron: `0 14 * * 3`

**Features:**
- Automatic execution via GitHub Actions
- Uses `GITHUB_TOKEN` secret
- Auto-commits reports to `data/reports/`
- Manual trigger available via workflow_dispatch

**Triggering Manually:**
1. Go to repository → Actions → Goldmine Detector
2. Click "Run workflow"
3. Select branch and click "Run workflow"

## Rate Limiting

To stay within GitHub API limits (5,000 requests/hour):
- 1 second delay between topic searches
- 1 second delay between repository analyses
- Limited to 30 repos per niche
- Limited to 3 topics per niche
- Automatic 60-second wait on rate limit errors

## Architecture

### File Structure
```
src/lib/goldmine-detector.ts       # Main implementation
scripts/detect-goldmines.ts         # Wrapper script
scripts/verify-goldmine.ts          # Verification tool
.github/workflows/goldmine-detector.yml  # Automation
config/target-niches.yaml           # Configuration
data/reports/goldmine-*.md          # Generated reports
```

### Key Functions

1. **`runGoldmineDetector()`**
   - Main entry point
   - Processes all niches
   - Generates reports

2. **`searchAbandonedRepos()`**
   - Searches GitHub for abandoned repos
   - Filters by stars and last update
   - Returns unique repositories

3. **`analyzeGoldmine()`**
   - Fetches commits and issues
   - Calculates goldmine score
   - Returns goldmine object

4. **`calculateGoldmineScore()`**
   - Implements scoring algorithm
   - Returns breakdown of scores
   - Max score: 100

5. **`extractUnmetNeeds()`**
   - Analyzes open issues
   - Sorts by comment count
   - Returns top 10 needs

6. **`generateRebuildOpportunity()`**
   - Determines rebuild type
   - Suggests tech stack
   - Estimates time and difficulty

7. **`generateMonetizationStrategy()`**
   - Creates pricing strategies
   - Calculates estimated MRR
   - Defines target customers

8. **`generateReport()`**
   - Creates markdown report
   - Formats goldmine data
   - Includes summary section

## Development

### Adding a New Scoring Factor
Edit `calculateGoldmineScore()` function:
```typescript
// Add new factor to appropriate category
if (repo.has_downloads > 1000) {
  valueScore += 5; // Add to value score
}
```

### Customizing Report Format
Edit `generateReport()` function to change:
- Markdown structure
- Number of goldmines shown (default: 15)
- Summary calculations
- Visual indicators

### Testing
```bash
# Verify implementation without API calls
npx tsx scripts/verify-goldmine.ts

# Run with limited scope (requires GITHUB_TOKEN)
# Edit test file to adjust scope
npx tsx scripts/test-goldmine.ts
```

## Troubleshooting

### "GITHUB_TOKEN environment variable is required"
- Set GITHUB_TOKEN in your environment
- For GitHub Actions, token is automatically available
- For local use: `export GITHUB_TOKEN=your_token_here`

### "No goldmines found"
- Check niche configuration has GitHub topics
- Verify topics are relevant to niche
- Try different topics or broader search terms
- Some niches may have no abandoned repos matching criteria

### Rate Limit Errors
- Detector automatically waits on rate limits
- If persistent, reduce niches processed
- Wait 1 hour for rate limit reset
- Use authenticated token for higher limits

### TypeScript Errors
```bash
# Check for type errors
npm run typecheck

# Fix with strict mode
npm run build:strict
```

## Best Practices

1. **Niche Selection**
   - Choose niches with active GitHub communities
   - Ensure topics are widely used
   - Validate topics have repos >1k stars

2. **Report Review**
   - Review top 3 goldmines first
   - Check license compatibility
   - Validate market demand outside GitHub
   - Research existing alternatives

3. **Rebuild Planning**
   - Start with "easy" difficulty goldmines
   - Focus on top unmet needs
   - Validate with potential users first
   - Budget 1.5x time estimate

4. **Monetization**
   - Test pricing with landing page first
   - Offer early-bird discount to stargazers
   - Build MVP with top 3 features
   - Launch in original repo issues/discussions

## Integration with Council

### Daily Intelligence Brief
Goldmine reports feed into the daily brief for opportunity analysis.

### Ruthless Judge
Goldmines are evaluated by Ruthless Judge for viability assessment.

### Market Gap Identifier
Goldmine unmet needs inform market gap analysis.

### Fork Evolution
Cross-reference goldmine forks for modification patterns.

## Success Metrics

Track these metrics for goldmine rebuilds:
- **Conversion rate:** Stargazers → users
- **MRR growth:** Monthly recurring revenue
- **Feature completion:** Unmet needs addressed
- **Time to market:** Weeks from start to launch
- **Competition:** New repos in space

## Contributing

To improve Goldmine Detector:
1. Add new scoring factors
2. Enhance rebuild type detection
3. Improve monetization calculations
4. Add new report sections
5. Create visualization tools

## License

Part of Council App - MIT License

---

**Last Updated:** 2026-02-14
**Version:** 1.0.0
**Maintainer:** Council Intelligence Team
