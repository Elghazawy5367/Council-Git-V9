# Feature 9: HackerNews + ProductHunt Intelligence Extraction

**Goal**: Extract buying intent signals from tech communities without API costs using HackerNews Algolia Search API and ProductHunt GraphQL API.

**Value Proposition**: Detect "Ask HN: Alternative to X?" posts, trending product launches, and pain points in real-time for $0/month vs. manual monitoring costs of ~$1,500/month (1 hour/day × $50/hour × 30 days).

---

## 1. HackerNews Algolia Search API

### 1.1 Overview

HackerNews provides a **free Algolia-powered search API** with zero authentication required and generous rate limits.

**Key Facts:**
- **Cost**: $0/month (100% free, no API key needed)
- **Rate Limit**: 10,000 requests/hour per IP address
- **Application ID**: `UJ5WYC0L7X`
- **API Key**: `8ece23f8eb07cd25d40262a1764599b1` (public, read-only)
- **Base URL**: `https://hn.algolia.com/api/v1/`
- **Documentation**: [hn.algolia.com/api](https://hn.algolia.com/api)

**Available Indexes:**
- `Item_production` - Stories sorted by relevance
- `Item_production_sort_date` - Stories sorted by date
- `User_production` - User profiles

**Source Repository**: [algolia/hn-search](https://github.com/algolia/hn-search) (583⭐)

---

### 1.2 Core Implementation Pattern

**Initialize Algolia Client (TypeScript)**

```typescript
import algoliasearch from 'algoliasearch';

// Public credentials - no auth flow needed
const client = algoliasearch(
  "UJ5WYC0L7X", // Application ID
  "8ece23f8eb07cd25d40262a1764599b1" // Public API Key (read-only)
);

// Get default index (stories by relevance)
const index = client.initIndex("Item_production");

// Or get date-sorted index for recent posts
const dateIndex = client.initIndex("Item_production_sort_date");
```

**Basic Search Query**

```typescript
interface SearchParams {
  query: string;
  tags?: string[];
  numericFilters?: string[];
  page?: number;
  hitsPerPage?: number;
}

async function searchHackerNews(params: SearchParams) {
  const { query, tags, numericFilters, page = 0, hitsPerPage = 30 } = params;
  
  const searchParams: any = {
    query,
    page,
    hitsPerPage,
  };

  if (tags && tags.length > 0) {
    searchParams.tagFilters = tags;
  }

  if (numericFilters && numericFilters.length > 0) {
    searchParams.numericFilters = numericFilters;
  }

  try {
    const result = await index.search("", searchParams);
    return result;
  } catch (error) {
    console.error("HN Search Error:", error);
    throw error;
  }
}
```

---

### 1.3 Tag-Based Filtering (Finding Post Types)

**Available Tags:**
- `story` - Regular story posts
- `ask_hn` - "Ask HN" posts (buying intent goldmine!)
- `show_hn` - "Show HN" product launches
- `comment` - Comments
- `poll` - Poll posts
- `job` - Job postings

**Implementation Pattern from algolia/hn-search:**

```typescript
// From algolia/hn-search/src/SearchSettings.ts
function getTagFilters(pathname: string): string[] {
  const tagFilters: string[] = [];

  switch (pathname) {
    case "/":
      tagFilters.push("story");
      break;
    case "/ask-hn":
      tagFilters.push("ask_hn"); // 🎯 Buying intent signals!
      break;
    case "/show-hn":
      tagFilters.push("show_hn"); // 🚀 Product launches!
      break;
    case "/jobs":
      tagFilters.push("job");
      break;
    case "/polls":
      tagFilters.push("poll");
      break;
    default:
      if (pathname.startsWith("/story/")) {
        tagFilters.push("story");
      }
  }

  return tagFilters;
}
```

**Example: Find "Ask HN" Posts About Alternatives**

```typescript
async function findBuyingIntentSignals(productCategory: string) {
  const result = await index.search(`alternative ${productCategory}`, {
    tagFilters: ["ask_hn"], // Only "Ask HN" posts
    numericFilters: ["points>=10"], // At least 10 upvotes
    hitsPerPage: 50
  });

  return result.hits.map(hit => ({
    title: hit.title,
    url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
    points: hit.points,
    numComments: hit.num_comments,
    author: hit.author,
    createdAt: new Date(hit.created_at_i * 1000),
    text: hit.story_text // The actual question/description
  }));
}

// Usage examples:
// await findBuyingIntentSignals("slack"); // "Ask HN: Alternative to Slack?"
// await findBuyingIntentSignals("notion"); // "Ask HN: Alternative to Notion?"
// await findBuyingIntentSignals("jira"); // "Ask HN: Alternative to JIRA?"
```

---

### 1.4 Numeric Filters (Engagement Scoring)

**Query Parsing Pattern from algolia/hn-search:**

```typescript
// From algolia/hn-search/src/SearchSettings.ts
const POINTS_REGEXP = /points(!=|=|<|>|<=|>=)([0-9]+)/gm;
const COMMENTS_REGEXP = /comments(!=|=|<|>|<=|>=)([0-9]+)/gm;
const DATE_REGEXP = /date([<>])([0-9]+)/gm;
const AUTHOR_REGEXP = /author:([a-zA-Z0-9_-]+)/gm;

function extractPointsQuery(query: string): string[] {
  const matches = [...query.matchAll(POINTS_REGEXP)];
  return matches.map(match => `points${match[1]}${match[2]}`);
}

function extractCommentsQuery(query: string): string[] {
  const matches = [...query.matchAll(COMMENTS_REGEXP)];
  return matches.map(match => `num_comments${match[1]}${match[2]}`);
}

function extractDateQuery(query: string): string[] {
  const matches = [...query.matchAll(DATE_REGEXP)];
  return matches.map(match => `created_at_i${match[1]}${match[2]}`);
}
```

**Example: Find High-Engagement Ask HN Posts**

```typescript
async function findTrendingBuyingIntentPosts() {
  const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
  
  const result = await index.search("", {
    tagFilters: ["ask_hn"],
    numericFilters: [
      `points>=50`, // Highly upvoted
      `num_comments>=20`, // Active discussion
      `created_at_i>${oneDayAgo}` // Posted in last 24h
    ],
    hitsPerPage: 50
  });

  // Calculate engagement velocity
  return result.hits.map(hit => {
    const ageInHours = (Date.now() / 1000 - hit.created_at_i) / 3600;
    const commentsPerHour = hit.num_comments / ageInHours;
    const pointsPerHour = hit.points / ageInHours;
    
    return {
      ...hit,
      engagementVelocity: {
        commentsPerHour: Math.round(commentsPerHour * 10) / 10,
        pointsPerHour: Math.round(pointsPerHour * 10) / 10,
        totalEngagement: hit.points + (hit.num_comments * 2)
      }
    };
  }).sort((a, b) => 
    b.engagementVelocity.totalEngagement - a.engagementVelocity.totalEngagement
  );
}
```

---

### 1.5 Response Structure

**HackerNews Hit Object:**

```typescript
interface HNHit {
  objectID: string; // Story ID
  title: string;
  url: string | null; // External URL (null for Ask HN)
  author: string;
  points: number;
  story_text: string | null; // Description/question text
  comment_text: string | null; // For comment hits
  num_comments: number;
  created_at: string; // ISO timestamp
  created_at_i: number; // Unix timestamp
  _tags: string[]; // ["story", "ask_hn", etc.]
  _highlightResult?: any; // Highlighted search matches
}

interface HNSearchResponse {
  hits: HNHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  params: string;
}
```

---

### 1.6 Rate Limit Handling

```typescript
class HNSearchClient {
  private requestCount = 0;
  private resetTime = Date.now() + 3600000; // 1 hour from now
  
  async searchWithRateLimit(params: SearchParams): Promise<HNSearchResponse> {
    // Reset counter every hour
    if (Date.now() >= this.resetTime) {
      this.requestCount = 0;
      this.resetTime = Date.now() + 3600000;
    }
    
    // Check rate limit (10,000/hour)
    if (this.requestCount >= 9500) {
      const waitTime = this.resetTime - Date.now();
      console.warn(`Approaching rate limit. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.resetTime = Date.now() + 3600000;
    }
    
    this.requestCount++;
    return await index.search(params.query, params);
  }
}
```

---

### 1.7 Complete Use Case: Buying Intent Detector

```typescript
interface BuyingIntent {
  problem: string; // What they're unhappy with
  currentSolution: string; // Product they want to replace
  painPoints: string[]; // Extracted from comments
  engagement: {
    points: number;
    comments: number;
    velocity: number; // Comments per hour
  };
  url: string;
  postedAt: Date;
}

