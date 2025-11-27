#!/usr/bin/env node
const { program } = require('commander');
const { logArabic, printCustomHelp, fixArabic } = require('../src/utils/logger');
const { readProjectFiles } = require('../src/utils/fileReader');
const { processCommand } = require('../src/index');
const { saveKey } = require('../src/utils/config');
const path = require('path');
const chalk = require('chalk');

// Program configuration
program
  .name('arabdevs')
  .helpOption(false)
  .addHelpCommand(false);

// Get files from target path
function getFiles(targetPath) {
  const currentDir = process.cwd();
  const fullPath = targetPath ? path.resolve(currentDir, targetPath) : currentDir;
  
  logArabic('جاري فحص ملفات المشروع...', 'info');
  
  try {
    const files = readProjectFiles(fullPath, currentDir);
    
    if (files.length === 0) {
      throw new Error('لم يتم العثور على ملفات برمجية');
    }
    
    return files;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('المسار غير موجود');
    }
    throw err;
  }
}

// Config command - save API key
program
  .command('config')
  .requiredOption('-k, --key <key>', 'API Key')
  .action((options) => {
    try {
      saveKey(options.key);
      logArabic('تم حفظ المفتاح بنجاح', 'success');
      logArabic('يمكنك الآن استخدام جميع الأوامر', 'info');
    } catch (err) {
      logArabic('فشل حفظ المفتاح', 'error');
      console.log(chalk.red(fixArabic('السبب: ') + err.message));
    }
  });

// Help command
program
  .command('help')
  .action(() => {
    printCustomHelp();
  });

// Explain command
program
  .command('explain <file>')
  .action(async (file) => {
    try {
      const files = getFiles(file);
      console.log(chalk.white(fixArabic('عدد الملفات: ')) + chalk.yellow(files.length));
      await processCommand('explain', files);
    } catch (err) {
      logArabic(err.message || err, 'error');
    }
  });

// Debug command
program
  .command('debug')
  .argument('[path]', 'ملف أو مجلد للفحص')
  .option('-e, --error <message>', 'ألصق رسالة الخطأ من الطرفية')
  .action(async (targetPath, options) => {
    try {
      if (!targetPath && !options.error) {
        throw new Error('حدد ملفاً أو استخدم --error مع رسالة الخطأ');
      }

      const files = targetPath ? getFiles(targetPath) : [];

      if (options.error) {
        files.unshift({
          path: 'CLI_ERROR_LOG.txt',
          content: options.error
        });
      }

      if (files.length === 0) {
        throw new Error('لا توجد ملفات لتحليلها');
      }

      console.log(chalk.white(fixArabic('عدد الملفات: ')) + chalk.yellow(files.length));
      await processCommand('debug', files);
    } catch (err) {
      logArabic(err.message || err, 'error');
    }
  });

// Comment command
program
  .command('comment [path]')
  .action(async (targetPath) => {
    try {
      const files = getFiles(targetPath);
      console.log(chalk.white(fixArabic('عدد الملفات: ')) + chalk.yellow(files.length));
      await processCommand('comment', files);
    } catch (err) {
      logArabic(err.message || err, 'error');
    }
  });

// Generate command
program
  .command('generate <path>')
  .action(async (targetPath) => {
    try {
      const files = getFiles(targetPath);
      console.log(chalk.white(fixArabic('عدد الملفات: ')) + chalk.yellow(files.length));
      await processCommand('generate', files);
    } catch (err) {
      logArabic(err.message || err, 'error');
    }
  });

// Handle unknown commands
program.on('command:*', () => {
  logArabic('أمر غير معروف', 'error');
  console.log(chalk.yellow(fixArabic('للمساعدة اكتب: ')) + chalk.cyan('arabdevs help'));
});

// Run program
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('help') || args.includes('--help') || args.includes('-h')) {
  printCustomHelp();
} else {
  program.parse(process.argv);
}