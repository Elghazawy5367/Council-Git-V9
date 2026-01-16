# The Council - AI-Powered Multi-Perspective Decision Engine

## Overview

The Council is a React-based web application that leverages multiple AI models to provide multi-perspective analysis on user queries. It functions as a decision-support tool that consults various AI "experts" simultaneously, each with distinct personas and specialties, then synthesizes their responses into actionable insights. The application features a dark glassmorphism UI design with purple/blue gradients.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **UI Components**: Shadcn/UI component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for Council-specific theming
- **State Management**: Zustand stores for different feature domains (expert-store, control-panel-store, settings-store, memory-store)
- **Data Fetching**: TanStack React Query for server state management
- **Routing**: React Router v6 with lazy-loaded pages for code splitting

### Feature-Based Organization
The codebase follows a hybrid feature-first architecture:
- `src/features/council/` - Core council functionality (experts, synthesis, history)
- `src/features/settings/` - Application settings and configuration
- `src/components/primitives/` - Reusable UI components (Shadcn/UI)
- `src/lib/` - Shared utilities, types, and configuration

### Intelligence & AI Tooling
The application now includes an advanced intelligence layer:
- **Phantom Scout**: GitHub intelligence and Blue Ocean discovery.
- **Reddit Sniper**: High-intent buying signal detection on subreddits.
- **Reddit Pain Points**: Market gap analysis via user frustration mapping.
- **Viral Radar**: Cross-platform trend tracking (Twitter, Reddit, HN).
- **Twin Mimicry**: Structural pattern matching from elite repositories.
- **Fork Evolution**: Tracking innovative changes in repository forks.
- **Stargazer Analysis**: Institutional backing detection.
- **GitHub Trending**: Real-time topic and language trend analysis.
- **Market Gap**: Deep AI-powered opportunity identification.

### Key Architectural Patterns
1. **Expert System**: Configurable AI experts with unique personas, models, and behavior modes
2. **Execution Modes**: Multiple council operation modes (separated, synthesis, debate, pipeline)
3. **Synthesis Engine**: Tiered synthesis system (quick/balanced/deep) for combining expert outputs
4. **Persona Library**: Pre-configured expert templates for different use cases

### Data Persistence
- **IndexedDB**: Primary storage via idb-keyval for experts, sessions, and app state
- **localStorage**: Fallback storage and session history
- **Session Storage**: Temporary session data with timeout management

### Security
- **Content Sanitization**: DOMPurify for XSS protection on AI-generated content
- **Vault System**: Encrypted API key storage with session-based unlocking
- **Error Boundaries**: React error boundaries for graceful failure handling

## External Dependencies

### AI/API Services
- **OpenRouter API**: Primary gateway for multiple AI model providers
- **Serper API**: Optional web search capability for real-time information

### AI Model Fleet (Magnificent 7)
- DeepSeek V3 (logic & reasoning)
- Qwen 2.5 72B (code & architecture)
- Gemini 2.0 Flash (context & speed)
- Llama 3.1 8B (fast critique)
- Command R7B (strategic reasoning)
- Mixtral 8x7B (psychology & persuasion)

### Document Export
- **docx**: Microsoft Word document generation
- **file-saver**: Client-side file downloads for CSV/DOCX exports

### Visualization
- **Mermaid**: Diagram rendering for flowcharts and architecture diagrams
- **Recharts**: Data visualization components

### Core Libraries
- **TanStack Query**: Async state management with caching
- **Zustand**: Lightweight state management with persistence middleware
- **React Hook Form + Zod**: Form handling and validation
- **date-fns**: Date formatting and manipulation