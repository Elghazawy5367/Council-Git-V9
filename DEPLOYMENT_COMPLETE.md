# 🚀 Multi-Platform Deployment Guide

This guide ensures The Council app runs smoothly on all supported platforms: **GitHub Pages**, **Vercel**, **Firebase Hosting**, **Google IDX**, and **Google Studio**.

---

## ✅ Pre-Deployment Verification

Run the verification script before deploying:

```bash
npm run verify-deploy
```

This checks all configuration files and performs a test build.

---

## 🌐 Platform-Specific Deployment

### 1️⃣ GitHub Pages (Automated)

**Status**: ✅ Fully Configured

**Auto-Deploy**: Pushes to `main` branch automatically deploy via GitHub Actions.

**Manual Deploy**:
```bash
npm run deploy:github
```

**Live URL**: https://elghazawy5367.github.io/Council-Git-V9/

**Configuration Files**:
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `vite.config.ts` - Base path set to `/Council-Git-V9/`
- `public/.nojekyll` - Disables Jekyll processing
- `public/404.html` - SPA routing fallback

**First-Time Setup**:
1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Save (no branch selection needed)

---

### 2️⃣ Vercel

**Status**: ✅ Fully Configured

**Deploy**:
```bash
npm run deploy:vercel
# OR
vercel --prod
```

**Configuration**: `vercel.json`
- Framework: Vite (auto-detected)
- Output: `dist/`
- Build: `npm run build`
- Dev: `npm run dev`
- SPA rewrites enabled
- Security headers configured
- Asset caching optimized

**First-Time Setup**:
```bash
npm install -g vercel
vercel login
vercel
```

**Environment Variables** (if needed):
- Add via Vercel dashboard
- Or use: `vercel env add OPENROUTER_API_KEY`

---

### 3️⃣ Firebase Hosting

**Status**: ✅ Fully Configured

**Deploy**:
```bash
npm run deploy:firebase
# OR
firebase deploy
```

**Configuration**: `firebase.json`
- Public directory: `dist/`
- SPA rewrites to `/index.html`
- Asset caching (1 year for /assets/*)
- Security headers

**First-Time Setup**:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Choose: Use existing project
# Public directory: dist
# Single-page app: Yes
# Set up automatic builds: No
```

---

### 4️⃣ Google IDX

**Status**: ✅ Fully Configured

**Configuration**: `.idxrc`

**Available Tasks**:
- `install` - Install dependencies
- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `typecheck` - Run TypeScript checks
- `deploy` - Deploy to GitHub Pages

**Ports**:
- **5173** - Vite dev server (public)
- **4173** - Preview server (public)

**Usage**:
1. Open project in Google IDX
2. Tasks auto-load from `.idxrc`
3. Click "Run" on any task
4. Dev server accessible via public URL

---

### 5️⃣ Google Studio (Firebase Studio)

**Status**: ✅ Compatible

Since Google Studio uses Firebase under the hood, use the Firebase deployment method:

1. Connect to Firebase project in Studio
2. Use Firebase Hosting deployment
3. Or run: `npm run deploy:firebase`

---

## 🔧 Configuration Files Overview

### `vite.config.ts`
```typescript
base: mode === 'production' ? '/Council-Git-V9/' : '/'
```
- **GitHub Pages**: Uses `/Council-Git-V9/` base path
- **Vercel/Firebase**: Automatically handled (root deployment)

### `vercel.json`
- Build command: `npm run build`
- Output: `dist/`
- Framework detection: Vite
- SPA rewrites enabled
- Security headers configured

### `firebase.json`
- Public: `dist/`
- SPA rewrites to `/index.html`
- Cache control for assets
- Security headers

### `.idxrc`
- Development tasks pre-configured
- Port forwarding (5173, 4173)
- Extensions: ESLint, Prettier

---

## 🎯 Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run build:strict` | Build with TypeScript checks |
| `npm run build:dev` | Development mode build |
| `npm run preview` | Preview production build |
| `npm run clean` | Clean build artifacts |

---

## 🔍 Troubleshooting

### GitHub Pages 404 on Refresh
✅ **Fixed**: `404.html` redirects to app router

### Assets Not Loading
- Check `vite.config.ts` base path matches repository name
- Verify `dist/` contains `assets/` folder

### Build Fails
```bash
npm run clean
npm install
npm run build
```

### Vercel Deployment Issues
- Check build logs in Vercel dashboard
- Verify environment variables if using APIs
- Ensure `vercel.json` is committed

### Firebase Deployment Issues
```bash
firebase login --reauth
firebase use --add  # Select correct project
firebase deploy --only hosting
```

---

## 🌍 Environment Variables

For platforms that need API keys:

**Vercel**:
```bash
vercel env add OPENROUTER_API_KEY
```

**Firebase**:
```bash
firebase functions:config:set openrouter.key="YOUR_KEY"
```

**IDX**:
Add to Secrets in IDX dashboard

**Note**: The Council stores API keys in browser localStorage with encryption. No server-side environment variables needed for basic operation.

---

## 📊 Deployment Status Check

### GitHub Pages
```bash
curl -I https://elghazawy5367.github.io/Council-Git-V9/
```

### Vercel
Check: https://vercel.com/dashboard

### Firebase
```bash
firebase hosting:sites:list
```

---

## 🚦 CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
- Triggers on push to `main`
- Runs `npm ci` and `npm run build`
- Deploys to GitHub Pages
- Full TypeScript and lint checks in pre-commit hook

---

## 📱 Mobile/Tablet Testing

All platforms serve the app correctly on mobile. Test with:
- Chrome DevTools Device Mode
- Real devices via public URLs
- Responsive design verified in `tailwind.config.ts`

---

## 🔒 Security

All platforms configured with:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- HTTPS enforced
- Asset integrity via immutable cache headers

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Run `npm run verify-deploy`
- [ ] Run `npm run typecheck`
- [ ] Run `npm run lint`
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Verify API keys are in vault (localStorage)
- [ ] Check console for errors
- [ ] Test on mobile viewport
- [ ] Commit all changes
- [ ] Push to main (triggers GitHub Pages auto-deploy)

---

## 🎉 Quick Deploy All Platforms

```bash
# 1. Verify everything is ready
npm run verify-deploy

# 2. Deploy to all platforms
npm run deploy:github  # GitHub Pages
npm run deploy:vercel  # Vercel
npm run deploy:firebase  # Firebase/Studio

# 3. Verify deployments
curl -I https://elghazawy5367.github.io/Council-Git-V9/
```

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Google IDX Documentation](https://idx.dev/docs)

---

**Last Updated**: January 13, 2026  
**Verified Platforms**: GitHub Pages ✅ | Vercel ✅ | Firebase ✅ | IDX ✅ | Studio ✅
