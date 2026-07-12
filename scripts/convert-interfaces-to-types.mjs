import fs from 'node:fs';

const typesPath = 'src/app/_lib/interfaces/types.ts';
let content = fs.readFileSync(typesPath, 'utf8');

content = content.replace(
  /export interface (\w+) extends (\w+) \{/g,
  'export type $1 = $2 & {',
);
content = content.replace(/export interface (\w+) \{/g, 'export type $1 = {');
content = content.replace(
  /\{ \[questionId: string\]: any \}/g,
  '{ [questionId: string]: JsonValue }',
);
content = content.replace(/Record<string, unknown>/g, 'Record<string, JsonValue>');

if (!content.includes("from '@/lib/api/json'")) {
  content = content.replace(
    "import { UserRole } from '../Enums/UserRole';",
    "import type { JsonValue } from '@/lib/api/json';\nimport { UserRole } from '../Enums/UserRole';",
  );
}

fs.writeFileSync(typesPath, content);
console.log('Converted types.ts');
