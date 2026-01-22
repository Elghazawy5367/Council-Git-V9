# 🎭 The HEIST - Quick Start Guide

## What is The HEIST?

**The HEIST** is The Council's prompt engineering exploitation system that imports 290+ battle-tested prompt patterns from [danielmiessler/fabric](https://github.com/danielmiessler/fabric) (MIT License).

Instead of reinventing the wheel, The HEIST "borrows" world-class prompts from one of the most popular prompt pattern repositories on GitHub.

---

## 🚀 Quick Start

### 1. Enable The HEIST

**Option A: Via Dropdown**
1. Click the **Features** dropdown in the navbar
2. Find **🎭 The HEIST** in the Intelligence Layer
3. Toggle it **ON**

**Option B: Via Dashboard**
1. Navigate to `/features` page
2. Find the **🎭 The HEIST** card
3. Click **Settings** to configure

### 2. Configure Your Patterns

1. Open the Configuration Center
2. Select the **🎭 HEIST** tab
3. Customize your settings:
   - ✅ **Auto-Update**: Enable for automatic updates
   - 📅 **Update Frequency**: Daily/Weekly/Monthly
   - ⏰ **Cache Expiry**: How long to cache patterns (default: 7 days)
   - 📚 **Categories**: Select pattern categories to use
   - 🎯 **Patterns**: Choose specific patterns to enable

### 3. Use the Patterns

**Via CLI** (Recommended for first run):
```bash
# Download all configured patterns
npm run heist

# Update existing patterns
npm run heist:update

# Test the system
npm run test:heist
```

**Via Code**:
```typescript
import { loadPrompt, enhancePrompt } from '@/lib/prompt-heist';

// Load a specific pattern
const wisdom = await loadPrompt('extract_wisdom');

// Enhance a Council expert's prompt
const enhanced = await enhancePrompt(
  'You are a strategic advisor',
  ['extract_wisdom', 'analyze_claims']
);
```

---

## 📚 Available Categories

### Analysis (Default: ✅)
Deep analytical prompts for comprehensive examination
- `analyze_claims` - Fact-checking and verification
- `analyze_paper` - Academic paper analysis
- `analyze_debate` - Debate analysis and argument mapping

### Validation (Default: ✅)
Verification and fact-checking patterns
- `find_logical_fallacies` - Detect reasoning errors
- `check_agreement` - Agreement analysis
- `rate_content` - Quality assessment

### Synthesis (Default: ✅)
Information consolidation and summarization
- `create_summary` - Generate concise summaries
- `extract_wisdom` - Extract key insights
- `extract_ideas` - Idea extraction and clustering

### Strategy
Planning and decision-making patterns
- `create_strategy` - Strategic planning
- `create_markmap` - Mind mapping
- `create_investigation_visualization` - Investigation flows

### Extraction
Data and insight extraction patterns
- `extract_article_wisdom` - Article insights
- `extract_book_ideas` - Book concept extraction
- `extract_patterns` - Pattern recognition

### Improvement
Content enhancement and refinement
- `improve_writing` - Writing enhancement
- `improve_prompt` - Prompt optimization
- `improve_academic_writing` - Academic polish

---

## 🎯 Most Popular Patterns

### extract_wisdom (60 lines)
Extract key insights, quotes, habits, facts, and recommendations from content.

**Use Case**: Distilling long-form content into actionable insights

**Output Sections**:
- Summary
- Ideas
- Insights
- Quotes
- Habits
- Facts
- References
- Recommendations

### analyze_claims (51 lines)
Verify factual claims with rating, reasoning, and evidence.

**Use Case**: Fact-checking content for accuracy

**Output Format**:
- Claim statement
- Truth rating (0-10)
- Reasoning
- Supporting evidence
- Contradicting evidence

### create_summary (42 lines)
Generate concise summaries with 5-word headline and one-sentence summary.

**Use Case**: Quick content distillation

