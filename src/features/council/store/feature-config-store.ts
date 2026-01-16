import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ScoutConfig {
  enabled: boolean;
  targetNiche: string;
  minStars: number;
  maxRepos: number;
  depth: 'shallow' | 'normal' | 'deep';
  schedule: string;
  excludeKeywords: string[];
  minUpvotes: number;
}

export interface MirrorConfig {
  enabled: boolean;
  generateReport: boolean;
  standards: string[];
  schedule: string;
  excludeDirectories: string[];
}

export interface QualityConfig {
  enabled: boolean;
  autoFix: boolean;
  runLinter: boolean;
  runTypeCheck: boolean;
  checkSecurity: boolean;
  checkStyle: boolean;
  schedule: string;
}

export interface SelfImproveConfig {
  enabled: boolean;
  niche: string;
  minStars: number;
  maxRepos: number;
  schedule: string;
}

export interface StargazerAnalysisConfig {
  enabled: boolean;
  minFollowers: number;
  checkCompanies: boolean;
  targetCompanies: string[];
  maxStargazers: number;
}

export interface DataFetchingConfig {
  enabled: boolean;
  useCaching: boolean;
  cacheExpiry: number; // hours
}

export interface TypeSafeFormsConfig {
  enabled: boolean;
  useZod: boolean;
  validateOnChange: boolean;
}

export interface ErrorHandlingConfig {
  enabled: boolean;
  useRetry: boolean;
  maxRetries: number;
  circuitBreaker: boolean;
}

export interface AuthSecurityConfig {
  enabled: boolean;
  useVault: boolean;
  sessionTimeout: number; // minutes
}

export interface MobileDrawersConfig {
  enabled: boolean;
  gesturesEnabled: boolean;
  swipeThreshold: number;
}

export interface VirtualizedListsConfig {
  enabled: boolean;
  itemHeight: number;
  overscanCount: number;
}

export interface StreamingAIConfig {
  enabled: boolean;
  useTypewriter: boolean;
  chunkSize: number;
}

export interface AgentOrchestrationConfig {
  enabled: boolean;
  maxAgents: number;
  executionMode: 'parallel' | 'consensus' | 'adversarial' | 'sequential';
}

export interface LocalDatabaseConfig {
  enabled: boolean;
  useDexie: boolean;
  autoSync: boolean;
}

export interface GitHubTrendingConfig {
  enabled: boolean;
  topics: string[];
  languages: string[];
  minStars: number;
  schedule: string;
}

export interface MarketGapConfig {
  enabled: boolean;
  minQualityScore: number;
  deepAnalysis: boolean;
  schedule: string;
}

export interface RedditSniperConfig {
  enabled: boolean;
  minIntentScore: number;
  subreddits: string[];
  instantNotifications: boolean;
  schedule: string;
}

export interface RedditPainPointsConfig {
  enabled: boolean;
  analysisModel: string;
  deepAIAnalysis: boolean;
  targetSubreddits: string[];
  schedule: string;
}

export interface ViralRadarConfig {
  enabled: boolean;
  minViralScore: number;
  platforms: string[];
  checkInterval: number;
  schedule: string;
}

export interface TwinMimicryConfig {
  enabled: boolean;
  targetRepo: string;
  mimicStyle: 'exact' | 'balanced' | 'creative';
  schedule: string;
}

export interface ForkEvolutionConfig {
  enabled: boolean;
  minForks: number;
  trackChanges: boolean;
  schedule: string;
}

export interface FeatureConfigState {
  scout: ScoutConfig;
  mirror: MirrorConfig;
  quality: QualityConfig;
  selfImprove: SelfImproveConfig;
  stargazerAnalysis: StargazerAnalysisConfig;
  githubTrending: GitHubTrendingConfig;
  marketGap: MarketGapConfig;
  redditSniper: RedditSniperConfig;
  redditPainPoints: RedditPainPointsConfig;
  viralRadar: ViralRadarConfig;
  twinMimicry: TwinMimicryConfig;
  forkEvolution: ForkEvolutionConfig;
  dataFetching: DataFetchingConfig;
  typeSafeForms: TypeSafeFormsConfig;
  errorHandling: ErrorHandlingConfig;
  authSecurity: AuthSecurityConfig;
  mobileDrawers: MobileDrawersConfig;
  virtualizedLists: VirtualizedListsConfig;
  streamingAI: StreamingAIConfig;
  agentOrchestration: AgentOrchestrationConfig;
  localDatabase: LocalDatabaseConfig;
  
