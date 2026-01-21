# Mining Drill - Pain Point Extraction System

The Mining Drill extracts marketing intelligence from GitHub issues by identifying pain points, urgency levels, and buying intent.

## Features

### 🎯 Pain Point Detection
- Scans GitHub issues for **28 pain keywords** (hate, sucks, broken, etc.)
- Identifies **15 high-intent phrases** (willing to pay, hire, urgent, etc.)
- Extracts commercial context indicators ($, budget, team, company)

### 📊 Intelligent Scoring

**Urgency Score (0-100)**
- High engagement (comments): +30 max
- Issue age (6+ months): +20
- Labels (bug, critical, etc.): +30 max
- Community reactions: +20 max

**Buying Intent (0-10)**
- High-intent phrases: +1 each
- Multiple pain keywords: +2
- Money mentioned: +1
- Commercial context: +3 max

### 🔍 Filtering
- **Min Buying Intent**: 3 (default)
- **Min Urgency**: 20 (default)
- **Max Results**: 20 (top opportunities)
- Results sorted by buying intent, then urgency

## Usage

### In the App (UI)
1. Navigate to **Features Dashboard** (`/features`)
2. Scroll to **Mining Drill** section
3. Enter repository owner and name (e.g., `facebook/react`)
4. Click **Start Mining**
5. View pain points with urgency and intent scores
6. Click **Copy Marketing Intelligence** for report

### Programmatically

```typescript
import { minePainPoints, analyzePainPoints } from '@/lib/mining-drill';

// Extract pain points
const painPoints = await minePainPoints('facebook', 'react', {
  minBuyingIntent: 3,
  minUrgency: 20,
  maxResults: 20,
  githubToken: 'your_github_token' // Optional, for higher rate limits
});

// Analyze for insights
const insights = analyzePainPoints(painPoints);

console.log(`Found ${insights.totalPainPoints} pain points`);
console.log(`High intent: ${insights.highIntentCount}`);
console.log(`Top keywords:`, insights.topPainKeywords);
```

## Output Example

### Pain Point Object
```typescript
{
  title: "React performance is terrible for large lists",
  body: "We're willing to pay for a solution...",
  comments: 45,
  url: "https://github.com/facebook/react/issues/12345",
  created: "2024-01-15T10:30:00Z",
  
  painKeywords: ["terrible", "willing to pay", "need help"],
  urgencyScore: 85,     // High urgency (lots of comments + old issue)
  buyingIntent: 7,      // High intent (willing to pay + commercial context)
  
  labels: ["bug", "help wanted"],
  author: "enterprise-user",
  state: "open"
}
```

### Market Insights
```typescript
{
  topPainKeywords: [
    { keyword: "broken", count: 15 },
    { keyword: "need help", count: 12 },
    { keyword: "alternative to", count: 8 }
  ],
  averageUrgency: 62.5,
  averageBuyingIntent: 5.2,
  totalPainPoints: 20,
  highIntentCount: 8,
  commonLabels: [
    { label: "bug", count: 12 },
    { label: "feature request", count: 7 }
  ]
}
```

## API Rate Limits

**Without GitHub Token:**
- 60 requests/hour per IP
- May hit limits on large repositories

**With GitHub Token:**
- 5,000 requests/hour
- Add token in Settings → Vault → GitHub API Key

## Marketing Intelligence Export

Click **Copy Marketing Intelligence** to get:
- Top pain point summary
- Urgency and buying intent analysis
- Recommended actions (market validation, priority level)
- Top pain keywords and common labels

Perfect for:
- Product validation
- Market research
- Competitive analysis
- Feature prioritization
- Sales copy generation

## Integration with Other Features

The Mining Drill complements:
- **Scout**: Discovers repositories → Mining Drill finds their pain points
- **Sonar**: Identifies abandoned projects → Mining Drill confirms market need
- **Self-Improve**: Learns patterns → Mining Drill finds what users actually want

## Advanced Use Cases

### Competitor Analysis
```typescript
const competitorPain = await minePainPoints('competitor', 'product');
// Find what users hate about competitors
```

### Market Validation
```typescript
const validation = await minePainPoints('trending', 'project', {
  minBuyingIntent: 5,  // Only high-intent
  minUrgency: 50       // Only urgent pain
});
// Confirm market demand before building
```

### Sales Lead Generation
```typescript
const leads = await minePainPoints('enterprise', 'tool', {
  minBuyingIntent: 7   // "Willing to pay" level intent
});
// Find companies ready to buy
```

---

**Pro Tip**: Run Mining Drill on repositories with 1000+ stars and high issue counts for best results. Smaller projects may not have enough data for statistical significance.
