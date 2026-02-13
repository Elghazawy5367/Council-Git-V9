# Fork Evolution - Repository Modification Pattern Detection

## Overview

Fork Evolution is an automated intelligence system that analyzes how developers fork and modify popular repositories across multiple niches. By detecting common modification patterns, it reveals product gaps, validated demand, and business opportunities.

## Quick Start

```bash
# Run locally
npm run fork-evolution

# With GitHub token for higher rate limits
GITHUB_TOKEN=your_token npm run fork-evolution
```

## Configuration

Fork Evolution reads from `config/target-niches.yaml`:

```yaml
niches:
  - id: your-niche-id
    name: "Your Niche Name"
    enabled: true
    monitoring:
      keywords:
        - keyword1
        - keyword2
      github_topics:
        - topic1
        - topic2
```

### Current Niches (5)

1. **freelancer-scope-creep** - Freelancer Scope Creep Prevention Tools
2. **newsletter-deliverability** - Newsletter Deliverability Solutions
3. **etsy-handmade-pricing** - Etsy Handmade Sellers Pricing Strategy
4. **tpt-copyright-protection** - Teachers Pay Teachers Copyright Protection
5. **podcast-transcription-seo** - Podcast Transcription SEO Workflow

## How It Works

### 1. Config Loading
- Reads `config/target-niches.yaml`
- Filters enabled niches
- Handles nested `monitoring` structure

### 2. Fork-Worthy Repository Search
For each niche:
- Searches GitHub repositories by topics
- Filters for fork-worthy candidates:
  - Stars: >1,000 (validated demand)
  - Forks: >100 (active ecosystem)
- Sorts by fork count (descending)
- Deduplicates by repository ID

### 3. Fork Ecosystem Analysis
For each repository (up to 15 per niche):
- Fetches top 20 forks (sorted by stars)
- Analyzes each fork for:
  - Active status (updated in last 90 days)
  - Success status (more stars than original)
  - Commit messages (feature detection)
- Extracts features from commit messages
- Identifies common modification patterns

### 4. Opportunity Scoring (0-100)

**Score Breakdown:**
- **Fork Count** (max 30 points):
  - 100+ forks = 30 points
  - Scales linearly below that
- **Active Fork Ecosystem** (max 25 points):
  - 5+ active forks = 25 points
  - Indicates ongoing interest
- **Successful Forks** (max 25 points):
  - 15 points per fork with more stars
  - Proves better approaches exist
- **Common Modifications** (max 20 points):
  - 5 points per common pattern
  - Indicates validated demand

### 5. Business Opportunity Detection

Four opportunity types identified:

1. **🎯 Validated Demand**
   - Multiple forks add similar features
   - Signal: Users independently want same features
   - Opportunity: Build version with features built-in

2. **🏆 Proven Better Approach**
   - Fork has more stars than original
   - Signal: Better execution/features
   - Opportunity: Study what made it successful

3. **💰 Abandoned + Active Ecosystem**
   - Original unmaintained but forks still active
   - Signal: Demand persists despite abandonment
   - Opportunity: Build maintained alternative

4. **✨ High Opportunity Score**
   - Score ≥ 70/100
   - Signal: Strong convergence of signals
   - Opportunity: Hot area with proven demand

### 6. Report Generation

Markdown reports saved to: `data/reports/fork-evolution-{niche-id}-{date}.md`

Each report includes:
- Niche name and date
- Total fork-worthy repositories
- Top 15 repositories ranked by opportunity score
- For each repository:
  - Name, description, opportunity score
  - Repository metrics (stars, forks, active forks, successful forks)
  - More popular forks (if any)
  - Common modifications across forks
  - Business opportunity analysis
  - Links to original, network graph, and top fork

## Rate Limiting

Implemented to respect GitHub API limits:

- **1 second** delay between topic searches
- **2 seconds** delay between repository analyses
- **500ms** delay after commit analysis
- **Limit to 15 repositories** per niche
- **Limit to 20 forks** per repository