**Output**:
- 5-word headline
- One-sentence summary
- Main points (5 bullets)
- Key takeaways

### find_logical_fallacies (230 lines)
Detect 50+ types of logical fallacies in arguments.

**Use Case**: Argument quality assessment

**Fallacy Categories**:
- Formal fallacies
- Informal fallacies
- Emotional appeals
- Distraction tactics
- Statistical manipulation

### explain_code (35 lines)
Break down code into understandable explanations.

**Use Case**: Code documentation and learning

**Output**:
- Purpose explanation
- Step-by-step breakdown
- Key concepts
- Use cases

---

## ⚙️ Configuration Options

### Auto-Update
- **Enabled**: Patterns update automatically
- **Disabled**: Manual updates only (recommended for stability)

### Update Frequency
- **Daily**: Fresh patterns every day (high bandwidth)
- **Weekly**: Updated weekly (balanced)
- **Monthly**: Updated monthly (stable, recommended)

### Cache Expiry
- **Range**: 1-720 hours
- **Default**: 168 hours (7 days)
- **Recommendation**: 7-14 days for balance of freshness and performance

### Pattern Selection
- **All Categories**: Maximum versatility
- **Selected Categories**: Focused use cases
- **Specific Patterns**: Minimal footprint, maximum control

---

## 🔧 Advanced Usage

### Hybrid Prompts
Combine Fabric patterns with Council experts:

```typescript
import { getEnhancedBlueOceanPrompt } from '@/lib/prompt-heist-examples';

// Blue Ocean Strategist + extract_wisdom
const prompt = await getEnhancedBlueOceanPrompt();

// Use with Council execution
const result = await callExpert({
  role: 'Blue Ocean Strategist',
  persona: prompt,
  model: 'anthropic/claude-opus',
  // ... other config
});
```

### Multi-Pattern Synthesis
Combine multiple patterns for comprehensive analysis:

```typescript
import { synthesizeWithMultiplePatterns } from '@/lib/prompt-heist-examples';

const result = await synthesizeWithMultiplePatterns(
  yourInputText,
  ['extract_wisdom', 'analyze_claims', 'find_logical_fallacies']
);

console.log(result.wisdom);     // Key insights
console.log(result.claims);     // Fact-checked claims
console.log(result.fallacies);  // Logical errors
```

### Pattern Metadata
Access pattern metadata for dynamic usage:

```typescript
import { PromptVault } from '@/lib/prompt-heist';

const vault = new PromptVault();
const metadata = vault.getPatternMetadata('extract_wisdom');

console.log(metadata.category);     // 'analysis'
console.log(metadata.lines);        // 60
console.log(metadata.cachedAt);     // timestamp
```

---

## 📂 File Structure

```
prompts/
└── fabric/                    # Downloaded patterns
    ├── analysis/
    │   ├── analyze_claims.md
    │   ├── analyze_paper.md
    │   └── extract_wisdom.md
    ├── validation/
    │   ├── find_logical_fallacies.md
    │   └── rate_content.md
    ├── synthesis/
    │   ├── create_summary.md
    │   └── extract_ideas.md
    ├── strategy/
    │   └── create_strategy.md
    ├── extraction/
    │   └── extract_patterns.md
    └── improvement/
        ├── improve_writing.md
        └── improve_prompt.md
```

---

## 🛠️ CLI Commands

### Primary Commands
```bash
# Download/update all configured patterns
npm run heist

# Update existing patterns (force refresh)
npm run heist:update

# Test the HEIST system
npm run test:heist
```

### Custom Downloads
```bash
# Run the script directly with custom options
npx tsx scripts/heist-prompts.ts
```

---

## 📊 Pattern Stats

### Current Collection
- **Total Patterns**: 20 downloaded
- **Total Lines**: 1,716 lines of battle-tested prompts
- **Categories**: 6 (analysis, validation, synthesis, strategy, extraction, improvement)
- **License**: MIT (danielmiessler/fabric)
- **Update Status**: Local cache with 7-day expiry

