# 🔬 Current Synthesizer vs Audit Findings: Gap Analysis

**Date:** January 9, 2026  
**Files Compared:**
- `/src/lib/synthesis-engine.ts` (Tiered synthesis with ToT)
- `/src/features/council/api/ai-client.ts` (`synthesizeVerdict` function)

---

## 🚨 CRITICAL DISCOVERY

**You have TWO different synthesizers!** They serve different purposes but have overlapping concerns.

### Synthesizer #1: `synthesis-engine.ts`
**Purpose:** Tiered synthesis strategies (Quick/Balanced/Deep)  
**Location:** `/src/lib/synthesis-engine.ts`  
**Status:** ⚠️ Unused in production (prompt-only, no executor)

### Synthesizer #2: `synthesizeVerdict` in `ai-client.ts`  
**Purpose:** Active production synthesis  
**Location:** `/src/features/council/api/ai-client.ts:256-330`  
**Status:** ✅ Currently in use

---

## 📊 Feature-by-Feature Comparison

| Feature | synthesis-engine.ts | synthesizeVerdict | Elite Standard | Winner |
|---------|---------------------|-------------------|----------------|---------|
| **Tiered strategies** | ✅ Quick/Balanced/Deep | ❌ Single fixed prompt | ✅ LangChain has this | Engine |
| **Tree-of-Thought** | ✅ Deep mode has ToT | ❌ None | ❌ Rare, cutting-edge | Engine |
| **Chain-of-Thought** | ✅ Balanced mode | ❌ None | ✅ Standard | Engine |
| **Structured output** | ❌ Raw strings | ❌ Raw strings | ✅ Zod schemas | TIE (both fail) |
| **Retry logic** | ❌ None | ❌ None | ✅ Exponential backoff | TIE (both fail) |
| **Error handling** | ❌ None | ✅ try-catch with status | ⚠️ Needs improvement | Verdict |
| **Cost tracking** | ❌ None | ✅ Calculates cost | ✅ Essential | Verdict |
| **Model selection** | ✅ Configurable | ⚠️ Hardcoded Gemini | ✅ Configurable | Engine |
| **Temperature control** | ✅ Per-tier | ⚠️ Fixed 0.3 | ✅ Configurable | Engine |
| **Custom instructions** | ✅ Supported | ❌ None | ✅ User control | Engine |
| **Execution** | ❌ No executor | ✅ Direct API call | ✅ Must execute | Verdict |

---

## 🎯 Current Synthesizer Deep Dive

### What `synthesizeVerdict` Does RIGHT ✅

