# Reddit Sniper - High-Intent Buying Signal Detector

## Overview

**Reddit Sniper** detects high-intent buying signals on Reddit - posts where users are actively looking for solutions RIGHT NOW. These are your hottest leads, much warmer than passive pain points.

**Status:** ✅ **FULLY OPERATIONAL** (as of Feb 14, 2026)

## What Reddit Sniper Does

### Core Purpose
Find Reddit posts with HIGH-INTENT buying signals = people actively looking for solutions.

**Why This Matters:**
- **Buying intent** = ready to purchase
- **Real-time signals** = act immediately  
- **Specific needs** = clear product requirements
- **Direct contact** = can reply and convert

### Example High-Intent Post
```
Title: "Looking for a tool to track freelance project scope"
Subreddit: r/freelance
Body: "Need something to help me track scope changes and bill for extra 
      work. Budget $50/month. What do you recommend?"
Intent Score: 95/100 🔥🔥🔥
Action: Reply with solution immediately
```

## How It Works

### 1. Multi-Niche Configuration
Reads from `config/target-niches.yaml` to monitor 5 target niches:
- `freelancer-scope-creep`
- `newsletter-deliverability`
- `etsy-handmade-pricing`
- `tpt-copyright-protection`
- `podcast-transcription-seo`

Each niche specifies:
- **keywords**: Search terms for Reddit queries
- **subreddits**: Which subreddits to monitor

### 2. Reddit API Search
For each niche:
- Searches configured subreddits using Reddit's public JSON API
- Combines keywords with buying intent phrases: `(looking OR need OR recommend OR best)`
- Fetches posts from last 7 days
- Rate limiting: 1 second between keyword searches, 2 seconds between subreddits

### 3. Intent Scoring System (0-100)

#### Score Breakdown:
- **Base Score (0-50 points):**
  - "Looking for" in title: +20 points
  - "Need" in title: +15 points
  - "Recommend" or "suggestion" in title: +15 points
  - Question mark in title: +10 points

- **Budget Signal (0-20 points):**
  - Specific budget mentioned ($X): +20 points
  - Price range mentioned: +15 points
  - "Willing to pay" phrase: +10 points

- **Urgency Signal (0-15 points):**
  - "ASAP" or "urgent": +15 points
  - Specific deadline: +10 points
  - "Soon" or "quickly": +5 points

- **Detail Signal (0-15 points):**
  - 3+ specific requirements: +15 points
  - 2 requirements: +10 points
  - 1 requirement: +5 points

#### Action Thresholds:
- **80-100:** 🔥🔥🔥 HIGH PRIORITY - Reply immediately
- **60-79:** 🔥🔥 MEDIUM PRIORITY - Reply if exact match
- **40-59:** 🔥 LOW PRIORITY - Monitor for more details
- **0-39:** SKIP - Intent too low

### 4. Report Generation
For each niche, generates a markdown report:
- **Location:** `data/reports/reddit-sniper-{niche-id}-{date}.md`
- **Contents:**
  - All posts with intent score 40+
  - Sorted by intent score (highest first)
  - Buying signals detected
  - Budget/timeframe/current solution extracted
  - Recommended action for each post
  - Reply templates for high-intent posts
  - Summary statistics

## Usage

### Manual Run
```bash
npm run reddit-sniper
```

### Automated Schedule
GitHub Actions workflow runs **every 6 hours** (4x daily):
- File: `.github/workflows/reddit-sniper.yml`
- Schedule: `0 */6 * * *`
- Also supports manual trigger via `workflow_dispatch`

### Output
Generates 5 reports (one per niche):
```
data/reports/reddit-sniper-freelancer-scope-creep-2026-02-14.md
data/reports/reddit-sniper-newsletter-deliverability-2026-02-14.md
data/reports/reddit-sniper-etsy-handmade-pricing-2026-02-14.md
data/reports/reddit-sniper-tpt-copyright-protection-2026-02-14.md
data/reports/reddit-sniper-podcast-transcription-seo-2026-02-14.md
```

## Report Format

### Header
```markdown
# Reddit Sniper Report: {Niche Name}

**Date:** 2026-02-14
**Niche:** freelancer-scope-creep
**High-Intent Signals:** 15

## 🎯 What is a High-Intent Signal?
Reddit posts where users are actively looking for solutions RIGHT NOW.
These are your hottest leads - people ready to buy.
```

### Individual Signal
```markdown
## 1. Looking for tool to track freelance scope changes - budget $50/month

**Intent Score:** 95/100 🔥🔥🔥

**Post Details:**
- Subreddit: r/freelance
- Author: u/freelancer_dev
- Score: 23 upvotes
- Comments: 8
- Posted: 2/12/2026

**🎯 Buying Signals:**
  - Looking for solution
  - Budget mentioned: $50/month
  - Expressed need
  - Urgent need

**💰 Budget:** $50/month
**⏰ Timeframe:** ASAP
**🔄 Current Solution:** spreadsheets

**📋 Specific Needs:**
  - Need it to track scope changes automatically
  - Must have invoicing integration
  - Want to send change requests to clients

**✅ Recommended Action:**
HIGH PRIORITY: Reply with solution immediately

**💡 Reply Template:**
Hey! I saw you're looking for [solution].
I actually built [your product] specifically for this.
It handles [specific needs mentioned].
Happy to answer any questions!

**🔗 Link:** https://reddit.com/r/freelance/comments/xyz123/...
```