  updateScoutConfig: (config: Partial<ScoutConfig>) => void;
  updateMirrorConfig: (config: Partial<MirrorConfig>) => void;
  updateQualityConfig: (config: Partial<QualityConfig>) => void;
  updateSelfImproveConfig: (config: Partial<SelfImproveConfig>) => void;
  updateStargazerAnalysisConfig: (config: Partial<StargazerAnalysisConfig>) => void;
  updateGitHubTrendingConfig: (config: Partial<GitHubTrendingConfig>) => void;
  updateMarketGapConfig: (config: Partial<MarketGapConfig>) => void;
  updateRedditSniperConfig: (config: Partial<RedditSniperConfig>) => void;
  updateRedditPainPointsConfig: (config: Partial<RedditPainPointsConfig>) => void;
  updateViralRadarConfig: (config: Partial<ViralRadarConfig>) => void;
  updateTwinMimicryConfig: (config: Partial<TwinMimicryConfig>) => void;
  updateForkEvolutionConfig: (config: Partial<ForkEvolutionConfig>) => void;
  updateDataFetchingConfig: (config: Partial<DataFetchingConfig>) => void;
  updateTypeSafeFormsConfig: (config: Partial<TypeSafeFormsConfig>) => void;
  updateErrorHandlingConfig: (config: Partial<ErrorHandlingConfig>) => void;
  updateAuthSecurityConfig: (config: Partial<AuthSecurityConfig>) => void;
  updateMobileDrawersConfig: (config: Partial<MobileDrawersConfig>) => void;
  updateVirtualizedListsConfig: (config: Partial<VirtualizedListsConfig>) => void;
  updateStreamingAIConfig: (config: Partial<StreamingAIConfig>) => void;
  updateAgentOrchestrationConfig: (config: Partial<AgentOrchestrationConfig>) => void;
  updateLocalDatabaseConfig: (config: Partial<LocalDatabaseConfig>) => void;
  
  resetToDefaults: () => void;
}

const DEFAULT_SCOUT_CONFIG: ScoutConfig = {
  enabled: true,
  targetNiche: 'developer-tools',
  minStars: 100,
  maxRepos: 50,
  depth: 'normal',
  schedule: '0 6 * * *', // Daily at 6 AM UTC
  excludeKeywords: ['crypto', 'nft', 'gambling'],
  minUpvotes: 10,
};

const DEFAULT_MIRROR_CONFIG: MirrorConfig = {
  enabled: true,
  generateReport: true,
  standards: ['elite', 'production', 'security'],
  schedule: '0 8 * * 0', // Weekly on Sundays at 8 AM UTC
  excludeDirectories: ['node_modules', 'dist', '.git', 'attached_assets'],
};

const DEFAULT_QUALITY_CONFIG: QualityConfig = {
  enabled: true,
  autoFix: false,
  runLinter: true,
  runTypeCheck: true,
  checkSecurity: true,
  checkStyle: true,
  schedule: '0 10 * * 2,5', // Twice weekly - Tuesday and Friday
};

const DEFAULT_SELF_IMPROVE_CONFIG: SelfImproveConfig = {
  enabled: true,
  niche: 'developer-tools',
  minStars: 1000,
  maxRepos: 20,
  schedule: '0 9 * * 1', // Weekly on Mondays
};

const DEFAULT_STARGAZER_ANALYSIS_CONFIG: StargazerAnalysisConfig = {
  enabled: true,
  minFollowers: 1000,
  checkCompanies: true,
  targetCompanies: ['google', 'meta', 'stripe', 'vercel', 'shopify', 'amazon', 'microsoft', 'netflix'],
  maxStargazers: 100,
};

const DEFAULT_GITHUB_TRENDING_CONFIG: GitHubTrendingConfig = {
  enabled: false,
  topics: ['ai', 'saas', 'productivity'],
  languages: ['TypeScript', 'Python'],
  minStars: 100,
  schedule: '0 0 * * *',
};

const DEFAULT_MARKET_GAP_CONFIG: MarketGapConfig = {
  enabled: false,
  minQualityScore: 0.8,
  deepAnalysis: true,
  schedule: '0 12 * * 0',
};

const DEFAULT_REDDIT_SNIPER_CONFIG: RedditSniperConfig = {
  enabled: false,
  minIntentScore: 7,
  subreddits: ['SaaS', 'Entrepreneur', 'startups'],
  instantNotifications: true,
  schedule: '0 10 * * *',
};

const DEFAULT_REDDIT_PAIN_POINTS_CONFIG: RedditPainPointsConfig = {
  enabled: false,
  analysisModel: 'gemini-2.0',
  deepAIAnalysis: true,
  targetSubreddits: ['entrepreneur', 'startups', 'SaaS'],
  schedule: '0 11 * * *',
};

const DEFAULT_VIRAL_RADAR_CONFIG: ViralRadarConfig = {
  enabled: false,
  minViralScore: 7,
  platforms: ['twitter', 'reddit', 'hackernews'],
  checkInterval: 60,
  schedule: '0 */4 * * *',
};

