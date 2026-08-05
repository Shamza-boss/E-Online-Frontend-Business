import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walk(full);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf8');
      const updated = content
        .replace(/ \.\/types'/g, " from './types'")
        .replace(/ \.\.\/types'/g, " from '../types'")
        .replace(/ \.\.\/\.\.\/types'/g, " from '../../types'")
        .replace(/ \.\.\/\.\.\/\.\.\/types'/g, " from '../../../types'");
      if (updated !== content) {
        fs.writeFileSync(full, updated);
      }
    }
  }
}

walk('src');
console.log('Fixed broken type imports');
