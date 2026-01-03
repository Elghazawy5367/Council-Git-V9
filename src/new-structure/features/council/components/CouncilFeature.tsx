import { ExpertLegacy } from "@legacy/components/ExpertLegacy";

export const CouncilFeature = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">New Council Feature</h2>
      <div className="grid gap-4">
        {/* Strangling the old component by wrapping it in the new feature structure */}
        <ExpertLegacy name="DeepSeek V3" />
        <div className="p-4 bg-primary text-primary-foreground rounded-lg shadow-lg hover-elevate transition-all">
          <p className="font-bold">New Strategy Module Active</p>
        </div>
      </div>
    </div>
  );
};

export const CouncilFeature = () => {
  return <div>Temporary fix for Council Feature</div>;
};
