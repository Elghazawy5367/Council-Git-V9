import { describe, it, expect } from 'vitest';
import { 
  calculateExpertWeights, 
  calculateWeightedAverage,
  normalizeWeights 
} from '@/lib/expert-weights';
import { SAMPLE_EXPERT_RESPONSES } from '../fixtures/sample-responses';

describe('Expert Weights', () => {
  describe('calculateExpertWeights', () => {
    it('should calculate weights based on model quality', () => {
      const responses = SAMPLE_EXPERT_RESPONSES;
      const weights = calculateExpertWeights(responses);

      expect(weights).toHaveLength(3);
      
      // GPT-4 should have highest weight (1.0 model score)
      const gpt4Weight = weights.find(w => w.expertId === '1');
      expect(gpt4Weight).toBeDefined();
      expect(gpt4Weight!.factors.modelQuality).toBeGreaterThan(0.9);
      
      // Weights should be normalized (sum to 1)
      const totalWeight = weights.reduce((sum, w) => sum + w.normalizedWeight, 0);
      expect(totalWeight).toBeCloseTo(1.0, 2);
    });

    it('should factor in confidence scores', () => {
      const highConfidence = {
        expertId: '1',
        expertName: 'Confident Expert',
        model: 'openai/gpt-4',
        output: 'High quality output with confidence: 95%',
        confidence: 0.95,
      };

      const lowConfidence = {
        expertId: '2',
        expertName: 'Uncertain Expert',
        model: 'openai/gpt-4',
        output: 'Uncertain output with confidence: 50%',
        confidence: 0.50,
      };

      const weights = calculateExpertWeights([highConfidence, lowConfidence]);
      
      const highWeight = weights.find(w => w.expertId === '1');
      const lowWeight = weights.find(w => w.expertId === '2');
      
      expect(highWeight!.weight).toBeGreaterThan(lowWeight!.weight);
    });

    it('should handle unknown models with default scores', () => {
      const unknownModel = {
        expertId: '1',
        expertName: 'Unknown Model',
        model: 'unknown/model',
        output: 'Output from unknown model',
      };

      const weights = calculateExpertWeights([unknownModel]);
      
      expect(weights).toHaveLength(1);
      expect(weights[0].factors.modelQuality).toBeGreaterThan(0);
    });
  });

  describe('normalizeWeights', () => {
    it('should normalize weights to sum to 1', () => {
      const weights = [
        { expertId: '1', weight: 10 },
        { expertId: '2', weight: 20 },
        { expertId: '3', weight: 30 },
      ];

      const normalized = normalizeWeights(weights);
      const sum = normalized.reduce((acc, w) => acc + w.normalizedWeight, 0);

      expect(sum).toBeCloseTo(1.0, 5);
      expect(normalized[0].normalizedWeight).toBeCloseTo(10/60, 5);
      expect(normalized[1].normalizedWeight).toBeCloseTo(20/60, 5);
      expect(normalized[2].normalizedWeight).toBeCloseTo(30/60, 5);
    });

    it('should handle single weight', () => {
      const weights = [{ expertId: '1', weight: 5 }];
      const normalized = normalizeWeights(weights);

      expect(normalized[0].normalizedWeight).toBe(1.0);
    });

    it('should handle zero weights gracefully', () => {
      const weights = [
        { expertId: '1', weight: 0 },
        { expertId: '2', weight: 0 },
      ];

      const normalized = normalizeWeights(weights);
      
      // Should assign equal weights when all are zero
      expect(normalized[0].normalizedWeight).toBeCloseTo(0.5, 2);
      expect(normalized[1].normalizedWeight).toBeCloseTo(0.5, 2);
    });
  });

  describe('calculateWeightedAverage', () => {
    it('should calculate weighted average correctly', () => {
      const values = [
        { value: 10, weight: 0.5 },
        { value: 20, weight: 0.3 },
        { value: 30, weight: 0.2 },
      ];

      const avg = calculateWeightedAverage(values);
      const expected = (10 * 0.5) + (20 * 0.3) + (30 * 0.2);

      expect(avg).toBeCloseTo(expected, 5);
    });

    it('should handle single value', () => {
      const values = [{ value: 42, weight: 1.0 }];
      const avg = calculateWeightedAverage(values);

      expect(avg).toBe(42);
    });
  });
});
