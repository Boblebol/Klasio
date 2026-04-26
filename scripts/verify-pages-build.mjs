import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

const requiredPaths = [
  'index.html',
  'app.html',
  'privacy.html',
  'src/core.mjs',
  'vendor/jspdf/jspdf.umd.min.js',
  'vendor/jspdf/LICENSE',
  '.nojekyll',
];

const requiredLinks = [
  ['index.html', 'href="./app.html"'],
  ['index.html', 'href="./app.html?demo=1"'],
  ['index.html', 'href="./privacy.html"'],
  ['app.html', "from './src/core.mjs'"],
  ['app.html', 'href="privacy.html"'],
  ['privacy.html', 'href="./app.html"'],
];

function fail(message) {
  console.error(`Pages artifact check failed: ${message}`);
  process.exitCode = 1;
}

for (const path of requiredPaths) {
  const fullPath = join(dist, path);
  if (!existsSync(fullPath)) {
    fail(`missing dist/${path}`);
    continue;
  }
  try {
    const stats = statSync(fullPath);
    if (path !== '.nojekyll' && stats.isFile() && stats.size === 0) {
      fail(`empty dist/${path}`);
    }
  } catch {
    fail(`missing dist/${path}`);
  }
}

for (const [path, text] of requiredLinks) {
  const fullPath = join(dist, path);
  if (!existsSync(fullPath)) continue;
  const content = readFileSync(fullPath, 'utf8');
  if (!content.includes(text)) {
    fail(`dist/${path} does not contain ${JSON.stringify(text)}`);
  }
}

if (process.exitCode) process.exit();

process.stdout.write('Pages artifact check passed.\n');
