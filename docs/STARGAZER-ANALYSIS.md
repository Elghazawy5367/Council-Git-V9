# Stargazer Analysis - Quality Signal Detection

## Overview

The Stargazer Analysis is an automated intelligence system that analyzes GitHub repository stargazers across multiple niches to detect quality signals, institutional backing, and business opportunities. It identifies validated product ideas, emerging trends, and abandoned opportunities.

## Quick Start

```bash
# Run locally
npm run stargazer

# With GitHub token for higher rate limits
GITHUB_TOKEN=your_token npm run stargazer
```

## Configuration

The Stargazer Analysis reads from `config/target-niches.yaml`:

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

### 2. Repository Search
For each niche:
- Searches GitHub repositories by topics
- Filters repos with 100+ stars
- Sorts by star count (descending)
- Deduplicates by repository ID

### 3. Stargazer Analysis
For each repository (up to 30 per niche):
- Fetches up to 100 stargazers
- Calculates star velocity (projected monthly growth)
- Checks for institutional backing indicators
- Analyzes maintenance activity

### 4. Quality Scoring (0-100)

**Score Breakdown:**
- **Stars** (max 30 points): Base validation signal
  - 1,000 stars = 30 points
  - Scales linearly below that
- **Star Velocity** (max 20 points): Growth trajectory
  - 50+ stars/month = 20 points
  - Indicates rising demand
- **Institutional Backing** (max 20 points): Enterprise validation
  - 10 points per institutional backer
  - Limited without additional API calls
- **Influencers** (max 15 points): Thought leader validation
  - 5 points per influencer
  - Requires additional API calls
- **Recent Activity** (max 15 points): Maintenance signal
  - Updated < 7 days ago = 15 points
  - Updated < 30 days ago = 10 points
  - Updated < 90 days ago = 5 points

### 5. Business Opportunity Detection

Six opportunity types identified:

1. **✅ Validated Market**
   - Quality score ≥ 70
   - Updated within last 30 days
   - Strong institutional backing
   - Signal: Proven demand, active development

2. **💰 Abandoned Goldmine**
   - 1,000+ stars
   - No update in 180+ days
   - Signal: Popular but abandoned - rebuild opportunity

3. **🚀 Emerging Trend**
   - Star velocity > 100/month
   - Signal: Rising demand, early mover advantage

4. **🏢 Enterprise Validated**
   - Has institutional backers
   - Signal: B2B revenue potential

5. **⭐ Influencer Endorsed**
   - Has influencer endorsements
   - Signal: Marketing angles, credibility

6. **🍴 High Fork Ratio**
   - Forks > 30% of stars
   - Signal: Developers extending/modifying - indicates gaps

### 6. Report Generation

Markdown reports saved to: `data/reports/stargazer-{niche-id}-{date}.md`

Each report includes:
- Niche name and date
- Total repositories analyzed
- Top 20 repositories ranked by quality score
- For each repository:
  - Name, description, quality score
  - Star count, velocity, forks, last update
  - Institutional backers (if any)
  - Influencer endorsements (if any)
  - Business opportunity analysis
  - Direct link to repository

## Rate Limiting

Implemented to respect GitHub API limits:

- **1 second** delay between topic searches
- **1 second** delay between repository analyses
- **100ms** delay after stargazer checks
- **Limit to 30 repositories** per niche
- **Up to 100 stargazers** per repository

**Total API calls per niche:**
- ~4 topic searches (1 per topic)
- ~30 repository analyses
- ~30 stargazer list calls
- **≈ 64 API calls per niche**
- **≈ 320 API calls for all 5 niches**

With GitHub token: 5,000 requests/hour (safe)
Without token: 60 requests/hour (will hit limit)

## GitHub Actions Automation

The workflow runs automatically:
- **Monday, Wednesday, Friday at 10 AM UTC** (cron: '0 10 * * 1,3,5')
- **Manual trigger** available via workflow_dispatch

Workflow steps:
1. Checkout repository
2. Install dependencies
3. Run Stargazer Analysis with GITHUB_TOKEN
4. Auto-commit reports to repository

## Output Format

Example report structure:

