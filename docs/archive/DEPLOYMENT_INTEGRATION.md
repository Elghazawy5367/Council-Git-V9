# Deployment Integration Guide

This guide covers deployment configurations for GitHub Pages, Vercel, IDX, and Firebase.

## 🚀 Deployment Platforms

### 1. GitHub Pages (Automatic)
**Status**: ✅ Configured and Ready

**Configuration**:
- File: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- Base path: `/Council-Git-V9/`
- Branch: `gh-pages`
- Trigger: Push to `main` or `worktree-*` branches

**Access**:
```
https://Elghazawy5367.github.io/Council-Git-V9/
```

**Setup**:
1. Ensure `gh-pages` branch exists in repository
2. Go to Repository Settings → Pages
3. Set source to `gh-pages` branch
4. Enable GitHub Pages

---

### 2. Vercel (Preview & Production)
**Status**: ⚙️ Requires Manual Setup

**Configuration**:
- File: [vercel.json](vercel.json)
- Workflow: [.github/workflows/vercel-deploy.yml](.github/workflows/vercel-deploy.yml)
- Build: `npm run build`
- Output: `dist/`

**Setup Steps**:
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Set environment variables
vercel env add VERCEL_ORG_ID
vercel env add VERCEL_PROJECT_ID
```

**GitHub Secrets to Add**:
- `VERCEL_TOKEN` - Get from [Vercel Tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` - Your organization ID
- `VERCEL_PROJECT_ID` - Your project ID

**Access**:
```
https://council-git-v7-rrr.vercel.app (production)
https://council-git-v7-rrr-pr-*.vercel.app (previews)
```

---

### 3. Firebase Hosting
**Status**: ⚙️ Requires Manual Setup

**Configuration**:
- File: [firebase.json](firebase.json)
- Workflow: [.github/workflows/firebase-deploy.yml](.github/workflows/firebase-deploy.yml)
- Build: `npm run build`
- Output: `dist/`

**Setup Steps**:
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase project
firebase init hosting

# 4. Generate token for CI/CD
firebase login:ci
```

**GitHub Secrets to Add**:
- `FIREBASE_TOKEN` - From `firebase login:ci`

**Features**:
- ✅ SPA rewrite rules configured
- ✅ Cache control headers for assets
- ✅ Security headers enabled
- ✅ CDN deployment

**Access**:
```
https://council-git-v7-rrr.web.app
https://council-git-v7-rrr.firebaseapp.com
```

---

### 4. Google IDX
**Status**: ✅ Configured and Ready

**Configuration**:
- File: [.idxrc](.idxrc)
- Dev Port: 5173
- Preview Port: 4173

**Features**:
- ✅ Pre-configured dev tasks
- ✅ VSCode extensions
- ✅ Public port forwarding
- ✅ Dev/Build/Preview commands

**Access**:
1. Go to [IDX.dev](https://idx.dev)
2. Import this repository
3. Start developing

**Quick Commands**:
```bash
npm run dev      # Start dev server on :5173
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📋 Environment Variables

### Required for All Deployments
None required - this is a pure frontend React app

### Optional for Features
```bash
# For Scout/Intelligence Features
GITHUB_TOKEN=<your-github-token>
REDDIT_API_KEY=<your-reddit-api-key>
```

---

## 🔄 Deployment Workflow

### Automatic Deployments Triggered By:
1. **Push to `main` branch**
   - ✅ GitHub Pages (immediate)
   - ✅ Vercel (if configured)
   - ✅ Firebase (if configured)

2. **Manual Trigger**
   - Go to Actions tab → Select workflow → Run workflow

### Deployment Checklist
- [ ] TypeScript validation passes: `npm run typecheck`
- [ ] Build succeeds: `npm run build`
- [ ] No unused variables/imports
- [ ] Tests pass (if applicable)
- [ ] Commit to main/deploy branch

---

## 🧪 Local Testing Before Deploy

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Then visit http://localhost:4173/Council-Git-V9/
```

---

## 📊 Deployment Status

| Platform | Status | URL | Auto-Deploy |
|----------|--------|-----|------------|
| GitHub Pages | ✅ Ready | [Link](https://Elghazawy5367.github.io/Council-Git-V9/) | Yes |
| Vercel | ⚙️ Setup Required | [Docs](https://vercel.com/docs) | Requires Config |
| Firebase | ⚙️ Setup Required | [Docs](https://firebase.google.com/docs/hosting) | Requires Config |
| IDX | ✅ Ready | [IDX.dev](https://idx.dev) | N/A |

---

## 🔐 Security Headers

All platforms configured with:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Cache-Control` on assets (1 year)

---

## 🛠️ Troubleshooting

### GitHub Pages Not Updating
1. Check workflow in Actions tab
2. Ensure `gh-pages` branch exists
3. Verify repository settings enable Pages
4. Clear browser cache

### Build Failures
1. Run locally: `npm run build`
2. Check TypeScript: `npm run typecheck`
3. Check dependencies: `npm ci`
4. Check Node version: `node --version` (need 18+)

### Preview Server Shows Blank Page
1. Check base path in `vite.config.ts`
2. Verify routes in `src/App.tsx`
3. Check browser console for errors
4. Ensure `dist/index.html` exists

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router SPA Routing](https://reactrouter.com/en/main/start/overview)
- [GitHub Pages Documentation](https://pages.github.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Google IDX](https://idx.dev/)

---

**Last Updated**: January 13, 2026  
**Maintained By**: Council AI  
**Repository**: [Elghazawy5367/Council-Git-V9](https://github.com/Elghazawy5367/Council-Git-V9)
