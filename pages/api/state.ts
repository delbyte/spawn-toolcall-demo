import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const STATE_PATH = path.resolve(process.cwd(), 'state.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    // Clear the state by deleting the file
    if (fs.existsSync(STATE_PATH)) {
      fs.unlinkSync(STATE_PATH);
    }
    return res.status(200).json({ message: 'State cleared', runs: [] });
  }

  if (req.method === 'GET') {
    if (!fs.existsSync(STATE_PATH)) {
      return res.status(200).json({ runs: [] });
    }
    const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    return res.status(200).json(state);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
