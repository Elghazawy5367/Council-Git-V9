# Testing Guide - The Council

Complete testing strategy focused on unique business logic only.

## Overview

This testing suite focuses exclusively on **The Council's unique business logic**, specifically excluding:
- ❌ UI components (tested by library)
- ❌ State management patterns (Zustand library)
- ❌ React Query hooks (library patterns)
- ❌ Router logic (React Router)
- ❌ Styling (Tailwind CSS)

**What we DO test:**
- ✅ Ruthless Judge algorithm
- ✅ Persona system
- ✅ Synthesis engine
- ✅ Expert weighting
- ✅ Report generation logic

---

## Installation

```bash
# Install test dependencies (already done)
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 happy-dom
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch

# Run with UI
npm run test:ui

# Run specific test file
npm test expert-weights

# Run specific suite
npm test -- --grep="Expert Weights"
```

### Advanced Options

```bash
# Run tests matching pattern
npm test -- --run --reporter=verbose

# Update snapshots
npm test -- --update

# Bail on first failure
npm test -- --bail

# Show execution time
npm test -- --reporter=verbose --run
```

---

## Test Structure

```
tests/
├── setup.ts                          # Global test setup
├── fixtures/
│   ├── sample-responses.ts           # Expert responses
│   ├── sample-personas.ts            # Persona configurations
│   └── sample-reports.ts             # Report test data
├── unit/
│   ├── expert-weights.test.ts        # Weight calculations
│   ├── synthesis-engine.test.ts      # Synthesis strategies
│   ├── ruthless-judge.test.ts        # Basic judging
│   ├── ruthless-judge-enhanced.test.ts # Voting methods
│   ├── persona-library.test.ts       # Persona system
│   └── reports/
│       ├── engine.test.ts            # Report engine
│       ├── analysis.test.ts          # Intelligence analysis
│       └── generators.test.ts        # Format generation
├── integration/
│   ├── synthesis-flow.test.ts        # E2E synthesis
│   ├── consensus-scenarios.test.ts   # Multi-expert consensus
│   └── report-pipeline.test.ts       # Report generation flow
└── helpers/
    └── test-utils.ts                 # Shared utilities
```

---

## Writing Tests

### Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ModuleName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('functionName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = createTestInput();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.property).toBe(expectedValue);
    });

    it('should handle edge case', () => {
      // Test edge cases
    });

    it('should throw error for invalid input', () => {
      expect(() => functionUnderTest(null)).toThrow();
    });
  });
});
```

### Best Practices

**1. Clear Test Names**
```typescript
// ✅ Good
it('should calculate normalized weights summing to 1.0')

// ❌ Bad
it('works correctly')
```

**2. Arrange-Act-Assert Pattern**
```typescript
it('should calculate expert weights', () => {
  // Arrange: Set up test data
  const responses = SAMPLE_EXPERT_RESPONSES;
  
  // Act: Execute the function
  const weights = calculateExpertWeights(responses);
  
  // Assert: Verify results
  expect(weights).toHaveLength(3);
  expect(weights[0].weight).toBeGreaterThan(0);
});
```

**3. Test One Thing**
```typescript
// ✅ Good: Single responsibility
it('should normalize weights to sum to 1')
it('should handle zero weights gracefully')

// ❌ Bad: Multiple responsibilities
it('should normalize weights and handle edge cases')
```

**4. Use Fixtures**
```typescript
// Use shared test data
import { SAMPLE_EXPERT_RESPONSES } from '../fixtures/sample-responses';

