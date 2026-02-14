# Viral Radar - Trending Content Scanner

**Status:** ✅ ACTIVE  
**Purpose:** Track viral content trending RIGHT NOW across Reddit and HackerNews  
**Frequency:** Every 4 hours (automated)  
**Output:** Markdown reports in `data/reports/viral-radar-{niche}-{date}.md`

---

## What is Viral Radar?

Viral Radar detects content going viral in real-time across multiple platforms. Viral content = massive organic reach opportunity. Capitalize on trends before they peak.

**Why This is Valuable:**
- 🔥 Early trend detection = ride the wave
- 📈 Viral topics = high engagement content
- 🌐 Platform agnostic = cross-platform insights
- ⚡ Real-time = act while trending
- 💰 Organic reach = free marketing

**Example Viral Signal:**
- **Reddit post:** "I automated my freelance invoicing" - 12k upvotes in 6 hours
- **Viral score:** 94/100 (rapid growth + high engagement)
- **Your opportunity:** Create content about invoicing automation while topic is hot
- **Result:** Ride viral wave, get 10-100x normal reach

---

## How It Works

### 1. Platforms Monitored

**Primary:**
- ✅ Reddit (public JSON API)
  - r/all hot posts
  - Niche-specific subreddits
  - Top posts from last 24 hours
- ✅ HackerNews (Algolia API)
  - Front page stories
  - Keyword matching

### 2. Viral Scoring System (0-100 points)

**Growth Rate Score (0-40 points):**
- \>1,000 votes/hour: 40 points
- 500-1,000 votes/hour: 30 points
- 100-500 votes/hour: 20 points
- 50-100 votes/hour: 10 points

**Engagement Score (0-30 points):**
- Comment/vote ratio \>0.3: 30 points
- Comment/vote ratio 0.2-0.3: 20 points
- Comment/vote ratio 0.1-0.2: 10 points

**Recency Score (0-20 points):**
- Posted <3 hours ago: 20 points
- Posted 3-6 hours ago: 15 points
- Posted 6-12 hours ago: 10 points
- Posted 12-24 hours ago: 5 points

**Cross-Platform Score (0-10 points):**
- On 3+ platforms: 10 points
- On 2 platforms: 7 points
- On 1 platform: 3 points

**Total Viral Score = Growth + Engagement + Recency + Cross-Platform (max 100)**

### 3. What Makes Content Viral?

✅ **Rapid Growth:** Votes/likes increasing exponentially  
✅ **High Engagement:** Many comments, active discussion  
✅ **Cross-Platform Spread:** Same topic on multiple platforms  
✅ **Recency:** Posted recently, still growing

---

## Usage

### Run Manually

```bash
npm run viral-radar
```

### Run Automatically (GitHub Actions)

The workflow runs every 4 hours automatically:
- Scans all 5 enabled niches
- Generates reports with viral content
- Commits reports to repository

**Manual trigger:** Go to Actions → Viral Radar → Run workflow

---

## Configuration

Viral Radar reads from `config/target-niches.yaml`:

```yaml
niches:
  - id: "freelancer-scope-creep"
    name: "Freelancer Scope Creep Prevention Tools"
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

**What gets scanned:**
- Keywords are matched against Reddit posts and HN stories
- Top 3 subreddits per niche are checked
- Only content with score \>500 (Reddit) or \>50 (HN) is included

---

## Report Format

Reports are saved to: `data/reports/viral-radar-{niche-id}-{date}.md`

**Example:**
```markdown
# Viral Radar Report: Freelancer Scope Creep Prevention

**Date:** 2026-02-14
**Niche:** freelancer-scope-creep
**Viral Content Found:** 15

---

## 1. I automated my entire freelance invoicing workflow

**Viral Score:** 94/100 🔥🔥🔥

**Platform:** Reddit
**Source:** r/freelance
**Score:** 12,456
**Comments:** 487
**Age:** 5.2 hours
**Growth Rate:** 2,395 points/hour

**Viral Metrics:**
- Growth Score: 40/40
- Engagement Score: 30/30
- Recency Score: 15/20
- Cross-Platform Score: 7/10

**🎯 Opportunity:**
🔥 EXTREMELY VIRAL: Create content NOW while trending
⚡ FRESH: Still early, maximum reach potential
🌐 CROSS-PLATFORM: Topic trending on multiple sites

**💡 Content Ideas:**
  - Create response/commentary on: "I automated my..."
  - Write tutorial based on viral topic
  - Reply to top comments with your solution
  - Create similar content in your niche subreddits

**🔗 Link:** https://reddit.com/r/freelance/comments/abc123/...
```

---

## Key Insights This Feature Provides

1. **Ride Viral Waves:** 10-100x organic reach
2. **Early Detection:** Act while trending (not after peak)
3. **Cross-Platform:** See what's hot everywhere
4. **Content Ideas:** What to create right now
5. **Timing:** Strike while the iron is hot

---

## Rate Limiting

- Reddit: 60 requests/minute
  - 2 second delays between requests
- HackerNews: Generally unlimited
  - Respectful usage

**Protection:**
- Automatic delays between API calls
- Error handling for rate limit responses
- Graceful degradation if APIs fail

---

## Technical Details

**File:** `src/lib/viral-radar.ts`  
**Script:** `scripts/scan-viral.ts`  
**Workflow:** `.github/workflows/viral-radar.yml`

**Dependencies:**
- `js-yaml` - Config parsing (already installed)
- `node-fetch` - HTTP requests (built-in)

**Pattern follows:**
- `reddit-sniper.ts` - Reddit API usage
- `hackernews-intelligence.ts` - HN API usage

---

## Troubleshooting

**No viral content found:**
- Keywords might be too specific
- Check if niche keywords match content on Reddit/HN
- Try broader keywords in config

**Reports empty:**
- Viral content threshold is 40/100
- Most content may not be viral enough
- This is expected - viral content is rare

**API errors:**
- Rate limiting: Wait and retry
- Network issues: Check internet connection
- API changes: May need code updates

---

## Future Enhancements

Potential additions:
- 🔄 Twitter/X integration (via Nitter)
- 📦 Product Hunt trending products
- 📊 Historical viral trend tracking
- 🔔 Alert system for extremely viral content (80+)

---

Last Updated: February 14, 2026
