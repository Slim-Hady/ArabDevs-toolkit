const chalk = require('chalk');
const arabicReshaper = require('arabic-reshaper');

// إعدادات التشكيل
const config = {
    // بيحافظ على تشكيل الحروف لو موجودة
    keepLigatures: false, 
};

function logArabic(text, type = 'info') {
    // 1. تشبيك الحروف (Connect letters)
    let shaped = arabicReshaper.convertArabic(text, config);
    
    // 2. عكس النص (عشان الترمينال بيطبع LTR)
    let finalOutput = shaped.split("").reverse().join("");

    // 3. التلوين والطباعة
    if (type === 'error') {
        console.log(chalk.red.bold(finalOutput));
    } else if (type === 'success') {
        console.log(chalk.green.bold(finalOutput));
    } else {
        console.log(chalk.white(finalOutput));
    }
}

module.exports = { logArabic };