# Stargazer Analysis Reports

This directory contains automatically generated reports from the Stargazer Analysis feature.

## Report Format

Reports are generated with the filename pattern:
```
stargazer-{niche-id}-{date}.md
```

For example:
- `stargazer-freelancer-scope-creep-2026-02-13.md`
- `stargazer-newsletter-deliverability-2026-02-13.md`

## What's in Each Report

Each report contains:
- **Niche name and date**
- **Top 20 repositories** ranked by quality score
- **Detailed metrics** for each repository:
  - Description
  - Quality score (0-100)
  - Stars, star velocity, forks
  - Last update date
  - Institutional backers (if any)
  - Influencer endorsements (if any)
  - Business opportunity analysis
  - GitHub link

## Quality Score

Repositories are scored 0-100 based on:
- Star count (max 30 points)
- Star velocity (max 20 points)
- Institutional backing (max 20 points)
- Influencer endorsements (max 15 points)
- Recent activity (max 15 points)

Indicators:
- 🔥 80+ = Excellent
- ⭐ 60+ = Good
- No emoji = Standard

## Business Opportunities

Reports identify:
- ✅ **VALIDATED MARKET** - Active, high-quality projects
- 💰 **ABANDONED GOLDMINE** - Popular but abandoned
- 🚀 **EMERGING TREND** - Rapid growth
- 🏢 **ENTERPRISE VALIDATED** - Corporate backing
- ⭐ **INFLUENCER ENDORSED** - Industry leader support
- 🍴 **HIGH FORK RATIO** - Development gaps

## Generation

Reports are generated:
- **Automatically**: Mon/Wed/Fri at 10 AM UTC via GitHub Actions
- **Manually**: Run `npm run stargazer` (requires GITHUB_TOKEN)

## Configuration

Niches are configured in `config/target-niches.yaml`.

Current niches:
1. freelancer-scope-creep
2. newsletter-deliverability
3. etsy-handmade-pricing
4. tpt-copyright-protection
5. podcast-transcription-seo
