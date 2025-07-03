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
