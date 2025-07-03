import fs from 'fs';
import crypto from 'crypto';

export async function mineBlock(inputPath: string): Promise<any> {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  
  // Check for failure simulation
  if (data.simulate_failure && data.failure_step === 'mine') {
    throw new Error('Simulated mining failure: Insufficient computational power');
  }
  
  const { nonce, simulate_failure, failure_step, ...rest } = data;
  let testNonce = 0;
  let hash = '';
  
  // Different difficulty based on data complexity
  const difficulty = data.priority === 'high' ? '00000' : '0000';
  const maxIterations = data.security_level === 'maximum' ? 2000000 : 500000;
  
  console.log(`Starting mining with difficulty: ${difficulty}, max iterations: ${maxIterations}`);
  
  while (!hash.startsWith(difficulty) && testNonce < maxIterations) {
    testNonce++;
    hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(rest) + testNonce)
      .digest('hex');
    
    // Log progress every 50,000 iterations
    if (testNonce % 50000 === 0) {
      console.log(`Mining progress: ${testNonce}/${maxIterations} iterations (${Math.round(testNonce/maxIterations*100)}%)`);
    }
  }
  
  if (testNonce >= maxIterations) {
    throw new Error(`Mining failed: Could not find valid nonce within ${maxIterations} iterations`);
  }
  
  // Return the updated data instead of writing to file
  const minedData = { ...data, nonce: testNonce };
  console.log(`Mined with nonce=${testNonce} (difficulty: ${difficulty})`);
  return minedData;
}