```typescript
// 1. Simple, focused prompt structure
const systemPrompt = `You are "The Synthesizer"...
### Consensus Points
### Unique Insights
### Resolved Conflicts
### Unified Recommendation
### Confidence Level`;
```
**Elite Comparison:** ✅ Similar to LangChain's "stuff" strategy  
**Grade:** B+ (clear, but basic)

```typescript
// 2. Cost tracking
const cost = calculateCost(synthesizerModel, promptTokens, completionTokens);
return { verdict, cost };
```
**Elite Comparison:** ✅ Matches AutoGPT's cost awareness  
**Grade:** A

```typescript
// 3. Error handling
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.error?.message || `Synthesis error: ${response.status}`);
}
```
**Elite Comparison:** ⚠️ Basic but functional  
**Grade:** C+ (needs retry logic)

---

### What `synthesizeVerdict` Does WRONG ❌

#### 1. **Hardcoded Model**
```typescript
const synthesizerModel = 'google/gemini-2.0-flash-001'; // 😱 Can't switch
```

**Problem:**
- Gemini down? → Complete failure
- Want to use Claude for better reasoning? → Edit code
- A/B test models? → Impossible

**Elite Standard:**
```typescript
const synthesizerModel = config.model || fallbackModel;
```

**Fix Priority:** ⭐⭐⭐⭐ HIGH

---

#### 2. **Fixed Temperature = One-Size-Fits-All**
```typescript
temperature: 0.3, // Always conservative
```

**Problem:**
- Creative tasks (brainstorming) → Too rigid
- Math/logic tasks → Want 0.0 for accuracy
- No user control

**Elite Standard:**
```typescript
temperature: config.temperature || TIER_DEFAULTS[tier].temperature
```

**Fix Priority:** ⭐⭐⭐ MEDIUM

---

#### 3. **No Retry Logic**
```typescript
const response = await fetch(OPENROUTER_API_URL, { ... });
// Network error? → User sees error page 💥
```

**Problem:**
- Transient network hiccup = complete failure
- Rate limit = no retry with backoff
- 50x error = no fallback model

**Elite Standard:**
```typescript
const response = await fetchWithRetry(url, {
  retries: 3,
  backoff: [1000, 2000, 4000],
  fallbackModel: 'deepseek/deepseek-chat'
});
```

**Fix Priority:** ⭐⭐⭐⭐⭐ CRITICAL

---

#### 4. **No Structured Output**
```typescript
const verdict = data.choices[0]?.message?.content || 'Synthesis failed';
// What if LLM returns malformed markdown? 🤷
```

**Problem:**
- Can't extract parts programmatically (e.g., `result.consensus`)
- Hallucinated sections? → No validation
- Missing "Confidence Level"? → Silent failure

**Elite Standard:**
```typescript
const parser = StructuredOutputParser.fromZodSchema(VerdictSchema);
const verdict = await parser.parse(rawContent);
// ✅ Type-safe, validated output
```

**Fix Priority:** ⭐⭐⭐⭐ HIGH

---

#### 5. **No Weighted Voting**
```typescript
for (const [_expertId, data] of Object.entries(expertOutputs)) {
  userPrompt += `\n### ${data.expertName}\n${data.output}\n`;
}
// All experts treated equally, even if one is hallucinating
```

**Problem:**
- GPT-4 expert = Same weight as cheap model
- Domain specialist = Same weight as generalist
- Confident answer = Same weight as "I'm not sure..."

**Elite Standard:**
```typescript
const weightedOutputs = expertOutputs.map(e => ({
  ...e,
  weight: e.confidence * modelTiers[e.model] * domainRelevance[e.expertise]
}));
```

**Fix Priority:** ⭐⭐⭐⭐ HIGH

---

#### 6. **No Caching**
```typescript
// Same expert outputs → Same synthesis request → $$$
```

**Problem:**
- User clicks "Synthesize" twice → Pays twice
- No semantic deduplication
- Iterative refinement → Wasteful

**Elite Standard:**
```typescript
const cacheKey = hashExpertOutputs(expertOutputs);
if (cache.has(cacheKey) && !forceRefresh) {
  return cache.get(cacheKey);
}
```

**Fix Priority:** ⭐⭐⭐ MEDIUM

---

#### 7. **No Streaming**
```typescript
const response = await fetch(...); // User waits 10-30s 😴
const data = await response.json();
```

**Problem:**
- Long synthesis → Spinner for 30 seconds
- No incremental updates
- Feels broken compared to ChatGPT

**Elite Standard:**
```typescript
const stream = await fetch(..., { stream: true });
for await (const chunk of parseSSE(stream)) {
  yield { delta: chunk.content };
}
```

**Fix Priority:** ⭐⭐ LOW (UX, not correctness)

---

## 🔥 The Brutal Truth

### Current State Grade: **C+ (68/100)**

**What's Good:**
- ✅ Works for basic use cases
- ✅ Tracks costs
- ✅ Clear prompt structure
- ✅ Handles errors (barely)

**What's Missing (vs Elite Repos):**
- ❌ No retry/fallback resilience
- ❌ No structured output validation
- ❌ No weighted voting
- ❌ No tiered strategies (you built them but don't use them!)
- ❌ No caching
- ❌ No streaming
- ❌ Hardcoded model/temperature

---

## 🎯 Unified Architecture Recommendation

**Stop having two synthesizers.** Merge them into one cohesive system:

### Proposed: `UnifiedSynthesizer` Class

```typescript
class UnifiedSynthesizer {
  constructor(
    private config: SynthesisConfig,
    private apiKey: string
  ) {}

  async synthesize(
    expertOutputs: ExpertOutput[],
    task: string,
    tier: SynthesisTier = 'balanced'
  ): Promise<StructuredSynthesis> {
    // 1. Check cache
    const cached = await this.checkCache(expertOutputs, tier);
    if (cached) return cached;

    // 2. Build prompt (from synthesis-engine.ts)
    const promptBuilder = getPromptBuilder(tier);
    const prompt = promptBuilder(expertOutputs, task, this.config.customInstructions);

    // 3. Call API with retry (from ai-client.ts + improvements)
    const result = await this.callWithRetry({
      model: this.config.model,
      fallbackModel: this.config.fallbackModel,
      prompt,
      temperature: SYNTHESIS_TIERS[tier].temperature,
      maxTokens: SYNTHESIS_TIERS[tier].maxTokens
    });

    // 4. Parse structured output
    const parsed = await this.parseOutput(result.content);

    // 5. Validate quality
    const quality = this.validateQuality(parsed);
    if (quality.score < 0.7) {
      return this.retry(expertOutputs, task, 'deep'); // Escalate to deeper tier
    }

    // 6. Cache result
    await this.cache(expertOutputs, tier, parsed);

    return {
      ...parsed,
      cost: result.cost,
      tier,
      quality
    };
  }

