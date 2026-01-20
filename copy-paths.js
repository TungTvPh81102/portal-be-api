// Simple script to copy paths.js to the dist directory
const fs = require('fs');
const path = require('path');

// Ensure the target directory exists
const targetDir = path.join(__dirname, 'dist', 'src', 'config');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy the file
const sourceFile = path.join(__dirname, 'src', 'config', 'paths.js');
const targetFile = path.join(targetDir, 'paths.js');

try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('Successfully copied paths.js to dist/src/config/');
} catch (err) {
  console.error('Error copying paths.js:', err);
  process.exit(1);
}