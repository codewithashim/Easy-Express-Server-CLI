import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export async function prompt() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: chalk.green('What is the name of your project?'),
            default: 'my-express-app',
            validate: (input) => {
                if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
                return chalk.red('Project name may only include letters, numbers, underscores and hashes.');
            },
        },
        {
            type: 'list',
            name: 'language',
            message: chalk.green('Choose a language:'),
            choices: ['TypeScript', 'JavaScript'],
            default: 'TypeScript',
        },
    ]);

    const projectPath = path.join(process.cwd(), answers.projectName);
    if (fs.existsSync(projectPath)) {
        const { overwrite } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: chalk.yellow(`A directory with the name "${answers.projectName}" already exists. Do you want to overwrite it?`),
                default: false,
            },
        ]);

        if (!overwrite) {
            console.log(chalk.red('Project creation cancelled.'));
            process.exit(1);
        }
    }

    return answers;
}