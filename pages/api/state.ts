import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const STATE_PATH = path.resolve(process.cwd(), 'state.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!fs.existsSync(STATE_PATH)) {
    return res.status(200).json({ runs: [] });
  }
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
  res.status(200).json(state);
}
