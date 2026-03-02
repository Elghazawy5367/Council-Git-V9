import { Link } from 'react-router-dom';
import { useDevToolsStore } from '../../store/devtools-store';

export function ScoutPanel() {
  const { lastRuns } = useDevToolsStore();
  const last = lastRuns['scout'];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">🔭 Scout Intelligence</h2>
          <p className="text-xs text-muted-foreground">GitHub intelligence extraction and opportunity discovery</p>
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
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground text-sm space-y-3">
        <p>LLM-powered market research wired in Phase 2</p>
        <Link to="/features/scout" className="inline-block text-primary hover:underline text-xs">
          → View Scout Configuration
        </Link>
      </div>
    </div>
  );
}