**Total API calls per niche:**
- ~4 topic searches (1 per topic)
- ~15 repository analyses
- ~20 fork lists
- ~300 commit lists (15 repos × 20 forks)
- **≈ 339 API calls per niche**
- **≈ 1,695 API calls for all 5 niches**

With GitHub token: 5,000 requests/hour (sufficient)
Without token: 60 requests/hour (will hit limit)

## GitHub Actions Automation

The workflow runs automatically:
- **Tuesday and Thursday at 12 PM UTC** (cron: '0 12 * * 2,4')
- **Manual trigger** available via workflow_dispatch

Workflow steps:
1. Checkout repository
2. Install dependencies
3. Run Fork Evolution with GITHUB_TOKEN
4. Auto-commit reports to repository

## Output Format

Example report structure:

```markdown
# Fork Evolution Report: Freelancer Scope Creep Prevention

**Date:** 2026-02-13
**Niche:** freelancer-scope-creep
**Fork-Worthy Repositories:** 12

---

## 1. invoiceninja/invoiceninja

**Description:** Free open-source invoicing software

**Opportunity Score:** 85/100 🔥

**Repository Metrics:**
- Stars: 7,234
- Total Forks: 2,103
- Active Forks (90d): 47
- Successful Forks: 2
- Last Updated: 11/15/2025

**🏆 More Popular Forks:**
  - [modernvoice/invoice-pro](https://github.com/modernvoice/invoice-pro) - 8,901 stars
  - [saas-invoice/nextgen](https://github.com/saas-invoice/nextgen) - 7,456 stars

**🎯 Common Modifications Across Forks:**
  - recurring billing support (12 forks)
  - multi-currency support (8 forks)
  - time tracking integration (7 forks)
  - custom branding removal (6 forks)
  - api webhook support (5 forks)

**Business Opportunity Analysis:**
🎯 VALIDATED DEMAND:
Multiple forks independently added similar features:
  - recurring billing support (12 forks)
  - multi-currency support (8 forks)
  - time tracking integration (7 forks)
💡 Opportunity: Build version with these features built-in

🏆 PROVEN BETTER APPROACH:
  - modernvoice/invoice-pro: 8,901 stars (1,667 more than original)
💡 Opportunity: Study what made these forks more successful

**Links:**
- Original: https://github.com/invoiceninja/invoiceninja
- Network Graph: https://github.com/invoiceninja/invoiceninja/network
- Top Fork: https://github.com/modernvoice/invoice-pro

---
```

## Fork-Worthy Criteria

### Target Repositories
- **Stars**: >1,000 (validated demand)
- **Forks**: >100 (active ecosystem)
- **Topics**: Match niche topics
- **Public**: Accessible for analysis

### Interesting Forks
- **Active**: Updated in last 90 days
- **Substantial**: 50+ commits
- **Popular**: 50+ stars (gaining traction)
- **Successful**: More stars than original (rare but gold)

### Modification Patterns Detected
- Feature additions (from commit messages)
- Platform support (Windows, Docker, mobile)
- Integration additions (APIs, webhooks)
- UI/UX improvements
- Performance optimizations
- Language/framework migrations

## Feature Extraction

From commit messages, looks for keywords:
- add, added, feature
- support for, implement
- new, introduce, enable, allow

Examples:
- "add recurring billing support" → "recurring billing support"
- "implement multi-currency feature" → "multi-currency feature"
- "enable api webhook support" → "api webhook support"

Filters out:
- Merge commits
- Version bumps
- Generic messages

## Common Pattern Detection

Identifies patterns appearing in 2+ forks:
- Groups similar modifications
- Counts frequency
- Sorts by popularity
- Returns top patterns with counts

Example: "recurring billing support (12 forks)"

## Business Opportunity Examples

