const explainPrompt = require('./explain');
const debugPrompt = require('./debug');
const commentPrompt = require('./comment');
const generatePrompt = require('./generate');

// Build complete prompt from files + instructions
function buildPrompt(type, files) {
  // Build files context
  let filesContext = "\n\n=== ملفات المشروع ===\n";
  
  files.forEach(file => {
    filesContext += `\n--- File: ${file.path} ---\n`;
    filesContext += `${file.content}\n`;
    filesContext += `--- End of ${file.path} ---\n`;
  });
  
  // Select appropriate prompt
  let systemInstruction = "";
  
  switch (type) {
    case 'explain':
      systemInstruction = explainPrompt;
      break;
    case 'debug':
      systemInstruction = debugPrompt;
      break;
    case 'comment':
      systemInstruction = commentPrompt;
      break;
    case 'generate':
      systemInstruction = generatePrompt;
      break;
    default:
      systemInstruction = "اشرح هذا الكود.";
  }
  
  // Combine instruction + context
  return `${systemInstruction}\n${filesContext}`;
}

module.exports = { buildPrompt };