### Repository Stats (fabric)
- **Stars**: ~50,000+
- **Patterns**: 290+ available
- **Community**: Active development
- **Quality**: Elite repository standards

---

## 💡 Pro Tips

### Tip #1: Start with Defaults
The default configuration (3 patterns, 3 categories) is optimized for:
- Quick setup
- Low bandwidth
- High impact

### Tip #2: Cache Management
- Keep cache expiry at 7 days for most use cases
- Increase to 14-30 days for stability
- Decrease to 1-3 days for bleeding-edge updates

### Tip #3: Pattern Pairing
Best pattern combinations:
- **Research**: `extract_wisdom` + `analyze_claims` + `create_summary`
- **Validation**: `analyze_claims` + `find_logical_fallacies`
- **Content Creation**: `create_summary` + `improve_writing`
- **Code Review**: `explain_code` + `rate_content`

### Tip #4: Category Focus
Choose categories based on use case:
- **Business Analysis**: Analysis + Strategy
- **Content Review**: Validation + Improvement
- **Research**: Analysis + Extraction + Synthesis

### Tip #5: Auto-Update Strategy
- **Development**: Disable auto-update, manual control
- **Production**: Enable monthly auto-update
- **Testing**: Enable weekly for latest patterns

---

## 🐛 Troubleshooting

### Patterns Not Loading
1. Check internet connection
2. Run `npm run heist` manually
3. Verify `prompts/fabric/` directory exists
4. Check cache expiry settings

### Cache Issues
```bash
# Clear cache and re-download
rm -rf prompts/fabric/
npm run heist
```

### Permission Errors
```bash
# Ensure write permissions
chmod -R 755 prompts/
npm run heist
```

### GitHub Rate Limiting
The HEIST includes polite delays (1 second between requests) to avoid rate limiting.  
If you hit limits:
- Wait 1 hour
- Use GitHub API token (set in vault)
- Reduce pattern count

---

## 🔗 Resources

### Documentation
- **Main Guide**: [THE HEIST Guide](../🎯%20THE%20HEIST%20-%20Prompt%20Engineering%20Exploit%20Guide.md)
- **Integration Report**: [HEIST_INTEGRATION_COMPLETE.md](./HEIST_INTEGRATION_COMPLETE.md)
- **Visual Guide**: [HEIST_UI_VISUAL_GUIDE.md](./HEIST_UI_VISUAL_GUIDE.md)
- **Execution Report**: [HEIST_EXECUTION_COMPLETE.md](./HEIST_EXECUTION_COMPLETE.md)

### Code References
- **Loader System**: [src/lib/prompt-heist.ts](../src/lib/prompt-heist.ts)
- **Automation Script**: [scripts/heist-prompts.ts](../scripts/heist-prompts.ts)
- **Usage Examples**: [src/lib/prompt-heist-examples.ts](../src/lib/prompt-heist-examples.ts)
- **Store Config**: [src/features/council/store/feature-config-store.ts](../src/features/council/store/feature-config-store.ts)

### External Links
- **Fabric Repository**: https://github.com/danielmiessler/fabric
- **MIT License**: https://opensource.org/licenses/MIT

---

## ✨ Next Steps

1. ✅ **Enable The HEIST** via dropdown or dashboard
2. ✅ **Run Initial Download**: `npm run heist`
3. ✅ **Test a Pattern**: `npm run test:heist`
4. ✅ **Configure Preferences**: Select categories and patterns
5. ✅ **Integrate with Council**: Use patterns in expert prompts
6. ✅ **Monitor Usage**: Track which patterns work best
7. ✅ **Adjust Configuration**: Refine based on results

---

**Welcome to The HEIST!** 🎭  
*Where elite prompts meet AI orchestration.*

---

*Last Updated: January 7, 2026*  
*The Council - Intelligence Layer*
