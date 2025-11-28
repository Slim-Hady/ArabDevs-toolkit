أهلاً بك زميلي الكاتب التقني! سأقوم بإنشاء ملف `README.md` احترافي ومفصل لمشروع "ArabDevs CLI"، مع مراعاة جميع المتطلبات ودمج المعلومات المستفادة من ملفات المشروع المقدمة.

---

# ArabDevs CLI

## أداة المطورين العرب - AI CLI Tool for Developers

[![npm version](https://badge.fury.io/js/arabdevs.svg)](https://www.npmjs.com/package/arabdevs)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

أداة سطر الأوامر (CLI) هذه هي مبادرة عربية خالصة، مصممة خصيصًا للمطورين العرب. تربط الأداة بمحرك Google Gemini لشرح، تصحيح الأخطاء، وتوثيق قواعد الأكواد البرمجية باللغة العربية بطلاقة. تتميز بإعداد سريع، رسائل سجل (logs) واضحة باللغة العربية، ومخرجات متوافقة مع اتجاه النص من اليمين إلى اليسار (RTL) في أي طرفية.

### الميزات الأساسية

*   **شرح الكود بالعربية**: احصل على شرح مفصل لأي جزء من الكود البرمجي باللغة العربية.
*   **تصحيح الأخطاء الذكي**: أرسل الكود ورسائل الخطأ للحصول على تشخيص وحلول مقترحة.
*   **إنشاء التعليقات تلقائيًا**: أضف تعليقات شارحة (comments) لكودك بسرعة.
*   **توليد التوثيق**: قم بإنشاء ملف `README.md` احترافي لمشروعك بناءً على محتوياته.
*   **دعم RTL كامل**: تم تصميم الأداة لعرض النصوص العربية بشكل صحيح ومنسق في الطرفية.
*   **سهولة الاستخدام**: واجهة سطر أوامر بسيطة وواضحة.

### المتطلبات

*   [Node.js](https://nodejs.org/en/download/) الإصدار 20 فما فوق (مطلوب بواسطة `commander@14` و `@google/genai`).
*   [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) الإصدار 9 فما فوق.
*   مفتاح API من [Google AI Studio](https://aistudio.google.com/) مع إمكانية الوصول إلى موديلات Gemini (مثل `gemini-2.5-flash`).
*   اتصال بالإنترنت (تتطلب الأداة الاتصال بواجهة برمجة تطبيقات Google AI).

### الاعتمادات الأساسية

*   [`commander`](https://www.npmjs.com/package/commander) – لتحليل وسائط سطر الأوامر (CLI argument parsing).
*   [`chalk`](https://www.npmjs.com/package/chalk) – لإخراج الألوان في الطرفية.
*   [`@google/genai`](https://www.npmjs.com/package/@google/genai) – عميل API للاتصال بموديلات Gemini.
*   [`arabic-reshaper`](https://www.npmjs.com/package/arabic-reshaper) + [`bidi-js`](https://www.npmjs.com/package/bidi-js) – لتصحيح عرض النص العربي في الطرفيات التي لا تدعم RTL.
*   [`ignore`](https://www.npmjs.com/package/ignore) – لاحترام ملفات `.gitignore` عند مسح ملفات المشروع.
*   [`dotenv`](https://www.npmjs.com/package/dotenv) – لتحميل متغيرات البيئة من ملفات `.env` تلقائيًا.
*   [`fs-extra`](https://www.npmjs.com/package/fs-extra) – مساعدات نظام الملفات (للميزات المستقبلية).

---

## التسطيب (Installation)

لتثبيت ArabDevs CLI، اتبع الخطوات التالية:

1.  **استنساخ المستودع (Clone the repository):**
    ```bash
    git clone https://github.com/<your-org>/ArabDevs-toolkit.git
    ```

2.  **الانتقال إلى مجلد المشروع:**
    ```bash
    cd "ArabDevs-toolkit"
    ```

3.  **تثبيت الاعتمادات (Install dependencies):**
    ```bash
    npm install
    ```

4.  **ربط الأمر عالميًا (اختياري - Optional for global command):**
    إذا كنت ترغب في تشغيل الأداة مباشرة باستخدام `arabdevs` من أي مكان في الطرفية، قم بالربط:
    ```bash
    npm link
    ```
    إذا فضلت عدم استخدام `npm link`، يمكنك تشغيل الأداة باستخدام `node bin/cli.js <command>`.

---

## التهيئة (Configuration)

قبل البدء باستخدام الأداة، يجب عليك حفظ مفتاح Google Gemini API الخاص بك. هناك طريقتان للقيام بذلك:

1.  **حفظ المفتاح باستخدام الأمر `config`:**
    هذه هي الطريقة الموصى بها، حيث تقوم بحفظ المفتاح مرة واحدة في ملف تهيئة محلي (`~/.arabdevs-config.json`).
    ```bash
    arabdevs config --key AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    ```
    (استبدل `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` بمفتاح API الفعلي الخاص بك).

2.  **استخدام متغيرات البيئة أو ملف `.env`:**
    بدلاً من ذلك، يمكنك تعيين مفتاح API كمتغير بيئة في نظامك، أو إضافته إلى ملف `.env` في جذر مشروعك. الأداة ستبحث عن المفتاح في أي من هذه المتغيرات (بالترتيب):
    *   `GEMINI_API_KEY`
    *   `GOOGLE_API_KEY`
    *   `ARABDEVS_API_KEY`

    مثال لملف `.env`:
    ```
    GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    ```

---

## الأوامر المتاحة (Available Commands)

| الأمر                               | الوصف                                                                |
| :---------------------------------- | :------------------------------------------------------------------- |
| `arabdevs help`                     | عرض المساعدة المختصرة للأداة مع نص عربي متوافق مع RTL.                |
| `arabdevs comment [path]`           | توليد تعليقات برمجية (code comments) باللغة العربية. إذا تم حذف `path`، فسيتم مسح المشروع بأكمله (باستثناء الملفات المتجاهلة). |
| `arabdevs debug [path] --error "<stack>"` | إرسال الكود بالإضافة إلى رسالة خطأ اختيارية من الطرفية لتشخيص المشكلة. إذا لم يتم تحديد `path`، يجب تمرير `error--`  فقط. |
| `arabdevs explain <file>`           | شرح ملف واحد بالتفصيل باللغة العربية.                                 |
| `arabdevs generate <path>`          | قراءة الملفات من المجلد المحدد وإنشاء ملف `GENERATED_README.md`. |
| `arabdevs config --key <KEY>`       | حفظ أو تحديث مفتاح Gemini API محليًا.                              |

---

## أمثلة الاستخدام (Usage Examples)

إليك بعض الأمثلة السريعة لكيفية استخدام ArabDevs CLI:

```bash
# حفظ مفتاح Gemini API الخاص بك
arabdevs config --key AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# إضافة تعليقات للمشروع الحالي بالكامل (باستثناء الملفات المتجاهلة)
arabdevs comment

# إضافة تعليقات لملف معين
arabdevs comment src/api/client.js

# تصحيح ملف مع رسالة خطأ من الطرفية
arabdevs debug src/index.js --error "TypeError: cannot read properties of undefined at someFunction (app.js:10:5)"

# تصحيح رسالة خطأ فقط دون تحديد ملفات مشروع
arabdevs debug --error "Error: Cannot connect to database"

# شرح ملف معين
arabdevs explain src/utils/logger.js

# توليد ملف README.md للمستودع بأكمله
arabdevs generate .
```

---

## عرض النص العربي (Arabic Rendering)

تقوم الأداة بإعادة تشكيل وإعادة ترتيب النص العربي باستخدام مكتبتي `arabic-reshaper` و `bidi-js`. هذا يضمن أن الطرفيات التي تفتقر إلى دعم RTL الأصلي ستظل تعرض الحروف العربية متصلة وصحيحة.

إذا استمر ظهور النص مفصولاً أو معكوساً، يمكنك تجربة ما يلي:
*   تثبيت خط يدعم الحروف العربية (مثل "Noto Sans Arabic").
*   تشغيل الأمر داخل محاكي طرفية يدعم RTL بشكل أفضل.
*   ضبط متغير البيئة `LC_ALL=ar_EG.UTF-8` لمساعدة الطرفية على فهم دعم RTL (على أنظمة Linux/macOS).

---

## استكشاف الأخطاء وإصلاحها (Troubleshooting)

*   **"unknown option '--key'"**
    *   **الحل**: تأكد من استخدام الأمر الفرعي `config` بشكل صحيح: `arabdevs config --key <KEY>`.

*   **"Missing `generate` path"**
    *   **الحل**: يجب تمرير مسار لـ `generate`: `arabdevs generate .` أو `arabdevs generate src/`.

*   **"Gemini 404 / model unavailable"**
    *   **الحل**: تأكد أن مفتاح API الخاص بك لديه صلاحية الوصول إلى موديلات Gemini وأن جهازك يمكنه الوصول إلى `https://generativelanguage.googleapis.com`. تحاول الأداة تلقائيًا استخدام معرفات موديل متعددة. قد يكون هناك قيود جغرافية أو قيود على المفتاح.

*   **"RTL output still broken"**
    *   **الحل**: تحقق من إعدادات اللغة والخط في طرفيتك. يمكنك محاولة تعيين `export LC_ALL=ar_EG.UTF-8` في الطرفية (خاصة على أنظمة Unix-like) للمساعدة في تمكين دعم RTL.

*   **"لم يتم العثور على مفتاح جيميناي" / "API key invalid"**
    *   **الحل**: لم يتم تهيئة مفتاح API بشكل صحيح. تأكد من حفظه باستخدام `arabdevs config --key <KEY>` أو تعيينه كمتغير بيئة صالح. تأكد من أن المفتاح صحيح وغير منتهي الصلاحية من [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## هيكلية الملفات (Project Structure)

يوضح الهيكل التالي تنظيم الملفات والمجلدات في مشروع ArabDevs CLI:

```
.
├── bin/
│   └── cli.js                  # نقطة الدخول الرئيسية لـ CLI، يقوم بتحليل الأوامر والوسائط.
├── src/
│   ├── api/
│   │   └── client.js           # يتعامل مع الاتصال بواجهة برمجة تطبيقات Google Gemini، ويدير مفاتيح API واختيار الموديل.
│   ├── prompts/
│   │   ├── comment.js          # قالب توجيه AI (prompt) لتوليد تعليقات الكود.
│   │   ├── debug.js            # قالب توجيه AI لتصحيح أخطاء الكود.
│   │   ├── explain.js          # قالب توجيه AI لشرح الكود.
│   │   ├── generate.js         # قالب توجيه AI لتوليد ملفات README.md.
│   │   └── index.js            # يختار ويجمع قوالب توجيه AI المناسبة مع ملفات المشروع.
│   └── utils/
│       ├── config.js           # يدير حفظ واسترجاع مفتاح API في ملف تهيئة محلي.
│       ├── fileReader.js       # يقرأ ملفات المشروع بشكل متكرر، مع احترام قواعد .gitignore.
│       ├── formatter.js        # (غير مستخدمة مباشرة في المنطق الحالي) أدوات لتنسيق النصوص، الأكواد، والماركداون.
│       ├── logger.js           # يعالج الإخراج الملون للطرفية وعرض النصوص العربية RTL (إعادة التشكيل والترتيب).
│       └── test.js             # ملف اختبار بسيط (مثال).
├── .gitignore                  # يحدد الملفات التي يجب تجاهلها من تتبع Git.
├── .npmignore                  # يحدد الملفات التي يجب استبعادها عند نشر الحزمة إلى npm.
├── package.json                # بيانات تعريف المشروع، الاعتمادات، وتعريفات السكريبتات.
├── package-lock.json           # يسجل شجرة الاعتمادات الدقيقة للمشروع.
└── test-direct.js              # سكريبت اختبار اتصال مباشر بـ Google Gemini API.
```

---

## سكريبتات التطوير (Development Scripts)

```bash
npm test           # (مكان للاختبارات - أضف اختباراتك حسب الحاجة)
node test-direct.js  # اختبار سريع للاتصال بواجهة برمجة التطبيقات
```

---

## المساهمة (Contributing)

نرحب بمساهماتك! للمساهمة في مشروع ArabDevs CLI:

1.  قم بعمل `Fork` للمستودع (repository) وأنشئ فرعًا جديدًا (branch).
2.  أدخل تغييراتك مع تعليقات واضحة داخل الكود فقط عند الضرورة.
3.  قم بتشغيل `lint` والاختبارات (إذا تم تهيئتها).
4.  أرسل طلب دمج (Pull Request) يصف التغيير بوضوح باللغة العربية أو الإنجليزية — بدون رموز تعبيرية (emojis).

---

## الترخيص (License)

هذا المشروع مرخص بموجب [ISC License](https://opensource.org/licenses/ISC).
© ArabDevs. لا تتردد في عمل `fork` للمشروع، تخصيصه، ونشر توزيعاتك الخاصة طالما تم الحفاظ على الإسناد (attribution).

---