### Summary
```markdown
## 📊 Summary

**High-Intent Signals (80+):** 5
**Medium-Intent Signals (60-79):** 7
**Posts with Budget:** 8

⚡ **Action Required:** Reply to 5 high-intent posts immediately
```

## High-Intent Signal Patterns

### 1. Explicit Buying Intent
- "Looking for [tool/service]"
- "Need recommendations for..."
- "What's the best [category] for..."
- "Trying to find..."
- "Shopping for..."

### 2. Budget Signals
- "Budget of $X"
- "Willing to pay..."
- "Price range..."
- "Up to $X/month"

### 3. Urgency Signals
- "Need ASAP"
- "Starting next week"
- "Project launching soon"
- "Deadline approaching"

### 4. Comparison Shopping
- "X vs Y - which is better?"
- "Alternatives to X?"
- "Better than X?"
- "Switching from X"

### 5. Pain + Solution Seeking
- "Frustrated with X, need alternative"
- "X doesn't have [feature], looking for..."
- "Outgrew X, need something more powerful"

## Key Insights This Feature Provides

1. **Ready-to-Buy Customers:** Active searchers, not passive browsers
2. **Budget Information:** Know what they'll pay
3. **Specific Needs:** Exact requirements for your product
4. **Urgency:** Know when they need it
5. **Competition:** What they're currently using
6. **Pain Points:** Why current solutions aren't working

## Technical Details

### Files
- **Core Logic:** `src/lib/reddit-sniper.ts`
- **Script Runner:** `scripts/snipe-reddit.ts`
- **Workflow:** `.github/workflows/reddit-sniper.yml`
- **Test Script:** `scripts/test-reddit-sniper.ts`

### Dependencies
- `js-yaml` - YAML config parsing
- `fs` / `path` - File system operations
- Built-in `fetch` - Reddit API calls (Node 18+)

### Configuration
Uses `config/target-niches.yaml` with nested monitoring structure:
```yaml
niches:
  - id: "freelancer-scope-creep"
    name: "Freelancer Scope Creep Prevention"
    monitoring:
      keywords:
        - "scope creep"
        - "freelance scope"
        - "client requesting more work"
      subreddits:
        - "r/freelance"
        - "r/Upwork"
        - "r/Fiverr"
```

### Rate Limiting
- Reddit allows 60 requests/minute without authentication
- 1 second delay between keyword searches
- 2 second delay between subreddit searches
- Uses public JSON endpoints (no API key needed)

## Testing

### Unit Tests
Run intent scoring validation:
```bash
npx tsx scripts/test-reddit-sniper.ts
```

Tests verify:
- ✅ Intent score calculation (0-100 scale)
- ✅ Buying signal detection
- ✅ Budget/timeframe extraction
- ✅ Action recommendation logic

### Example Test Output
```
🧪 Testing Reddit Sniper Intent Scoring

Test 1: "Looking for a tool to track freelance scope changes - budget $50/month"
Intent Score: 60/100
Buying Signals: Looking for solution, Budget mentioned: $50, Urgent need
Budget: $50
Timeframe: ASAP
Current Solution: spreadsheets
Action: MEDIUM PRIORITY: Reply if you have exact solution

✅ Intent scoring test complete!
```

## Comparison with Other Features

| Feature | Purpose | Data Source | Update Frequency |
|---------|---------|-------------|------------------|
| **Reddit Sniper** | 🎯 High-intent buying signals | Reddit | Every 6 hours |
| Mining Drill | Pain point extraction | GitHub Issues | Daily |
| HackerNews Intelligence | Tech community signals | HackerNews API | Bi-weekly |
| Goldmine Detector | Abandoned repo opportunities | GitHub | Weekly |
| Stargazer Analysis | Institutional backing | GitHub | Weekly |

## Future Enhancements

### Potential Improvements
1. **Sentiment Analysis:** Detect frustration level in posts
2. **Competitor Tracking:** Auto-identify mentioned competitors
3. **User Profiling:** Analyze post history to qualify leads
4. **Auto-Response:** Generate personalized reply drafts
5. **Lead Scoring:** Combine with other signals for super-score
6. **Slack Integration:** Push high-intent signals to Slack
7. **CRM Export:** Auto-create leads in CRM systems

## Troubleshooting

### No Posts Found
- **Cause:** Reddit might be rate-limiting or blocking requests
- **Solution:** Check User-Agent header, add delays, or use authenticated API

### Low Intent Scores
- **Cause:** Posts don't match high-intent patterns
- **Solution:** Adjust keywords in config, or lower score threshold

### Missing Subreddits
- **Cause:** Subreddit doesn't exist or is private
- **Solution:** Verify subreddit names, check if public

## Success Metrics

Track these to measure Reddit Sniper effectiveness:
- **High-intent signals found** (80+ score)
- **Posts with budget mentions**
- **Posts with urgent timeframes**
- **Conversion rate** (replies → customers)
- **Response time** (find signal → reply)

## Related Documentation

- [Mining Drill](MINING-DRILL.md) - Pain point extraction from GitHub
- [HackerNews Intelligence](HACKERNEWS-INTELLIGENCE.md) - HN community analysis
- [Target Niches Config](../config/target-niches.yaml) - Multi-niche configuration

---

**Last Updated:** February 14, 2026  
**Status:** ✅ Production Ready  
**Maintainer:** Council App Development Team
