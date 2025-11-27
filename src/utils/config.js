const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { fixArabic } = require('./logger');

// Config file path in home directory
const configPath = path.join(os.homedir(), '.arabdevs-config.json');

// Save API key to config file
function saveKey(key) {
  if (!key || key.trim() === '') {
    throw new Error('المفتاح فارغ');
  }
  
  const config = { apiKey: key.trim() };
  
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(chalk.gray(fixArabic('مسار الحفظ: ')) + chalk.cyan(configPath));
  } catch (err) {
    throw new Error('فشل حفظ الملف: ' + err.message);
  }
}

// Get API key from config file
function getKey() {
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content);
      return config.apiKey;
    } catch (e) {
      return null;
    }
  }
  return null;
}

module.exports = { saveKey, getKey };