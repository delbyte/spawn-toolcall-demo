# 🔗 Spawn Tool-Call Pipeline Demo

This repository demonstrates the proper way to handle sequential tool calls with state tracking, addressing the common issue where "Tool call has parts after it, skipping" causes pipelines to fail after the first step.

## 🎯 The Problem We're Solving

When external files are provided or complex tasks require tool-calling, many systems encounter this issue:
```
Tool call has parts after it, skipping: toolu_01Hwz8yWna4sWHLK7AutvfDG
Found tool-call: toolu_01SHSZZreGYMYt2o59QVNHVp completed? false
Returning in-progress tool: toolu_01SHSZZreGYMYt2o59QVNHVp
Found tool-call: toolu_01Hwz8yWna4sWHLK7AutvfDG completed? true
Tool call has parts after it, skipping:
```

**The core issue:** Systems run step 1 and then crash/freeze, not running consecutive steps.

## 💡 The Solution

This demo shows proper state tracking using status fields:
- `pending` - Step hasn't started yet
- `running` - Step is currently executing  
- `success` - Step completed successfully
- `failed` - Step failed with error

## 🚀 Live Demo

**[View Live Demo on Vercel →](https://spawn-toolcall-demo.vercel.app)**

## 📋 Examples Included

1. **Simple Block** - Basic blockchain mining example
2. **Complex Transaction** - Multi-transaction blockchain block  
3. **High-Value Transaction** - High-priority block with increased security
4. **Validation Failure** - Demonstrates pipeline failure handling

## 🛠️ Tech Stack

- **Next.js** - React framework with API routes
- **TypeScript** - Type safety and better developer experience
- **Node.js** - Runtime environment
- **File System State** - Simple JSON-based state management

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/spawn-toolcall-demo.git
cd spawn-toolcall-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.

### Run CLI Examples
```bash
# Run different examples
npm run cli -- --input examples/sample-block.json
npm run cli -- --input examples/complex-block.json
npm run cli -- --input examples/high-value-block.json
npm run cli -- --input examples/failing-block.json
```

## 📁 Project Structure

```
spawn-toolcall-demo/
├── src/
│   ├── cli.ts                 # CLI entrypoint
│   ├── ToolManager.ts         # Orchestrates tool calls, manages state
│   └── tools/
│       ├── mineBlock.ts       # Mine a block (proof-of-work)
│       ├── validateBlock.ts   # Validate the mined block
│       └── broadcastBlock.ts  # Broadcast to network
├── pages/
│   ├── index.tsx              # Main dashboard UI
│   └── api/
│       ├── state.ts           # API route to serve state
│       └── run-example.ts     # API route to run examples
├── components/
│   └── PipelineViewer.tsx     # React component showing pipeline status
├── examples/
│   ├── sample-block.json      # Basic example
│   ├── complex-block.json     # Complex transaction example
│   ├── high-value-block.json  # High-priority example
│   └── failing-block.json     # Failure simulation
└── state.json                 # Pipeline state store
```

## 🔧 How It Works

### 1. Pipeline Initialization
```typescript
const run: PipelineRun = {
  id: Date.now().toString(),
  inputPath,
  steps: [
    { name: 'mineBlock', status: 'pending' },
    { name: 'validateBlock', status: 'pending' },
    { name: 'broadcastBlock', status: 'pending' }
  ]
};
```

### 2. Sequential Execution
```typescript
for (const step of run.steps) {
  step.status = 'running';
  saveState(state); // 🔑 Save state before execution
  
  try {
    await executeStep(step);
    step.status = 'success';
  } catch (err) {
    step.status = 'failed';
    step.error = err.message;
    throw err; // Stop pipeline on failure
  }
  
  saveState(state); // 🔑 Save state after completion
}
```

### 3. Real-time UI Updates
The dashboard polls the state every 2 seconds and shows:
- ✅ Completed steps (green)
- ⏳ Running steps (animated, scaled)
- ❌ Failed steps (red with error message)
- 📊 Progress indicators and network logging

## 🌐 Deploy to Vercel

### Method 1: GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy automatically on push

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Method 3: Import from GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Deploy

## 📊 Network Logging

The demo includes realistic network-style logging in the browser console:
```
[PIPELINE] Run 1703932800000 - Step 1/3 executing...
[TOOL-CALL] toolu_32800000 - mineBlock - Status: RUNNING
[NETWORK] POST /api/tools/mineBlock - Starting execution
[STATE] Pipeline state: step 1 of 3 - mineBlock in progress
[TOOL-CALL] toolu_32800000 - mineBlock - Status: COMPLETED ✓
[NETWORK] POST /api/tools/mineBlock - 200 OK (847ms)
[STATE] Pipeline advancing: mineBlock complete, progressing to next step...
[PIPELINE] Preparing next step: validateBlock
```

## 🎨 Features

- **🔄 Real-time Updates** - Dashboard updates every 2 seconds
- **📱 Responsive Design** - Works on desktop and mobile
- **🎯 Interactive Examples** - Click to run different scenarios
- **📈 Progress Tracking** - Visual progress indicators
- **🔍 Detailed Logging** - Network-style console logging
- **⚡ Fast Performance** - Optimized for quick feedback
- **🎭 Failure Simulation** - Shows how errors are handled

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This demo was created to address tool-calling pipeline issues observed in production systems, specifically the "Tool call has parts after it, skipping" problem that causes step execution to halt after the first successful step.

---

**[🚀 View Live Demo](https://spawn-toolcall-demo.vercel.app)** | **[📧 Report Issues](https://github.com/yourusername/spawn-toolcall-demo/issues)**
