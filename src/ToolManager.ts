
import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { mineBlock } from './tools/mineBlock';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { validateBlock } from './tools/validateBlock';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { broadcastBlock } from './tools/broadcastBlock';

export interface PipelineStep {
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  input?: any;
  output?: any;
  error?: string;
}

export interface PipelineRun {
  id: string;
  inputPath: string;
  steps: PipelineStep[];
}

const STATE_PATH = path.resolve(process.cwd(), 'state.json');

function loadState(): { runs: PipelineRun[] } {
  if (!fs.existsSync(STATE_PATH)) return { runs: [] };
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
}

function saveState(state: { runs: PipelineRun[] }) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

export async function runPipeline(inputPath: string) {
  const state = loadState();
  const run: PipelineRun = {
    id: Date.now().toString(),
    inputPath,
    steps: [
      { name: 'mineBlock', status: 'pending' },
      { name: 'validateBlock', status: 'pending' },
      { name: 'broadcastBlock', status: 'pending' }
    ]
  };
  state.runs.push(run);
  saveState(state);

  for (const step of run.steps) {
    step.status = 'running';
    let stepInput: any = null;
    let stepOutput: any = null;

    try {
      // Read input file content before each step
      stepInput = fs.readFileSync(inputPath, 'utf-8');
      step.input = JSON.parse(stepInput);
      saveState(state);

      switch (step.name) {
        case 'mineBlock':
          await mineBlock(inputPath);
          stepOutput = fs.readFileSync(inputPath, 'utf-8'); // Read updated file after mineBlock
          break;
        case 'validateBlock':
          await validateBlock(inputPath);
          stepOutput = 'Block validated successfully';
          break;
        case 'broadcastBlock':
          await broadcastBlock(inputPath);
          stepOutput = 'Block broadcast successfully';
          break;
      }
      step.output = stepOutput;
      step.status = 'success';
    } catch (err: any) {
      step.status = 'failed';
      step.error = err.message;
      saveState(state);
      throw err;
    }
    saveState(state);
  }
}
