# Council-Git-Pro

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

> Multi-perspective AI intelligence and decision engine for autonomous market opportunity discovery.

## 📋 Overview

Council-Git-Pro is a professional-grade intelligence and decision-making platform designed to discover, analyze, and validate market opportunities with surgical precision. By leveraging a **Council of Experts** architecture, it synthesizes raw data from GitHub, Reddit, HackerNews, and ProductHunt into actionable business verdicts.

The system operates on a two-phase intelligence workflow: parallel expert analysis followed by strategic synthesis by **"The Ruthless Judge."** This ensures that every opportunity is scrutinized from multiple angles—technical feasibility, market demand, competition, and solo-founder fit—before a final recommendation is made. Built for the non-technical solo founder, the platform focuses on identifying high-margin, low-competition "Blue Ocean" opportunities.

## ✨ Key Features

- 🔍 **Multi-Platform Scouting**: Automated intelligence gathering from GitHub, Reddit, HackerNews, and ProductHunt.
- 💎 **Abandoned Goldmine Detection**: Identification of high-value, popular repositories that have been abandoned by their maintainers.
- 🎯 **High-Intent Lead Sniping**: Real-time detection of buying signals and specific pain points on Reddit and community forums.
- ⚖️ **Ruthless Synthesis**: A sophisticated multi-tier synthesis engine (Quick, Balanced, Deep) that cuts through noise to find consensus.
- 📂 **Multi-Niche Configuration**: Easily monitor multiple market sectors simultaneously via a centralized YAML configuration.
- 📈 **Market Gap Identification**: Advanced synthesis of supply and demand signals to find underserved market gaps.
- 🤖 **Elite Mimicry**: Analysis of top-tier developer patterns to extract mental models and architectural best practices.

## 🏗 Architecture

Council-Git-Pro follows a modular, feature-first architecture designed for both automated execution and interactive analysis.

- **Intelligence Layer**: Features in `src/lib/` collect raw data from various APIs. Each feature is designed to be self-contained and produces structured reports in `data/reports/`.
- **Synthesis Engine**: The "Ruthless Judge" (`src/lib/synthesis-engine.ts`) processes outputs from multiple experts, identifying consensus, unique insights, and contradictions using Tree-of-Thought reasoning.
- **State Management**: A unified Zustand store (`src/stores/council.store.ts`) manages the collective intelligence and decision state.
- **Automation Pipeline**: GitHub Actions workflows in `.github/workflows/` trigger daily and weekly intelligence runs, ensuring continuous monitoring.
- **Adaptive UI**: A modern React 18.3 + Vite 6.4 (SWC) dashboard provides a real-time "Intelligence Feed" and an interactive Command Palette.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **GitHub Account**: For repository analysis and automated workflows
- **API Tokens**: A GitHub Personal Access Token (PAT) is required for core features

### Installation

```bash
# Clone the repository
git clone https://github.com/YourUsername/Council-Git-Pro.git
cd Council-Git-Pro

# Install dependencies (using --legacy-peer-deps for compatibility)
npm install --legacy-peer-deps
```

### Configuration

1. **Environment Variables**: Create a `.env` file based on `.env.example`.
   ```bash
   GITHUB_TOKEN=your_github_token_here
   ```

2. **Target Niches**: Council-Git-Pro uses a powerful multi-niche system. Configure your targets in `config/target-niches.yaml`:
   ```yaml
   niches:
     - id: "neurodivergent-products"
       name: "Neurodivergent-Focused Digital Products"
       monitoring:
         keywords: ["adhd productivity", "executive function", "time blindness"]
         subreddits: ["r/ADHD", "r/autism"]
         github_topics: ["productivity", "neurodiversity"]
   ```

## 📊 Intelligence Features

| Feature | Category | Primary Data Source | Core Output |
|---------|----------|---------------------|-------------|
| **Scout** | Gathering | GitHub API | Blue Ocean Opportunities |
| **Reddit Sniper** | Gathering | Reddit API | High-Intent Buying Signals |
| **HackerNews Intel**| Gathering | Algolia HN API | Tech Trends & Pain Points |
| **Mining Drill** | Analysis | GitHub Issues | Raw Frustration Extraction |
| **Goldmine Detector**| Analysis | GitHub Repos | Abandoned High-Value Projects |
| **Market Gap ID** | Analysis | Internal Reports | Underserved Market Synthesis |
| **Ruthless Judge** | Decision | Expert Outputs | Integrated Actionable Verdicts |
| **Quality Pipeline**| Decision | Internal Data | Curated High-Signal Leads |

