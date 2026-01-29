# Feature 8: Reddit Scraping Without API Costs

## Overview
Extract Reddit data without hitting rate limits or paying for API access by using Reddit's public JSON endpoints.

---

## Cost Analysis

**Before:** Reddit API Premium = $24/month
**After:** Public JSON endpoints = $0/month  
**Reduction:** 100% ($24/month saved)  
**Bonus:** No OAuth flow needed

---

## Key Repositories Found

### 1. **YARS (Yet Another Reddit Scraper)** ⭐ 151 stars
**Repo:** [datavorous/yars](https://github.com/datavorous/yars)
**Language:** Python
**Last Updated:** 2025-07-07

**Key Patterns:**

```python
# File: src/yars/yars.py (Lines 19-34)
class YARS:
    def __init__(self, proxy=None, timeout=10, random_user_agent=True):
        self.session = RandomUserAgentSession() if random_user_agent else requests.Session()
        self.proxy = proxy
        self.timeout = timeout

        # EXPONENTIAL BACKOFF ON 429 ERRORS
        retries = Retry(
            total=5,
            backoff_factor=2,  # Exponential backoff
            status_forcelist=[429, 500, 502, 503, 504],
        )

        self.session.mount("https://", HTTPAdapter(max_retries=retries))

        if proxy:
            self.session.proxies.update({"http": proxy, "https": proxy})
```

**Reddit JSON Endpoint URLs (The .json Trick):**
```python
# File: src/yars/yars.py (Lines 63-71)

# Search Reddit
url = "https://www.reddit.com/search.json"
params = {"q": query, "limit": limit, "sort": "relevance", "type": "link"}

# Get post details
url = f"https://www.reddit.com{permalink}.json"

# Get subreddit posts
url = f"https://www.reddit.com/r/{subreddit}/hot.json"
url = f"https://www.reddit.com/r/{subreddit}/top.json"
url = f"https://www.reddit.com/r/{subreddit}/new.json"

# Get user data
url = f"https://www.reddit.com/user/{username}/.json"
```

**User-Agent Rotation:**
```python
# File: src/yars/sessions.py (Lines 0-15)
from requests import Session
from .agents import get_agent


class RandomUserAgentSession(Session):
    """
    Session class which passes a random user agent with each request
    """

    def request(self, *args, **kwargs):
        self.headers.update({"User-Agent": get_agent()})
        return super().request(*args, **kwargs)
```

**Parsing Nested Comment Trees:**
```python
# File: src/yars/yars.py (Lines 99-120)
def _extract_comments(self, comments):
    extracted_comments = []
    for comment in comments:
        if isinstance(comment, dict) and comment.get("kind") == "t1":
            comment_data = comment.get("data", {})
            extracted_comment = {
                "author": comment_data.get("author", ""),
                "body": comment_data.get("body", ""),
                "score": comment_data.get("score",""),
                "replies": [],
            }

            # RECURSIVE COMMENT PARSING
            replies = comment_data.get("replies", "")
            if isinstance(replies, dict):
                extracted_comment["replies"] = self._extract_comments(
                    replies.get("data", {}).get("children", [])
                )
            extracted_comments.append(extracted_comment)
    return extracted_comments
```

**Rate Limiting with Random Sleep:**
```python
# File: src/yars/yars.py (Lines 269-290)
def fetch_subreddit_posts(self, subreddit, limit=10, category="hot", time_filter="all"):
    # ... fetch logic ...
    
    # Random sleep between batches (1-2 seconds)
    time.sleep(random.uniform(1, 2))
    
    return all_posts
```

---

### 2. **Simple Reddit Fetcher** (Frontend Masters AI Agent Course)
**Repo:** [Hendrixer/agent-from-scratch](https://github.com/hendrixer/agent-from-scratch)
**Language:** TypeScript
**Last Updated:** Recent (Active Course Material)

**Minimal TypeScript Implementation:**

```typescript
// File: src/tools/reddit.ts
import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'

export const redditToolDefinition = {
  name: 'reddit',
  parameters: z
    .object({})
    .describe(
      'Use this tool to get the latest posts from Reddit. Returns JSON with title, link, subreddit, author, upvotes.'
    ),
}

type Args = z.infer<typeof redditToolDefinition.parameters>

export const reddit: ToolFn<Args, string> = async ({ toolArgs, userMessage }) => {
  // SIMPLE .JSON ENDPOINT ACCESS
  const { data } = await fetch('https://www.reddit.com/.json').then((res) =>
    res.json()
  )

  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }))

  return JSON.stringify(relevantInfo, null, 2)
}
```

---

### 3. **snoowrap (For Comparison - Uses Official API)**
**Repo:** [not-an-aardvark/snoowrap](https://github.com/not-an-aardvark/snoowrap) ⭐ 1,032 stars
**Language:** JavaScript
**Note:** This uses OAuth, but shows rate limit handling patterns

**Exponential Backoff Pattern:**
```javascript
// File: src/request_handler.js (Lines 101-108)
export function _awaitExponentialBackoff (attempts) {
  if (attempts === 1) {
    return Promise.resolve();
  }

  // Exponential backoff with jitter
  return Promise.delay((Math.pow(2, attempts - 1) + (Math.random() - 0.3)) * 1000);
}
```

**Rate Limit Checking:**
```javascript
// File: src/request_handler.js (Lines 109-125)
export function _awaitRatelimit () {
  if (this.ratelimitRemaining < 1 && Date.now() < this.ratelimitExpiration) {
    const timeUntilExpiry = this.ratelimitExpiration - Date.now();
    
    if (this._config.continueAfterRatelimitError) {
      // Queue the request and wait
      this._warn(rateLimitWarning(timeUntilExpiry));
      return Promise.delay(timeUntilExpiry);
    }
    
    // Otherwise, throw error
    throw new RateLimitError(timeUntilExpiry);
  }
  
  return Promise.resolve();
}
```

---

## Implementation Patterns

### Pattern 1: Reddit's Hidden JSON Endpoints

Reddit serves JSON by simply adding `.json` to the end of any URL:

```
https://www.reddit.com/r/programming/hot     →  HTML
https://www.reddit.com/r/programming/hot.json → JSON

https://www.reddit.com/r/AskReddit/comments/abc123  →  HTML
https://www.reddit.com/r/AskReddit/comments/abc123.json → JSON

https://www.reddit.com/user/spez               →  HTML
https://www.reddit.com/user/spez/.json          → JSON
```

### Pattern 2: Avoiding IP Bans

**Techniques Used:**
1. **Random User-Agent rotation** (mimic different browsers)
2. **Random sleep intervals** (1-2 seconds between requests)
3. **Exponential backoff** on 429 (rate limit) errors
4. **Proxy support** for distributing requests across IPs
5. **Batch size limits** (max 100 posts per request)

### Pattern 3: Reddit Response Structure

```json
{
  "kind": "Listing",
  "data": {
    "after": "t3_abc123",
    "children": [
      {
        "kind": "t3",
        "data": {
          "title": "Post Title",
          "author": "username",
          "score": 1234,
          "num_comments": 56,
          "permalink": "/r/sub/comments/abc123/...",
          "selftext": "Post body...",
          "url": "https://..."
        }
      }
    ]
  }
}
```

**Key fields:**
- `kind`: Type identifier (t1=comment, t3=post, t5=subreddit)
- `after`: Pagination cursor
- `children`: Array of items
- `data`: Actual content

### Pattern 4: Handling Deleted/Removed Content

```python
# From YARS codebase
author = comment_data.get("author", "[deleted]")
if author == "[deleted]":
    # Handle deleted user
    pass

if comment_data.get("removed_by_category"):
    # Content was removed by moderator
    pass
```

### Pattern 5: Recursive Comment Parsing

Comments can be nested infinitely deep. Use recursion:

```python
def _extract_comments(self, comments):
    extracted = []
    for comment in comments:
        if comment.get("kind") == "t1":  # It's a comment
            data = comment["data"]
            extracted_comment = {
                "author": data.get("author"),
                "body": data.get("body"),
                "replies": []  # Initialize empty
            }
            
            # Recursively parse replies
            if isinstance(data.get("replies"), dict):
                replies_data = data["replies"]["data"]["children"]
                extracted_comment["replies"] = self._extract_comments(replies_data)
            
            extracted.append(extracted_comment)
    return extracted
```

---

## Complete TypeScript Implementation Example

```typescript
import fetch from 'node-fetch';

interface RedditPost {
  title: string;
  author: string;
  score: number;
  num_comments: number;
  permalink: string;
  created_utc: number;
}

class RedditScraper {
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
  ];
  
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }
  
  private async fetchWithRetry(url: string, maxRetries = 3): Promise<any> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': this.getRandomUserAgent(),
          }
        });
        
        if (response.status === 429) {
          // Rate limited - exponential backoff
          const backoffTime = Math.pow(2, attempt) * 1000;
          
          await this.delay(backoffTime);
          continue;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        // Exponential backoff
        const backoffTime = Math.pow(2, attempt) * 1000;
        await this.delay(backoffTime);
      }
    }
  }
  
  async getSubredditPosts(subreddit: string, limit: number = 25): Promise<RedditPost[]> {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    const data = await this.fetchWithRetry(url);
    
    return data.data.children.map((child: any) => ({
      title: child.data.title,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      permalink: child.data.permalink,
      created_utc: child.data.created_utc
    }));
  }
  
  async getPostComments(permalink: string): Promise<any> {
    const url = `https://www.reddit.com${permalink}.json`;
    const data = await this.fetchWithRetry(url);
    
    // data[0] = post, data[1] = comments
    return {
      post: data[0].data.children[0].data,
      comments: this.extractComments(data[1].data.children)
    };
  }
  
  private extractComments(comments: any[]): any[] {
    return comments
      .filter(c => c.kind === 't1')
      .map(comment => {
        const data = comment.data;
        return {
          author: data.author === '[deleted]' ? null : data.author,
          body: data.body,
          score: data.score,
          created_utc: data.created_utc,
          replies: data.replies && typeof data.replies === 'object'
            ? this.extractComments(data.replies.data.children)
            : []
        };
      });
  }
  
  async searchReddit(query: string, limit: number = 10): Promise<RedditPost[]> {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    const data = await this.fetchWithRetry(url);
    
    return data.data.children.map((child: any) => ({
      title: child.data.title,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      permalink: child.data.permalink,
      created_utc: child.data.created_utc
    }));
  }
}

// Usage
const scraper = new RedditScraper();

// Get posts from r/programming
const posts = await scraper.getSubredditPosts('programming', 10);

// Get comments from a specific post
const postData = await scraper.getPostComments('/r/programming/comments/abc123/...');

// Search Reddit
const searchResults = await scraper.searchReddit('typescript', 5);
```

---

## Key Takeaways

### ✅ What Works
1. **Public .json endpoints** - Reddit serves JSON freely, no auth needed
2. **User-Agent rotation** - Prevents pattern detection
3. **Exponential backoff** - Handles 429 errors gracefully
4. **Random delays** - Mimics human behavior (1-2 seconds)
5. **Batch requests** - Use `limit` and `after` parameters for pagination

### ⚠️ Warnings
1. **IP bans are real** - Use rotating proxies for high volume
2. **Max ~2500 posts** in one session before rate limiting
3. **No write operations** - This is read-only scraping
4. **Respect robots.txt** - Be a good internet citizen
5. **Terms of Service** - Reddit's ToS technically prohibits scraping

### 💡 Best Practices
1. **Start with small limits** (5-10 posts) when testing
2. **Cache results** - Don't re-fetch the same data
3. **Monitor 429 errors** - Implement backoff before hitting limits
4. **Use proxies** for production - Rotate IPs to distribute load
5. **Log rate limit headers** - Track remaining quota

---

## Alternative: URS (Universal Reddit Scraper)

**Repo:** [JosephLai241/URS](https://github.com/JosephLai241/URS) ⭐ 957 stars
**Note:** Uses PRAW (official API with OAuth), but has excellent rate limit handling

**Rate Limit Detection Pattern:**
```python
# File: urs/utils/Logger.py
@staticmethod
def log_rate_limit(function):
    def wrapper(reddit):
        user_limits = function(reddit)
        
        if int(user_limits["remaining"]) == 0:
            logging.critical(
                f"RATE LIMIT REACHED. WILL RESET AT {user_limits['reset_timestamp']}"
            )
            quit()
        
        return user_limits
    return wrapper
```

---

## References

- **YARS Documentation:** https://github.com/datavorous/yars
- **Reddit JSON Endpoints:** Any Reddit URL + `.json`
- **snoowrap (API wrapper):** https://github.com/not-an-aardvark/snoowrap
- **URS (PRAW-based):** https://github.com/JosephLai241/URS
- **Frontend Masters Course:** https://github.com/Hendrixer/agent-from-scratch

---

## Cost Savings Summary

| Approach | Monthly Cost | Setup Complexity | Rate Limits |
|----------|-------------|------------------|-------------|
| Reddit API Premium | $24/month | Low (OAuth) | 600 req/10min |
| Public JSON Endpoints | $0/month | Very Low | ~2500/session |
| With Rotating Proxies | $5-15/month | Medium | Near unlimited |

**Winner:** Public JSON endpoints with basic rate limiting = **$0/month** 🎉
