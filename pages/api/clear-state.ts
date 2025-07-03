
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const STATE_PATH = path.resolve(process.cwd(), 'state.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    fs.writeFileSync(STATE_PATH, JSON.stringify({ runs: [] }));
    res.status(200).json({ message: 'State cleared' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
