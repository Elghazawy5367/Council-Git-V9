# Fabric Patterns - Heisted from danielmiessler/fabric

**License:** MIT  
**Source:** https://github.com/danielmiessler/fabric  
**Last Updated:** 2026-01-22T13:46:47.694Z

---

## Pattern Categories

### Analysis
*Market Research, Insight Extraction, Blue Ocean Discovery*

- **extract_wisdom**: Extract surprising insights, ideas, quotes, and recommendations from any content
- **analyze_tech_impact**: Evaluate technology projects for societal impact and strategic positioning
- **find_hidden_message**: Uncover concealed meanings, implications, and hidden agendas in content
- **analyze_paper**: Analyze research papers for findings, rigor, and quality assessment

### Validation
*Fact-Checking, Claim Analysis, Quality Scoring*

- **analyze_claims**: Fact-check claims with evidence, counter-arguments, and confidence scoring
- **find_logical_fallacies**: Identify and analyze logical fallacies to evaluate argument validity
- **analyze_product_feedback**: Process user feedback to identify themes and prioritize insights
- **rate_content**: Quality scoring system for evaluating content value and relevance

### Synthesis
*Summarization, Writing Enhancement, Idea Organization*

- **create_summary**: Create concise summaries with main points and key takeaways
- **improve_writing**: Enhance writing quality, clarity, and professional polish
- **create_idea_compass**: Organize thoughts analyzing definitions, evidence, relationships, implications

### Strategy
*Risk Assessment, Competitive Analysis, Strategic Planning*

- **create_stride_threat_model**: Security and risk assessment using STRIDE framework
- **analyze_candidates**: Compare competitive positioning and strategic differentiation
- **prepare_7s_strategy**: McKinsey 7S strategic framework analysis

### Extraction
*Data Mining, Business Intelligence, Prediction Analysis*

- **extract_insights**: Extract powerful insights about life, technology, and business
- **extract_predictions**: Identify predictions, claims, confidence levels, and verification methods
- **extract_recommendations**: Extract actionable recommendations organized for implementation
- **extract_business_ideas**: Extract and elaborate on business opportunities with differentiators

### Improvement
*Prompt Engineering, Writing Enhancement, Quality Improvement*

- **improve_prompt**: Enhance AI prompts for clarity, specificity, and effectiveness
- **improve_academic_writing**: Enhance academic writing quality and scholarly rigor

---

## Usage in The Council

### Integration Example:

```typescript
import { promptVault } from '@/lib/prompt-heist';

// Load a fabric pattern
const wisdomPrompt = await promptVault.loadPrompt('extract_wisdom');

// Combine with Council context
const councilPrompt = `${wisdomPrompt}

---

COUNCIL CONTEXT:
Apply this pattern to Blue Ocean market analysis.
Focus on identifying untapped opportunities and non-customer insights.
`;
```

### Available Patterns:

- `extract_wisdom`
- `analyze_tech_impact`
- `find_hidden_message`
- `analyze_paper`
- `analyze_claims`
- `find_logical_fallacies`
- `analyze_product_feedback`
- `rate_content`
- `create_summary`
- `improve_writing`
- `create_idea_compass`
- `create_stride_threat_model`
- `analyze_candidates`
- `prepare_7s_strategy`
- `extract_insights`
- `extract_predictions`
- `extract_recommendations`
- `extract_business_ideas`
- `improve_prompt`
- `improve_academic_writing`

---

## Legal Notice

All patterns are sourced from danielmiessler/fabric under MIT License.  
Attribution is included in each pattern file header.  
Original repository: https://github.com/danielmiessler/fabric

The Council integrates these patterns with custom frameworks (ERRC Grid, Mom Test, ROT Analysis, etc.)
to create hybrid, Council-optimized prompts.
