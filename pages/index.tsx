import { useEffect, useState } from 'react';
import { PipelineViewer } from '../src/web/components/PipelineViewer';

export default function Home() {
  const [state, setState] = useState({ runs: [] });
  const [showSimulation, setShowSimulation] = useState(false);
  const [runningExample, setRunningExample] = useState<string | null>(null);

  useEffect(() => {
    if (!showSimulation) return;
    
    async function fetchState() {
      const res = await fetch('/api/state');
      setState(await res.json());
    }
    fetchState();
    const iv = setInterval(fetchState, 2000);
    return () => clearInterval(iv);
  }, [showSimulation]);

  const runExample = async (example: string) => {
    setRunningExample(example);
    try {
      const res = await fetch('/api/run-example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ example })
      });
      const result = await res.json();
      console.log('Example result:', result);
    } catch (error) {
      console.error('Error running example:', error);
    }
    setRunningExample(null);
  };

  if (!showSimulation) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '40px',
          maxWidth: '800px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              color: '#2d3748', 
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              Tool-Call Pipeline Demo
            </h1>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2d3748', marginBottom: '15px' }}>The Problem We're Solving</h2>
            <div style={{ 
              background: '#f7fafc', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#4a5568', marginBottom: '10px', fontSize: '1.5rem' }}>
                <strong>The issue with how it is being done right now:</strong> When external files are uploaded or complex tasks require tool-calling, 
                the system encounters this critical bug:
              </p>
              <code style={{ 
                background: '#2d3748', 
                color: '#68d391', 
                padding: '10px', 
                borderRadius: '4px',
                display: 'block',
                fontSize: '1.5rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
              }}>
{`Tool call has parts after it, skipping: toolu_01Hwz8yWna4sWHLK7AutvfDG
Found tool-call: toolu_01SHSZZreGYMYt2o59QVNHVp completed? false
Returning in-progress tool: toolu_01SHSZZreGYMYt2o59QVNHVp
Tool call has parts after it, skipping:`}
              </code>
              <p style={{ color: '#e53e3e', marginTop: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                Result: Step 1 completes, but steps 2-N are silently skipped!
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#2d3748', marginBottom: '15px' }}>Why did I take a Blockchain example for This Demo?</h2>
            <div style={{ 
              background: '#edf2f7', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #cbd5e0'
            }}>
              <p style={{ color: '#4a5568', marginBottom: '15px', fontSize: '1.5rem' }}>
                <strong>They're a good example of a multi-step Process:</strong> Blockchain operations naturally require sequential, dependent steps:
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ 
                  background: '#bee3f8', 
                  padding: '10px 15px', 
                  borderRadius: '6px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  1. Mine Block
                </div>
                <span style={{ color: '#4a5568' }}>→</span>
                <div style={{ 
                  background: '#c6f6d5', 
                  padding: '10px 15px', 
                  borderRadius: '6px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  2. Validate Block
                </div>
                <span style={{ color: '#4a5568' }}>→</span>
                <div style={{ 
                  background: '#fed7d7', 
                  padding: '10px 15px', 
                  borderRadius: '6px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  3. Broadcast Block
                </div>
              </div>
              <p style={{ color: '#4a5568', fontSize: '1.5rem' }}>
                <strong>Each step depends on the previous one</strong>, exactly like Savi's tool chains! 
                If any step fails or gets skipped, the entire process breaks.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowSimulation(true)}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s ease'
              }}
            >
              Enter the Simulation
            </button>
            <p style={{ color: '#718096', fontSize: '1.5rem', marginTop: '15px' }}>
              See how proper tool-call pipelines should work
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Spawn Tool-Call Pipeline Demo</h1>
          <p style={{ color: '#4a5568', margin: 0 }}>
            This dashboard shows each pipeline run and the status of its tool calls.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowSimulation(false)}
            style={{
              background: '#4a5568',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ← Back to Info
          </button>
          <button
            onClick={async () => {
              await fetch('/api/state', { method: 'DELETE' });
              setState({ runs: [] });
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Clear State
          </button>
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '15px' }}>Interactive Examples</h2>
        <p style={{ color: '#4a5568', marginBottom: '20px', fontSize: '1.2rem' }}>
          Click any example below to run it and see the tool-call pipeline in action (PS, you should check the console logs!):
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          <button
            onClick={() => runExample('sample-block')}
            disabled={runningExample !== null}
            style={{
              background: runningExample === 'sample-block' ? '#e2e8f0' : '#007bff',
              color: runningExample === 'sample-block' ? '#4a5568' : 'white',
              border: '1px solid #007bff',
              padding: '20px',
              borderRadius: '8px',
              cursor: runningExample !== null ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ color: runningExample === 'sample-block' ? '#4a5568' : 'white', marginBottom: '8px' }}>
              Simple Block
              {runningExample === 'sample-block' && <span style={{ color: '#4299e1' }}> (Running...)</span>}
            </h3>
            <p style={{ color: runningExample === 'sample-block' ? '#4a5568' : 'white', fontSize: '0.9rem', margin: 0 }}>
              Basic blockchain mining example with standard difficulty
            </p>
          </button>

          <button
            onClick={() => runExample('complex-block')}
            disabled={runningExample !== null}
            style={{
              background: runningExample === 'complex-block' ? '#e2e8f0' : '#28a745',
              color: runningExample === 'complex-block' ? '#4a5568' : 'white',
              border: '1px solid #28a745',
              padding: '20px',
              borderRadius: '8px',
              cursor: runningExample !== null ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ color: runningExample === 'complex-block' ? '#4a5568' : 'white', marginBottom: '8px' }}>
              Complex Transaction
              {runningExample === 'complex-block' && <span style={{ color: '#4299e1' }}> (Running...)</span>}
            </h3>
            <p style={{ color: runningExample === 'complex-block' ? '#4a5568' : 'white', fontSize: '0.9rem', margin: 0 }}>
              Multi-transaction blockchain block with medium complexity
            </p>
          </button>

          <button
            onClick={() => runExample('high-value-block')}
            disabled={runningExample !== null}
            style={{
              background: runningExample === 'high-value-block' ? '#e2e8f0' : '#ffc107',
              color: runningExample === 'high-value-block' ? '#4a5568' : '#212529',
              border: '1px solid #ffc107',
              padding: '20px',
              borderRadius: '8px',
              cursor: runningExample !== null ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ color: runningExample === 'high-value-block' ? '#4a5568' : '#212529', marginBottom: '8px' }}>
              High-Value Transaction
              {runningExample === 'high-value-block' && <span style={{ color: '#4299e1' }}> (Running...)</span>}
            </h3>
            <p style={{ color: runningExample === 'high-value-block' ? '#4a5568' : '#212529', fontSize: '0.9rem', margin: 0 }}>
              High-priority block with maximum security (takes longer)
            </p>
          </button>

          <button
            onClick={() => runExample('failing-block')}
            disabled={runningExample !== null}
            style={{
              background: runningExample === 'failing-block' ? '#e2e8f0' : '#dc3545',
              color: runningExample === 'failing-block' ? '#4a5568' : 'white',
              border: '1px solid #dc3545',
              padding: '20px',
              borderRadius: '8px',
              cursor: runningExample !== null ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ color: runningExample === 'failing-block' ? '#4a5568' : 'white', marginBottom: '8px' }}>
              Validation Failure
              {runningExample === 'failing-block' && <span style={{ color: '#4299e1' }}> (Running...)</span>}
            </h3>
            <p style={{ color: runningExample === 'failing-block' ? '#4a5568' : 'white', fontSize: '0.9rem', margin: 0 }}>
              Demonstrates pipeline failure handling and error states
            </p>
          </button>
        </div>
      </div>

      <PipelineViewer runs={state.runs} />
    </main>
  );
}
