# Deployment Guide

This guide covers deploying The Council to GitHub Pages and Vercel.

## 🚀 Quick Start

### GitHub Pages (Automated)

**Automatic deployment on every push to main:**

1. Push to main branch
2. GitHub Actions automatically builds and deploys
3. Visit: https://Elghazawy5367.github.io/Council-Git-V9/

**Manual deployment:**

```bash
npm run deploy
```

### Vercel (Recommended for Production)

1. **Connect Repository:**
   - Visit https://vercel.com
   - Click "Import Project"
   - Select `Elghazawy5367/Council-Git-V9`

2. **Configure Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy:**
   - Click "Deploy"
   - Your app will be live at: `https://your-project.vercel.app`

## 🔐 Environment Variables

The Council uses an **encrypted vault system** for API keys. No environment variables are needed for deployment.

### User Setup (After Deployment)

Users need to:
1. Visit the deployed app
2. Click Settings → Create Vault
3. Enter their OpenRouter API key
4. Set a vault password

Keys are encrypted and stored in browser localStorage.

### Optional API Keys (For Intelligence Features)

If you want to pre-configure intelligence tools, you can set these in `.env`:

```bash
# GitHub API (for Scout/Intelligence features)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Reddit API
REDDIT_API_KEY=your_reddit_key_here
```

**Note:** These are for server-side intelligence scripts only, not the deployed app.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `npm run build` succeeds
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] No console errors in preview: `npm run preview`
- [ ] Test vault creation locally
- [ ] Verify expert outputs work

## 🔧 Build Configuration

### GitHub Pages

- **Base URL:** `/Council-Git-V9/`
- **Build:** Production mode automatically uses base path
- **Output:** `dist/` directory

### Vercel

- **Base URL:** `/` (root domain)
- **Build:** Automatically configured via `vercel.json`
- **Output:** `dist/` directory
- **SPA Routing:** All routes redirect to `index.html`

## 🐛 Troubleshooting

### GitHub Pages Shows 404

**Problem:** Assets not loading after deployment

**Solution:** Check that `vite.config.ts` has correct base path:
```typescript
base: mode === 'production' ? '/Council-Git-V9/' : '/',
```

### Vercel Build Fails

**Problem:** TypeScript errors during build

**Solution:**
```bash
# Run locally first
npm run type-check
npm run build

# Fix any errors before pushing
```

### App Loads But Features Don't Work

**Problem:** Vault not created or API keys not set

**Solution:** 
1. Check browser console for errors
2. Ensure user has created vault via Settings
3. Verify OpenRouter API key is valid

### CORS Errors

**Problem:** API calls blocked by CORS

**Solution:** OpenRouter has CORS enabled. If you see errors:
1. Check that API key is correctly stored in vault
2. Verify network requests in browser DevTools
3. Ensure using HTTPS (not HTTP)

## 📊 Monitoring

### Build Status

- **GitHub Actions:** Check `.github/workflows/deploy.yml` status
- **Vercel:** Dashboard shows deployment status and logs

### Performance

- **Bundle Size:** Target < 2MB (currently optimized)
- **Load Time:** First contentful paint < 2s
- **Lighthouse Score:** Aim for 90+ performance

## 🔄 Rollback

### GitHub Pages

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

### Vercel

1. Go to Vercel Dashboard
2. Select deployment
3. Click "Rollback to this deployment"

## 🎯 Post-Deployment

After successful deployment:

1. **Test core features:**
   - Expert creation
   - Synthesis execution
   - Memory system
   - Intelligence tools

2. **Check performance:**
   - Page load speed
   - Bundle size
   - API response times

3. **Monitor errors:**
   - Browser console
   - Network tab
   - GitHub Actions logs

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
