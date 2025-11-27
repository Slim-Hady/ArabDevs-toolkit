const chalk = require('chalk');
const ArabicReshaper = require('arabic-reshaper');
const bidiFactory = require('bidi-js');

const bidi = bidiFactory();
const ARABIC_RANGE = /[\u0600-\u06FF]/;

function reorderBidi(text) {
  const info = bidi.getEmbeddingLevels(text, 'rtl');
  const chars = Array.from(text);
  const segments = bidi.getReorderSegments(text, info);

  segments.forEach(([start, end]) => {
    let i = start;
    let j = end;
    while (i < j) {
      const tmp = chars[i];
      chars[i] = chars[j];
      chars[j] = tmp;
      i += 1;
      j -= 1;
    }
  });

  const mirrored = bidi.getMirroredCharactersMap(text, info);
  mirrored.forEach((char, index) => {
    chars[index] = char;
  });

  return chars.join('');
}

// Ensure Arabic text appears connected and right-to-left
function fixArabic(text) {
  if (!text) return '';
  const message = String(text);
  const hasArabic = ARABIC_RANGE.test(message);

  if (!hasArabic) return message;

  try {
    return message
      .split('\n')
      .map((line) => {
        if (!ARABIC_RANGE.test(line)) return line;
        const reshaped = ArabicReshaper.convertArabic(line);
        return reorderBidi(reshaped);
      })
      .join('\n');
  } catch (err) {
    return message;
  }
}

// Main logging function
function logArabic(text, type = 'info') {
  const message = fixArabic(text);
  if (type === 'error') {
    console.log(chalk.red.bold(`${message}`));
  } else if (type === 'success') {
    console.log(chalk.green.bold(`${message}`));
  } else if (type === 'warning') {
    console.log(chalk.yellow.bold(`${message}`));
  } else if (type === 'info') {
    console.log(chalk.cyan(`${message}`));
  } else {
    console.log(chalk.white(message));
  }
}

// Print help menu
function printCustomHelp() {
  const rtl = (text) => fixArabic(text);

  console.log(chalk.bold.blue(rtl('\n   أداة المطورين العرب')));
  console.log(chalk.gray('   ' + '─'.repeat(55)));
  
  const printRow = (cmd, desc) => {
    const padding = ' '.repeat(Math.max(0, 32 - cmd.length));
    console.log(chalk.yellow(cmd) + padding + chalk.white(rtl(desc)));
  };
  
  console.log('\n' + chalk.white(rtl('الاستخدام:')));
  console.log(chalk.gray(rtl('   arabdevs <الأمر> [المسار]\n')));
  
  console.log(chalk.white(rtl('الأوامر:')));
  console.log(chalk.gray('   ' + '─'.repeat(55)));
  
  printRow('config --key <المفتاح>', 'حفظ مفتاح Gemini داخل الجهاز');
  printRow('comment [file|dir]', 'مع مسار: ملف محدد، بدون مسار: كل المشروع');
  printRow('debug [file] --error "<log>"', 'ملف + سياق الخطأ أو رسالة الخطأ وحدها');
  printRow('explain <file>', 'شرح ملف واحد بالعربي المبسط');
  printRow('generate <path>', 'قراءة الملفات وإنشاء GENERATED_README.md');
  printRow('help', 'عرض هذه الصفحة المختصرة');
  
  console.log('\n' + chalk.white(rtl('أمثلة سريعة:')));
  console.log(chalk.gray('   ' + '─'.repeat(55)));
  console.log(chalk.cyan('   arabdevs config --key AIzaSyXXXXXXXXX'));
  console.log(chalk.cyan('   arabdevs comment src/index.js'));
  console.log(chalk.cyan('   arabdevs comment'));
  console.log(chalk.cyan('   arabdevs debug app.js'));
  console.log(chalk.cyan('   arabdevs generate ./'));
  
  console.log('\n' + chalk.gray(rtl('مفتاح مجاني من: https://aistudio.google.com/\n')));
}

module.exports = { logArabic, printCustomHelp, fixArabic };