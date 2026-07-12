/**
 * Fetch OpenAPI types from the backend Swagger document.
 *
 * Usage:
 *   npm run generate:api-types
 *   OPENAPI_SPEC_URL=http://localhost:5064/swagger/v1/swagger.json npm run generate:api-types
 *
 * Requires: backend running (or a reachable spec URL) and `openapi-typescript` installed.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'src', 'app', '_lib', 'api', 'generated');
const outFile = path.join(outDir, 'schema.d.ts');

const specUrl =
  process.env.OPENAPI_SPEC_URL ??
  `${process.env.BASE_API_URL ?? 'http://localhost:5064'}/swagger/v1/swagger.json`;

async function main() {
  let openapiTS;
  try {
    ({ default: openapiTS } = await import('openapi-typescript'));
  } catch {
    console.error(
      'Missing dependency: openapi-typescript\n' +
        '  npm i -D openapi-typescript\n',
    );
    process.exit(1);
  }

  console.log(`Fetching OpenAPI spec: ${specUrl}`);
  const output = await openapiTS(new URL(specUrl), {
    // Keep output stable for diffs
    exportType: true,
  });

  await mkdir(outDir, { recursive: true });
  await writeFile(
    outFile,
    `/**\n * AUTO-GENERATED — do not edit.\n * Run: npm run generate:api-types\n * Source: ${specUrl}\n */\n\n${output}`,
    'utf8',
  );
  console.log(`Wrote ${path.relative(root, outFile)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
