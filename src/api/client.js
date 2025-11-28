require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const { logArabic, fixArabic } = require('../utils/logger');
const { getKey } = require('../utils/config');
const chalk = require('chalk');

const KEY_ENV_VARS = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'ARABDEVS_API_KEY'];
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro"
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
      
      // Check for errors in response
      if (result.error) {
        throw new Error(JSON.stringify(result.error));
      }
      
      // Access text as property (new SDK format)
      const text = result.text || (result.response && result.response.text) || '';
      
      if (!text || text.trim() === '') {
        throw new Error('الاستجابة فارغة');
      }
      
      return text;
    } catch (error) {
      let errorMsg = error.message;
      let errorCode = null;
      
      // Parse JSON error objects
      try {
        const parsed = JSON.parse(errorMsg);
        if (parsed.error) {
          errorCode = parsed.error.code;
          errorMsg = parsed.error.message || JSON.stringify(parsed.error);
        }
      } catch (e) {
        // Not JSON, use message as-is
      }
      
      errors.push({ modelName, error: errorMsg });
      
      // Handle specific error codes
      if (errorCode === 503 || errorMsg.includes('overloaded') || errorMsg.includes('UNAVAILABLE')) {
        logArabic(`الموديل ${modelName} مشغول حالياً، جاري المحاولة مع موديل آخر...`, 'warning');
        continue; // Try next model
      }
      
      if (errorCode === 404 || errorMsg.includes('not found') || errorMsg.includes('NOT_FOUND')) {
        logArabic(`الموديل ${modelName} غير متاح`, 'warning');
        continue; // Try next model
      }
      
      if (errorMsg.includes('API key') || errorMsg.includes('API_KEY_INVALID')) {
        logArabic('المفتاح غير صحيح أو منتهي', 'error');
        console.log(chalk.yellow(fixArabic('احصل على مفتاح جديد من: https://aistudio.google.com/')));
        return null;
      }
      
      if (errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        logArabic('تم تجاوز الحد المجاني', 'error');
        console.log(chalk.yellow(fixArabic('حاول غداً أو ترقّ للباقة المدفوعة')));
        return null;
      }
      
      if (errorMsg.includes('SAFETY')) {
        logArabic('تم رفض الطلب لأسباب أمنية', 'warning');
        return null;
      }
      
      if (error.code === 'ETIMEDOUT') {
        logArabic('انتهت مهلة الاتصال', 'error');
      } else if (error.code === 'ENOTFOUND') {
        logArabic('لا يوجد اتصال بالإنترنت', 'error');
      } else if (errorMsg.includes('Permission denied')) {
        logArabic('المفتاح لا يمتلك صلاحية لهذا الموديل', 'error');
      } else {
        logArabic(`خطأ من ${modelName}: ${errorMsg}`, 'error');
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