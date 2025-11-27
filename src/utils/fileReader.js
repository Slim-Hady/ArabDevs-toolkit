const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

// Get ignore rules from .gitignore
function getIgnoreRules(rootDir) {
  const gitignorePath = path.join(rootDir, '.gitignore');
  const ig = ignore();
  
  // Default ignore rules
  ig.add(['node_modules', '.git', '.env', 'dist', 'coverage']);
  
  // Add .gitignore rules if exists
  if (fs.existsSync(gitignorePath)) {
    try {
      ig.add(fs.readFileSync(gitignorePath, 'utf-8'));
    } catch (err) {
      // Continue if .gitignore read fails
    }
  }
  
  return ig;
}

// Read project files recursively
function readProjectFiles(targetPath, rootDir = process.cwd(), ig = null) {
  // Initialize ignore rules on first call
  if (!ig) ig = getIgnoreRules(rootDir);
  
  let results = [];
  
  // Check if path exists
  if (!fs.existsSync(targetPath)) {
    return [];
  }
  
  const stat = fs.statSync(targetPath);
  
  // Case 1: Single file
  if (stat.isFile()) {
    const relativePath = path.relative(rootDir, targetPath);
    if (!ig.ignores(relativePath)) {
      try {
        results.push({
          path: relativePath,
          content: fs.readFileSync(targetPath, 'utf-8')
        });
      } catch (e) {
        // Skip binary files
      }
    }
    return results;
  }
  
  // Case 2: Directory
  const list = fs.readdirSync(targetPath);
  
  list.forEach(file => {
    const fullPath = path.join(targetPath, file);
    const relativePath = path.relative(rootDir, fullPath);
    
    // Skip ignored paths
    if (ig.ignores(relativePath)) return;
    
    const fileStat = fs.statSync(fullPath);
    
    if (fileStat.isDirectory()) {
      // Recursive call for subdirectories
      const subResults = readProjectFiles(fullPath, rootDir, ig);
      results = results.concat(subResults);
    } else {
      try {
        // Read file content
        const content = fs.readFileSync(fullPath, 'utf-8');
        results.push({
          path: relativePath,
          content: content
        });
      } catch (err) {
        // Skip unreadable files (images, videos, etc)
      }
    }
  });
  
  return results;
}

module.exports = { readProjectFiles };