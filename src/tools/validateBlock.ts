import crypto from 'crypto';

export async function validateBlock(blockData: any): Promise<string> {
  // Check for failure simulation
  if (blockData.simulate_failure && blockData.failure_step === 'validate') {
    throw new Error('Simulated validation failure: Invalid block signature');
  }
  
  // simple validation: recompute and check prefix
  const { nonce, simulate_failure, failure_step, ...rest } = blockData;
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(rest) + nonce)
    .digest('hex');
  if (!hash.startsWith('0000')) {
    throw new Error(`Invalid proof-of-work: hash ${hash} does not start with 0000`);
  }
  console.log('Block validated');
  return 'Block validated successfully';
}
