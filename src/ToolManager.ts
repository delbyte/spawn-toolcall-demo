
import fs from 'fs';
import path from 'path';
import { getState, addRun, updateRun } from './StateManager';
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

export async function runPipeline(inputPath: string) {
  const run: PipelineRun = {
    id: Date.now().toString(),
    inputPath,
    steps: [
      { name: 'mineBlock', status: 'pending' },
      { name: 'validateBlock', status: 'pending' },
      { name: 'broadcastBlock', status: 'pending' }
    ]
  };
  
  // Add run to in-memory state
  addRun(run);

  // Read the initial input file
  let currentData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  for (const step of run.steps) {
    step.status = 'running';
    step.input = currentData;
    updateRun(run.id, run); // Update state after setting input

    try {
      let stepOutput: any = null;

      switch (step.name) {
        case 'mineBlock':
          stepOutput = await mineBlock(inputPath);
          currentData = stepOutput; // Update current data with mined block
          break;
        case 'validateBlock':
          stepOutput = await validateBlock(currentData);
          break;
        case 'broadcastBlock':
          stepOutput = await broadcastBlock(currentData);
          break;
      }
      step.output = stepOutput;
      step.status = 'success';
    } catch (err: any) {
      step.status = 'failed';
      step.error = err.message;
      updateRun(run.id, run); // Update state after error
      throw err;
    }
    updateRun(run.id, run); // Update state after successful step
  }
}
