import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const routeFiles = [
  path.join(repoRoot, 'api/oauth/start/linkedin.js'),
  path.join(repoRoot, 'api/oauth/callback/linkedin.js')
];

const importRegex = /from\s+['"]([^'"]+)['"]/g;

for (const routeFile of routeFiles) {
  const source = fs.readFileSync(routeFile, 'utf8');
  const matches = [...source.matchAll(importRegex)];
  for (const match of matches) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) {
      continue;
    }
    const resolved = path.resolve(path.dirname(routeFile), specifier);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Missing relative import target from ${path.relative(repoRoot, routeFile)} -> ${specifier} -> ${path.relative(repoRoot, resolved)}`);
    }
  }
}

console.log('OK: oauth route relative imports resolve to existing files');