const DEFAULT_TWIN_MIMICRY_CONFIG: TwinMimicryConfig = {
  enabled: false,
  targetRepo: '',
  mimicStyle: 'balanced',
  schedule: '0 0 * * 0',
};

const DEFAULT_FORK_EVOLUTION_CONFIG: ForkEvolutionConfig = {
  enabled: false,
  minForks: 50,
  trackChanges: true,
  schedule: '0 12 * * *',
};

const DEFAULT_DATA_FETCHING_CONFIG: DataFetchingConfig = {
  enabled: true,
  useCaching: true,
  cacheExpiry: 24,
};

const DEFAULT_TYPE_SAFE_FORMS_CONFIG: TypeSafeFormsConfig = {
  enabled: true,
  useZod: true,
  validateOnChange: false,
};

const DEFAULT_ERROR_HANDLING_CONFIG: ErrorHandlingConfig = {
  enabled: true,
  useRetry: true,
  maxRetries: 3,
  circuitBreaker: true,
};

const DEFAULT_AUTH_SECURITY_CONFIG: AuthSecurityConfig = {
  enabled: true,
  useVault: true,
  sessionTimeout: 60,
};

const DEFAULT_MOBILE_DRAWERS_CONFIG: MobileDrawersConfig = {
  enabled: true,
  gesturesEnabled: true,
  swipeThreshold: 50,
};

const DEFAULT_VIRTUALIZED_LISTS_CONFIG: VirtualizedListsConfig = {
  enabled: true,
  itemHeight: 80,
  overscanCount: 5,
};

const DEFAULT_STREAMING_AI_CONFIG: StreamingAIConfig = {
  enabled: true,
  useTypewriter: true,
  chunkSize: 50,
};

const DEFAULT_AGENT_ORCHESTRATION_CONFIG: AgentOrchestrationConfig = {
  enabled: true,
  maxAgents: 7,
  executionMode: 'consensus',
};

const DEFAULT_LOCAL_DATABASE_CONFIG: LocalDatabaseConfig = {
  enabled: true,
  useDexie: true,
  autoSync: true,
};

