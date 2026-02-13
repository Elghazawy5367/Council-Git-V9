# Mining Drill - Pain Point Extraction Engine

## Overview

The Mining Drill is an automated intelligence system that extracts pain points from GitHub issues across multiple niches. It identifies high-value business opportunities by analyzing:
- Issue engagement (comments, reactions)
- Frustration indicators in text
- Issue recency and persistence
- Community validation signals

## Quick Start

```bash
# Run locally
npm run mining-drill

# With GitHub token for higher rate limits
GITHUB_TOKEN=your_token npm run mining-drill
```

## Configuration

The Mining Drill reads from `config/target-niches.yaml`:

```yaml
niches:
  - id: your-niche-id
    name: "Your Niche Name"
    enabled: true
    keywords:
      - keyword1
      - keyword2
    github_search_queries:
      - "search query 1 in:title,body"
      - "search query 2 in:title,body"
    github_topics:
      - topic1
      - topic2
    subreddits:  # For reference, not used by Mining Drill
      - subreddit1
```

### Current Niches (5)

1. **freelancer-scope-creep** - Freelancer Scope Creep Prevention
2. **newsletter-deliverability** - Newsletter Deliverability Issues
3. **etsy-handmade-pricing** - Etsy/Handmade Product Pricing
4. **tpt-copyright-protection** - Teachers Pay Teachers Copyright Protection
5. **podcast-transcription-seo** - Podcast Transcription for SEO

## How It Works

### 1. Config Loading
- Reads `config/target-niches.yaml`
- Filters enabled niches
- Validates configuration structure

### 2. GitHub Search
For each niche:
- Executes all `github_search_queries`
- Searches GitHub Issues API
- Filters out pull requests
- Removes duplicates by URL

### 3. Pain Point Scoring (1-10)
Baseline score: **5** (neutral pain point)

Score modifiers:
- **Comments > 20**: +3 (high engagement)
- **Comments > 10**: +2
- **Comments > 5**: +1
- **Reactions > 10**: +2 (strong community agreement)
- **Reactions > 5**: +1
- **Frustration keywords**: +2 (explicit pain signals)
- **Recent issue (< 30 days)**: +1 (current problem)

**Frustration keywords detected:**
- frustrated, impossible, broken, doesn't work
- terrible, awful, painful, annoying, hate
- nightmare, struggling, waste of time, crashes
- useless, not working, horrible

### 4. Business Opportunity Generation
For each pain point, generates:
- Solution type recommendation (tool, guide, automation)
- Pricing suggestion based on engagement:
  - High engagement (>20 comments): $29-97
  - Moderate engagement (>10 comments): $15-49
  - Growing pain point: $9-29

### 5. Report Generation
Markdown reports saved to: `data/reports/mining-drill-{niche-id}-{date}.md`

Each report includes:
- Niche name and date
- Total pain points found
- Top 30 pain points ranked by score
- For each pain point:
  - Title and repository
  - Pain score (1-10)
  - Comment and reaction counts
  - Business opportunity description
  - Direct link to issue

## Rate Limiting

- **1 second** delay between GitHub API calls
- **60 second** backoff on rate limit errors (403)
- Graceful degradation on failures

## GitHub Actions Automation

The workflow runs automatically:
- **Daily at 8 AM UTC** (cron: '0 8 * * *')
- **Manual trigger** available via workflow_dispatch

Workflow steps:
1. Checkout repository
2. Install dependencies
3. Run Mining Drill with GITHUB_TOKEN
4. Auto-commit reports to repository

## Output Format

Example report structure:

```markdown
# Mining Drill Report: Freelancer Scope Creep Prevention

**Date:** 2026-02-13
**Niche:** freelancer-scope-creep
**Pain Points Found:** 23

---

## 1. Client keeps asking for "small tweaks" outside scope

**Repository:** freelance/contract-templates
**Pain Score:** 9/10
**Comments:** 47
**Reactions:** 15
**Link:** https://github.com/...

**Business Opportunity:**
Create email templates for freelancers to politely push back on 
scope creep while maintaining client relationships. High engagement 
suggests strong demand. Could charge $29-97 for a quality solution.

---

## 2. How to track scope changes and bill for them?

**Repository:** freelance/project-management
**Pain Score:** 8/10
**Comments:** 32
**Reactions:** 8
**Link:** https://github.com/...

**Business Opportunity:**
Build an automation solution. Moderate demand. Pricing could range $15-49.

---
```

## Adding New Niches

1. Edit `config/target-niches.yaml`
2. Add new niche with required fields:
   - `id`: Unique identifier (lowercase-with-hyphens)
   - `name`: Display name
   - `enabled`: true
   - `keywords`: Array of relevant terms
   - `github_search_queries`: Array of GitHub search queries
   - `github_topics`: Array of topic filters
   - `subreddits`: Array for reference

3. Test locally:
```bash
npm run mining-drill
```

4. Commit changes to trigger daily automation

## Troubleshooting

### "No GITHUB_TOKEN found" Warning
- Add GITHUB_TOKEN environment variable
- Without token, rate limits are 60 requests/hour
- With token, rate limits are 5000 requests/hour

### Rate Limit Errors
- Script automatically backs off for 60 seconds
- Consider running less frequently or adding delays
- Use authenticated requests (GITHUB_TOKEN)

### No Pain Points Found
- Check if niche queries are too specific
- Verify GitHub topics exist and are popular
- Try broader search terms

### TypeScript Compilation Errors
```bash
npm run typecheck
```

## Dependencies

- `js-yaml`: YAML configuration parsing
- `@octokit/rest`: GitHub API client
- `@types/js-yaml`: TypeScript types for js-yaml

## Integration with Council App

The Mining Drill is part of the Council App's intelligence pipeline:
- **Scout** → Identifies Blue Ocean opportunities
- **Mining Drill** → Extracts pain points per niche
- **Goldmine Detector** → Validates market demand
- **Daily Intelligence Brief** → Synthesizes all intelligence

## Performance

Expected runtime per niche:
- **4 queries** × **1 second** = 4 seconds minimum
- Plus processing time: ~2-5 seconds
- **Total per niche**: ~6-9 seconds
- **All 5 niches**: ~30-45 seconds

## License

Part of the Council App - MIT License
