# Synthesis Cache Guide

## Overview
The `synthesis-cache.ts` utility provides a caching layer for AI expert responses and consolidated synthesis reports. This reduces API costs and improves perceived performance by serving previously generated insights for identical queries.

## Configuration
- **Storage**: Uses `idb-keyval` for persistent browser-side storage.
- **TTL**: Default time-to-live is 24 hours.

## Usage
The cache is automatically used during the synthesis process in the `SynthesisEngine`.

## Troubleshooting
- If data seems stale, use the "Clear Cache" button in the Settings panel.
- Check browser IndexedDB storage if caching fails.
