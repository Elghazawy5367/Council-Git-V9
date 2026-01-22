import type { FeatureDefinition } from '../types/feature.types';

// Default feature definitions with configurations
export const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  // ═══════════════════════════════════════════════════════════════
  // GITHUB FEATURES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'github-trending',
    name: 'GitHub Trending Scanner',
    category: 'github',
    description: 'Scans GitHub trending repositories for market opportunities and emerging technologies',
    icon: '📈',
    enabled: false,
    status: 'inactive',
    metrics: {
      lastRun: null,
      nextRun: null,
      successRate: 0,
      totalRuns: 0,
      reportsGenerated: 0,
      averageExecutionTime: 0,
    },
    defaultConfig: {
      featureId: 'github-trending',
      featureName: 'GitHub Trending Scanner',
      enabled: false,
      runMode: 'manual',
      limits: {
        maxRunTime: 300,
        maxAPIRequests: 100,
        maxDataPoints: 50,
        retryAttempts: 3,
        cooldownPeriod: 3600,
      },
      targets: {
        github: {
          topics: ['ai', 'saas', 'productivity', 'developer-tools'],
          languages: ['TypeScript', 'Python', 'JavaScript', 'Go'],
          stars: { min: 100 },
        },
        niches: {
          primary: 'Developer Tools & SaaS',
          keywords: ['productivity', 'automation', 'ai', 'workflow', 'developer experience'],
          excludedKeywords: ['crypto', 'nft', 'blockchain', 'gambling'],
        },
      },
      processing: {
        filters: {
          minQualityScore: 0.7,
          requireEngagement: true,
          recencyFilter: 30,
          sentimentFilter: 'all',
        },
        analysis: {
          enableSentiment: true,
          enableTrending: true,
          enablePainPoints: true,
          enableOpportunities: true,
          deepAnalysis: false,
        },
      },
      output: {
        format: {
          type: 'structured',
          includeRawData: false,
          includeCharts: false,
          includeMetadata: true,
        },
        sections: {
          summary: true,
          keyFindings: true,
          painPoints: true,
          opportunities: true,
          recommendations: true,
          rawData: false,
          charts: false,
        },
        storage: {
          saveToIndexedDB: true,
          exportToJSON: false,
          retentionDays: 30,
        },
        routing: {
          sendToRuthlessJudge: true,
          ruthlessJudgeMode: 'balanced',
          sendToCouncil: false,
          executionMode: 'parallel',
          notifyOnComplete: true,
          notifyOnError: true,
        },
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // REDDIT FEATURES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'reddit-pain-points',
    name: 'Reddit Pain Point Extractor',
    category: 'reddit',
    description: 'Extracts and analyzes pain points from Reddit discussions to identify market needs',
    icon: '💬',
    enabled: false,
    status: 'inactive',
    metrics: {
      lastRun: null,
      nextRun: null,
      successRate: 0,
      totalRuns: 0,
      reportsGenerated: 0,
      averageExecutionTime: 0,
    },
    defaultConfig: {
      featureId: 'reddit-pain-points',
      featureName: 'Reddit Pain Point Extractor',
      enabled: false,
      runMode: 'manual',
      limits: {
        maxRunTime: 300,
        maxAPIRequests: 100,
        maxDataPoints: 100,
        retryAttempts: 3,
        cooldownPeriod: 3600,
      },
      targets: {
        reddit: {
          subreddits: [
            'entrepreneur',
            'startups',
            'SaaS',
            'Entrepreneur',
            'smallbusiness',
            'digitalnomad',
            'SideProject',
          ],
          sortBy: 'hot',
          timeRange: 'week',
          minUpvotes: 10,
          minComments: 5,
          keywords: [
            'problem',
            'issue',
            'frustrated',
            'wish',
            'need',
            'struggle',
            'annoying',
            'pain point',
            'difficult',
          ],
          excludeKeywords: ['spam', 'promotion', 'advertisement'],
        },
        niches: {
          primary: 'SaaS & Online Business',
          keywords: ['productivity', 'automation', 'tools', 'software', 'business'],
          excludedKeywords: ['crypto', 'nft', 'gambling', 'adult'],
        },
      },
      processing: {
        filters: {
          minQualityScore: 0.6,
          requireEngagement: true,
          recencyFilter: 14,
          sentimentFilter: 'negative',
        },
        analysis: {
          enableSentiment: true,
          enableTrending: false,
          enablePainPoints: true,
          enableOpportunities: true,
          deepAnalysis: true,
        },
        aiEnhancement: {
          enabled: true,
          model: 'google/gemini-2.0-flash-thinking-exp-1219',
          promptTemplate: 'Analyze these Reddit discussions and extract specific pain points, categorize them, and identify underlying needs.',
          maxTokens: 2000,
        },
      },
      output: {
        format: {
          type: 'structured',
          includeRawData: false,
          includeCharts: false,
          includeMetadata: true,
        },
        sections: {
          summary: true,
          keyFindings: true,
          painPoints: true,
          opportunities: true,
          recommendations: true,
          rawData: false,
          charts: false,
        },
        storage: {
          saveToIndexedDB: true,
          exportToJSON: true,
          retentionDays: 30,
        },
        routing: {
          sendToRuthlessJudge: true,
          ruthlessJudgeMode: 'deep',
          sendToCouncil: true,
          specificExperts: ['ruthless_validator', 'blue_ocean_strategist'],
          executionMode: 'parallel',
          notifyOnComplete: true,
          notifyOnError: true,
        },
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // HYBRID FEATURES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'market-gap-identifier',
    name: 'Market Gap Identifier',
    category: 'hybrid',
    description: 'Combines GitHub and Reddit data to identify underserved market gaps',
    icon: '🎯',
    enabled: false,
    status: 'inactive',
    metrics: {
      lastRun: null,
      nextRun: null,
      successRate: 0,
      totalRuns: 0,
      reportsGenerated: 0,
      averageExecutionTime: 0,
    },
    defaultConfig: {
      featureId: 'market-gap-identifier',
      featureName: 'Market Gap Identifier',
      enabled: false,
      runMode: 'manual',
      limits: {
        maxRunTime: 600,
        maxAPIRequests: 200,
        maxDataPoints: 100,
        retryAttempts: 3,
        cooldownPeriod: 7200,
      },
      targets: {
        github: {
          topics: ['developer-tools', 'saas', 'productivity'],
          languages: ['TypeScript', 'Python'],
          stars: { min: 50, max: 5000 },
        },
        reddit: {
          subreddits: ['entrepreneur', 'SaaS', 'startups', 'indiehackers'],
          sortBy: 'top',
          timeRange: 'month',
          minUpvotes: 20,
          keywords: ['need', 'missing', 'wish existed', 'no solution'],
        },
        niches: {
          primary: 'Developer SaaS',
          keywords: ['automation', 'productivity', 'developer tools', 'workflow'],
          excludedKeywords: ['crypto', 'blockchain', 'gambling'],
        },
      },
      processing: {
        filters: {
          minQualityScore: 0.8,
          requireEngagement: true,
          recencyFilter: 60,
          sentimentFilter: 'all',
        },
        analysis: {
          enableSentiment: true,
          enableTrending: true,
          enablePainPoints: true,
          enableOpportunities: true,
          deepAnalysis: true,
        },
        aiEnhancement: {
          enabled: true,
          model: 'google/gemini-2.0-flash-thinking-exp-1219',
          promptTemplate: 'Analyze GitHub trending data and Reddit discussions to identify market gaps where demand exists but solutions are inadequate or missing.',
          maxTokens: 3000,
        },
      },
      output: {
        format: {
          type: 'mixed',
          includeRawData: true,
          includeCharts: false,
          includeMetadata: true,
        },
        sections: {
          summary: true,
          keyFindings: true,
          painPoints: true,
          opportunities: true,
          recommendations: true,
          rawData: true,
          charts: false,
        },
        storage: {
          saveToIndexedDB: true,
          exportToJSON: true,
          retentionDays: 90,
        },
        routing: {
          sendToRuthlessJudge: true,
          ruthlessJudgeMode: 'deep',
          sendToCouncil: true,
          specificExperts: [
            'blue_ocean_strategist',
            'ruthless_validator',
            'passive_income_architect',
          ],
          executionMode: 'sequential',
          notifyOnComplete: true,
          notifyOnError: true,
        },
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROMPT ENGINEERING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'prompt-heist',
    name: 'The HEIST',
    category: 'intelligence',
    description: 'Import battle-tested prompts from danielmiessler/fabric - 290+ world-class patterns for AI orchestration',
    icon: '🎭',
    enabled: true,
    status: 'active',
    metrics: {
      lastRun: null,
      nextRun: null,
      successRate: 100,
      totalRuns: 0,
      reportsGenerated: 0,
      averageExecutionTime: 0,
    },
    defaultConfig: {
      featureId: 'prompt-heist',
      featureName: 'The HEIST',
      enabled: true,
      runMode: 'manual',
      limits: {
        maxRunTime: 60,
        maxAPIRequests: 30,
        maxDataPoints: 20,
        retryAttempts: 2,
        cooldownPeriod: 86400, // 24 hours
      },
      targets: {
        repository: {
          owner: 'danielmiessler',
          repo: 'fabric',
          branch: 'main',
          path: 'patterns',
        },
        patterns: {
          enabled: [
            'extract_wisdom',
            'analyze_claims',
            'create_summary',
            'find_logical_fallacies',
            'explain_code',
            'improve_writing',
          ],
          categories: ['analysis', 'validation', 'synthesis', 'strategy', 'extraction', 'improvement'],
        },
      },
      processing: {
        autoUpdate: false,
        updateFrequency: 'monthly',
        cacheExpiry: 168, // 7 days in hours
        filters: {
          minPatternLength: 10,
          excludeDeprecated: true,
        },
        attribution: {
          includeSource: true,
          includeLicense: true,
          includeAuthor: true,
        },
      },
      output: {
        format: 'markdown',
        storage: 'local',
        directory: 'prompts/fabric',
        organizeByCategory: true,
        includeMetadata: true,
      },
    },
  },
];

// Helper to get feature by ID
export function getFeatureById(id: string): FeatureDefinition | undefined {
  return FEATURE_DEFINITIONS.find((f) => f.id === id);
}

// Helper to get features by category
export function getFeaturesByCategory(category: string): FeatureDefinition[] {
  return FEATURE_DEFINITIONS.filter((f) => f.category === category);
}

// Helper to get enabled features
export function getEnabledFeatures(): FeatureDefinition[] {
  return FEATURE_DEFINITIONS.filter((f) => f.enabled);
}
