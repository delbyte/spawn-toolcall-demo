# spawn-toolcall-demo

This repo fixes the bug I saw in Spawn’s logs where step 1 would complete but steps 2–N were silently skipped, here’s how a proper pipeline avoids that.

---

## Project Structure

spawn-toolcall-demo/
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
├── state.json # in‑process pipeline state store
├── public/ # static assets
├── src/
│ ├── cli.ts # CLI entrypoint
│ ├── pages/api/state.ts # Next.js API route to serve state.json
│ ├── ToolManager.ts # orchestrates tool calls, manages state.json
│ ├── tools/
│ │ ├── mineBlock.ts # tool: mine a single block
│ │ ├── validateBlock.ts # tool: validate the mined block
│ │ └── broadcastBlock.ts # tool: broadcast block to network
│ └── web/
│ ├── pages/index.tsx # Next.js dashboard UI
│ └── components/
│ └── PipelineViewer.tsx # shows each step’s status
├── examples/
│ └── sample-block.json # block data to mine
└── README.md # this file, updated with usage instructions

lua
Copy
Edit

---

## package.json

```jsonc
{
  "name": "spawn-toolcall-demo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "cli": "ts-node src/cli.ts --input examples/sample-block.json"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.0.0"
  }
}
tsconfig.json
jsonc
Copy
Edit
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
state.json (initial)
json
Copy
Edit
{
  "runs": []
}
src/ToolManager.ts
ts
Copy
Edit
import fs from 'fs';
import path from 'path';
import { mineBlock } from './tools/mineBlock';
import { validateBlock } from './tools/validateBlock';
import { broadcastBlock } from './tools/broadcastBlock';

export interface PipelineStep {
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
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
    saveState(state);
    try {
      switch (step.name) {
        case 'mineBlock':
          await mineBlock(inputPath);
          break;
        case 'validateBlock':
          await validateBlock(inputPath);
          break;
        case 'broadcastBlock':
          await broadcastBlock(inputPath);
          break;
      }
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
src/tools/mineBlock.ts
ts
Copy
Edit
import fs from 'fs';
import crypto from 'crypto';

export async function mineBlock(inputPath: string) {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  let nonce = 0;
  let hash = '';
  while (!hash.startsWith('0000')) {
    nonce++;
    hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(data) + nonce)
      .digest('hex');
  }
  console.log(`Mined with nonce=${nonce}`);
}
src/tools/validateBlock.ts
ts
Copy
Edit
import fs from 'fs';
import crypto from 'crypto';

export async function validateBlock(inputPath: string) {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  // simple validation: recompute and check prefix
  const { nonce, ...rest } = data;
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(rest) + nonce)
    .digest('hex');
  if (!hash.startsWith('0000')) {
    throw new Error('Invalid proof-of-work');
  }
  console.log('Block validated');
}
src/tools/broadcastBlock.ts
ts
Copy
Edit
import fs from 'fs';

export async function broadcastBlock(inputPath: string) {
  const data = fs.readFileSync(inputPath, 'utf-8');
  // Simulate network broadcast delay
  await new Promise((r) => setTimeout(r, 500));
  console.log('Block broadcast to network');
}
src/cli.ts
ts
Copy
Edit
#!/usr/bin/env ts-node
import yargs from 'yargs';
import { runPipeline } from './ToolManager';

async function main() {
  const argv = yargs.option('input', { type: 'string', demandOption: true }).argv;
  try {
    await runPipeline((argv as any).input);
    console.log('Pipeline completed successfully');
  } catch (err: any) {
    console.error('Pipeline failed:', err.message);
    process.exit(1);
  }
}

main();
src/pages/api/state.ts
ts
Copy
Edit
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const STATE_PATH = path.resolve(process.cwd(), 'state.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!fs.existsSync(STATE_PATH)) {
    return res.status(200).json({ runs: [] });
  }
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
  res.status(200).json(state);
}
src/web/components/PipelineViewer.tsx
tsx
Copy
Edit
import React from 'react';

export function PipelineViewer({ runs }: { runs: any[] }) {
  return (
    <div>
      {runs.map((run) => (
        <div key={run.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <strong>Run {run.id}</strong>
          <ul>
            {run.steps.map((step: any) => (
              <li key={step.name}>
                {step.name}: <em>{step.status}</em>{step.error ? ` — ${step.error}` : ''}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
src/web/pages/index.tsx
tsx
Copy
Edit
import { useEffect, useState } from 'react';
import { PipelineViewer } from '../components/PipelineViewer';

export default function Home() {
  const [state, setState] = useState({ runs: [] });

  useEffect(() => {
    async function fetchState() {
      const res = await fetch('/api/state');
      setState(await res.json());
    }
    fetchState();
    const iv = setInterval(fetchState, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Spawn Tool-Call Pipeline Demo</h1>
      <p>This dashboard shows each pipeline run and the status of its tool calls.</p>
      <PipelineViewer runs={state.runs} />
    </main>
  );
}
examples/sample-block.json
json
Copy
Edit
{
  "data": "example payload",
  "nonce": 0
}
README.md (extended usage)
markdown
Copy
Edit
# spawn-toolcall-demo

This repo fixes the bug I saw in Spawn’s logs where step 1 would complete but steps 2–N were silently skipped, here’s how a proper pipeline avoids that.


