import React from "react";
import { Slider } from "@/components/primitives/slider";

interface CoreAiExpertConfigProps {
  config: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  onChange: (newConfig: any) => void;
}

export const CoreAiExpertConfig: React.FC<CoreAiExpertConfigProps> = ({ config, onChange }) => {
  const handleConfigChange = (key: string, value: number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Temp</span>
          <span className="font-mono">{config.temperature.toFixed(2)}</span>
        </div>
        <Slider
          value={[config.temperature]}
          onValueChange={([value]) => handleConfigChange("temperature", value)}
          min={0}
          max={2}
          step={0.1}
          className="slider-council"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Top P</span>
          <span className="font-mono">{config.topP.toFixed(2)}</span>
        </div>
        <Slider
          value={[config.topP]}
          onValueChange={([value]) => handleConfigChange("topP", value)}
          min={0}
          max={1}
          step={0.05}
          className="slider-council"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Max Tokens</span>
          <span className="font-mono">{config.maxTokens}</span>
        </div>
        <Slider
          value={[config.maxTokens]}
          onValueChange={([value]) => handleConfigChange("maxTokens", value)}
          min={1000}
          max={8000}
          step={500}
          className="slider-council"
        />
      </div>
    </div>
  );
};
