#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SHOULD_FIX = process.argv.includes('--fix');
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', '.expo', 'android', 'ios']);
const ALLOWED_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.md']);
const CONFLICT_PATTERNS = [/^\s*<<<<<<< /m, /^\s*=======$/m, /^\s*>>>>>>> /m, /^\s*\|\|\|\|\|\|\| /m];

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
    const trimmedStart = line.trimStart();
    if (
      trimmedStart.startsWith('<<<<<<< ') ||
      trimmedStart === '=======' ||
      trimmedStart.startsWith('>>>>>>> ') ||
      trimmedStart.startsWith('||||||| ')
    ) {
      matches.push(idx + 1);
    }
  });
  return matches;
}

function removeConflictMarkerLines(content) {
  return content
    .split(/\r?\n/)
    .filter(
      (line) => {
        const trimmedStart = line.trimStart();
        return (
          !trimmedStart.startsWith('<<<<<<< ') &&
          trimmedStart !== '=======' &&
          !trimmedStart.startsWith('>>>>>>> ') &&
          !trimmedStart.startsWith('||||||| ')
        );
      }
    )
    .join('\n');
}

function removeDuplicateNamedImportMembers(content) {
  const lines = content.split(/\r?\n/);
  let insideImportBlock = false;
  const seenMembers = new Set();
  const output = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('import {') && !trimmed.includes('} from ')) {
      insideImportBlock = true;
      seenMembers.clear();
      output.push(line);
      continue;
    }

    if (insideImportBlock) {
      if (trimmed.startsWith('} from ')) {
        insideImportBlock = false;
        output.push(line);
        continue;
      }

      if (trimmed === '') {
        output.push(line);
        continue;
      }

      const rawMember = trimmed.replace(/,$/, '');
      if (seenMembers.has(rawMember)) {
        continue;
      }
      seenMembers.add(rawMember);
      output.push(line);
      continue;
    }

    output.push(line);
  }

  return output.join('\n');
}

const files = walk(ROOT);
const conflicts = [];

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!CONFLICT_PATTERNS.some((pattern) => pattern.test(content))) continue;

  const lineNumbers = findConflictLines(content);
  if (lineNumbers.length) {
    if (SHOULD_FIX) {
      const cleaned = removeDuplicateNamedImportMembers(removeConflictMarkerLines(content));
      fs.writeFileSync(filePath, cleaned, 'utf8');
    }
    conflicts.push({ filePath, lineNumbers });
  }
}

if (SHOULD_FIX && !conflicts.length) {
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const normalized = removeDuplicateNamedImportMembers(content);
    if (normalized !== content) {
      fs.writeFileSync(filePath, normalized, 'utf8');
    }
  }
}

if (!conflicts.length) {
  console.log('✅ No se encontraron marcadores de conflicto de merge.');
  process.exit(0);
}

if (SHOULD_FIX) {
  console.log('🛠️ Se eliminaron líneas de marcadores de conflicto en los siguientes archivos:');
  for (const conflict of conflicts) {
    const relativePath = path.relative(ROOT, conflict.filePath);
    console.log(`- ${relativePath}: líneas ${conflict.lineNumbers.join(', ')}`);
  }
  console.log('\n✅ Marcadores removidos. Revisa el código resultante y conserva únicamente el bloque correcto.');
  process.exit(0);
}

console.error('❌ Se encontraron marcadores de conflicto de merge:');
for (const conflict of conflicts) {
  const relativePath = path.relative(ROOT, conflict.filePath);
  console.error(`- ${relativePath}: líneas ${conflict.lineNumbers.join(', ')}`);
}
console.error('\nResuelve los conflictos eliminando <<<<<<<, ======= y >>>>>>> y conservando solo el código correcto.');
process.exit(1);
