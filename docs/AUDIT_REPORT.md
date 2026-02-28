# Codebase Audit Report - Council-Git-V9

## 1. Project Structure Mapping

### 1.1 Tech Stack
- **Frontend Framework:** React 18.3.1 with Vite 6.4.1
- **Language:** TypeScript 5.8.3
- **Styling:** Tailwind CSS 3.4.17, Radix UI (shadcn/ui), Lucide React 0.462.0
- **State Management:**
  - **Zustand 5.0.9:** Global stores for experts, features, settings, and reports.
  - **React Context:** `CouncilContext` for workflow orchestration.
  - **React Query 5.90.20:** For data fetching and caching.
  - **Dexie.js 4.2.1:** IndexedDB wrapper for local persistence (CouncilDatabase).
- **Routing:** React Router DOM 6.30.1 (HashRouter)
- **API Layer:**
  - **OpenRouter:** Unified LLM access (GPT-4, Claude 3.5, Gemini Pro, DeepSeek).
  - **GitHub API:** Custom Octokit-based service.
  - **Reddit API:** Public JSON API wrapper.
- **Persistence:** Local Storage, IndexedDB, and repository-based JSON/Markdown files.

### 1.2 Dashboard Inventory (Screenshot-Equivalent Descriptions)

#### Council Home (`/`)
- **Purpose:** Mixture of Experts (MoE) interface for multi-perspective AI analysis.
- **Layout:**
  - **Top:** Glassmorphism Header with cost tracker, vault status, and navigation.
  - **Left Sidebar (1/3):** Control Panel for mode selection (Parallel, Consensus, etc.) and Verdict Panel.
  - **Main Area (2/3):** Responsive grid of Expert Cards showing individual LLM thoughts, plus a large Synthesis Card for the final "Judge" output.
- **Roles:** All Users.
- **Data Sources:** OpenRouter API, Local History (IndexedDB).

#### Automation Dashboard (`/automation` - Consolidated)
- **Purpose:** Unified command center for intelligence gathering and analytics.
- **Layout:**
  - **Tabs:** Features, Live Monitoring, Intelligence Feed, Council Metrics, Blue Ocean.
  - **Features Grid:** High-density cards for 14+ intelligence vectors (Scout, Sniper, etc.) with status indicators and quick-trigger buttons.
  - **Analytics Tab:** Complex dashboard with interactive charts (Recharts) showing cost, duration, and success rates.
- **Roles:** Researchers, Admins.
- **Data Sources:** GitHub API, Reddit API, HackerNews, ProductHunt, Local Reports.

#### Quality Dashboard (`/quality`)
- **Purpose:** System health and pattern recognition tracking.
- **Layout:**
  - **Top:** Overall Quality Score (large numeric display) with trend indicators.
  - **Middle:** 4-column stats grid for Files Analyzed, Critical Issues, Patterns Learned, Improvements.
  - **Bottom:** Interactive Area Chart showing "Quality Progress" over time.
- **Roles:** Developers.
- **Data Sources:** Quality Pipeline reports (JSON).

### 1.3 Dependencies (Package Inventory)
- `@tanstack/react-query`: ^5.90.20
- `zustand`: ^5.0.9
- `lucide-react`: ^0.462.0
- `recharts`: ^2.15.4
- `dexie`: ^4.2.1
- `radix-ui` primitives: Various (Accordion, Dialog, Tabs, etc.)
- `typescript`: ^5.8.3
- `vite`: ^6.4.1

---

## 3. Technical Debt Assessment

### 3.1 Critical/High Severity
- **Redundancy:** Multiple similar dashboard files (`Dashboard.tsx`, `AutomationDashboard.tsx`, `FeaturesDashboard.tsx`) with overlapping logic.
- **Mock Data:** `QualityDashboard.tsx` relies heavily on mock data for patterns.
- **Service Extraction:** Intelligence scripts in `src/lib/` still contain some direct File System operations which may fail in browser environments without proper guards.
- **Consistency:** Mixed use of Context and Zustand for overlapping state (e.g., expert selection).

### 3.2 Medium Severity
- **Layout Consistency:** Varying glassmorphism and gradient styles across different dashboards.
- **Performance:** Potential large DOM in the Expert Grid when many experts are active.
- **Responsive Design:** Some dashboards (like Quality) are complex for mobile views.

### 3.3 Low Severity
- **Deprecated Files:** `Dashboard.tsx` seems to be a legacy version of `AutomationDashboard.tsx`.
- **Inline Styles:** Occasional use of hardcoded Tailwind classes that could be abstracted into design tokens.

---

## 4. Modernization Opportunities

- **AI-Driven UX:** Implement predictive feature suggestions based on user input.
- **Smart Layouts:** Use CSS Grid with "auto-flow: dense" and interactive resizing for the Expert Grid.
- **Intelligent Dashboards:** Replace static charts with interactive Recharts components that allow drill-down into raw GitHub/Reddit data.
- **Unified Command Center:** Consolidate the redundant dashboards into a single, tabbed "Intelligence Command Center".