it('should process sample responses', () => {
  const result = process(SAMPLE_EXPERT_RESPONSES);
  expect(result).toBeDefined();
});
```

**5. Test Edge Cases**
```typescript
describe('edge cases', () => {
  it('should handle empty array')
  it('should handle null input')
  it('should handle undefined values')
  it('should handle very large numbers')
  it('should handle very small numbers')
  it('should handle special characters')
});
```

---

## Module-Specific Testing

### 1. Expert Weights

**File:** `tests/unit/expert-weights.test.ts`

**What to test:**
- Weight calculation based on model quality
- Confidence factor incorporation
- Weight normalization (sum to 1)
- Weighted average computation
- Edge cases (unknown models, zero weights)

**Example:**
```typescript
it('should prioritize higher quality models', () => {
  const gpt4Response = { model: 'openai/gpt-4', ... };
  const llamaResponse = { model: 'meta-llama/llama-3.1-8b', ... };
  
  const weights = calculateExpertWeights([gpt4Response, llamaResponse]);
  
  const gpt4Weight = weights.find(w => w.expertId === gpt4Response.expertId);
  const llamaWeight = weights.find(w => w.expertId === llamaResponse.expertId);
  
  expect(gpt4Weight.weight).toBeGreaterThan(llamaWeight.weight);
});
```

### 2. Synthesis Engine

**File:** `tests/unit/synthesis-engine.test.ts`

**What to test:**
- Strategy selection (quick, balanced, deep)
- Score calculation (accuracy, completeness, conciseness)
- Conflict detection
- Quality metrics
- Temperature and token settings

**Example:**
```typescript
it('should select deep strategy for high quality', () => {
  const strategy = selectSynthesisStrategy('deep');
  
  expect(strategy.temperature).toBeGreaterThan(0.7);
  expect(strategy.maxTokens).toBeGreaterThan(2000);
  expect(strategy.mode).toBe('deep');
});
```

### 3. Ruthless Judge

**File:** `tests/unit/ruthless-judge.test.ts` & `ruthless-judge-enhanced.test.ts`

**What to test:**
- Basic judging flow
- Iterative refinement
- Convergence detection
- Voting methods (Condorcet, Borda, Approval)
- Conflict resolution
- Explanation generation

**Example:**
```typescript
it('should use weighted voting for synthesis', async () => {
  const responses = SAMPLE_EXPERT_RESPONSES;
  
  const result = await judge.judge(responses, {
    synthesisStrategy: 'weighted',
    confidenceWeighting: 'sigmoid',
  });
  
  expect(result.votingResults).toBeDefined();
  expect(result.votingResults.strategy).toBe('weighted');
});
```

### 4. Persona System

**File:** `tests/unit/persona-library.test.ts`

**What to test:**
- Persona creation
- Validation rules
- Team presets
- Expert configuration
- Customization

**Example:**
```typescript
it('should create valid persona configuration', () => {
  const persona = createPersona({
    name: 'Strategic Thinker',
    role: 'Strategy',
    expertise: ['business', 'planning'],
  });
  
  expect(persona).toBeDefined();
  expect(persona.name).toBe('Strategic Thinker');
  expect(persona.role).toBe('Strategy');
});
```

### 5. Report Generation

**Files:** `tests/unit/reports/*.test.ts`

**What to test:**
- Template rendering (MD, JSON, PDF, DOCX)
- Data transformation
- Analysis algorithms
- Format generation
- Token counting

**Example:**
```typescript
it('should generate markdown report', async () => {
  const data = SAMPLE_REPORT_DATA;
  
  const report = await generateReport(data, {
    format: 'markdown',
    template: 'default',
  });
  
  expect(report).toContain('# Intelligence Report');
  expect(report).toContain('## Opportunities');
});
```

---

## Integration Tests

### End-to-End Synthesis Flow

```typescript
describe('Synthesis Flow Integration', () => {
  it('should complete full synthesis pipeline', async () => {
    // 1. Create task
    const task = createTask('Explain neural networks');
    
    // 2. Query experts
    const responses = await queryExperts(task);
    
    // 3. Run judge synthesis
    const synthesis = await judge.judge(responses);
    
    // 4. Verify output
    expect(synthesis.unifiedResponse).toBeDefined();
    expect(synthesis.unifiedResponse.length).toBeGreaterThan(100);
  });
});
```

### Consensus Scenarios

```typescript
describe('Consensus Scenarios', () => {
  it('should handle agreement between experts', async () => {
    const responses = SAMPLE_CONSENSUS_RESPONSES;
    const result = await judge.judge(responses);
    
    expect(result.consensusLevel).toBeGreaterThan(0.8);
  });

  it('should resolve conflicts between experts', async () => {
    const responses = SAMPLE_CONFLICTING_RESPONSES;
    const result = await judge.judge(responses, {
      synthesisStrategy: 'condorcet',
    });
    
    expect(result.conflictsResolved).toBeGreaterThan(0);
  });
});
```

---

## Coverage Reports

### Generate Coverage

```bash
# Generate HTML coverage report
npm run test:coverage

# View coverage report
open coverage/index.html
```

### Coverage Targets

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 75%
- **Statements:** 80%

### Interpreting Coverage

**Green (> 80%):** Well tested ✅
**Yellow (60-80%):** Needs more tests ⚠️
**Red (< 60%):** Critical gaps ❌

---

## Continuous Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Troubleshooting

### Common Issues

**1. Tests timing out**
```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

**2. Module not found**
```bash
# Check path aliases in vitest.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  }
}
```

**3. Coverage not calculating**
```bash
# Ensure files are in coverage.include array
coverage: {
  include: ['src/services/ruthless-judge*.ts'],
}
```

**4. Tests failing randomly**
```typescript
// Use beforeEach/afterEach for cleanup
beforeEach(() => {
  // Reset state
});
```

---

## Best Practices Summary

1. ✅ **Test business logic only** - Not UI or library code
2. ✅ **One assertion per test** - Clear, focused tests
3. ✅ **Use descriptive names** - Tests as documentation
4. ✅ **Test edge cases** - Null, undefined, empty, extreme values
5. ✅ **Use fixtures** - Reusable test data
6. ✅ **Mock external calls** - Fast, reliable tests
7. ✅ **Maintain > 80% coverage** - Quality assurance
8. ✅ **Run tests before commit** - Catch issues early

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Test Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)

---

**Last Updated:** February 4, 2026  
**Status:** Complete ✅  
**Coverage Target:** 80%+
