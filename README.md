# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

---

## 🚀 The Council - Intelligence Features

The Council includes powerful intelligence tools for discovering market opportunities:

### 📊 Daily Intelligence Report (Feature 11)
Generate comprehensive daily briefs combining Scout + Goldmine Detector + Mining Drill:

```bash
# Generate daily brief for any niche
npm run brief developer-tools
npm run brief react-native
npm run brief machine-learning

# Show help
npm run brief:help
```

**Output:** Markdown report + JSON data with:
- Abandoned goldmines (high demand, zero competition)
- Pain point analysis (marketing copy from user complaints)
- 30-day sprint action plan
- Revenue projections

**Documentation:** See [docs/DAILY_INTELLIGENCE_REPORT.md](docs/DAILY_INTELLIGENCE_REPORT.md)

### Other Intelligence Tools
```bash
npm run scout          # Scan GitHub for opportunities
npm run mirror         # Code quality analysis
npm run quality        # Full quality pipeline
npm run learn          # Learn from successful repos
```

### 🔄 Repository Mirror Tool
Complete repository mirroring with all refs, tags, and branches:

```bash
# Mirror this repository to a new location
cd scripts
./mirror-repository.sh
```

**Default mirrors:**
- Source: `https://github.com/Elghazawy5367/Council-Git-V9`
- Destination: `https://github.com/Elghazawy5367/Council-Git-V9A`

**Custom repositories:**
```bash
./mirror-repository.sh <source-url> <destination-url>
```

**Documentation:** See [scripts/README-MIRROR.md](scripts/README-MIRROR.md)

---

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### 🚀 GitHub Pages Deployment

The project is automatically deployed to GitHub Pages on every push to `main` branch.

**Live URL:** https://Elghazawy5367.github.io/Council-Git-V9/

#### Manual Deployment
```bash
npm run deploy
```

This will:
1. Build the project with the correct base path (`/Council-Git-V9/`)
2. Deploy the `dist/` folder to GitHub Pages
3. Make the site available at the URL above

#### GitHub Actions
The repository includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages on every push to main.

#### Lovable Platform
Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share → Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
