const { sendToAI } = require('./api/client');
const { buildPrompt } = require('./prompts/index');
const { logArabic, fixArabic } = require('./utils/logger');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Main command processor
async function processCommand(commandType, files) {
  // Prepare prompt
  logArabic('جاري تجهيز الطلب...', 'info');
  const fullPrompt = buildPrompt(commandType, files);
  
  // Send request
  logArabic('جاري الاتصال بخوادم جيميناي...', 'info');
  logArabic('يرجى الانتظار... (قد يستغرق دقيقة)', 'warning');
  
  const response = await sendToAI(fullPrompt);
  
  // Check if request failed
  if (!response) {
    logArabic('فشل الاتصال بالخادم', 'error');
    return;
  }
  
  // Display result
  console.log('\n' + chalk.gray('═'.repeat(70)));
  console.log(chalk.bold.cyan(fixArabic('النتيجة:')));
  console.log(chalk.gray('═'.repeat(70)) + '\n');
  
  if (commandType === 'generate') {
    // Save to file for generate command
    const readmePath = path.join(process.cwd(), 'GENERATED_README.md');
    fs.writeFileSync(readmePath, response);
    logArabic('تم إنشاء ملف التوثيق بنجاح', 'success');
    console.log(chalk.gray(fixArabic('المسار: ')) + chalk.cyan(readmePath));
  } else {
    // Print response directly
    const formatted = response
      .split('\n')
      .map((line) => fixArabic(line))
      .join('\n');
    console.log(chalk.white(formatted));
  }
  
  console.log('\n' + chalk.gray('═'.repeat(70)) + '\n');
  logArabic('انتهت العملية بنجاح', 'success');
}

module.exports = { processCommand };