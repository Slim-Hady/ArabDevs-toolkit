const { sendToAI } = require('./api/client');
const { buildPrompt } = require('./prompts/index');
const { logArabic, fixArabic } = require('./utils/logger');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Parse commented files from AI response
function parseCommentedFiles(response, originalFiles) {
  const fileMap = new Map();
  originalFiles.forEach(file => {
    fileMap.set(file.path, file);
    // Also map by filename only (in case AI uses just filename)
    const fileName = path.basename(file.path);
    if (!fileMap.has(fileName)) {
      fileMap.set(fileName, file);
    }
  });
  
  const commentedFiles = [];
  
  // Try pattern: --- File: path --- ... --- End of path ---
  const filePattern = /---\s*File:\s*(.+?)\s*---\s*([\s\S]*?)---\s*End\s*of\s*.+?\s*---/gi;
  let match;
  const processedPaths = new Set();
  
  while ((match = filePattern.exec(response)) !== null) {
    const filePath = match[1].trim();
    let commentedCode = match[2].trim();
    
    // Try to find matching file
    let targetFile = fileMap.get(filePath);
    if (!targetFile) {
      // Try by filename only
      targetFile = fileMap.get(path.basename(filePath));
    }
    
    if (targetFile && !processedPaths.has(targetFile.path)) {
      // Clean up code block markers if present
      commentedCode = commentedCode.replace(/^```[\w]*\n/, '').replace(/\n```$/, '');
      commentedFiles.push({
        path: targetFile.path,
        content: commentedCode
      });
      processedPaths.add(targetFile.path);
    }
  }
  
  // Fallback: if only one file and no structured format found, use entire response
  if (commentedFiles.length === 0 && originalFiles.length === 1) {
    let code = response.trim();
    // Remove markdown code blocks if present
    code = code.replace(/^```[\w]*\n/, '').replace(/\n```$/, '');
    commentedFiles.push({
      path: originalFiles[0].path,
      content: code
    });
  }
  
  return commentedFiles;
}

// Create backup of file
function createBackup(filePath) {
  const backupPath = filePath + '.backup';
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }
  return null;
}

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
  } else if (commandType === 'comment') {
    // Parse and write commented files back
    const commentedFiles = parseCommentedFiles(response, files);
    
    if (commentedFiles.length === 0) {
      logArabic('لم يتم العثور على ملفات معلقة في الاستجابة', 'warning');
      console.log(chalk.yellow(fixArabic('عرض الاستجابة الكاملة:')));
      console.log(chalk.white(response));
      return;
    }
    
    const currentDir = process.cwd();
    let successCount = 0;
    
    for (const commentedFile of commentedFiles) {
      try {
        const fullPath = path.resolve(currentDir, commentedFile.path);
        
        // Create backup
        const backupPath = createBackup(fullPath);
        if (backupPath) {
          logArabic(`تم إنشاء نسخة احتياطية: ${backupPath}`, 'info');
        }
        
        // Write commented code
        fs.writeFileSync(fullPath, commentedFile.content, 'utf-8');
        logArabic(`تم إضافة التعليقات إلى: ${commentedFile.path}`, 'success');
        successCount++;
      } catch (err) {
        logArabic(`فشل كتابة الملف ${commentedFile.path}: ${err.message}`, 'error');
      }
    }
    
    if (successCount > 0) {
      logArabic(`تم إضافة التعليقات إلى ${successCount} ملف(ات) بنجاح`, 'success');
    }
  } else {
    // Print response directly for explain/debug
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