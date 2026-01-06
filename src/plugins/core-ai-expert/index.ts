import React from "react";
import { ExpertPlugin } from "@/lib/plugins";
import { pluginManager } from "@/lib/plugin-manager";
import { CoreAiExpertConfig } from "./components/CoreAiExpertConfig";

/**
 * Core AI Expert Plugin
 * Migrates existing expert logic into a modular plugin format.
 */

export const coreAiExpertPlugin: ExpertPlugin = {
  id: "core-ai-expert",
  name: "Core AI Expert",
  description: "Standard Large Language Model expert for analysis and reasoning.",
  
  defaultConfig: {
    temperature: 0.7,
    maxTokens: 4000,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
  },

  validateConfig: (config: Record<string, unknown>) => {
    const cfg = config as { temperature?: number; maxTokens?: number };
    return typeof cfg.temperature === "number" && typeof cfg.maxTokens === "number" && cfg.maxTokens > 0;
  },

  renderConfig: (
    config: Record<string, unknown>,
    onChange: (newConfig: Record<string, unknown>) => void
  ) => {
    // Wrapper to handle type conversion between plugin API and component props
    const typedConfig = config as unknown as { temperature: number; maxTokens: number; topP: number };
    const typedOnChange = (newConfig: unknown) => {
      onChange(newConfig as Record<string, unknown>);
    };
    return React.createElement(CoreAiExpertConfig, { 
      config: typedConfig, 
      onChange: typedOnChange
    });
  },

  execute: async (_input: string, _config: Record<string, unknown>) => {
    // Execution logic would go here, calling the AI client
    return "Expert analysis completed.";
  }
};

// Register the plugin
pluginManager.registerExpertPlugin(coreAiExpertPlugin);
