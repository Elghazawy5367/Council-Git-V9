# Synthesis Engine Architecture

## Overview
The Synthesis Engine (`synthesis-engine.ts`) is the core logic responsible for aggregating individual AI expert outputs into a coherent, multi-perspective decision report.

## Architecture
1. **Collector**: Gathers raw text from all active experts.
2. **Aggregator**: Groups insights by perspective (Strategic, Technical, Creative).
3. **Synthesizer**: Uses a high-reasoning model (e.g., DeepSeek V3) to generate the final summary.

## Usage
Accessed through the Council interface when selecting "Synthesis" mode.

## Troubleshooting
- Ensure at least 3 experts are active for balanced synthesis.
- Verify API connectivity if synthesis hangs.