```markdown
# Stargazer Analysis Report: Freelancer Scope Creep Prevention Tools

**Date:** 2026-02-13
**Niche:** freelancer-scope-creep
**Repositories Analyzed:** 30

---

## 1. invoiceninja/invoiceninja

**Description:** Free open-source invoicing software

**Quality Score:** 73/100 ⭐

**Metrics:**
- Stars: 7,234
- Star Velocity (projected monthly): +89
- Forks: 2,103
- Last Updated: 2/10/2026

**Business Opportunity:**
✅ VALIDATED MARKET: High quality, actively maintained, strong institutional backing
🚀 EMERGING TREND: Rapid star growth indicates rising demand

**Link:** https://github.com/invoiceninja/invoiceninja

---
```

## API Limitations

### Institutional Backing Detection

The GitHub API endpoint `listStargazersForRepo` returns minimal user data that **does not include the company field**. This means:

- ❌ Cannot detect institutional backing from basic stargazer list
- ✅ Can still assess quality via star count and velocity
- ✅ Can detect organizational accounts (type: 'Organization')

**To enable full institutional backing detection:**
1. Fetch full user details: `octokit.users.getByUsername(login)`
2. Check user.company field for institutional keywords
3. **Caution**: Costs 1 API call per stargazer (100 calls per repo)

This is currently **disabled** to preserve rate limits.

### Influencer Detection

Detecting influencers requires:
1. Full user details via `octokit.users.getByUsername(login)`
2. Check user.followers field (threshold: 10,000+)
3. **Caution**: Costs 1 API call per stargazer

This is currently **disabled** to preserve rate limits.

## Quality Signals Detected

### Strong Signals (Currently Implemented)
- ✅ High star count (1,000+ = proven demand)
- ✅ Star velocity (rapid growth = emerging trend)
- ✅ Recent activity (active maintenance)
- ✅ High fork ratio (developer interest)
- ✅ Organizational stargazers (companies)

### Moderate Signals (Limited Implementation)
- ⚠️ Institutional backing (requires extra API calls)
- ⚠️ Influencer endorsements (requires extra API calls)

### Planned Future Enhancements
- Contributor diversity analysis
- Issue response time tracking
- PR acceptance rate measurement
- Documentation quality scoring

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
npm run stargazer
```

4. Commit changes to trigger automation

## Troubleshooting

### "No GITHUB_TOKEN found" Warning
- Add GITHUB_TOKEN environment variable
- Without token: 60 requests/hour (will fail for 5 niches)
- With token: 5,000 requests/hour (sufficient)

### Rate Limit Errors
- Script automatically adds delays
- Reduce repositories per niche (currently 30)
- Run less frequently
- Use authenticated requests

### No Repositories Found
- Check if niche topics exist on GitHub
- Verify topics are popular (100+ starred repos)
- Try broader topic terms
- Check GitHub Search syntax

### TypeScript Compilation Errors
```bash
npm run typecheck
```

## Integration with Council App

The Stargazer Analysis is part of Council's intelligence pipeline:

**Intelligence Flow:**
Scout → **Stargazer Analysis** → Market Gap → Daily Brief

- **Scout**: Identifies Blue Ocean opportunities (abandoned markets)
- **Stargazer Analysis**: Validates quality and detects trends
- **Market Gap**: Identifies unmet needs
- **Daily Brief**: Synthesizes all intelligence

## Performance

Expected runtime per niche:
- **Topic searches**: 4 topics × 1 second = 4 seconds
- **Repository analysis**: 30 repos × 1 second = 30 seconds
- **Processing**: ~5 seconds
- **Total per niche**: ~39 seconds
- **All 5 niches**: ~3-4 minutes

## Example Insights

### Validated Product Idea
```
Repository: stripe/stripe-node
Quality Score: 92/100 🔥
Opportunity: ✅ VALIDATED MARKET + 🏢 ENTERPRISE VALIDATED
→ Stripe's official SDK has high quality and enterprise backing
→ Building tools for Stripe integration = validated demand
```

### Abandoned Goldmine
```
Repository: old-invoicing/invoice-app
Quality Score: 65/100
Opportunity: 💰 ABANDONED GOLDMINE
→ 3,000 stars but no commits in 2 years
→ Opportunity to build modern alternative
```

### Emerging Trend
```
Repository: ai-assistants/new-framework
Quality Score: 78/100
Opportunity: 🚀 EMERGING TREND
→ +250 stars/month velocity
→ Early mover advantage in AI assistant tools
```

## License

Part of the Council App - MIT License
