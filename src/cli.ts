#!/usr/bin/env ts-node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { runPipeline } from './ToolManager';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('input', { type: 'string', demandOption: true, describe: 'Input file path' })
    .argv;
  
  try {
    await runPipeline(argv.input);
    console.log('Pipeline completed successfully');
  } catch (err: any) {
    console.error('Pipeline failed:', err.message);
    process.exit(1);
  }
}

main();
