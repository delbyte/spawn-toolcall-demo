import { PipelineRun } from './ToolManager';

// In-memory state storage for Vercel deployment
let globalState: { runs: PipelineRun[] } = { runs: [] };

export function getState() {
  return globalState;
}

export function setState(newState: { runs: PipelineRun[] }) {
  globalState = newState;
}

export function addRun(run: PipelineRun) {
  globalState.runs.push(run);
}

export function updateRun(runId: string, updates: Partial<PipelineRun>) {
  const runIndex = globalState.runs.findIndex(r => r.id === runId);
  if (runIndex !== -1) {
    globalState.runs[runIndex] = { ...globalState.runs[runIndex], ...updates };
  }
}

export function clearState() {
  globalState = { runs: [] };
}
