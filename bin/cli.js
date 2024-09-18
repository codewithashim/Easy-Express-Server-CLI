#!/usr/bin/env node
import chalk from 'chalk';
import figlet from 'figlet';
import { prompt } from '../cli/prompts.js';
import { setupProject } from '../cli/setup.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log(
    chalk.cyan(
      figlet.textSync('Easy Express CWA', { horizontalLayout: 'full' })
    )
  );

  console.log(chalk.cyan('Welcome to Easy Express CLI!'));
  console.log(chalk.yellow('Let\'s set up your new Express project.\n'));

  try {
    const options = await prompt();
    const projectPath = path.join(process.cwd(), options.projectName);
    await setupProject(projectPath, options);
  } catch (error) {
    console.error(chalk.red('Error setting up project:'), error);
  }
}

main();