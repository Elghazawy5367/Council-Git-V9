export interface PluginBase {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ExpertPlugin extends PluginBase {
  renderConfig: (config: Record<string, unknown>, onChange: (newConfig: Record<string, unknown>) => void) => React.ReactNode;
  execute: (input: string, config: Record<string, unknown>) => Promise<string>;
  validateConfig: (config: Record<string, unknown>) => boolean;
  defaultConfig: Record<string, unknown>;
}

export interface ModePlugin extends PluginBase {
  execute: (experts: ExpertPlugin[], task: string, config: Record<string, unknown>) => Promise<Record<string, unknown>>;
  defaultConfig: Record<string, unknown>;
}
