# 🚀 Quick Deploy Reference Card

## One-Line Deployments

```bash
# GitHub Pages (Auto-deploys on git push)
git push origin main

# Or manual:
npm run deploy:github

# Vercel
npm run deploy:vercel

# Firebase
npm run deploy:firebase

# Verify All Configs
npm run verify-deploy
```

## Platform URLs

| Platform | URL | Status |
|----------|-----|--------|
| **GitHub Pages** | https://elghazawy5367.github.io/Council-Git-V9/ | ✅ Auto-deploy |
| **Vercel** | (Generated after first deploy) | ✅ Ready |
| **Firebase** | (Your Firebase project URL) | ✅ Ready |
| **IDX** | (IDX workspace URL) | ✅ Ready |

## Quick Health Check

```bash
# Verify configurations
npm run verify-deploy

# Build test
npm run build

# Preview locally
npm run preview
```

## Emergency Fixes

```bash
# Clean and rebuild
npm run clean && npm install && npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Key Files

- `vite.config.ts` - Base path: `/Council-Git-V9/`
- `vercel.json` - Vercel config
- `firebase.json` - Firebase config
- `.idxrc` - IDX config
- `.github/workflows/deploy.yml` - Auto-deploy

## See Full Guide

Read [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) for detailed instructions.