### 🔍 Intelligence Gathering
- **Scout** (`src/lib/scout.ts`): Analyzes GitHub for trending repos and "Blue Ocean" opportunities.
- **Reddit Sniper** (`src/lib/reddit-sniper.ts`): Detects high-intent buying signals using specialized keyword scoring.
- **HackerNews Intelligence** (`src/lib/hackernews-intelligence.ts`): Extracts buying signals and validations from HN discussions.
- **ProductHunt Intelligence** (`src/lib/producthunt-intelligence.ts`): Monitors new launches for market validation signals.

### 🔬 Analysis & Strategy
- **Mining Drill** (`src/lib/mining-drill.ts`): Drills into issue trackers to extract the exact marketing copy used by frustrated users.
- **Goldmine Detector** (`src/lib/goldmine-detector.ts`): Ranks abandoned repositories based on stars, forks, and unmet community needs.
- **Market Gap Identifier** (`src/lib/market-gap-identifier.ts`): A meta-feature that synthesizes supply and demand signals to find profitable gaps.
- **Stargazer Intelligence** (`src/lib/stargazer-intelligence.ts`): Analyzes institutional backing and quality signals from repo stargazers.

### 🧠 Decision Making
- **The Council** (`src/stores/council.store.ts`): Orchestrates the multi-expert deliberation process.
- **Ruthless Judge** (`src/lib/synthesis-engine.ts`): Resolves expert conflicts using multi-pass refinement and uncompromising scrutiny.

## 🧠 Council of Experts

The **Council** is the core deliberation engine of the system. It processes intelligence through a rigorous multi-stage pipeline:

1. **Evidence Extraction**: Experts identify core claims from raw intelligence data.
2. **Conflict Detection**: The system flags where experts disagree (e.g., technical difficulty vs. market demand).
3. **Judicial Resolution**: The "Ruthless Judge" evaluates the strength of evidence and provides a synthesized position.
4. **Final Verdict**: An integrated recommendation with specific immediate, medium-term, and long-term actions.

## 📁 Project Structure

```text
├── config/             # Multi-niche YAML configurations (target-niches.yaml)
├── data/               # Intelligence storage (reports, opportunities, judge-reports)
│   ├── reports/        # Daily feature-specific markdown reports
│   └── intelligence/   # Synthesized market gap and quality reports
├── scripts/            # CLI utilities (quality-pipeline.ts, report-manager.ts)
├── src/
│   ├── components/     # UI components (AdaptiveGrid, IntelligenceFeed, CommandPalette)
│   ├── lib/            # Feature implementations (scout.ts, synthesis-engine.ts)
│   ├── services/       # API services (github.service.ts)
│   └── stores/         # Zustand global state (council.store.ts, intelligence-store.ts)
└── .github/workflows/  # Automation (daily-scout.yml, market-gap.yml)
```

## 🔄 Workflows

- **Automation**: Workflows in `.github/workflows/` run daily (scout, reddit, hn) and weekly (market gap, goldmine).
- **Triggers**: Most features can be triggered manually via `npm run` scripts or scheduled automatically.
- **Results**: Reports are generated in Markdown format in the `data/` directory, optimized for human reading and AI consumption.

## 📖 Usage Examples

### Running a Manual Scout
```bash
# Scan for Blue Ocean opportunities in a specific niche
npm run scout
```

### Identifying Market Gaps
```bash
# Synthesize all recent reports to find underserved markets
npm run market-gaps
```

### Quality Pipeline Execution
```bash
# Filter all reports for the top 10% highest-quality signals
npm run quality-pipeline
```

## 🤝 Contributing

1. **Architecture Rule**: Features must not import directly from other features. Use shared libraries in `src/lib` or global stores in `src/stores`.
2. **Type Safety**: Run `npm run typecheck` before submitting.
3. **Accessibility**: All UI changes must adhere to the project's accessibility standards (aria-labels, focus management).

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Architecture Deep Dive**: `docs/DEEP_LOGIC_ANALYSIS.md`
- **Niche Monitoring**: `config/target-niches.yaml`
- **Live Intelligence Dashboard**: (Accessed via `npm run dev` at `http://localhost:5000/#/automation`)
