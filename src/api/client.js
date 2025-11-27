require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const { logArabic, fixArabic } = require('../utils/logger');
const { getKey } = require('../utils/config');
const chalk = require('chalk');

const KEY_ENV_VARS = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'ARABDEVS_API_KEY'];
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.0-pro",
  "gemini-pro"
];
const GENERATION_CONFIG = {
  maxOutputTokens: 8000,
  temperature: 0.7,
};

// Get API key from config or env
function getApiKey() {
  const storedKey = getKey();
  if (storedKey && storedKey.trim()) {
    return storedKey.trim();
  }

  for (const envName of KEY_ENV_VARS) {
    const value = process.env[envName];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

// Send request to Gemini AI
async function sendToAI(promptText) {
  const apiKey = getApiKey();
  
  // Check if API key exists
  if (!apiKey) {
    console.log('\n' + chalk.red(fixArabic('لم يتم العثور على مفتاح جيميناي')));
    console.log(chalk.yellow(fixArabic('الخيار 1: أحفظه عبر الأمر:')));
    console.log(chalk.cyan('   arabdevs config --key AIzaXXXXXXXXXXX'));
    console.log(chalk.yellow(fixArabic('الخيار 2: أضف GEMINI_API_KEY أو GOOGLE_API_KEY داخل ملف .env')));
    console.log(chalk.gray(fixArabic('مفتاح مجاني من: https://aistudio.google.com/\n')));
    return null;
  }

  const genAI = new GoogleGenAI({ apiKey });
  const errors = [];
  
  for (const modelName of MODEL_CANDIDATES) {
    try {
      logArabic(`محاولة الاتصال بالموديل: ${modelName}`, 'info');
      
      const result = await genAI.models.generateContent({
        model: modelName,
        contents: promptText,
        generationConfig: GENERATION_CONFIG,
      });
      
      const text = typeof result.text === 'function'
        ? result.text()
        : (result.response && typeof result.response.text === 'function'
            ? result.response.text()
            : '');
      
      if (!text || text.trim() === '') {
        throw new Error('الاستجابة فارغة');
      }
      
      return text;
    } catch (error) {
      errors.push({ modelName, error: error.message });
      
      if (error.message.includes('API key') || error.message.includes('API_KEY_INVALID')) {
        logArabic('المفتاح غير صحيح أو منتهي', 'error');
        console.log(chalk.yellow(fixArabic('احصل على مفتاح جديد من: https://aistudio.google.com/')));
        return null;
      }
      
      if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        logArabic('تم تجاوز الحد المجاني', 'error');
        console.log(chalk.yellow(fixArabic('حاول غداً أو ترقّ للباقة المدفوعة')));
        return null;
      }
      
      if (error.message.includes('SAFETY')) {
        logArabic('تم رفض الطلب لأسباب أمنية', 'warning');
        return null;
      }
      
      if (error.code === 'ETIMEDOUT') {
        logArabic('انتهت مهلة الاتصال', 'error');
      } else if (error.code === 'ENOTFOUND') {
        logArabic('لا يوجد اتصال بالإنترنت', 'error');
      } else if (error.message.includes('Permission denied')) {
        logArabic('المفتاح لا يمتلك صلاحية لهذا الموديل', 'error');
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        logArabic(`الموديل غير متاح (${modelName})`, 'warning');
      } else {
        logArabic(`خطأ غير متوقع من ${modelName}: ${error.message}`, 'error');
      }
    }
  }
  
  logArabic('فشلت جميع المحاولات مع الموديلات المتاحة', 'error');
  errors.forEach(({ modelName, error }) => {
    console.log(chalk.gray(`- ${modelName}: ${error}`));
  });
  
  return null;
}

module.exports = { sendToAI, getApiKey };