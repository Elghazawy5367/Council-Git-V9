export interface AutomationRule {  
  id: string;  
  name: string;  
  description: string;  
  enabled: boolean;  
  trigger: AutomationTrigger;  
  conditions: AutomationCondition[];  
  actions: AutomationAction[];  
  schedule?: CronSchedule;  
  lastRun?: Date;  
  nextRun?: Date;  
}

export interface AutomationTrigger {  
  type: 'schedule' | 'event' | 'webhook' | 'manual';  
  config: Record<string, any>;  
}

export interface AutomationCondition {  
  field: string;  
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'matches';  
  value: any;  
}

export interface AutomationAction {  
  type: 'scan_repository' | 'run_scout' | 'detect_goldmine' | 'send_notification' | 'export_data';  
  config: Record<string, any>;  
}

export interface CronSchedule {  
  expression: string; // e.g., "0 9 * * 1" for every Monday at 9 AM  
  timezone: string;  
}

export const defaultAutomationRules: AutomationRule[] = [  
  {  
    id: 'daily-scout',  
    name: 'Daily Scout Scan',  
    description: 'Run Scout to discover new GitHub opportunities every morning',  
    enabled: true,  
    trigger: {  
      type: 'schedule',  
      config: {  
        cron: '0 9 * * *',  
      }  
    },  
    conditions: [],  
    actions: [  
      {  
        type: 'run_scout',  
        config: {  
          keywords: ['react', 'typescript', 'api'],  
          minStars: 100,  
          maxAge: 30,  
        }  
      },  
      {  
        type: 'send_notification',  
        config: {  
          channel: 'email',  
          subject: 'Daily Scout Results',  
        }  
      }  
    ],  
    schedule: {  
      expression: '0 9 * * *',  
      timezone: 'UTC',  
    }  
  },  
  {  
    id: 'weekly-goldmine',  
    name: 'Weekly Goldmine Detection',  
    description: 'Detect high-value niches with low competition every Monday',  
    enabled: true,  
    trigger: {  
      type: 'schedule',  
      config: {  
        cron: '0 10 * * 1',  
      }  
    },  
    conditions: [  
      {  
        field: 'competition',  
        operator: 'less_than',  
        value: 5,  
      },  
      {  
        field: 'demand',  
        operator: 'greater_than',  
        value: 100,  
      }  
    ],  
    actions: [  
      {  
        type: 'detect_goldmine',  
        config: {  
          categories: ['developer-tools', 'productivity', 'automation'],  
          minDemand: 100,  
          maxCompetition: 5,  
        }  
      },  
      {  
        type: 'export_data',  
        config: {  
          format: 'markdown',  
          destination: 'reports/goldmine',  
        }  
      }  
    ],  
    schedule: {  
      expression: '0 10 * * 1',  
      timezone: 'UTC',  
    }  
  }
];

export const automationConfig = {  
  enabled: true,  
  maxConcurrentRuns: 3,  
  retryAttempts: 3,  
  retryDelay: 5000,  
  timeout: 300000,  
  logging: {  
    enabled: true,  
    level: 'info' as 'debug' | 'info' | 'warn' | 'error',  
    destination: 'console' as 'console' | 'file' | 'both',  
  },  
  notifications: {  
    onSuccess: true,  
    onFailure: true,  
    channels: ['email'] as ('email' | 'slack' | 'webhook')[],  
  },  
};

export const createAutomationRule = (partial: Partial<AutomationRule>): AutomationRule => {  
  return {  
    id: crypto.randomUUID(),  
    name: partial.name || 'New Automation',  
    description: partial.description || '',  
    enabled: partial.enabled ?? true,  
    trigger: partial.trigger || { type: 'manual', config: {} },  
    conditions: partial.conditions || [],  
    actions: partial.actions || [],  
    schedule: partial.schedule,  
    ...partial,  
  };  
};

export const validateCronExpression = (expression: string): boolean => {  
  const cronRegex = /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([01]?\d|2\d|3[01])) (\*|([1-9]|1[0-2])) (\*|[0-6])$/;  
  return cronRegex.test(expression);  
};

export const getNextRunTime = (schedule: CronSchedule): Date => {  
  const now = new Date();  
  const nextRun = new Date(now);  
  nextRun.setDate(nextRun.getDate() + 1);  
  return nextRun;  
};

export const executeAutomation = async (rule: AutomationRule): Promise<void> => {  
  console.log(`Executing automation: ${rule.name}`);  
  try {  
    const conditionsMet = rule.conditions.every(condition => {  
      return true;  
    });

    if (!conditionsMet) {  
      console.log('Conditions not met, skipping execution');  
      return;  
    }

    for (const action of rule.actions) {  
      await executeAction(action);  
    }

    console.log(`Automation completed: ${rule.name}`);  
  } catch (error) {  
    console.error(`Automation failed: ${rule.name}`, error);  
    throw error;  
  }  
};

const executeAction = async (action: AutomationAction): Promise<void> => {  
  console.log(`Executing action: ${action.type}`);  
  switch (action.type) {  
    case 'run_scout':  
      break;  
    case 'detect_goldmine':  
      break;  
    case 'scan_repository':  
      break;  
    case 'send_notification':  
      break;  
    case 'export_data':  
      break;  
    default:  
      throw new Error(`Unknown action type: ${action.type}`);  
  }  
};

export default {  
  defaultAutomationRules,  
  automationConfig,  
  createAutomationRule,  
  validateCronExpression,  
  getNextRunTime,  
  executeAutomation,  
};