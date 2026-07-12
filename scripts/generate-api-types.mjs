/**
 * Generate TypeScript types from the backend OpenAPI contract.
 *
 * Spec resolution (first hit wins):
 *   1. OPENAPI_SPEC_PATH — absolute or relative file path
 *   2. Sibling backend: ../E-Online-Backend-Business/contracts/openapi.v1.json
 *   3. Vendored:       ./contracts/openapi.v1.json
 *   4. OPENAPI_SPEC_URL / {BASE_API_URL}/swagger/v1/swagger.json
 *
 * Usage:
 *   npm run generate:api-types
 *   OPENAPI_SPEC_PATH=../E-Online-Backend-Business/contracts/openapi.v1.json npm run generate:api-types
 */
import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'src', 'app', '_lib', 'api', 'generated');
const outFile = path.join(outDir, 'schema.d.ts');
const vendoredSpec = path.join(root, 'contracts', 'openapi.v1.json');
const siblingSpec = path.resolve(
  root,
  '..',
  'E-Online-Backend-Business',
  'contracts',
  'openapi.v1.json',
);

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveSpec() {
  if (process.env.OPENAPI_SPEC_PATH) {
    const resolved = path.resolve(root, process.env.OPENAPI_SPEC_PATH);
    if (!(await exists(resolved))) {
      throw new Error(`OPENAPI_SPEC_PATH not found: ${resolved}`);
    }
    return { kind: 'file', source: resolved, label: resolved };
  }

  if (await exists(siblingSpec)) {
    return { kind: 'file', source: siblingSpec, label: siblingSpec };
  }

  if (await exists(vendoredSpec)) {
    return { kind: 'file', source: vendoredSpec, label: vendoredSpec };
  }

  const specUrl =
    process.env.OPENAPI_SPEC_URL ??
    `${process.env.BASE_API_URL ?? 'http://localhost:5064'}/swagger/v1/swagger.json`;
  return { kind: 'url', source: specUrl, label: specUrl };
}

async function main() {
  let openapiTS;
  let astToString;
  try {
    ({ default: openapiTS, astToString } = await import('openapi-typescript'));
  } catch {
    console.error(
      'Missing dependency: openapi-typescript\n' +
        '  npm i -D openapi-typescript\n',
    );
    process.exit(1);
  }

  const spec = await resolveSpec();
  console.log(`OpenAPI source: ${spec.label}`);

  const input =
    spec.kind === 'file' ? pathToFileURL(spec.source) : new URL(spec.source);

  const ast = await openapiTS(input, {
    exportType: true,
  });
  const output = typeof ast === 'string' ? ast : astToString(ast);

  await mkdir(outDir, { recursive: true });
  await writeFile(
    outFile,
    `/**\n * AUTO-GENERATED — do not edit.\n * Run: npm run generate:api-types\n * Source: ${spec.label}\n */\n\n${output}`,
    'utf8',
  );
  console.log(`Wrote ${path.relative(root, outFile)}`);

  // Keep FE vendored contract in sync when generating from sibling/path.
  if (spec.kind === 'file' && path.resolve(spec.source) !== path.resolve(vendoredSpec)) {
    await mkdir(path.dirname(vendoredSpec), { recursive: true });
    await copyFile(spec.source, vendoredSpec);
    console.log(`Synced ${path.relative(root, vendoredSpec)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
