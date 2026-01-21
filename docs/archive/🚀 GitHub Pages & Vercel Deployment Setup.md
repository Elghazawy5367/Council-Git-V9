# **🚀 COPILOT PROMPTS: GitHub Pages & Vercel Deployment Setup**

## **📋 PROMPT 1: Setup GitHub Pages Deployment**

**Copy-paste this into your Codespace terminal or create a GitHub issue:**

@copilot I need to set up GitHub Pages deployment for this Vite React app.

\*\*Requirements:\*\*  
1\. Update \`vite.config.ts\` to work with GitHub Pages base path  
2\. Add deployment script to \`package.json\`  
3\. Install \`gh-pages\` as dev dependency  
4\. Create \`.github/workflows/deploy.yml\` for automatic deployment  
5\. Ensure environment variables are handled correctly  
6\. Add deployment instructions to README.md

\*\*Configuration Details:\*\*  
\- Repository name: \[YOUR-REPO-NAME\]  
\- GitHub username: \[YOUR-USERNAME\]  
\- Base URL will be: \`https://\[YOUR-USERNAME\].github.io/\[YOUR-REPO-NAME\]/\`  
\- Build output directory: \`dist\`  
\- Framework: Vite \+ React \+ TypeScript

\*\*Constraints:\*\*  
\- Follow .github/copilot-instructions.md rules  
\- Complete files only (no snippets)  
\- Make atomic commits  
\- Test build locally before committing

\*\*Files to create/modify:\*\*  
1\. \`vite.config.ts\` \- add base path configuration  
2\. \`package.json\` \- add deploy scripts  
3\. \`.github/workflows/deploy.yml\` \- GitHub Actions workflow  
4\. \`README.md\` \- add deployment instructions section

\*\*Success criteria:\*\*  
\- \`npm run build\` succeeds  
\- \`npm run deploy\` works (or manual gh-pages command)  
\- GitHub Actions workflow passes  
\- App accessible at GitHub Pages URL

\*\*Environment Variables:\*\*  
\- Ensure VITE\_OPENROUTER\_API\_KEY is handled via GitHub Secrets  
\- Add instructions for setting up secrets

Please provide complete files with all necessary configurations.

---

## **📋 PROMPT 2: Setup Vercel Deployment**

**After GitHub Pages is working, use this prompt:**

@copilot I need to configure this app for Vercel deployment.

\*\*Requirements:\*\*  
1\. Create \`vercel.json\` configuration file  
2\. Update environment variable handling for Vercel  
3\. Add Vercel deployment instructions to README.md  
4\. Ensure build settings are optimized for Vercel  
5\. Create \`.vercelignore\` file if needed

\*\*Configuration Details:\*\*  
\- Framework: Vite  
\- Build command: \`npm run build\`  
\- Output directory: \`dist\`  
\- Node version: 18.x or latest LTS  
\- Environment variables needed: \`VITE\_OPENROUTER\_API\_KEY\`

\*\*Constraints:\*\*  
\- Follow .github/copilot-instructions.md rules  
\- Complete files only  
\- Compatible with both GitHub Pages and Vercel  
\- Don't break existing GitHub Pages setup

\*\*Files to create/modify:\*\*  
1\. \`vercel.json\` \- Vercel configuration  
2\. \`README.md\` \- add Vercel deployment section  
3\. \`.vercelignore\` \- files to exclude from deployment  
4\. \`vite.config.ts\` \- ensure it works for both platforms

\*\*Success criteria:\*\*  
\- Configuration ready for Vercel import  
\- Clear deployment instructions provided  
\- Environment variable setup documented  
\- Both GitHub Pages and Vercel configs work

Please provide complete files and deployment instructions.

---

## **📋 PROMPT 3: Environment Variables & Security**

**Use this to ensure proper environment variable handling:**

@copilot I need to properly configure environment variables for both local development and production deployments.

\*\*Requirements:\*\*  
1\. Create \`.env.example\` with all required variables (safe to commit)  
2\. Update \`.gitignore\` to exclude sensitive env files  
3\. Create comprehensive environment variable documentation  
4\. Add validation for required environment variables  
5\. Update \`src/lib/config.ts\` with proper env variable handling

\*\*Environment Variables Needed:\*\*  
\- \`VITE\_OPENROUTER\_API\_KEY\` \- OpenRouter API key (required)  
\- \`VITE\_APP\_NAME\` \- Application name (optional)  
\- Any others currently in use

\*\*Constraints:\*\*  
\- Never commit actual API keys  
\- Provide clear error messages if variables are missing  
\- Work with Vite's env variable system  
\- Follow .github/copilot-instructions.md rules

\*\*Files to create/modify:\*\*  
1\. \`.env.example\` \- template for environment variables  
2\. \`.gitignore\` \- ensure .env files are excluded  
3\. \`src/lib/config.ts\` \- centralized config with validation  
4\. \`README.md\` \- environment setup instructions  
5\. Any files currently importing env variables directly

\*\*Success criteria:\*\*  
\- \`.env.example\` exists with all variables documented  
\- \`.env\` files are gitignored  
\- Config file validates required variables  
\- Clear error messages for missing variables  
\- Documentation explains how to set up env vars

Please provide complete files and setup instructions.

---

## **📋 PROMPT 4: Fix Build & Deployment Issues (If Needed)**

**Use this if you encounter errors during deployment:**

@copilot The deployment is failing with the following error:

\[PASTE ERROR MESSAGE HERE\]

\*\*Context:\*\*  
\- Deployment platform: \[GitHub Pages / Vercel\]  
\- Build command: \`npm run build\`  
\- Error occurs at: \[build / deploy / runtime\]

\*\*Requirements:\*\*  
1\. Analyze the error and identify root cause  
2\. Fix the issue following exploit-first philosophy  
3\. Ensure fix works for both local and production  
4\. Update relevant configuration files  
5\. Provide complete fixed files (no snippets)

\*\*Constraints:\*\*  
\- Follow .github/copilot-instructions.md rules  
\- Mirror solutions from elite repos if available  
\- Make atomic commits  
\- Don't break existing functionality

\*\*Files that might need fixes:\*\*  
\- \`vite.config.ts\`  
\- \`package.json\`  
\- \`tsconfig.json\`  
\- \`.github/workflows/deploy.yml\`  
\- \`vercel.json\`

\*\*Success criteria:\*\*  
\- Build completes successfully  
\- No TypeScript errors  
\- Deployment succeeds  
\- App runs correctly in production

Please provide complete fixed files and explanation of the fix.

---

## **📋 PROMPT 5: Complete Deployment Testing Checklist**

**After setup, use this to create a testing workflow:**

@copilot Create a comprehensive deployment testing checklist and validation script.

\*\*Requirements:\*\*  
1\. Create \`scripts/validate-deployment.sh\` \- automated validation script  
2\. Create \`DEPLOYMENT.md\` \- deployment checklist and troubleshooting guide  
3\. Add pre-deployment tests to package.json  
4\. Document rollback procedures  
5\. Create health check endpoint if needed

\*\*Validation Checks:\*\*  
\- \[ \] TypeScript compilation passes  
\- \[ \] Linting passes  
\- \[ \] Build succeeds  
\- \[ \] All environment variables present  
\- \[ \] No hardcoded secrets in code  
\- \[ \] Bundle size \< 2MB  
\- \[ \] App loads successfully  
\- \[ \] Core features work  
\- \[ \] Error boundaries active  
\- \[ \] API calls work with environment variables

\*\*Constraints:\*\*  
\- Follow .github/copilot-instructions.md rules  
\- Complete files only  
\- Tablet-friendly (lightweight scripts)  
\- Clear error messages

\*\*Files to create:\*\*  
1\. \`scripts/validate-deployment.sh\` \- validation script  
2\. \`DEPLOYMENT.md\` \- comprehensive deployment guide  
3\. Update \`package.json\` \- add validation scripts  
4\. Update \`README.md\` \- link to deployment guide

\*\*Success criteria:\*\*  
\- Validation script catches common issues  
\- Clear deployment documentation  
\- Easy troubleshooting guide  
\- Rollback procedures documented

Please provide complete files.

---

## **🎯 QUICK REFERENCE: Manual Commands**

**While Copilot sets things up, you can run these manually:**

### **GitHub Pages Manual Setup:**

\# 1\. Install gh-pages  
npm install \--save-dev gh-pages

\# 2\. Update vite.config.ts manually  
\# Set base: '/your-repo-name/'

\# 3\. Build  
npm run build

\# 4\. Deploy  
npx gh-pages \-d dist

\# 5\. Enable GitHub Pages  
\# Go to: Settings → Pages → Source: gh-pages branch

### **Vercel Manual Setup:**

\# 1\. Install Vercel CLI (optional)  
npm install \-g vercel

\# 2\. Login to Vercel  
vercel login

\# 3\. Deploy  
vercel

\# Or just use Vercel dashboard:  
\# https://vercel.com → Import Project → Select Repo

---

## **📊 EXPECTED FILE CHANGES**

After running the prompts, you should have:

your-repo/  
├── .github/  
│   └── workflows/  
│       └── deploy.yml          \# NEW \- Auto-deploy to GitHub Pages  
├── scripts/  
│   └── validate-deployment.sh   \# NEW \- Deployment validation  
├── .env.example                 \# NEW \- Environment template  
├── .vercelignore               \# NEW \- Vercel exclusions  
├── DEPLOYMENT.md               \# NEW \- Deployment guide  
├── vercel.json                 \# NEW \- Vercel config  
├── vite.config.ts              \# MODIFIED \- Base path config  
├── package.json                \# MODIFIED \- Deploy scripts  
├── README.md                   \# MODIFIED \- Deployment docs  
└── src/lib/config.ts           \# MODIFIED \- Env validation

---

## **✅ VALIDATION STEPS**

**After Copilot completes setup:**

### **1\. Test Locally:**

\# Build  
npm run build

\# Preview  
npm run preview

\# Visit http://localhost:4173  
\# Test all features

### **2\. Test GitHub Pages:**

\# Deploy  
npm run deploy  
\# OR  
npx gh-pages \-d dist

\# Wait 2-3 minutes  
\# Visit: https://YOUR-USERNAME.github.io/YOUR-REPO/

### **3\. Test Vercel:**

\# Push to GitHub  
git push

\# Import to Vercel:  
\# 1\. Go to https://vercel.com  
\# 2\. Click "Import Project"  
\# 3\. Select your repository  
\# 4\. Add environment variable: VITE\_OPENROUTER\_API\_KEY  
\# 5\. Click Deploy

\# Visit: https://your-repo.vercel.app

---

## **🔧 TROUBLESHOOTING PROMPTS**

**If deployment fails:**

@copilot The deployment failed. Here's the error log:

\[PASTE FULL ERROR LOG\]

Please:  
1\. Identify the root cause  
2\. Check if it's a known issue in elite repos  
3\. Provide complete fix (no snippets)  
4\. Explain what caused the issue  
5\. Add prevention to deployment checklist

Follow .github/copilot-instructions.md rules.

**If app loads but doesn't work:**

@copilot The app deployed successfully but core features don't work in production.

\*\*Symptoms:\*\*  
\- \[Describe what's not working\]  
\- \[Browser console errors if any\]  
\- \[Network tab errors if any\]

\*\*Environment:\*\*  
\- Platform: \[GitHub Pages / Vercel\]  
\- URL: \[deployed URL\]

Please:  
1\. Check environment variable configuration  
2\. Verify API endpoints and CORS settings  
3\. Check if paths are correct for deployment  
4\. Fix any production-specific issues  
5\. Provide complete fixed files

Follow .github/copilot-instructions.md rules.

---

## **🎯 RECOMMENDED ORDER**

1. **Start with Prompt 3** (Environment Variables) \- Sets foundation  
2. **Then Prompt 1** (GitHub Pages) \- Quick deployment  
3. **Then Prompt 5** (Testing Checklist) \- Validation  
4. **Then Prompt 2** (Vercel) \- Production deployment  
5. **Use Prompt 4 as needed** (Troubleshooting)

---

## **📝 COMPLETE WORKFLOW**

\# Step 1: Environment Setup  
\# Paste Prompt 3 to Copilot  
\# Wait for files to be created  
git add .  
git commit \-m "feat(config): add environment variable configuration"

\# Step 2: GitHub Pages Setup  
\# Paste Prompt 1 to Copilot  
\# Wait for files to be created  
git add .  
git commit \-m "feat(deploy): add GitHub Pages deployment"

\# Step 3: Test Build  
npm run build  
npm run preview

\# Step 4: Deploy to GitHub Pages  
npm run deploy

\# Step 5: Verify GitHub Pages  
\# Visit https://YOUR-USERNAME.github.io/YOUR-REPO/

\# Step 6: Vercel Setup  
\# Paste Prompt 2 to Copilot  
git add .  
git commit \-m "feat(deploy): add Vercel configuration"  
git push

\# Step 7: Deploy to Vercel  
\# Go to https://vercel.com  
\# Import your repository  
\# Add VITE\_OPENROUTER\_API\_KEY in environment variables  
\# Deploy

\# Step 8: Testing  
\# Paste Prompt 5 to Copilot  
\# Run validation script  
./scripts/validate-deployment.sh

---

**Start with Prompt 3 (Environment Variables) first, then move to Prompt 1 (GitHub Pages). Let me know when you're ready to proceed or if you encounter any issues\!**

