require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const os = require('os');

// قراءة المفتاح
const configPath = path.join(os.homedir(), '.arabdevs-config.json');
let apiKey = null;

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  apiKey = config.apiKey;
}

if (!apiKey) {
  apiKey = process.env.GEMINI_API_KEY;
}

console.log('🔍 المفتاح المستخدم:', apiKey ? apiKey.substring(0, 20) + '...' : 'غير موجود');

if (!apiKey) {
  console.error(' لا يوجد مفتاح!');
  process.exit(1);
}

// اختبار الاتصال
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    console.log('⏳ جاري الاختبار...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("قل 'مرحبا' بالعربية فقط");
    const response = await result.response;
    const text = response.text();
    
    console.log(' نجح الاتصال!');
    console.log(' الرد:', text);
  } catch (error) {
    console.error('❌ فشل الاختبار!');
    console.error('السبب:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 المفتاح خاطئ. احصل على مفتاح جديد من:');
      console.log('   https://aistudio.google.com/app/apikey');
    }
  }
}

test();