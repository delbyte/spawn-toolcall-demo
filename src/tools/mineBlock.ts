import fs from 'fs';
import crypto from 'crypto';

export async function mineBlock(inputPath: string) {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  const { nonce, ...rest } = data;
  let testNonce = 0;
  let hash = '';
  while (!hash.startsWith('0000')) {
    testNonce++;
    hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(rest) + testNonce)
      .digest('hex');
  }
  
  // Save the nonce back to the data
  data.nonce = testNonce;
  fs.writeFileSync(inputPath, JSON.stringify(data, null, 2));
  console.log(`Mined with nonce=${testNonce}`);
}
