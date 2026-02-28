# Modernization Plan - Council-Git-V9

## Phase 1: Dashboard Consolidation & Smart Layouts
- **Goal:** Reduce redundancy and improve navigation.
- **Actions:**
  - Deprecate `src/pages/Dashboard.tsx` and `src/pages/FeaturesDashboard.tsx`.
  - Enhance `src/pages/AutomationDashboard.tsx` to become the primary "Automation Control Center".
  - Implement a tabbed interface for different intelligence streams (GitHub, Reddit, Hybrid).
  - Use `react-resizable-panels` to allow users to customize their dashboard layout.

## Phase 2: AI-Powered UI/UX Enhancements
- **Goal:** Leverage AI to improve user experience.
- **Actions:**
  - **Predictive Feature Suggestions:** Implement a "Smart Recommendation" card that suggests automation features to run based on current market trends or user activity.
  - **Intelligent Search:** Add a global command palette (using `cmdk`) for quick access to features, reports, and expert settings.
  - **Dynamic Expert Selection:** Allow the "Judge" to suggest which experts are best suited for a specific task.

## Phase 3: Intelligent Data Visualization
- **Goal:** Transform static data into actionable insights.
- **Actions:**
  - Replace static stats in `QualityDashboard.tsx` and `AutomationDashboard.tsx` with interactive Recharts components.
  - Implement "Drill-down" capabilities: Clicking on a chart data point should reveal the underlying raw data (e.g., specific GitHub issues or Reddit threads).
  - Add a "Market Heatmap" to visualize opportunities across different niches.

## Phase 4: Architectural Refinement & Browser Safety
- **Goal:** Improve code quality and portability.
- **Actions:**
  - Finish migrating stores to `src/stores/`.
  - Refactor `src/lib/` intelligence scripts to use a unified `BrowserSafeFileService` for reading/writing data, ensuring compatibility across Node and Browser environments.
  - Standardize glassmorphism UI components across all dashboards for a cohesive look.

## Phase 5: Verification & Testing
- **Goal:** Ensure stability and performance.
- **Actions:**
  - Implement Playwright tests for critical dashboard workflows.
  - Perform accessibility audit and fix WCAG violations.
  - Optimize large lists using virtualization where necessary.
