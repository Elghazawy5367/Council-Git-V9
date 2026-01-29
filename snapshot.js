import fs from 'fs';
import path from 'path';

// Constants
const OUTPUT_FILE = 'COUNCIL_FULL_SNAPSHOT_5.md';
const ROOT_DIR = './';
const SRC_DIR = './src';
const INCLUDED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json'];
const CRITICAL_CONFIG_FILES = ['package.json', 'tsconfig.json', 'vite.config.ts', 'vite.config.js', 'tailwind.config.js'];
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', '.idx'];
const EXCLUDED_FILES = ['package-lock.json'];
const EXCLUDED_EXTENSIONS = ['.png', '.jpg', '.svg', '.ico'];

// Utility function to check if a file should be included
function shouldIncludeFile(filePath) {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath);

  // Exclude specific files and extensions
  if (EXCLUDED_FILES.includes(baseName) || EXCLUDED_EXTENSIONS.includes(ext)) {
    return false;
  }

  // Include only specific extensions
  return INCLUDED_EXTENSIONS.includes(ext);
}

// Utility function to check if a directory should be excluded
function shouldExcludeDir(dirName) {
  return EXCLUDED_DIRS.includes(dirName);
}

// Recursive function to scan directories
function scanDirectory(dirPath, files = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!shouldExcludeDir(entry.name)) {
        scanDirectory(fullPath, files);
      }
    } else if (entry.isFile() && shouldIncludeFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to write the snapshot to the output file
function writeSnapshot(files) {
  const outputStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' });

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    outputStream.write(`================================================================================\n`);
    outputStream.write(`File: ${file}\n`);
    outputStream.write(`================================================================================\n`);
    outputStream.write(`${content}\n\n`);
  });

  outputStream.end();
}

// Main function
function createSnapshot() {
  

  // Scan the src directory
  const srcFiles = scanDirectory(SRC_DIR);

  // Add critical config files from the root directory
  const rootFiles = CRITICAL_CONFIG_FILES
    .map((file) => path.join(ROOT_DIR, file))
    .filter((file) => fs.existsSync(file));

  // Combine all files
  const allFiles = [...srcFiles, ...rootFiles];

  

  // Write the snapshot
  writeSnapshot(allFiles);

  
}

// Execute the script
createSnapshot();