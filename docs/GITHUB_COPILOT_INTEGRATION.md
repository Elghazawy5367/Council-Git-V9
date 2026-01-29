# GitHub & Copilot Integration Guide

## ✅ Current Integration Status

The Council is **fully integrated** with GitHub and GitHub Copilot:

### 🐙 GitHub Integration

#### 1. **GitHub API Client** (`src/lib/api-client.ts`)
- Specialized API client with retry logic and caching
- Rate limit handling (60 → 5,000 req/hour with token)
- 30-minute cache for GitHub responses
- Automatic error recovery

```typescript
export const githubAPI = new APIClient({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28'
  },
  retries: 3,
  useCache: true,
  cacheTime: 1000 * 60 * 30
});
```

#### 2. **GitHub Hooks** (`src/hooks/useGitHub.ts`)
- TanStack Query integration for caching
- Automatic refetching and stale data management
- Centralized query key management
- Functions: `useGitHubSearch`, `useGitHubRepo`, `useBlueOceanScan`

#### 3. **Intelligence Systems**

**Scout System** (`src/lib/scout.ts`)
- GitHub repository intelligence extraction
- Blue Ocean opportunity discovery
- Pain point analysis from issues
- Product opportunity detection
- Used by: Daily Scout workflow

**Fork Evolution** (`src/lib/fork-evolution.ts`)
- Analyzes repository forks to find user-added features
- Compares commits between original and forks
- Detects new functionality and improvements
- CLI: `npm run forks owner/repo`

**Twin Mimicry** (`src/lib/twin-mimicry.ts`)
- Extracts mental models from elite developer git history
- Analyzes commit patterns and decision-making
- Generates AI training prompts
- CLI: `npm run twin owner/repo`

**Self-Improve** (`src/lib/self-improve.ts`)
- Learns patterns from successful GitHub repositories
- Analyzes positioning, pricing, features
- Updates knowledge base with high-confidence patterns
- CLI: `npm run learn`

#### 4. **GitHub Actions Automation**

**Daily Scout** (`.github/workflows/daily-scout.yml`)
- Runs at 6 AM UTC daily
- Uses `GITHUB_TOKEN` secret (5,000 req/hour)
- Auto-commits intelligence reports
- Manual trigger available

**Reddit Sniper** (`.github/workflows/reddit-sniper.yml`)
- Daily 8 AM UTC automation
- Scrapes Reddit for buying intent leads
- Commits to `data/sniper-leads.json`

**Viral Radar** (`.github/workflows/viral-radar.yml`)
- Daily 10 AM UTC automation
- Scans social media trends
- Commits to `data/viral-radar.json`

**Fork Evolution** (`.github/workflows/fork-evolution.yml`)
- Manual trigger workflow
- Analyzes repository forks on demand

**Twin Mimicry** (`.github/workflows/twin-mimicry.yml`)
- Manual trigger workflow
- Full git history analysis (fetch-depth: 0)

#### 5. **Settings Integration** (`src/features/settings/`)

**Vault System** (`src/features/council/lib/vault.ts`)
- Encrypted storage for API keys
- Supports GitHub API key storage
- Password-protected encryption
- LocalStorage-based persistence

**Settings Store** (`src/features/settings/store/settings-store.ts`)
```typescript
interface SettingsState {
  githubApiKey: string;
  setGithubApiKey: (key: string) => void;
  openRouterKey: string;
  redditApiKey: string;
  // ... vault integration
}
```

**Settings UI** (`src/features/settings/components/SettingsModal.tsx`)
- GitHub API key input field
- Vault lock/unlock interface
- Key visibility toggle (masked display)

#### 6. **Data Storage**
```
data/
├── cache/
│   └── repos.json          # GitHub repository cache
├── intelligence/
│   ├── blue-ocean-*.md     # Blue Ocean reports
│   └── latest.md           # Latest intelligence
├── opportunities/
│   └── *.json              # Opportunity data from Scout
└── reports/
    └── *.md                # Generated reports
```

---

### 🤖 GitHub Copilot Integration

#### 1. **Copilot Instructions** (`.github/copilot-instructions.md`)
- Comprehensive 371-line project guide
- Architecture overview and patterns
- Feature organization and conventions
- Critical patterns and gotchas
- Development workflow instructions
- Quality standards and TypeScript rules

**Key Sections:**
- Tech Stack (React 18, TypeScript 5.8, Vite 6, Zustand, Dexie)
- Feature Organization (feature-based structure)
- State Management Pattern (Zustand stores)
- AI Client Architecture (OpenRouter integration)
- Intelligence Systems (Scout, Mirror, Self-Improve)
- Quality Workflow (typecheck, lint, architecture validation)

#### 2. **Copilot-Aware Features**

**Google Studio Hack** (`src/lib/google-studio-hack.ts`)
- Bypasses Copilot message limits
- Opens Google AI Studio automatically
- Provides unlimited free tokens
- Context preparation for large codebases
- CLI: `npm run studio`

