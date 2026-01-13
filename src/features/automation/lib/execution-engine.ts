import type { FeatureReport, ExecutionResult, FeatureConfiguration } from '../types/feature.types';
import { useFeaturesStore } from '../store/features-store';
import { useReportsStore } from '../store/reports-store';

type FeatureExecutor = (executionId: string, config: FeatureConfiguration) => Promise<FeatureReport>;

// Map of feature executors - will be populated as features are implemented
const FEATURE_EXECUTORS: Record<string, FeatureExecutor> = {};

export class ExecutionEngine {
  /**
   * Execute a feature and return the result
   */
  async executeFeature(featureId: string): Promise<ExecutionResult> {
    const featuresStore = useFeaturesStore.getState();
    const reportsStore = useReportsStore.getState();
    
    const feature = featuresStore.getFeature(featureId);
    
    if (!feature) {
      throw new Error(`Feature ${featureId} not found`);
    }

    if (!feature.enabled) {
      throw new Error(`Feature ${featureId} is disabled`);
    }

    const executor = FEATURE_EXECUTORS[featureId];
    
    if (!executor) {
      throw new Error(`No executor found for feature ${featureId}`);
    }

    // Start execution
    const executionId = featuresStore.startExecution(featureId);
    
    try {
      // Update progress
      featuresStore.updateExecutionProgress(executionId, 10, 'Initializing');

      // Execute the feature
      featuresStore.updateExecutionProgress(executionId, 30, 'Fetching data');
      const report = await executor(executionId, feature.defaultConfig);

      // Store the report
      featuresStore.updateExecutionProgress(executionId, 80, 'Processing report');
      reportsStore.addReport(report);

      // Route to Ruthless Judge if configured
      if (feature.defaultConfig.output.routing.sendToRuthlessJudge) {
        featuresStore.updateExecutionProgress(executionId, 90, 'Sending to Ruthless Judge');
        await this.routeToRuthlessJudge(report, feature.defaultConfig);
      }

      // Route to Council if configured
      if (feature.defaultConfig.output.routing.sendToCouncil) {
        featuresStore.updateExecutionProgress(executionId, 95, 'Sending to Council');
        await this.routeToCouncil(report, feature.defaultConfig);
      }

      // Complete execution
      const result: ExecutionResult = {
        featureId,
        executionId,
        status: 'success',
        report,
        executionTime: report.executionTime,
        timestamp: report.timestamp,
      };

      featuresStore.completeExecution(result);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      featuresStore.failExecution(executionId, errorMessage);

      return {
        featureId,
        executionId,
        status: 'failed',
        error: errorMessage,
        executionTime: Date.now() - Date.parse(new Date().toISOString()),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Execute multiple features in parallel
   */
  async executeMultiple(featureIds: string[]): Promise<ExecutionResult[]> {
    const promises = featureIds.map((id) => this.executeFeature(id));
    return Promise.allSettled(promises).then((results) =>
      results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            featureId: featureIds[index],
            executionId: `failed-${Date.now()}`,
            status: 'failed' as const,
            error: result.reason?.message || 'Unknown error',
            executionTime: 0,
            timestamp: new Date(),
          };
        }
      })
    );
  }

  /**
   * Start all enabled features
   */
  async startAll(): Promise<ExecutionResult[]> {
    const featuresStore = useFeaturesStore.getState();
    const enabledFeatures = featuresStore.getActiveFeatures();
    const featureIds = enabledFeatures.map((f) => f.id);
    return this.executeMultiple(featureIds);
  }

  /**
   * Route report to Ruthless Judge for validation
   */
  private async routeToRuthlessJudge(
    report: FeatureReport,
    config: FeatureConfiguration
  ): Promise<void> {
    const reportsStore = useReportsStore.getState();
    
    // Mark as processed (routing not yet implemented)
    reportsStore.updateReport(report.id, {
      processing: {
        ...report.processing,
        ruthlessJudgeProcessed: false,
      },
    });
  }

  /**
   * Route report to Council for expert analysis
   */
  private async routeToCouncil(
    report: FeatureReport,
    config: FeatureConfiguration
  ): Promise<void> {
    const reportsStore = useReportsStore.getState();
    
    // Mark as processed (routing not yet implemented)
    reportsStore.updateReport(report.id, {
      processing: {
        ...report.processing,
        sentToCouncil: false,
      },
    });
  }
}

// Singleton instance
export const executionEngine = new ExecutionEngine();
