import fs from 'node:fs';
import path from 'node:path';

const srcRoot = 'src';

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && entry.name === 'interfaces.ts') {
      files.push(full);
    }
  }
  return files;
}

const interfaceFiles = walk(srcRoot);
for (const filePath of interfaceFiles) {
  const dir = path.dirname(filePath);
  const typesPath = path.join(dir, 'types.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /export interface (\w+) extends (\w+) \{/g,
    'export type $1 = $2 & {',
  );
  content = content.replace(/export interface (\w+) \{/g, 'export type $1 = {');
  content = content.replace(/^interface (\w+) \{/gm, 'type $1 = {');
  fs.writeFileSync(typesPath, content);
  fs.unlinkSync(filePath);
  console.log(`Renamed ${filePath} -> ${typesPath}`);
}

function replaceImportsInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      replaceImportsInDir(full);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf8');
      const updated = content
        .replace(/from '(\.\/|\.\.\/[^']*\/)interfaces'/g, "$1types'")
        .replace(/from "(\.\/|\.\.\/[^"]*\/)interfaces"/g, '$1types"')
        .replace(/\/interfaces'/g, "/types'")
        .replace(/\/interfaces"/g, '/types"');
      if (updated !== content) {
        fs.writeFileSync(full, updated);
      }
    }
  }
}

replaceImportsInDir(srcRoot);
console.log('Updated imports');
