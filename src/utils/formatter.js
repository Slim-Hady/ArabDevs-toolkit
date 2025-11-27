const chalk = require('chalk');

class Formatter {
  static formatResponse(text, type = 'default') {
    const colors = {
      success: chalk.green,
      error: chalk.red,
      warning: chalk.yellow,
      info: chalk.blue,
      default: chalk.white
    };

    const color = colors[type] || colors.default;
    return color(text);
  }

  static formatCode(code, language = '') {
    return `\`\`\`${language}\n${code}\n\`\`\``; // ✅ إصلاح: backticks صحيحة
  }

  static createMarkdown(content, title = '') {
    let markdown = '';
    
    if (title) {
      markdown += `# ${title}\n\n`;
    }
    
    markdown += content;
    markdown += '\n\n---\n';
    markdown += `*تم الإنشاء بواسطة AI Code Assistant في ${new Date().toLocaleString('ar-EG')}*\n`;
    
    return markdown;
  }

  static truncate(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  static highlightSyntax(code, language) {
    return this.formatCode(code, language);
  }
}

module.exports = Formatter;