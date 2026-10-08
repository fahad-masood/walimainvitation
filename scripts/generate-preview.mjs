/**
 * Rebuild the static social image with locally installed Chromium.
 * Run: node scripts/generate-preview.mjs
 * Set CHROMIUM_BIN when Chromium is not available on PATH.
 * Uses only Node built-ins; no browser automation dependency is needed.
 */
import { readFile, writeFile, mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { execFileSync, spawn } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'public', 'og-preview.png');
const font = async (name) => (await readFile(join(root, 'src/assets/fonts', name))).toString('base64');
const [serif, italic, sans, arabic, floral] = await Promise.all([
  font('cormorant-latin-500-normal.woff2'),
  font('cormorant-latin-400-italic.woff2'),
  font('inter-latin-500-normal.woff2'),
  font('amiri-arabic-400-normal.woff2'),
  readFile(join(root, 'public/art/botanical-spray.svg')),
]);
const botanical = `data:image/svg+xml;base64,${floral.toString('base64')}`;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Daawat-e-Walima</title>
<style>
@font-face{font-family:Cormorant;src:url(data:font/woff2;base64,${serif}) format('woff2');font-weight:500}
@font-face{font-family:Cormorant;src:url(data:font/woff2;base64,${italic}) format('woff2');font-weight:400;font-style:italic}
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${sans}) format('woff2');font-weight:500}
@font-face{font-family:Amiri;src:url(data:font/woff2;base64,${arabic}) format('woff2')}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#F7F4EC;color:#183B36}
body{-webkit-font-smoothing:antialiased;position:relative;text-align:center}
.border{position:absolute;inset:20px;border:1px solid #B4965D;opacity:.62}.border.inner{inset:28px;opacity:.25}
.architecture{position:absolute;inset:0;width:1200px;height:630px;fill:none;stroke:#B4965D;stroke-width:1;opacity:.57}
.floral{position:absolute;top:27px;left:29px;width:313px;height:391px}.floral.right{left:auto;right:29px;transform:scaleX(-1)}
.opening{position:absolute;top:126px;width:100%;font-family:Amiri,serif;font-size:31px;line-height:1.65}
.grace{position:absolute;top:190px;width:100%;font:500 10px Inter,sans-serif;letter-spacing:3.4px}
.occasion{position:absolute;top:228px;width:100%;font:500 29px Cormorant,serif;letter-spacing:6px}
h1{position:absolute;top:278px;width:100%;margin:0;font:500 89px/1.08 Cormorant,serif;letter-spacing:-1.5px}
h1 span{font-weight:400;font-style:italic;font-size:67px;color:#B4965D;padding:0 6px}
.divider{position:absolute;top:397px;left:50%;transform:translateX(-50%);width:160px;height:25px;fill:none;stroke:#B4965D;stroke-width:.9}
.date{position:absolute;top:442px;width:100%;font:500 31px/1 Cormorant,serif;letter-spacing:.7px}
.place{position:absolute;top:495px;width:100%;font:500 10px Inter,sans-serif;letter-spacing:3px}
.signature{position:absolute;top:565px;left:50%;transform:translateX(-50%);width:36px;height:36px;fill:none;stroke:#B4965D;stroke-width:.8}
</style></head><body>
<div class="border"></div><div class="border inner"></div>
<svg class="architecture" viewBox="0 0 1200 630" aria-hidden="true">
<path d="M230 554V289C230 182 390 167 489 127C543 106 578 75 600 50C622 75 657 106 711 127C810 167 970 182 970 289V554"/>
<path opacity=".47" d="M240 554V290C240 191 397 177 493 137C547 116 578 88 600 64C622 88 653 116 707 137C803 177 960 191 960 290V554"/>
<path opacity=".3" d="M95 470h43v-43l-30 30 30 30v-60m-43 0h43m924 43h43v-43l-30 30 30 30v-60m-43 0h43"/>
<path d="M217 554h26m714 0h26"/>
</svg>
<img class="floral" src="${botanical}" alt=""><img class="floral right" src="${botanical}" alt="">
<div class="opening" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
<div class="grace">BY THE GRACE OF ALLAH</div>
<div class="occasion">DAAWAT-E-WALIMA</div>
<h1>Fahad <span>&amp;</span> Rahnuma</h1>
<svg class="divider" viewBox="0 0 160 25" aria-hidden="true"><path d="M0 12.5h59m42 0h59M80 4l8.5 8.5L80 21l-8.5-8.5Z"/><path d="m80 8 4.5 4.5L80 17l-4.5-4.5Z"/><circle cx="65" cy="12.5" r="1"/><circle cx="95" cy="12.5" r="1"/></svg>
<div class="date">15 November 2026</div>
<div class="place">REGAL PALACE · TANDA</div>
<svg class="signature" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 4 32 18 18 32 4 18ZM8 8h20v20H8ZM18 11l7 7-7 7-7-7Z"/></svg>
</body></html>`;

function findChromium() {
  const candidates = [process.env.CHROMIUM_BIN, 'chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'].filter(Boolean);
  for (const candidate of candidates) {
    try {
      execFileSync(candidate, ['--version'], { stdio: 'ignore' });
      return candidate;
    } catch {}
  }
  throw new Error('Install Chromium, or set CHROMIUM_BIN to its executable path.');
}

const temporary = await mkdtemp(join(tmpdir(), 'walima-preview-'));
let browser;
let socket;
try {
  await mkdir(dirname(output), { recursive: true });
  browser = spawn(findChromium(), [
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu',
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${join(temporary, 'browser')}`, '--force-device-scale-factor=1',
    '--window-size=1200,630', '--disable-background-networking', '--disable-component-update',
    '--remote-debugging-port=0', 'about:blank',
  ], {
    env: { ...process.env, XDG_CACHE_HOME: join(temporary, 'cache'), XDG_CONFIG_HOME: join(temporary, 'config') },
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  const endpoint = await new Promise((resolveEndpoint, reject) => {
    const timeout = setTimeout(() => reject(new Error('Chromium startup timed out.')), 15000);
    let stderr = '';
    browser.stderr.on('data', (chunk) => {
      stderr += chunk;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timeout); resolveEndpoint(match[1]); }
    });
    browser.once('error', (error) => { clearTimeout(timeout); reject(error); });
    browser.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`Chromium exited (${code}): ${stderr}`)); });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolveSocket, reject) => {
    socket.addEventListener('open', resolveSocket, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    const request = pending.get(message.id);
    if (!request) return;
    clearTimeout(request.timeout);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });
  const command = (method, params = {}, sessionId) => new Promise((resolveCommand, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out.`)); }, 15000);
    pending.set(id, { resolve: resolveCommand, reject, timeout });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await command('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await command('Target.attachToTarget', { targetId, flatten: true });
  await command('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false }, sessionId);
  await command('Page.enable', {}, sessionId);
  const { frameTree } = await command('Page.getFrameTree', {}, sessionId);
  await command('Page.setDocumentContent', { frameId: frameTree.frame.id, html }, sessionId);
  const ready = await command('Runtime.evaluate', {
    expression: `new Promise(resolve => { const ready = async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); await new Promise(requestAnimationFrame); resolve(true); }; document.readyState === 'complete' ? ready() : window.addEventListener('load', ready, {once:true}); })`,
    awaitPromise: true, returnByValue: true,
  }, sessionId);
  if (ready.exceptionDetails) throw new Error('Preview fonts or floral artwork failed to load.');
  const heading = await command('Runtime.evaluate', { expression: `document.querySelector('h1')?.textContent`, returnByValue: true }, sessionId);
  if (!heading.result?.value?.includes('Fahad')) throw new Error('Preview page did not render the invitation.');
  const screenshot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId);
  await writeFile(output, Buffer.from(screenshot.data, 'base64'));
  await command('Browser.close');
  socket.close();
  const png = await readFile(output);
  if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) {
    throw new Error('Preview dimensions must be 1200 × 630.');
  }
  console.log(`Created public/og-preview.png (1200 × 630, ${(await stat(output)).size.toLocaleString()} bytes)`);
} finally {
  socket?.close();
  if (browser && browser.exitCode === null) {
    const closed = new Promise(resolveClosed => browser.once('close', resolveClosed));
    browser.kill();
    await closed;
  }
  await rm(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
