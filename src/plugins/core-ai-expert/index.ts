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

  validateConfig: (config: any) => {
    return typeof config.temperature === "number" && config.maxTokens > 0;
  },

  renderConfig: (config: any, onChange: (newConfig: any) => void) => {
    return React.createElement(CoreAiExpertConfig, { config, onChange });
  },

  execute: async (_input: string, _config: any) => {
    // Execution logic would go here, calling the AI client
    return "Expert analysis completed.";
  }
};

// Register the plugin
pluginManager.registerExpertPlugin(coreAiExpertPlugin);