  private async callWithRetry(opts: CallOptions): Promise<APIResponse> {
    // Exponential backoff retry logic
    // Falls back to secondary model on repeated failures
  }

  private async parseOutput(content: string): Promise<StructuredSynthesis> {
    // Zod schema validation
    return SynthesisOutputSchema.parse(extractJSON(content));
  }

  private validateQuality(synthesis: StructuredSynthesis): QualityScore {
    // Check: has consensus, has conflicts resolved, is actionable
  }
}
```

---

## 📋 Action Plan: Fix Your Current Synthesizer

### 🔥 THIS WEEK

**1. Add Retry Logic to `synthesizeVerdict`**
```typescript
async function synthesizeVerdictWithRetry(
  expertOutputs: Record<string, { expertName: string; output: string }>,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  maxRetries: number = 3
): Promise<{ verdict: string; cost: number }> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await synthesizeVerdict(expertOutputs, task, mode, apiKey);
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}
```

**2. Make Model Configurable**
```typescript
export async function synthesizeVerdict(
  expertOutputs: Record<string, { expertName: string; output: string }>,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  config?: { model?: string; temperature?: number } // NEW
): Promise<{ verdict: string; cost: number }> {
  const synthesizerModel = config?.model || 'google/gemini-2.0-flash-001';
  const temperature = config?.temperature || 0.3;
  // ... rest
}
```

---

### 🔨 NEXT SPRINT

**3. Add Structured Output Parsing**
```typescript
import { z } from 'zod';

const VerdictSchema = z.object({
  consensus: z.array(z.string()),
  uniqueInsights: z.array(z.object({
    expert: z.string(),
    insight: z.string()
  })),
  resolvedConflicts: z.array(z.string()).optional(),
  recommendation: z.string(),
  confidence: z.number().min(0).max(100)
});

// In synthesizeVerdict:
const verdict = parseVerdict(data.choices[0]?.message?.content);

function parseVerdict(content: string): z.infer<typeof VerdictSchema> {
  try {
    // Extract markdown sections and convert to JSON
    return VerdictSchema.parse({
      consensus: extractSection(content, '### Consensus Points'),
      uniqueInsights: extractInsights(content),
      resolvedConflicts: extractSection(content, '### Resolved Conflicts'),
      recommendation: extractSection(content, '### Unified Recommendation'),
      confidence: extractConfidence(content)
    });
  } catch (error) {
    throw new Error(`Failed to parse verdict: ${error.message}`);
  }
}
```

**4. Integrate Tiered Strategies**
```typescript
// Replace current prompt with synthesis-engine.ts logic
export async function synthesizeVerdict(
  expertOutputs: Record<string, { expertName: string; output: string }>,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  tier: SynthesisTier = 'balanced' // NEW
): Promise<{ verdict: string; cost: number }> {
  const promptBuilder = getPromptBuilder(tier);
  const expertArray = Object.values(expertOutputs).map(e => ({
    name: e.expertName,
    model: 'unknown', // TODO: track model per expert
    content: e.output
  }));
  
  const userPrompt = promptBuilder(expertArray, task, '');
  // ... rest
}
```

---

## 🏆 Expected Outcome

After implementing these fixes, your synthesizer will jump from:

**Current: C+ (68/100)**  
**After Week 1: B (80/100)** (Retry + Config)  
**After Sprint 2: A- (90/100)** (Structured Output + Tiers)

With full unified architecture:  
**A+ (95/100)** - Elite-tier, production-ready

---

## 💡 Key Insight

**You already built the good stuff** (tiered strategies, ToT) in `synthesis-engine.ts`, but you're not using it! Your actual synthesizer in `ai-client.ts` is much simpler.

**Solution:** Either:
1. **Migrate `synthesizeVerdict` to use `synthesis-engine.ts` prompts** (recommended)
2. **Delete `synthesis-engine.ts`** if you don't plan to use it (don't hoard dead code)

Right now you're maintaining two systems that should be one.

---

## 📚 References

Compare your code to:
- **LangChain's CombineDocumentsChain:** [Link](https://github.com/langchain-ai/langchainjs/blob/main/langchain/src/chains/combine_documents)
- **CrewAI's Crew synthesis:** [Link](https://github.com/joaomdmoura/crewAI/blob/main/src/crewai/crew.py)
- **AutoGPT's agent summarization:** [Link](https://github.com/Significant-Gravitas/AutoGPT/blob/master/autogpts/autogpt/autogpt/agents/agent.py)

---

**Bottom Line:** Your current synthesizer is functional but fragile. It's like driving a car with no spare tire—works great until it doesn't. Add retry logic THIS WEEK, then incrementally harden it over the next month.