async function detectBuyingIntent(
  targetProducts: string[]
): Promise<BuyingIntent[]> {
  const signals: BuyingIntent[] = [];
  
  for (const product of targetProducts) {
    // Search for "alternative to X" posts
    const queries = [
      `alternative ${product}`,
      `replace ${product}`,
      `better than ${product}`,
      `${product} disappointed`
    ];
    
    for (const query of queries) {
      const result = await index.search(query, {
        tagFilters: ["ask_hn"],
        numericFilters: ["points>=5"], // Filter out noise
        hitsPerPage: 20
      });
      
      for (const hit of result.hits) {
        // Calculate engagement velocity
        const ageInHours = (Date.now() / 1000 - hit.created_at_i) / 3600;
        const velocity = hit.num_comments / Math.max(ageInHours, 1);
        
        signals.push({
          problem: hit.title,
          currentSolution: product,
          painPoints: await extractPainPoints(hit.objectID), // Fetch comments
          engagement: {
            points: hit.points,
            comments: hit.num_comments,
            velocity: Math.round(velocity * 10) / 10
          },
          url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          postedAt: new Date(hit.created_at_i * 1000)
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return signals.sort((a, b) => 
    b.engagement.velocity - a.engagement.velocity
  );
}

// Fetch comments to extract pain points
async function extractPainPoints(storyId: string): Promise<string[]> {
  const result = await index.search("", {
    tagFilters: [`story_${storyId}`, "comment"],
    numericFilters: ["points>=3"], // Only upvoted comments
    hitsPerPage: 50
  });
  
  // Simple keyword extraction (use NLP for production)
  const painKeywords = ["slow", "expensive", "difficult", "complex", "broken"];
  const painPoints = result.hits
    .filter(comment => 
      painKeywords.some(keyword => 
        comment.comment_text?.toLowerCase().includes(keyword)
      )
    )
    .map(comment => comment.comment_text)
    .slice(0, 10); // Top 10 pain points
  
  return painPoints;
}
```

**Example Output:**

```typescript
// Usage:
const signals = await detectBuyingIntent(["slack", "notion", "jira"]);

// Result:
[
  {
    problem: "Ask HN: Alternative to Slack for async communication?",
    currentSolution: "slack",
    painPoints: [
      "Slack is too noisy and distracting",
      "Notification fatigue is real",
      "Search is slow with large teams"
    ],
    engagement: { points: 127, comments: 89, velocity: 11.2 },
    url: "https://news.ycombinator.com/item?id=12345678",
    postedAt: new Date("2026-01-07T10:30:00Z")
  }
]
```

---

## 2. ProductHunt GraphQL API

### 2.1 Overview

ProductHunt provides a **GraphQL API** with OAuth authentication. Unlike Reddit, ProductHunt requires API credentials but offers structured product launch data.

**Key Facts:**
- **Cost**: Free tier available (rate limits apply)
- **Authentication**: OAuth 2.0 (3 scopes: public, private, write)
- **Base URL**: `https://api.producthunt.com/v2/api/graphql`
- **OAuth URL**: `https://api.producthunt.com/v2/oauth/token`
- **Documentation**: [api.producthunt.com/v2/docs](https://api.producthunt.com/v2/docs)
- **GraphQL Reference**: [api-v2-docs.producthunt.com](http://api-v2-docs.producthunt.com.s3-website-us-east-1.amazonaws.com/operation/query/)
- **API Explorer**: [ph-graph-api-explorer.herokuapp.com](https://ph-graph-api-explorer.herokuapp.com/)

**Source Repository**: [producthunt/producthunt-api](https://github.com/producthunt/producthunt-api) (353⭐)

---

### 2.2 Authentication Flow

**Step 1: Create OAuth Application**

1. Visit [API Dashboard](https://api.producthunt.com/v2/oauth/applications)
2. Create new application
3. Set redirect URI (e.g., `https://localhost:3000/callback`)
4. Choose required scopes:
   - `public` - Access public posts, users, topics
   - `private` - Access user-specific data (goals, votes)
   - `write` - Create posts, comments, votes

**Step 2: Get Client Credentials Token (No User Login)**

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{
    "client_id": "YOUR_API_KEY_HERE",
    "client_secret": "YOUR_API_SECRET_HERE",
    "grant_type": "client_credentials"
  }' \
  https://api.producthunt.com/v2/oauth/token
```

**Response:**

```json
{
  "access_token": "abc123...",
  "token_type": "Bearer",
  "scope": "public",
  "created_at": 1641234567
}
```

**Step 3: OAuth Authorization Code Flow (With User Login)**

```typescript
// From producthunt/producthunt-api/routes/authorize.js
function redirectToAuth(clientId: string, redirectUri: string, scopes: string) {
  const authUrl = `https://api.producthunt.com/v2/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=${scopes}`;
  
  window.location.href = authUrl;
}

// Handle callback
async function fetchAccessToken(code: string) {
  const response = await fetch("https://api.producthunt.com/v2/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: code,
      client_id: process.env.PH_APP_API_KEY,
      client_secret: process.env.PH_APP_API_SECRET,
      redirect_uri: process.env.PH_APP_REDIRECT_URI,
      grant_type: "authorization_code"
    })
  });
  
  const data = await response.json();
  return data.access_token;
}
```

---

### 2.3 GraphQL Client Setup

**Apollo Client Pattern (from producthunt/producthunt-api):**

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://api.producthunt.com/v2/api/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('ph_access_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json'
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

**Simple Fetch Pattern:**

```typescript
async function queryProductHunt(query: string, variables?: any) {
  const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.PH_ACCESS_TOKEN}`
    },
    body: JSON.stringify({ query, variables })
  });
  
  const data = await response.json();
  return data;
}
```

---

### 2.4 Rate Limit Handling

**From producthunt/producthunt-api/routes/graphql.js:**

```typescript
function logRateLimitInfo(response: Response) {
  
  );
  );
  );
  
}

async function queryWithRateLimit(query: string, variables?: any) {
  const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.PH_ACCESS_TOKEN}`
    },
    body: JSON.stringify({ query, variables })
  });
  
  // Log rate limit headers
  const limit = response.headers.get("x-rate-limit-limit");
  const remaining = response.headers.get("x-rate-limit-remaining");
  const reset = response.headers.get("x-rate-limit-reset");
  
  if (remaining && parseInt(remaining) < 10) {
    console.warn(`Rate limit almost exhausted: ${remaining}/${limit} remaining`);
  }
  
  return await response.json();
}
```

---

### 2.5 Query Examples

**Get Today's Featured Posts:**

```graphql
query GetTodaysPosts {
  posts(order: VOTES) {
    edges {
      node {
        id
        name
        tagline
        description
        votesCount
        commentsCount
        url
        website
        createdAt
        featuredAt
        topics {
          edges {
            node {
              name
            }
          }
        }
        user {
          username
          headline
        }
      }
    }
  }
}
```

**Search Posts by Topic:**

```graphql
query SearchByTopic($topic: String!) {
  posts(topic: $topic, order: VOTES) {
    edges {
      node {
        id
        name
        tagline
        votesCount
        commentsCount
        url
        createdAt
      }
    }
  }
}
```

**Get User Profile:**

```graphql
query GetViewer {
  viewer {
    user {
      id
      username
      name
      headline
      createdAt
      postsCount
      votesCount
    }
  }
}
```

---

### 2.6 TypeScript Implementation

```typescript
interface ProductHuntPost {
  id: string;
  name: string;
  tagline: string;
  description: string;
  votesCount: number;
  commentsCount: number;
  url: string;
  website: string;
  createdAt: string;
  featuredAt: string;
  topics: { name: string }[];
  maker: {
    username: string;
    headline: string;
  };
}

class ProductHuntClient {
  private accessToken: string;
  private baseUrl = "https://api.producthunt.com/v2/api/graphql";
  
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  
  async query<T>(query: string, variables?: any): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      throw new Error(`PH API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }
  
  async getTodaysPosts(limit = 20): Promise<ProductHuntPost[]> {
    const query = `
      query GetTodaysPosts {
        posts(order: VOTES, first: ${limit}) {
          edges {
            node {
              id
              name
              tagline
              description
              votesCount
              commentsCount
              url
              website
              createdAt
              featuredAt
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
              user {
                username
                headline
              }
            }
          }
        }
      }
    `;
    
    const result = await this.query<any>(query);
    return result.posts.edges.map((edge: any) => ({
      ...edge.node,
      topics: edge.node.topics.edges.map((t: any) => ({ name: t.node.name })),
      maker: edge.node.user
    }));
  }
  
  async searchByTopic(topic: string, limit = 50): Promise<ProductHuntPost[]> {
    const query = `
      query SearchByTopic($topic: String!) {
        posts(topic: $topic, order: VOTES, first: ${limit}) {
          edges {
            node {
              id
              name
              tagline
              votesCount
              commentsCount
              url
              createdAt
            }
          }
        }
      }
    `;
    
    const result = await this.query<any>(query, { topic });
    return result.posts.edges.map((edge: any) => edge.node);
  }
}
```

**Usage:**

```typescript
const ph = new ProductHuntClient(process.env.PH_ACCESS_TOKEN!);

// Get today's trending products
const trending = await ph.getTodaysPosts(20);

// {
//   id: "12345",
//   name: "SuperTool",
//   tagline: "The best tool for X",
//   votesCount: 1234,
//   commentsCount: 89,
//   topics: [{ name: "productivity" }, { name: "saas" }]
// }

// Search for developer tools
const devTools = await ph.searchByTopic("developer-tools");
```

---

## 3. Complete Workflow: Tech Community Intelligence

### 3.1 Combined HN + PH Intelligence Extractor

```typescript
interface TechCommunitySignal {
  source: "hackernews" | "producthunt";
  type: "buying_intent" | "product_launch" | "pain_point";
  title: string;
  description: string;
  engagement: {
    score: number; // Normalized 0-100
    velocity: number; // Engagement per hour
  };
  url: string;
  timestamp: Date;
  keywords: string[];
}

class TechCommunityIntelligence {
  private hnClient: HNSearchClient;
  private phClient: ProductHuntClient;
  
  constructor(phAccessToken: string) {
    this.hnClient = new HNSearchClient();
    this.phClient = new ProductHuntClient(phAccessToken);
  }
  
  async scanBuyingIntent(
    targetProducts: string[]
  ): Promise<TechCommunitySignal[]> {
    const signals: TechCommunitySignal[] = [];
    
    // Scan HackerNews "Ask HN" posts
    for (const product of targetProducts) {
      const hnResults = await index.search(`alternative ${product}`, {
        tagFilters: ["ask_hn"],
        numericFilters: ["points>=10"],
        hitsPerPage: 20
      });
      
      for (const hit of hnResults.hits) {
        const ageInHours = (Date.now() / 1000 - hit.created_at_i) / 3600;
        const velocity = hit.num_comments / Math.max(ageInHours, 1);
        
        signals.push({
          source: "hackernews",
          type: "buying_intent",
          title: hit.title,
          description: hit.story_text || "",
          engagement: {
            score: Math.min(100, hit.points + hit.num_comments * 2),
            velocity: Math.round(velocity * 10) / 10
          },
          url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          timestamp: new Date(hit.created_at_i * 1000),
          keywords: this.extractKeywords(hit.title + " " + hit.story_text)
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit
    }
    
    return signals.sort((a, b) => 
      b.engagement.score - a.engagement.score
    );
  }
  
  async scanProductLaunches(
    topics: string[]
  ): Promise<TechCommunitySignal[]> {
    const signals: TechCommunitySignal[] = [];
    
    // Scan HackerNews "Show HN" posts
    const hnResults = await index.search("", {
      tagFilters: ["show_hn"],
      numericFilters: ["points>=50"], // High-quality launches only
      hitsPerPage: 50
    });
    
    for (const hit of hnResults.hits) {
      const ageInHours = (Date.now() / 1000 - hit.created_at_i) / 3600;
      const velocity = hit.num_comments / Math.max(ageInHours, 1);
      
      signals.push({
        source: "hackernews",
        type: "product_launch",
        title: hit.title,
        description: hit.story_text || "",
        engagement: {
          score: Math.min(100, hit.points + hit.num_comments * 2),
          velocity: Math.round(velocity * 10) / 10
        },
        url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        timestamp: new Date(hit.created_at_i * 1000),
        keywords: this.extractKeywords(hit.title)
      });
    }
    
    // Scan ProductHunt launches
    for (const topic of topics) {
      const phResults = await this.phClient.searchByTopic(topic, 50);
      
      for (const post of phResults) {
        const ageInHours = 
          (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 3600);
        const velocity = post.commentsCount / Math.max(ageInHours, 1);
        
        signals.push({
          source: "producthunt",
          type: "product_launch",
          title: post.name,
          description: post.tagline,
          engagement: {
            score: Math.min(100, post.votesCount + post.commentsCount * 3),
            velocity: Math.round(velocity * 10) / 10
          },
          url: post.url,
          timestamp: new Date(post.createdAt),
          keywords: [topic, ...post.topics.map(t => t.name)]
        });
      }
    }
    
    return signals.sort((a, b) => 
      b.engagement.velocity - a.engagement.velocity
    );
  }
  
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction (use NLP library for production)
    const keywords = [
      "alternative", "replace", "better", "saas", "open source",
      "free", "cheap", "expensive", "slow", "fast", "simple", "complex"
    ];
    
    return keywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }
}
```

**Example Usage:**

```typescript
const intelligence = new TechCommunityIntelligence(process.env.PH_ACCESS_TOKEN!);

// Scan for people looking for alternatives to major SaaS products
const buyingSignals = await intelligence.scanBuyingIntent([
  "slack", "notion", "jira", "asana", "trello", "figma"
]);


// {
//   source: "hackernews",
//   type: "buying_intent",
//   title: "Ask HN: Alternative to Notion for personal knowledge management?",
//   description: "I've been using Notion for years but...",
//   engagement: { score: 87, velocity: 12.4 },
//   url: "https://news.ycombinator.com/item?id=12345678",
//   timestamp: Date("2026-01-07T10:30:00Z"),
//   keywords: ["alternative", "notion", "simple"]
// }

// Scan for new product launches in developer tools
const launches = await intelligence.scanProductLaunches([
  "developer-tools", "productivity", "saas"
]);
```

---

### 3.2 Automated Daily Intelligence Report

```typescript
async function generateDailyIntelligenceReport() {
  const intelligence = new TechCommunityIntelligence(process.env.PH_ACCESS_TOKEN!);
  
  // 1. Buying Intent Signals (Last 24h)
  const buyingSignals = await intelligence.scanBuyingIntent([
    "slack", "notion", "jira", "github", "figma"
  ]);
  
  // 2. Product Launches (Last 24h)
  const launches = await intelligence.scanProductLaunches([
    "developer-tools", "productivity", "ai"
  ]);
  
  // 3. Generate Report
  const report = {
    generatedAt: new Date(),
    summary: {
      totalSignals: buyingSignals.length + launches.length,
      highPrioritySignals: buyingSignals.filter(s => s.engagement.score >= 80).length,
      trendingLaunches: launches.filter(l => l.engagement.velocity >= 5).length
    },
    buyingIntent: buyingSignals.slice(0, 10), // Top 10
    productLaunches: launches.slice(0, 10), // Top 10
    insights: {
      mostMentionedProducts: this.aggregateKeywords(buyingSignals),
      hotTopics: this.aggregateKeywords(launches),
      peakEngagementTimes: this.calculatePeakTimes(buyingSignals.concat(launches))
    }
  };
  
  // Save to JSON
  await fs.writeFile(
    `data/intelligence/daily-report-${Date.now()}.json`,
    JSON.stringify(report, null, 2)
  );
  
  return report;
}

// Run daily at 9 AM
cron.schedule("0 9 * * *", async () => {
  
  const report = await generateDailyIntelligenceReport();
  
});
```

---

## 4. Cost Comparison

### 4.1 Traditional Approach (Manual Monitoring)

**Cost Breakdown:**
- **Labor**: 1 hour/day monitoring HN + PH manually
- **Hourly Rate**: $50/hour (junior analyst)
- **Monthly Cost**: 30 days × 1 hour × $50 = **$1,500/month**
- **Annual Cost**: $1,500 × 12 = **$18,000/year**

**Limitations:**
- Human bias in signal detection
- Limited coverage (can't scan thousands of posts)
- No historical trend analysis
- Inconsistent monitoring schedule

---

### 4.2 This Approach (Automated Intelligence)

**Cost Breakdown:**
- **HackerNews Algolia API**: $0/month (free forever)
- **ProductHunt API**: $0/month (free tier)
- **Compute**: $5-10/month (cloud function or VPS)
- **Total Monthly Cost**: **$5-10/month**

**Annual Cost**: $60-120/year

**Savings**: $17,880-17,940/year (99% cost reduction)

**Advantages:**
- 24/7 automated monitoring
- Scan thousands of posts per day
- Historical trend analysis
- Machine learning-ready data format
- Real-time alerts for high-priority signals

---

## 5. Advanced Patterns

### 5.1 Sentiment Analysis Integration

```typescript
import { Sentiment } from 'sentiment';

const sentiment = new Sentiment();

function analyzeSentiment(text: string): number {
  const result = sentiment.analyze(text);
  // Normalize to 0-100 (50 = neutral)
  return Math.max(0, Math.min(100, 50 + result.score * 10));
}

async function extractPainPointsWithSentiment(storyId: string) {
  const result = await index.search("", {
    tagFilters: [`story_${storyId}`, "comment"],
    numericFilters: ["points>=3"],
    hitsPerPage: 50
  });
  
  return result.hits.map(comment => ({
    text: comment.comment_text,
    sentiment: analyzeSentiment(comment.comment_text || ""),
    points: comment.points,
    author: comment.author
  })).filter(c => c.sentiment < 40); // Only negative comments
}
```

---

### 5.2 Trend Detection

```typescript
interface Trend {
  keyword: string;
  occurrences: number;
  weekOverWeekGrowth: number; // Percentage
  averageEngagement: number;
}

async function detectEmergingTrends(
  days: number = 7
): Promise<Trend[]> {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - (days * 24 * 60 * 60);
  const midPoint = startDate + ((endDate - startDate) / 2);
  
  // Get posts from both halves of the time period
  const firstHalf = await index.search("", {
    numericFilters: [
      `created_at_i>=${startDate}`,
      `created_at_i<${midPoint}`
    ],
    hitsPerPage: 1000
  });
  
  const secondHalf = await index.search("", {
    numericFilters: [
      `created_at_i>=${midPoint}`,
      `created_at_i<=${endDate}`
    ],
    hitsPerPage: 1000
  });
  
  // Extract keywords and calculate growth
  const firstKeywords = aggregateKeywords(firstHalf.hits);
  const secondKeywords = aggregateKeywords(secondHalf.hits);
  
  const trends: Trend[] = [];
  for (const [keyword, count] of Object.entries(secondKeywords)) {
    const previousCount = firstKeywords[keyword] || 0;
    const growth = previousCount === 0 
      ? 100 
      : ((count - previousCount) / previousCount) * 100;
    
    if (growth >= 50) { // 50%+ growth
      trends.push({
        keyword,
        occurrences: count,
        weekOverWeekGrowth: Math.round(growth),
        averageEngagement: calculateAvgEngagement(keyword, secondHalf.hits)
      });
    }
  }
  
  return trends.sort((a, b) => b.weekOverWeekGrowth - a.weekOverWeekGrowth);
}
```

---

## 6. Complete Implementation Guide

### 6.1 Installation

```bash
# Initialize project
npm init -y

# Install dependencies
npm install algoliasearch @apollo/client graphql
npm install -D typescript @types/node

# Optional: sentiment analysis
npm install sentiment

# Optional: scheduling
npm install node-cron
```

---

### 6.2 Environment Variables

```bash
# .env
PH_APP_API_KEY=your_api_key_here
PH_APP_API_SECRET=your_api_secret_here
PH_ACCESS_TOKEN=your_access_token_here

# HackerNews (no credentials needed - public API)
HN_ALGOLIA_APP_ID=UJ5WYC0L7X
HN_ALGOLIA_API_KEY=8ece23f8eb07cd25d40262a1764599b1
```

---

### 6.3 Project Structure

```
src/
├── clients/
│   ├── hackernews.ts       # HN Algolia client
│   └── producthunt.ts      # PH GraphQL client
├── services/
│   ├── intelligence.ts     # Combined intelligence extractor
│   ├── sentiment.ts        # Sentiment analysis
│   └── trends.ts           # Trend detection
├── types/
│   ├── hackernews.d.ts
│   └── producthunt.d.ts
└── index.ts                # Main entry point
```

---

### 6.4 Example: Complete Intelligence Bot

```typescript
// src/index.ts
import { TechCommunityIntelligence } from './services/intelligence';
import cron from 'node-cron';

async function main() {
  const intelligence = new TechCommunityIntelligence(
    process.env.PH_ACCESS_TOKEN!
  );
  
  // Run intelligence scan every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    
    
    const buyingSignals = await intelligence.scanBuyingIntent([
      "slack", "notion", "jira", "github", "figma", "linear"
    ]);
    
    const launches = await intelligence.scanProductLaunches([
      "developer-tools", "productivity", "ai", "saas"
    ]);
    
    // Filter high-priority signals
    const highPriority = buyingSignals.filter(s => 
      s.engagement.score >= 80 || s.engagement.velocity >= 10
    );
    
    if (highPriority.length > 0) {
      
      
      // Send Slack notification (optional)
      await sendSlackNotification({
        text: `Found ${highPriority.length} high-priority buying signals`,
        signals: highPriority
      });
    }
    
    
  });
  
  
}

main().catch(console.error);
```

---

## 7. Key Takeaways

### 7.1 HackerNews Advantages

✅ **Free forever** - No API key, no authentication
✅ **Generous rate limits** - 10,000 requests/hour per IP
✅ **Rich filtering** - Tags, numeric filters, date ranges
✅ **Real-time buying intent** - "Ask HN: Alternative to X?" gold mine
✅ **Engagement metrics** - Points, comments, velocity

### 7.2 ProductHunt Advantages

✅ **Structured product data** - GraphQL API with typed schemas
✅ **Product launches** - Trending products with maker info
✅ **Topic filtering** - Search by category (dev-tools, SaaS, etc.)
✅ **Social proof** - Votes, comments, maker credentials

### 7.3 Combined Intelligence Value

🎯 **Buying Intent Detection**: Find people actively looking for alternatives
🚀 **Product Launch Tracking**: Monitor competitor launches in real-time
📊 **Trend Analysis**: Detect emerging topics before they peak
💡 **Pain Point Extraction**: Extract feature requests from comments
🔔 **Real-time Alerts**: Get notified of high-engagement signals

---

## 8. Production Considerations

### 8.1 Rate Limit Management

```typescript
class RateLimiter {
  private queue: (() => Promise<any>)[] = [];
  private running = 0;
  private maxConcurrent = 5;
  
  async add<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}
```

### 8.2 Error Handling

```typescript
async function robustSearch(params: SearchParams, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await index.search(params.query, params);
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      console.warn(`Search failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### 8.3 Data Persistence

```typescript
import Dexie from 'dexie';

class IntelligenceDB extends Dexie {
  signals: Dexie.Table<TechCommunitySignal, number>;
  
  constructor() {
    super("IntelligenceDB");
    
    this.version(1).stores({
      signals: "++id, source, type, timestamp, engagement.score"
    });
    
    this.signals = this.table("signals");
  }
  
  async saveSignals(signals: TechCommunitySignal[]) {
    return await this.signals.bulkAdd(signals);
  }
  
  async getHighPrioritySignals(threshold = 80) {
    return await this.signals
      .where("engagement.score")
      .aboveOrEqual(threshold)
      .toArray();
  }
}
```

---

## 9. Next Steps

1. **Implement basic HN buying intent scanner** (1-2 hours)
2. **Add ProductHunt OAuth flow** (2-3 hours)
3. **Build automated daily report generator** (3-4 hours)
4. **Add sentiment analysis** (optional, 2-3 hours)
5. **Deploy to cloud function** (Vercel, AWS Lambda, etc.)
6. **Set up Slack/Discord notifications** (1 hour)

**Estimated Time to Production**: 8-14 hours for full implementation

**ROI**: Save $1,500/month in manual monitoring costs while getting 10x better coverage

---

## 10. References

- **HackerNews Algolia API**: [hn.algolia.com/api](https://hn.algolia.com/api)
- **ProductHunt API Docs**: [api.producthunt.com/v2/docs](https://api.producthunt.com/v2/docs)
- **algolia/hn-search**: [github.com/algolia/hn-search](https://github.com/algolia/hn-search) (583⭐)
- **producthunt/producthunt-api**: [github.com/producthunt/producthunt-api](https://github.com/producthunt/producthunt-api) (353⭐)
- **Algolia Search Client**: [github.com/algolia/algoliasearch-client-javascript](https://github.com/algolia/algoliasearch-client-javascript)

---

**Created**: January 7, 2026
**Status**: ✅ Complete Implementation Guide
**Cost Savings**: 99% reduction ($1,500/month → $5/month)