export const useFeatureConfigStore = create<FeatureConfigState>(
  // @ts-expect-error - Zustand v5 persist middleware type signature mismatch (non-breaking)
  persist(
    (set) => ({
      scout: DEFAULT_SCOUT_CONFIG,
      mirror: DEFAULT_MIRROR_CONFIG,
      quality: DEFAULT_QUALITY_CONFIG,
      selfImprove: DEFAULT_SELF_IMPROVE_CONFIG,
      stargazerAnalysis: DEFAULT_STARGAZER_ANALYSIS_CONFIG,
      githubTrending: DEFAULT_GITHUB_TRENDING_CONFIG,
      marketGap: DEFAULT_MARKET_GAP_CONFIG,
      redditSniper: DEFAULT_REDDIT_SNIPER_CONFIG,
      redditPainPoints: DEFAULT_REDDIT_PAIN_POINTS_CONFIG,
      viralRadar: DEFAULT_VIRAL_RADAR_CONFIG,
      twinMimicry: DEFAULT_TWIN_MIMICRY_CONFIG,
      forkEvolution: DEFAULT_FORK_EVOLUTION_CONFIG,
      dataFetching: DEFAULT_DATA_FETCHING_CONFIG,
      typeSafeForms: DEFAULT_TYPE_SAFE_FORMS_CONFIG,
      errorHandling: DEFAULT_ERROR_HANDLING_CONFIG,
      authSecurity: DEFAULT_AUTH_SECURITY_CONFIG,
      mobileDrawers: DEFAULT_MOBILE_DRAWERS_CONFIG,
      virtualizedLists: DEFAULT_VIRTUALIZED_LISTS_CONFIG,
      streamingAI: DEFAULT_STREAMING_AI_CONFIG,
      agentOrchestration: DEFAULT_AGENT_ORCHESTRATION_CONFIG,
      localDatabase: DEFAULT_LOCAL_DATABASE_CONFIG,
      
      updateScoutConfig: (config: Partial<ScoutConfig>) =>
        set((state) => ({ scout: { ...state.scout, ...config } })),
      
      updateMirrorConfig: (config: Partial<MirrorConfig>) =>
        set((state) => ({ mirror: { ...state.mirror, ...config } })),
      
      updateQualityConfig: (config: Partial<QualityConfig>) =>
        set((state) => ({ quality: { ...state.quality, ...config } })),
      
      updateSelfImproveConfig: (config: Partial<SelfImproveConfig>) =>
        set((state) => ({ selfImprove: { ...state.selfImprove, ...config } })),
      
      updateStargazerAnalysisConfig: (config: Partial<StargazerAnalysisConfig>) =>
        set((state) => ({ stargazerAnalysis: { ...state.stargazerAnalysis, ...config } })),
      
      updateGitHubTrendingConfig: (config: Partial<GitHubTrendingConfig>) =>
        set((state) => ({ githubTrending: { ...state.githubTrending, ...config } })),
      
      updateMarketGapConfig: (config: Partial<MarketGapConfig>) =>
        set((state) => ({ marketGap: { ...state.marketGap, ...config } })),
      
      updateRedditSniperConfig: (config: Partial<RedditSniperConfig>) =>
        set((state) => ({ redditSniper: { ...state.redditSniper, ...config } })),
      
      updateRedditPainPointsConfig: (config: Partial<RedditPainPointsConfig>) =>
        set((state) => ({ redditPainPoints: { ...state.redditPainPoints, ...config } })),
      
      updateViralRadarConfig: (config: Partial<ViralRadarConfig>) =>
        set((state) => ({ viralRadar: { ...state.viralRadar, ...config } })),
      
      updateTwinMimicryConfig: (config: Partial<TwinMimicryConfig>) =>
        set((state) => ({ twinMimicry: { ...state.twinMimicry, ...config } })),
      
      updateForkEvolutionConfig: (config: Partial<ForkEvolutionConfig>) =>
        set((state) => ({ forkEvolution: { ...state.forkEvolution, ...config } })),
      
      updateDataFetchingConfig: (config: Partial<DataFetchingConfig>) =>
        set((state) => ({ dataFetching: { ...state.dataFetching, ...config } })),
      
      updateTypeSafeFormsConfig: (config: Partial<TypeSafeFormsConfig>) =>
        set((state) => ({ typeSafeForms: { ...state.typeSafeForms, ...config } })),
      
      updateErrorHandlingConfig: (config: Partial<ErrorHandlingConfig>) =>
        set((state) => ({ errorHandling: { ...state.errorHandling, ...config } })),
      
      updateAuthSecurityConfig: (config: Partial<AuthSecurityConfig>) =>
        set((state) => ({ authSecurity: { ...state.authSecurity, ...config } })),
      
      updateMobileDrawersConfig: (config: Partial<MobileDrawersConfig>) =>
        set((state) => ({ mobileDrawers: { ...state.mobileDrawers, ...config } })),
      
      updateVirtualizedListsConfig: (config: Partial<VirtualizedListsConfig>) =>
        set((state) => ({ virtualizedLists: { ...state.virtualizedLists, ...config } })),
      
      updateStreamingAIConfig: (config: Partial<StreamingAIConfig>) =>
        set((state) => ({ streamingAI: { ...state.streamingAI, ...config } })),
      
      updateAgentOrchestrationConfig: (config: Partial<AgentOrchestrationConfig>) =>
        set((state) => ({ agentOrchestration: { ...state.agentOrchestration, ...config } })),
      
      updateLocalDatabaseConfig: (config: Partial<LocalDatabaseConfig>) =>
        set((state) => ({ localDatabase: { ...state.localDatabase, ...config } })),
      
      resetToDefaults: () =>
        set({
          scout: DEFAULT_SCOUT_CONFIG,
          mirror: DEFAULT_MIRROR_CONFIG,
          quality: DEFAULT_QUALITY_CONFIG,
          selfImprove: DEFAULT_SELF_IMPROVE_CONFIG,
          stargazerAnalysis: DEFAULT_STARGAZER_ANALYSIS_CONFIG,
          githubTrending: DEFAULT_GITHUB_TRENDING_CONFIG,
          marketGap: DEFAULT_MARKET_GAP_CONFIG,
          redditSniper: DEFAULT_REDDIT_SNIPER_CONFIG,
          redditPainPoints: DEFAULT_REDDIT_PAIN_POINTS_CONFIG,
          viralRadar: DEFAULT_VIRAL_RADAR_CONFIG,
          twinMimicry: DEFAULT_TWIN_MIMICRY_CONFIG,
          forkEvolution: DEFAULT_FORK_EVOLUTION_CONFIG,
          dataFetching: DEFAULT_DATA_FETCHING_CONFIG,
          typeSafeForms: DEFAULT_TYPE_SAFE_FORMS_CONFIG,
          errorHandling: DEFAULT_ERROR_HANDLING_CONFIG,
          authSecurity: DEFAULT_AUTH_SECURITY_CONFIG,
          mobileDrawers: DEFAULT_MOBILE_DRAWERS_CONFIG,
          virtualizedLists: DEFAULT_VIRTUALIZED_LISTS_CONFIG,
          streamingAI: DEFAULT_STREAMING_AI_CONFIG,
          agentOrchestration: DEFAULT_AGENT_ORCHESTRATION_CONFIG,
          localDatabase: DEFAULT_LOCAL_DATABASE_CONFIG,
        }),
    }),
    {
      name: 'council-feature-config',
    }
  )
);
