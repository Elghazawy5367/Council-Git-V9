# Quality Pipeline - Intelligence Filtering

**Status:** ✅ Operational  
**Type:** META Feature (Filters all other features)  
**Purpose:** Score and filter 50+ daily intelligence reports into top 10-20 high-quality opportunities

---

## What is Quality Pipeline?

Quality Pipeline is a **META feature** that doesn't gather new data. Instead, it:

1. **Reads reports** from all other intelligence features (last 7 days)
2. **Applies quality scoring** to each item (0-100)
3. **Filters out noise** (below 70 quality threshold)
4. **Creates curated reports** showing only high-quality opportunities
5. **Saves time** by highlighting what matters most (2 hours → 20 minutes review)

---

## Features Analyzed

Quality Pipeline reads and scores reports from:

- `mining-drill` - GitHub issue pain points
- `reddit-sniper` - High-intent buying signals
- `reddit-pain-points` - Complaint patterns
- `viral-radar` - Viral trending opportunities
- `hackernews` - HackerNews intelligence
- `goldmine` - Abandoned goldmine repos
- `fork-evolution` - GitHub fork patterns
- `stargazer` - GitHub engagement tracking
- `github-trending` - Trending repositories

---

## Quality Scoring Algorithm

**Total Score: 0-100 points**

### 1. Base Quality (0-60 points)
Uses the feature's existing score (normalized to 60-point scale):
- Reddit Sniper: Intent Score
- Reddit Pain Points: Pain Score
- Viral Radar: Viral Score
- GitHub Trending: Trend Score
- Goldmine: Goldmine Score
- Fork Evolution: Opportunity Score
- Stargazer: Quality Score
- HackerNews: HN Score
- Mining Drill: Priority-based estimate

### 2. Recency Bonus (0-20 points)
- Posted <24 hours ago: **+20 points**
- Posted 1-3 days ago: **+15 points**
- Posted 3-7 days ago: **+10 points**
- Posted >7 days ago: **+5 points**

### 3. Signal Strength (0-10 points)
Based on engagement indicators:
- High engagement (100+ comments, 1000+ upvotes, 1000+ stars): **+10 points**
- Moderate engagement (50+ comments, 500+ upvotes, 500+ stars): **+7 points**
- Some engagement (10+ comments, 100+ upvotes, 100+ stars): **+5 points**
- Low/no engagement: **+2 points**

### 4. Validation Bonus (0-10 points)
- Budget mentioned ($, budget, willing to pay): **+10 points**
- Users/customers mentioned: **+7 points**
- Company/team/startup mentioned: **+7 points**
- Specific needs (need, require, looking for): **+5 points**
- General mention: **+2 points**

---

## Quality Tiers

### 💎 PLATINUM (90-100)
**Must pursue immediately**
- Highest quality opportunities
- Strong validation signals
- Recent and highly engaged

### 🥇 GOLD (80-89)
**Strong opportunities**
- High quality signals
- Good engagement
- Worth serious consideration

### 🥈 SILVER (70-79)
**Worth considering**
- Meets quality threshold
- Moderate engagement
- May be worth pursuing

### 🥉 BRONZE (<70)
**Filtered out (noise)**
- Below quality threshold
- Not shown in reports
- Ignored to save time

---

## Usage

### Manual Execution

```bash
npm run quality-pipeline
```

**Output:**
```
🔍 Quality Pipeline - Starting...
📂 Found 5 enabled niches

🔍 Quality scoring: freelancer-scope-creep
  → Loading reports from last 7 days...
  → Found 127 items across all features
  → Scoring quality...
  → High-quality items (70+): 34
  → Platinum (90+): 5
  → Gold (80-89): 12
  → Report saved: data/intelligence/quality-pipeline-freelancer-scope-creep-2026-02-14.md

(... 4 more niches ...)

✅ Complete!
Generated 5 quality reports

📊 Summary:
  - freelancer-scope-creep: 34/127 high-quality (5 platinum, 12 gold)
  - newsletter-deliverability: 28/98 high-quality (3 platinum, 9 gold)
  - etsy-handmade-pricing: 19/76 high-quality (2 platinum, 7 gold)
  - tpt-copyright-protection: 24/89 high-quality (4 platinum, 8 gold)
  - podcast-transcription-seo: 31/115 high-quality (6 platinum, 11 gold)
```

### Automated Execution

**GitHub Actions workflow** runs automatically:
- **Schedule:** Daily at 10 PM UTC (after all other features)
- **Workflow:** `.github/workflows/quality-pipeline.yml`
- **Manual trigger:** Available via GitHub Actions UI

---

## Output Files

Reports saved to:
```
data/intelligence/quality-pipeline-{niche-id}-{date}.md
```

### Report Structure

