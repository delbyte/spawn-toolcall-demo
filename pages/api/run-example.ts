import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { runPipeline } from '../../src/ToolManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { example } = req.body;
    
    if (!example) {
      return res.status(400).json({ error: 'Example name is required' });
    }

    // Use the existing example file
    const examplePath = path.resolve(process.cwd(), 'examples', `${example}.json`);
    
    // Check if the example file exists
    if (!fs.existsSync(examplePath)) {
      return res.status(404).json({ error: `Example file ${example}.json not found` });
    }

    // Run the pipeline
    await runPipeline(examplePath);

    res.status(200).json({ 
      message: `Pipeline started successfully for ${example}`,
      path: examplePath 
    });    } catch (error: unknown) {
      console.error('Error running example:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
