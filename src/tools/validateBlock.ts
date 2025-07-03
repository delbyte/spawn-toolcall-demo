import fs from 'fs';
import crypto from 'crypto';

export async function validateBlock(inputPath: string) {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  
  // Check for failure simulation
  if (data.simulate_failure && data.failure_step === 'validate') {
    throw new Error('Simulated validation failure: Invalid block signature');
  }
  
  // simple validation: recompute and check prefix
  const { nonce, simulate_failure, failure_step, ...rest } = data;
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(rest) + nonce)
    .digest('hex');
  if (!hash.startsWith('0000')) {
    throw new Error(`Invalid proof-of-work: hash ${hash} does not start with 0000`);
  }
  console.log('Block validated');
}