```markdown
# Quality Pipeline Report: {Niche Name}

**Date:** 2026-02-14
**Niche:** freelancer-scope-creep
**Total Items Analyzed:** 127

---

## 💎 PLATINUM TIER (90-100)
**Must pursue immediately**

### 1. Looking for tool to track freelance scope - budget $50/month
**Quality Score:** 95/100 💎
**Source:** reddit-sniper
**Date:** 2026-02-13

**Quality Breakdown:**
- Base Quality: 57/60 (from 95/100 base score)
- Recency Bonus: 20/20
- Signal Strength: 10/10
- Validation: 10/10

**Why High Quality:**
  - Base score from reddit-sniper: 95/100
  - Posted <24h ago: +20 recency
  - High engagement: +10 signal
  - Budget mentioned: +10 validation

**Excerpt:**
> Looking for tool to track freelance scope - budget $50/month...

**Source File:** reddit-sniper-freelancer-scope-creep-2026-02-13.md

---

(... more items ...)

## 🥇 GOLD TIER (80-89)
(12 gold items)

## 🥈 SILVER TIER (70-79)
(17 silver items, top 10 shown)

## 📊 Summary
| Tier | Count | Avg Quality |
|------|-------|-------------|
| 💎 Platinum | 5 | 93/100 |
| 🥇 Gold | 12 | 84/100 |
| 🥈 Silver | 17 | 74/100 |
| 🥉 Bronze (filtered) | 93 | <70 |

## ⚡ PRIORITY ACTIONS
**This Week:**
1. Looking for tool to track freelance scope - budget $50/month (reddit-sniper)
2. I automated my invoicing workflow - 12k upvotes (viral-radar)
3. 23 complaints: invoicing tools don't handle recurring billing (reddit-pain-points)

## 📈 Feature Performance
| Feature | High-Quality Items | Avg Quality |
|---------|-------------------|-------------|
| reddit-sniper | 8 | 87/100 |
| viral-radar | 6 | 84/100 |
| reddit-pain-points | 7 | 79/100 |
| goldmine | 5 | 76/100 |
| github-trending | 4 | 73/100 |
| hackernews | 2 | 72/100 |
| mining-drill | 2 | 71/100 |
```

---

## Why Quality Pipeline is Valuable

### Problem Without It:
- 50+ reports daily from 10 features
- Mix of high and low quality signals
- Hard to know what to prioritize
- Noise overwhelms signal
- **Analysis paralysis**

### Solution With It:
- Automatic quality scoring (0-100)
- Filter: Only show 70+ quality items
- Curated: Top 20 high-quality opportunities
- **Time saved:** 2 hours → 20 minutes daily review
- **Focus:** Only on items worth pursuing

### Example Impact:

**Before Quality Pipeline:**
- See 127 items across all features
- Mix of serious and trivial signals
- Hard to identify top priorities
- **Problem:** Which 5-10 should you focus on?

**After Quality Pipeline:**
- See TOP 34 high-quality items (73% noise removed)
- 5 platinum (must pursue immediately)
- 12 gold (strong opportunities)
- 17 silver (worth considering)
- **Action:** Focus on platinum/gold, review silver if time permits

---

## Integration with Other Features

### Data Flow:
```
[All Features] → [Generate Reports] → [Quality Pipeline] → [Curated Intelligence]
     ↓                   ↓                    ↓                        ↓
  Raw Data         data/reports/     Quality Scoring      data/intelligence/
```

### Time Savings:
```
Without Quality Pipeline: Review 50+ reports → 2 hours
With Quality Pipeline: Review 1 curated report → 20 minutes
Efficiency Gain: 83% time saved
```

---

## Configuration

Quality Pipeline uses the same niche configuration as all other features:

**Config File:** `config/target-niches.yaml`

**Enabled Niches:**
1. freelancer-scope-creep
2. newsletter-deliverability
3. etsy-handmade-pricing
4. tpt-copyright-protection
5. podcast-transcription-seo

To add/remove niches, edit the YAML config and set `enabled: true/false`.

---

## Troubleshooting

### No Items Found
```
⚠️ No reports found - run other features first
```
**Solution:** Run other intelligence features to generate reports first:
```bash
npm run reddit-sniper
npm run viral-radar
npm run mining-drill
# ... etc
```

### All Items Below 70 Quality
If all items are filtered out (bronze tier), it means:
- Reports have low base scores
- Items are older (>7 days)
- Low engagement signals
- No validation indicators

**Solution:** Wait for newer reports with higher quality signals, or adjust quality threshold if needed.

---

## Technical Details

### Implementation
- **File:** `src/lib/quality-pipeline-intelligence.ts`
- **Runner:** `scripts/run-quality-pipeline-intelligence.ts`
- **Language:** TypeScript
- **Dependencies:** `js-yaml`, `glob` (already installed)

### Performance
- Processes 5 niches in ~5 seconds
- Reads ~500 report items per run
- Generates 5 curated reports
- **No API calls** - purely local processing

---

## Future Enhancements

Potential improvements:
- [ ] Adjust quality thresholds per niche
- [ ] Machine learning for score optimization
- [ ] Cross-niche "best of best" global report
- [ ] Email digest of platinum items
- [ ] Slack notifications for platinum opportunities
- [ ] Historical quality trends
- [ ] Feature reliability scoring

---

**Last Updated:** February 14, 2026  
**Status:** Production Ready ✅  
**Maintained By:** Quality Pipeline Bot
