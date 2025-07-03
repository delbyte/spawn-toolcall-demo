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
    throw new Error(`Invalid proof-of-work: hash ${hash} does not start with 0000`);
  }
  console.log('Block validated');
}
