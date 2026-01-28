const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const TARGET_DIRS = ['src', 'scripts'];
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build'];
const CONSOLE_METHODS_TO_REMOVE = ['log', 'warn'];

const isDryRun = process.argv.includes('--dry-run');
let filesModified = 0;
let logsRemoved = 0;

function processFile(filePath) {
  if (filePath.includes('.test.') || filePath.includes('.spec.')) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let fileLogsRemoved = 0;

  try {
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true, // Attempt to recover from parsing errors
    });

    traverse(ast, {
      CallExpression(path) {
        const callee = path.get('callee');
        if (
          callee.isMemberExpression() &&
          callee.get('object').isIdentifier({ name: 'console' }) &&
          CONSOLE_METHODS_TO_REMOVE.includes(callee.get('property').node.name)
        ) {
            fileLogsRemoved++;
            logsRemoved++;
            // Attempt to remove the entire statement if it's a standalone expression
            if (path.parentPath.isExpressionStatement()) {
                path.parentPath.remove();
            } else {
                 // If it's not a simple statement (e.g., part of a larger expression),
                 // we'll just replace the call with `undefined` to avoid breaking things.
                 // A better approach for complex cases might be to manually review.
                path.replaceWithSourceString('undefined');
            }
        }
      },
    });

    if (fileLogsRemoved > 0) {
        const { code } = generate(ast, {}, content);
        filesModified++;

        if (isDryRun) {
            console.log(`[DRY RUN] Would modify ${filePath}`);
            console.log(`--- REMOVED ${fileLogsRemoved} logs ---`);
        } else {
            fs.writeFileSync(filePath, code, 'utf8');
            console.log(`Modified ${filePath}`);
        }
    }

  } catch (error) {
      console.error(`Could not process ${filePath}: ${error.message}`);
  }


}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      if (!EXCLUDED_DIRS.includes(file)) {
        traverseDir(fullPath);
      }
    } else if (FILE_EXTENSIONS.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  });
}

console.log('Starting console.log cleanup with AST...');
if (isDryRun) {
  console.log('Running in DRY RUN mode. No files will be changed.');
}

TARGET_DIRS.forEach(dir => traverseDir(dir));

console.log('\n--- Cleanup Complete ---');
console.log(`Removed ${logsRemoved} logs from ${filesModified} files.`);
