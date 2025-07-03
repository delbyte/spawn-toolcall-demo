import type { NextApiRequest, NextApiResponse } from 'next';
import { runPipeline } from '../../src/ToolManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { inputPath } = req.body;

    if (!inputPath) {
      return res.status(400).json({ error: 'Input path is required' });
    }

    try {
      await runPipeline(inputPath);
      res.status(200).json({ message: 'Pipeline started successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
