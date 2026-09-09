/*
 * Porovná dvě sady screenshotů z tools/vizref.mjs a vypíše, kde se web změnil.
 *
 *   npx -y -p pixelmatch -p pngjs node tools/vizdiff.mjs screenshots/before screenshots/after
 *
 * Rozdílové obrázky se ukládají do screenshots/diff/ (červeně změněné pixely).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [aArg = 'screenshots/before', bArg = 'screenshots/after'] = process.argv.slice(2);
const A = path.resolve(ROOT, aArg);
const B = path.resolve(ROOT, bArg);
const DIFF = path.resolve(ROOT, 'screenshots/diff');

fs.mkdirSync(DIFF, { recursive: true });

const names = fs.readdirSync(A).filter((f) => f.endsWith('.png'));
let zmeneno = 0;

for (const name of names) {
  const bPath = path.join(B, name);
  if (!fs.existsSync(bPath)) {
    console.log(`?  ${name} – chybí v ${bArg}`);
    continue;
  }
  const a = PNG.sync.read(fs.readFileSync(path.join(A, name)));
  const b = PNG.sync.read(fs.readFileSync(bPath));

  if (a.width !== b.width || a.height !== b.height) {
    console.log(`!! ${name} – jiné rozměry: ${a.width}×${a.height} → ${b.width}×${b.height} (změnila se výška stránky)`);
    zmeneno++;
    continue;
  }

  const out = new PNG({ width: a.width, height: a.height });
  const pixely = pixelmatch(a.data, b.data, out.data, a.width, a.height, { threshold: 0.1 });
  const procenta = ((pixely / (a.width * a.height)) * 100).toFixed(2);

  if (pixely === 0) {
    console.log(`✓  ${name} – beze změny`);
  } else {
    fs.writeFileSync(path.join(DIFF, name), PNG.sync.write(out));
    console.log(`✗  ${name} – ${pixely} px (${procenta} %) → screenshots/diff/${name}`);
    zmeneno++;
  }
}

console.log(`\n${zmeneno === 0 ? 'Vizuálně beze změny.' : `Změněných snímků: ${zmeneno}/${names.length}`}`);
