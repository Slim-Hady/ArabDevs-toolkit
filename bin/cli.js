#!/usr/bin/env node
const { program } = require('commander');
const { logArabic } = require('../src/utils/logger'); // تحل مشكلة ظهور العربي بشكل معكوس ف التيرمنال

program
  .version('1.0.0')
  .description('أداة ذكاء اصطناعي لمساعدة المطورين العرب');

program
    .command('comment')
    .description('كوماند يقوم بعمل تعليقات على الكود')
    .action(() =>{
        logArabic('يتم عمل تعليقات على الكود', 'success')
        logArabic('يتم عمل تعليقات على الكود بس بالأبيض', 'info')
                logArabic('يتم عمل تعليقات على الكود بس بالأحمر', 'error')
    });
  

program.parse(process.argv);