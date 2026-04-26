import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const outDir = join(root, 'dist');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const path of ['index.html', 'privacy.html', 'src', 'vendor']) {
  cpSync(join(root, path), join(outDir, path), { recursive: true });
}

writeFileSync(join(outDir, '.nojekyll'), '');
