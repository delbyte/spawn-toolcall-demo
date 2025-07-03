import type { NextApiRequest, NextApiResponse } from 'next';
import { getState, clearState } from '../../src/StateManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    // Clear the state using in-memory manager
    clearState();
    return res.status(200).json({ message: 'State cleared', runs: [] });
  }

  if (req.method === 'GET') {
    // Get state from in-memory manager
    const state = getState();
    return res.status(200).json(state);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
