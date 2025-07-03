import { useEffect, useState } from 'react';
import { PipelineViewer } from '../src/web/components/PipelineViewer';


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

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage(null);
    }, 3000); // Hide after 3 seconds
  };

  async function clearState() {
    await fetch('/api/clear-state', { method: 'POST' });
    setState({ runs: [] });
    showToastMessage('State cleared successfully!');
  }

  async function startPipeline(inputPath: string) {
    try {
      const res = await fetch('/api/run-pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputPath }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start pipeline');
      }
      showToastMessage(data.message);
    } catch (error: any) {
      showToastMessage(`Error: ${error.message}`);
    }
  }

  const exampleFiles = [
    'examples/sample-block.json',
  ];

  return (
    <main style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee',
      }}>
        <div>
          <h1 style={{ fontSize: '2.5em', color: '#333', marginBottom: '10px' }}>Spawn Tool-Call Pipeline Demo</h1>
          <p style={{ fontSize: '1.1em', color: '#666' }}>This dashboard shows each pipeline run and the status of its tool calls.</p>
        </div>
        <button onClick={clearState} style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em',
          transition: 'background-color 0.3s ease',
        }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c82333')} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}>Clear State</button>
      </div>
      <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '1.8em', color: '#333', marginBottom: '20px' }}>Choose an example to run:</h2>
        {exampleFiles.map((file) => (
          <button key={file} onClick={() => startPipeline(file)} style={{
            marginRight: '15px',
            padding: '12px 25px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            transition: 'background-color 0.3s ease',
          }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}>
            Run {file.split('/').pop()}
          </button>
        ))}
      </div>
      <PipelineViewer runs={state.runs} />

      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: 'white',
          padding: '12px 25px',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          fontSize: '1.1em',
          opacity: 0.95,
        }}>
          {toastMessage}
        </div>
      )}
    </main>
  );
}