```typescript
/**
 * Google Studio Hack
 * Opens Google AI Studio when Copilot hits message limits.
 * Provides unlimited free AI tokens for uninterrupted coding.
 */
export function openGoogleStudio(projectPath?: string): void {
  
  
  // ... browser automation
}
```

#### 3. **Code Quality Tools for Copilot**

**Code Mirror** (`scripts/run-mirror.ts`)
- Analyzes code against elite repository standards
- Generates markdown reports with gaps
- Helps Copilot understand quality expectations
- CLI: `npm run mirror`

**Architecture Validation** (`scripts/validate-architecture.ts`)
- Enforces feature isolation
- Detects `any` types (architectural violation)
- Plugin system compliance checking
- CLI: `npm run quality`

**Quality Pipeline** (`scripts/quality-pipeline.ts`)
- Combines Mirror + Self-Improve
- Automated quality improvement workflow
- Can auto-apply fixes and generate PRs
- CLI: `npm run quality` or `npm run improve`

#### 4. **Development Constraints**
From `.github/copilot-instructions.md`:
- **TypeScript Strict Mode**: `strict: true` enforced
- **No `any` types**: Use `unknown` or proper types
- **Feature Isolation**: No cross-feature imports
- **Bundle Size**: Keep total < 2MB
- **Dependencies**: Avoid packages >2MB

#### 5. **Copilot Command Integration**
Copilot can trigger these commands via instructions:
```bash
npm run dev          # Start dev server
npm run typecheck    # TypeScript validation
npm run lint         # ESLint check
npm run build        # Production build
npm run quality      # Full quality pipeline
npm run mirror       # Code quality analysis
npm run improve      # Self-improvement learning
npm run scout        # GitHub intelligence scan
npm run sniper       # Reddit lead generation
npm run forks        # Fork evolution analysis
npm run twin         # Developer mental model extraction
npm run viral        # Social media trend scanning
npm run studio       # Google Studio bypass
```

---

## 🔐 Required Setup

### 1. GitHub Token Configuration

**For Local Development:**
```bash
# Create .env file
cp .env.example .env

# Add your GitHub token
echo "GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" >> .env
```

**Get GitHub Token:**
1. Visit https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `public_repo` (for public repository access)
   - `read:user` (for user data)
4. Copy token and add to `.env`

**For GitHub Actions:**
- Token is automatically provided as `secrets.GITHUB_TOKEN`
- No manual configuration needed
- 5,000 requests/hour limit

### 2. Vault Configuration (Optional but Recommended)

**In App Settings:**
1. Open The Council app
2. Click Settings (⚙️)
3. Go to "Vault" tab
4. Create vault with password
5. Add GitHub API key
6. Vault encrypts and stores in localStorage

**Vault Benefits:**
- Encrypted API key storage
- Password-protected access
- No plaintext keys in code
- Secure key rotation

### 3. Verify Integration

**Test GitHub API:**
```bash
# Run Scout to test GitHub API
npm run scout

# Check for rate limit info in output
# With token: 5000/5000 remaining
# Without token: 60/60 remaining
```

**Test Workflows:**
```bash
# Manually trigger Daily Scout workflow
gh workflow run daily-scout.yml --ref main

# Check workflow run
gh run list --workflow=daily-scout.yml
```

**Test Hooks:**
```typescript
// In any React component
import { useGitHubSearch } from '@/hooks/useGitHub';

function MyComponent() {
  const { data, isLoading, error } = useGitHubSearch({
    query: 'language:typescript stars:>1000',
    sort: 'stars',
    order: 'desc'
  });
  
  return <div>{data?.items?.length} repositories found</div>;
}
```

---

## 🚀 Advanced Features

### 1. **Rate Limit Management**

The app automatically handles GitHub rate limits:
- **Caching**: 30-minute cache for GitHub responses
- **Retry Logic**: 3 retries with exponential backoff
- **Graceful Degradation**: Falls back to cached data
- **Token Detection**: Automatically uses `GITHUB_TOKEN` if available

### 2. **GitHub Actions Exploitation**

The Council exploits GitHub Actions for:
- **Free Compute**: Runs on GitHub's servers (zero cost)
- **High Rate Limits**: 5,000 req/hour vs 60 personal
- **24/7 Automation**: Daily intelligence gathering
- **Zero Battery Drain**: Runs in the cloud
- **Auto-commits**: Results pushed to repository

### 3. **Intelligence Pipeline**

**Full Intelligence Workflow:**
```bash
# 1. Scout scans GitHub for opportunities
npm run scout developer-tools

# 2. Generate daily brief combining all intelligence
npm run brief developer-tools

# 3. Output: Markdown report + JSON data
# - data/opportunities/developer-tools-*.json
# - data/intelligence/blue-ocean-*.md
# - data/reports/daily-brief-*.md
```

**Automated via GitHub Actions:**
- Scout runs daily at 6 AM UTC
- Sniper runs daily at 8 AM UTC
- Viral Radar runs daily at 10 AM UTC
- All results auto-committed to `data/` directory

### 4. **Copilot-Enhanced Development**

**Copilot uses `.github/copilot-instructions.md` to:**
- Understand project architecture
- Follow established patterns
- Enforce quality standards
- Generate compliant code
- Suggest proper implementations

