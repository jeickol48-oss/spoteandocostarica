#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', '.expo', 'android', 'ios']);
const ALLOWED_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.md']);
const CONFLICT_PATTERNS = [/^<<<<<<< /m, /^=======$/m, /^>>>>>>> /m];

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) continue;
    files.push(fullPath);
  }
  return files;
}

function findConflictLines(content) {
  const lines = content.split(/\r?\n/);
  const matches = [];
  lines.forEach((line, idx) => {
    if (line.startsWith('<<<<<<< ') || line === '=======' || line.startsWith('>>>>>>> ')) {
      matches.push(idx + 1);
    }
  });
  return matches;
}

const files = walk(ROOT);
const conflicts = [];

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!CONFLICT_PATTERNS.some((pattern) => pattern.test(content))) continue;

  const lineNumbers = findConflictLines(content);
  if (lineNumbers.length) {
    conflicts.push({ filePath, lineNumbers });
  }
}

if (!conflicts.length) {
  console.log('✅ No se encontraron marcadores de conflicto de merge.');
  process.exit(0);
}

console.error('❌ Se encontraron marcadores de conflicto de merge:');
for (const conflict of conflicts) {
  const relativePath = path.relative(ROOT, conflict.filePath);
  console.error(`- ${relativePath}: líneas ${conflict.lineNumbers.join(', ')}`);
}
console.error('\nResuelve los conflictos eliminando <<<<<<<, ======= y >>>>>>> y conservando solo el código correcto.');
process.exit(1);
