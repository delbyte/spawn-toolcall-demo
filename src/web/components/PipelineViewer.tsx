import React from 'react';

const slideInKeyframes = `
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`;

export function PipelineViewer({ runs }: { runs: any[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'lightgreen';
      case 'failure':
        return 'salmon';
      default:
        return 'lightgray';
    }
  };

  // Log network-style messages to console to simulate tool call execution
  React.useEffect(() => {
    runs.forEach((run) => {
      const completedSteps = run.steps.filter((s: any) => s.status === 'success').length;
      const runningSteps = run.steps.filter((s: any) => s.status === 'running').length;
      const totalSteps = run.steps.length;
      
      // Log overall pipeline state
      if (runningSteps > 0) {
        console.log(`%c[PIPELINE] Run ${run.id} - Step ${completedSteps + 1}/${totalSteps} executing...`, 'color: #6f42c1; font-weight: bold;');
      }
      
      run.steps.forEach((step: any, index: number) => {
        if (step.status === 'running') {
          console.log(`%c[TOOL-CALL] toolu_${Date.now().toString().slice(-8)} - ${step.name} - Status: RUNNING`, 'color: #007bff; font-weight: bold;');
          console.log(`%c[NETWORK] POST /api/tools/${step.name} - Starting execution`, 'color: #28a745;');
          console.log(`%c[STATE] Pipeline state: step ${index + 1} of ${totalSteps} - ${step.name} in progress`, 'color: #6c757d; font-style: italic;');
        } else if (step.status === 'success') {
          console.log(`%c[TOOL-CALL] toolu_${Date.now().toString().slice(-8)} - ${step.name} - Status: COMPLETED ✓`, 'color: #28a745; font-weight: bold;');
          console.log(`%c[NETWORK] POST /api/tools/${step.name} - 200 OK (${Math.floor(Math.random() * 1000 + 500)}ms)`, 'color: #28a745;');
          console.log(`%c[STATE] Pipeline advancing: ${step.name} complete, progressing to next step...`, 'color: #6c757d; font-style: italic;');
          
          // Show next step preparation
          if (index < totalSteps - 1) {
            const nextStep = run.steps[index + 1];
            if (nextStep.status === 'pending') {
              console.log(`%c[PIPELINE] Preparing next step: ${nextStep.name}`, 'color: #6f42c1;');
            }
          } else {
            console.log(`%c[PIPELINE] Run ${run.id} - All steps completed successfully! 🎉`, 'color: #28a745; font-weight: bold;');
          }
        } else if (step.status === 'failed') {
          console.log(`%c[TOOL-CALL] toolu_${Date.now().toString().slice(-8)} - ${step.name} - Status: FAILED ✗`, 'color: #dc3545; font-weight: bold;');
          console.log(`%c[NETWORK] POST /api/tools/${step.name} - 500 Internal Server Error`, 'color: #dc3545;');
          console.log(`%c[ERROR] ${step.error}`, 'color: #dc3545;');
          console.log(`%c[PIPELINE] Run ${run.id} - Pipeline halted at step ${index + 1}`, 'color: #dc3545; font-weight: bold;');
        }
      });
    });
  }, [runs]);

  return (
    <>
      <style>{slideInKeyframes}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {runs
        .filter((run) => run.steps.some((step: any) => step.status !== 'pending'))
        .map((run) => {
          return (
            <div key={run.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: '0', marginBottom: '15px', fontSize: '1.2em', color: '#333' }}>
              Run {run.id}
              <span style={{ 
                fontSize: '0.8em', 
                marginLeft: '10px', 
                color: '#6c757d',
                backgroundColor: '#f8f9fa',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #dee2e6'
              }}>
                {run.steps.filter((s: any) => s.status === 'success').length}/{run.steps.length} steps completed
              </span>
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {run.steps
                .filter((step: any) => step.status !== 'pending')
                .map((step: any, index: number) => {
                  const filteredSteps = run.steps.filter((s: any) => s.status !== 'pending');
                  return (
                    <React.Fragment key={step.name}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '15px 20px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: getStatusVariant(step.status),
                        color: step.status === 'failed' ? 'white' : '#333',
                        minWidth: '120px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                        transform: step.status === 'running' ? 'scale(1.05)' : 'scale(1)',
                        animation: step.status === 'success' ? 'slideInFromLeft 0.5s ease-out' : 'none',
                        position: 'relative',
                      }}>
                        {/* Network indicator */}
                        {step.status === 'running' && (
                          <div style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#007bff',
                            borderRadius: '50%',
                            animation: 'pulse 1s infinite',
                          }}></div>
                        )}
                        {step.status === 'success' && (
                          <div style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#28a745',
                            borderRadius: '50%',
                          }}></div>
                        )}
                        <strong style={{ marginBottom: '5px' }}>{step.name}</strong>
                        <span style={{ fontSize: '0.9em', opacity: 0.8 }}>{step.status.toUpperCase()}</span>
                        {step.status === 'running' && (
                          <span style={{ fontSize: '0.7em', color: '#007bff', marginTop: '3px' }}>
                            Tool call in progress...
                          </span>
                        )}
                        {step.status === 'success' && (
                          <span style={{ fontSize: '0.7em', color: '#28a745', marginTop: '3px' }}>
                            Tool call completed ✓
                          </span>
                        )}
                        {step.error && <p style={{ color: 'darkred', fontSize: '0.8em', marginTop: '5px' }}>Error: {step.error}</p>}
                        {(step.input || step.output) && (
                          <details style={{ marginTop: '10px', width: '100%' }}>
                            <summary style={{ cursor: 'pointer', fontSize: '0.9em', color: '#007bff' }}>Details</summary>
                            <div style={{ textAlign: 'left', marginTop: '5px', fontSize: '1em', wordBreak: 'break-all' }}>
                              {step.input && (
                                <div style={{ marginBottom: '10px' }}>
                                  <strong style={{ fontSize: '1.1em' }}>Input:</strong>
                                  <pre style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '3px', overflowX: 'auto', fontSize: '0.95em', lineHeight: '1.4' }}>{JSON.stringify(step.input, null, 2)}</pre>
                                </div>
                              )}
                              {step.output && (
                                <div>
                                  <strong style={{ fontSize: '1.1em' }}>Output:</strong>
                                  <pre style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '3px', overflowX: 'auto', fontSize: '0.95em', lineHeight: '1.4' }}>{JSON.stringify(step.output, null, 2)}</pre>
                                </div>
                              )}
                            </div>
                          </details>
                        )}
                      </div>
                      {index < filteredSteps.length - 1 && (
                        <div style={{
                          width: '30px',
                          height: '2px',
                          backgroundColor: '#ccc',
                          position: 'relative',
                        }}>
                          <div style={{
                            width: '0',
                            height: '0',
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent',
                            borderLeft: '6px solid #ccc',
                            position: 'absolute',
                            right: '-6px',
                            top: '-5px',
                          }}></div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
}