**Example Copilot Prompt:**
```
"Add a new intelligence feature that scans HackerNews"
```

**Copilot knows to:**
1. Check existing patterns in `src/lib/`
2. Follow TypeScript strict mode
3. Use APIClient for HTTP requests
4. Add npm script to `package.json`
5. Create GitHub Actions workflow if needed
6. Update features dropdown
7. Generate documentation

---

## 📊 Integration Verification Checklist

### GitHub Integration
- [x] GitHub API client configured (`src/lib/api-client.ts`)
- [x] GitHub hooks implemented (`src/hooks/useGitHub.ts`)
- [x] Scout intelligence system (`src/lib/scout.ts`)
- [x] Fork Evolution analyzer (`src/lib/fork-evolution.ts`)
- [x] Twin Mimicry extractor (`src/lib/twin-mimicry.ts`)
- [x] Self-Improve learner (`src/lib/self-improve.ts`)
- [x] Daily Scout workflow (`.github/workflows/daily-scout.yml`)
- [x] Reddit Sniper workflow (`.github/workflows/reddit-sniper.yml`)
- [x] Viral Radar workflow (`.github/workflows/viral-radar.yml`)
- [x] Fork Evolution workflow (`.github/workflows/fork-evolution.yml`)
- [x] Twin Mimicry workflow (`.github/workflows/twin-mimicry.yml`)
- [x] GitHub API key in settings (`src/features/settings/`)
- [x] Vault encryption system (`src/features/council/lib/vault.ts`)
- [x] Environment variable support (`.env.example`)
- [x] Data directory structure (`data/cache/`, `data/intelligence/`)
- [x] Rate limit handling (3 retries, 30min cache)

### Copilot Integration
- [x] Copilot instructions file (`.github/copilot-instructions.md`)
- [x] Google Studio Hack bypass (`src/lib/google-studio-hack.ts`)
- [x] Code Mirror quality analyzer (`scripts/run-mirror.ts`)
- [x] Architecture validator (`scripts/validate-architecture.ts`)
- [x] Quality pipeline (`scripts/quality-pipeline.ts`)
- [x] TypeScript strict mode (`tsconfig.json`)
- [x] Feature isolation enforcement
- [x] npm scripts documentation (`package.json`)
- [x] Development workflow guide
- [x] Quality standards documented

### UI Integration
- [x] Features dropdown updated (15 features)
- [x] Settings modal with GitHub key input
- [x] Vault lock/unlock interface
- [x] API key masked display
- [x] Error boundaries for API failures
- [x] Loading states for GitHub requests

---

## 🎯 Next Steps

### Optional Enhancements

1. **GitHub OAuth Integration**
   - Add GitHub OAuth flow for seamless authentication
   - Eliminates manual token entry
   - Automatic token refresh

2. **GitHub App**
   - Convert to GitHub App for better rate limits
   - 15,000 requests/hour (vs 5,000)
   - Fine-grained permissions

3. **Webhook Integration**
   - Real-time updates on repository changes
   - Automated intelligence on new issues
   - Instant fork detection

4. **GraphQL API**
   - Migrate from REST to GraphQL for efficiency
   - Single request for complex queries
   - Reduced API calls

5. **Copilot Chat Integration**
   - Custom slash commands for intelligence features
   - `/scout developer-tools` directly in Copilot Chat
   - Inline intelligence suggestions

---

## 📚 Related Documentation

- **Intelligence Systems**: [docs/EXPLOITATION_STRATEGY_vs_CURRENT_IMPLEMENTATION.md](EXPLOITATION_STRATEGY_vs_CURRENT_IMPLEMENTATION.md)
- **New Exploits**: [docs/NEW_EXPLOITS_IMPLEMENTATION.md](NEW_EXPLOITS_IMPLEMENTATION.md)
- **Daily Brief**: [docs/DAILY_INTELLIGENCE_REPORT.md](DAILY_INTELLIGENCE_REPORT.md)
- **Code Mirror**: [docs/CODE_MIRROR_COMPLETE.md](CODE_MIRROR_COMPLETE.md)
- **Phantom Guide**: [PHANTOM_GUIDE.md](../PHANTOM_GUIDE.md)
- **Architecture**: [.github/copilot-instructions.md](../.github/copilot-instructions.md)

---

## 🐛 Troubleshooting

### "API rate limit exceeded"
**Solution:** Add `GITHUB_TOKEN` to `.env` file (increases from 60 to 5,000 req/hour)

### "GitHub API error: 401"
**Solution:** Check token validity at https://github.com/settings/tokens

### "Workflow failed: GITHUB_TOKEN not found"
**Solution:** Token is auto-provided by GitHub Actions, no action needed

### "Copilot not following patterns"
**Solution:** Verify `.github/copilot-instructions.md` exists and is up to date

### "Feature not in dropdown"
**Solution:** Check `src/components/primitives/dropdown-menu.tsx` features array

---

**Integration Status**: ✅ **FULLY INTEGRATED**  
**Last Updated**: January 9, 2026  
**Version**: 1.0.0
