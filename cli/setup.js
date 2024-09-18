import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import gradient from 'gradient-string';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOX_WIDTH = 80;

function createBox(content, options = {}) {
   return boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      width: BOX_WIDTH,
      textAlignment: 'center',
      ...options
   });
}

async function animateText(text, duration = 3) { 
   for (let i = 0; i <= text.length; i++) {
      process.stdout.write('\r' + text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, duration));
   }
   console.log();
}

export async function setupProject(projectPath, options) {
   const spinner = ora({
      text: 'Setting up your project...',
      spinner: 'dots12',
      color: 'cyan'
   }).start();

   try {
      const templatePath = path.join(__dirname, '..', 'templates', options.language.toLowerCase());

      // Copy template files
      await fs.copy(templatePath, projectPath);

      // Update package.json
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = options.projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      spinner.succeed(chalk.green('Project setup completed successfully!'));

      await animateText(gradient.pastel.multiline(`🎉 Congratulations! Your ${options.language} project is ready.`));

      console.log(
         createBox(
            `${chalk.cyan('📁 Project Location:')}\n${chalk.yellow(projectPath)}`,
            { borderColor: 'yellow' }
         )
      );

      await animateText(chalk.bold.magenta('🚀 Next Steps:'));

      console.log(
         createBox(
            chalk.bold('Option 1: Standard Setup') +
            '\n\n' +
            `1. ${chalk.yellow(`cd ${options.projectName}`)}\n` +
            `2. ${chalk.yellow('npm install')} ${chalk.gray('(or yarn install)')}\n` +
            `3. ${chalk.yellow(options.language === 'TypeScript' ? 'npm run dev' : 'node server.js')}\n\n` +
            (options.language === 'TypeScript' ?
               chalk.bold('For TypeScript projects:') +
               `\n   Build: ${chalk.yellow('npm run build')}` +
               `\n   Start production: ${chalk.yellow('npm start')}` : ''),
            { borderColor: 'blue', title: '💻 Standard', titleAlignment: 'center' }
         )
      );

      if (options.language === 'TypeScript') {
         console.log(
            createBox(
               chalk.bold('Option 2: Using Docker Compose') +
               '\n\n' +
               `1. ${chalk.yellow(`cd ${options.projectName}`)}\n` +
               `2. ${chalk.yellow('docker-compose up --build')}\n` +
               `3. App available at ${chalk.green('http://localhost:8000')}\n\n` +
               `To stop: ${chalk.yellow('docker-compose down')}`,
               { borderColor: 'magenta', title: '🐳 Docker', titleAlignment: 'center' }
            )
         );
      }

      console.log(
         createBox(
            chalk.bold.cyan('📘 Additional Information:') +
            '\n\n' +
            `• Project structure: ${options.language === 'TypeScript' ? 'Modular TypeScript setup' : 'Express.js with MVC pattern'}\n` +
            `• Env variables: Configure in ${chalk.yellow('.env')} file\n` +
            `• More details: See ${chalk.yellow('README.md')} file in the project root`,
            { borderColor: 'cyan' }
         )
      );

      await animateText(gradient.rainbow('Happy coding! May your code be bug-free and your coffee be strong! 🚀☕'));

   } catch (error) {
      spinner.fail(chalk.red('Error setting up project'));
      console.error(error);
   }
}