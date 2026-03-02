import { useDevToolsStore } from '../../store/devtools-store';

export function TwinPanel() {
  const { lastRuns } = useDevToolsStore();
  const last = lastRuns['twin'];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">👯 Twin Mimicry</h2>
          <p className="text-xs text-muted-foreground">Extract elite developer mental models from git history</p>
        </div>
        <button disabled className="px-4 py-2 text-sm rounded-lg bg-primary/20 text-primary cursor-not-allowed">
          ▶ Run (wired in Phase 2)
        </button>
      </div>
      {last && (
        <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          Last run: {last.summary} — {new Date(last.startedAt).toLocaleString()}
        </div>
      )}
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
        LLM-powered developer analysis wired in Phase 2
      </div>
    </div>
  );
}
