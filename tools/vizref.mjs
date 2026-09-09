/*
 * Vizuální reference webu – nafotí celou stránku v sadě rozlišení.
 *
 * Spuštění (Chromium už je v ~/Library/Caches/ms-playwright):
 *   npx -y -p playwright@1.60.0 node tools/vizref.mjs --out screenshots/before
 *   npx -y -p playwright@1.60.0 node tools/vizref.mjs --out screenshots/after
 *
 * Porovnání: node tools/vizdiff.mjs (viz hlavička toho souboru).
 */

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const outArg = args.indexOf('--out');
const OUT = path.resolve(ROOT, outArg > -1 ? args[outArg + 1] : 'screenshots/current');

/* Šířky jsou vybrané kolem breakpointů v css/style.css (1100, 900, 640),
   vždy těsně pod a nad hranicí, ať se zlom pozná hned. */
const VIEWPORTS = [
  ['mobil-360', 360, 740],
  ['mobil-390', 390, 844],
  ['mobil-414', 414, 896],
  ['mobil-640', 640, 900],
  ['tablet-641', 641, 900],
  ['tablet-768', 768, 1024],
  ['tablet-900', 900, 1200],
  ['laptop-901', 901, 900],
  ['laptop-1100', 1100, 900],
  ['laptop-1101', 1101, 900],
  ['desktop-1280', 1280, 800],
  ['desktop-1440', 1440, 900],
  ['desktop-1920', 1920, 1080],
  ['desktop-2560', 2560, 1440],
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function startServer() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(ROOT, rel === '/' ? 'index.html' : rel);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) return res.writeHead(404).end('404');
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/* Vypnout animace/přechody a zvýrazněný textový kurzor – jinak by se stejná
   stránka nafotila pokaždé jinak a diff by hlásil falešné změny. */
const STABILIZE = `*,*::before,*::after{animation:none!important;transition:none!important;
  caret-color:transparent!important;scroll-behavior:auto!important}`;

async function prepare(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: STABILIZE });
  // Projet stránku dolů a zpět, ať se dotáhnou i lazy-loaded obrázky.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.images].filter((i) => !i.complete).map((i) => i.decode().catch(() => {}))
    );
    await document.fonts.ready;
  });
  await page.waitForTimeout(250);
}

const server = await startServer();
const url = `http://127.0.0.1:${server.address().port}/index.html`;
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await context.newPage();

for (const [name, width, height] of VIEWPORTS) {
  await page.setViewportSize({ width, height });
  await prepare(page, url);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  console.log(`✓ ${name}.png (${width}×${height})`);
}

/* Stavy, které na statické fotce nejsou vidět, ale refactoring je umí rozbít. */

// Otevřené mobilní menu.
await page.setViewportSize({ width: 390, height: 844 });
await prepare(page, url);
await page.click('.nav__toggle');
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, 'stav-mobilni-menu.png') });
console.log('✓ stav-mobilni-menu.png');

// Karta služby pod myší (obsah karty se na desktopu ukazuje až na :hover).
await page.setViewportSize({ width: 1440, height: 900 });
await prepare(page, url);
const card = page.locator('.card').first();
if (await card.count()) {
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, 'stav-karta-hover.png') });
  console.log('✓ stav-karta-hover.png');
}

// Skip link po zaostření klávesnicí (ověřuje bod „Přístupnost“ z PLAN.md).
await prepare(page, url);
await page.keyboard.press('Tab');
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(OUT, 'stav-skip-link.png'), clip: { x: 0, y: 0, width: 1440, height: 300 } });
console.log('✓ stav-skip-link.png');

await browser.close();
server.close();
console.log(`\nHotovo → ${path.relative(ROOT, OUT)}/`);