### Pattern 1: Convergent Modifications
```
Finding: 10 invoice tool forks add "multi-currency support"
Opportunity: Build invoice tool with native multi-currency
Validation: 10 independent developers saw this need
Market: Proven demand exists
```

### Pattern 2: Successful Divergent Fork
```
Finding: Fork adds modern UI, gets 2x stars
Opportunity: UI is the differentiator, not features
Validation: Users prefer better design
Market: Rebuild with focus on UX
```

### Pattern 3: Abandoned + Active Forks
```
Finding: Original dead 2 years, 20 forks in last 6 months
Opportunity: Build maintained alternative
Validation: Clear ongoing demand
Market: Users still need this tool
```

### Pattern 4: Platform Gap
```
Finding: Mac-only tool, most forks add Windows support
Opportunity: Build native Windows version
Validation: Multiple forks prove demand
Market: Windows users underserved
```

## Adding New Niches

1. Edit `config/target-niches.yaml`
2. Add new niche with required fields:
   ```yaml
   - id: "my-new-niche"
     name: "My New Niche Name"
     enabled: true
     monitoring:
       keywords:
         - keyword1
         - keyword2
       github_topics:
         - topic1
         - topic2
   ```

3. Test locally:
```bash
npm run fork-evolution
```

4. Commit changes to trigger automation

## Troubleshooting

### "No GITHUB_TOKEN found" Warning
- Add GITHUB_TOKEN environment variable
- Without token: 60 requests/hour (insufficient for 5 niches)
- With token: 5,000 requests/hour (sufficient)

### Rate Limit Errors
- Script automatically adds delays
- Reduce repositories per niche (currently 15)
- Run less frequently (Tue/Thu instead of daily)
- Use authenticated requests

### No Fork-Worthy Repositories
- Check if niche topics have popular repos
- Try broader topic terms
- Verify repos have >1000 stars and >100 forks
- Check GitHub Search syntax

### Few Common Modifications Found
- Some repos have unique forks
- Increase fork sample size (currently 20)
- Look for broader patterns
- Consider lower threshold (currently 2+ forks)

### TypeScript Compilation Errors
```bash
npm run typecheck
```

## Integration with Council App

Fork Evolution is part of Council's intelligence pipeline:

**Intelligence Flow:**
Scout → Stargazer Analysis → **Fork Evolution** → Market Gap → Daily Brief

- **Scout**: Identifies Blue Ocean opportunities
- **Stargazer Analysis**: Validates quality and detects trends
- **Fork Evolution**: Reveals product gaps through modifications
- **Market Gap**: Identifies unmet needs
- **Daily Brief**: Synthesizes all intelligence

## Performance

Expected runtime per niche:
- **Topic searches**: 4 topics × 1 second = 4 seconds
- **Repository analysis**: 15 repos × 2 seconds = 30 seconds
- **Fork analysis**: 15 repos × 20 forks × 0.5 seconds = 150 seconds
- **Processing**: ~5 seconds
- **Total per niche**: ~189 seconds (~3 minutes)
- **All 5 niches**: ~15-20 minutes

## Key Insights Provided

1. **Feature Gaps**: What features users add themselves
2. **Validated Demand**: Multiple forks = multiple people need it
3. **Successful Patterns**: Learn from forks that exceeded original
4. **Rebuild Opportunities**: Abandoned + active forks = market ready
5. **Platform Gaps**: See what platforms/integrations are missing
6. **Market Validation**: Fork activity proves ongoing interest
7. **Better Approaches**: Successful forks reveal winning strategies

## Example Use Cases

### Product Development
- Identify missing features before building
- Validate feature ideas with fork patterns
- Learn from successful modifications

### Market Research
- Discover validated demand signals
- Find abandoned tools with active users
- Identify platform gaps

### Competitive Analysis
- See how developers modify competitors
- Learn what makes forks more successful
- Identify common pain points

### Investment Research
- Find tools with active ecosystems
- Validate market demand
- Identify rebuild opportunities

## License

Part of the Council App - MIT License
