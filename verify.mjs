// Headless runtime smoke test using JSDOM
// Loads the production bundle into a JSDOM environment and verifies React renders without errors
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DIST = join(process.cwd(), 'dist');
const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8');

// Patch the index html so it points at the actual JS/CSS assets
const jsAsset = (indexHtml.match(/assets\/index-[^"]+\.js/) || [])[0];
const cssAsset = (indexHtml.match(/assets\/index-[^"]+\.css/) || [])[0];
if (!jsAsset) { console.error('No JS asset found in dist/index.html'); process.exit(1); }

class LocalLoader extends ResourceLoader {
  fetch(url, options) {
    if (url.startsWith('file://')) return super.fetch(url, options);
    if (url.endsWith(jsAsset) || url.endsWith(cssAsset)) {
      const buf = readFileSync(join(DIST, url.replace(/^https?:.*?\//, '')));
      return Promise.resolve(buf);
    }
    return Promise.resolve(Buffer.from(''));
  }
}

const virtualConsole = new VirtualConsole();
const consoleErrors = [];
const consoleWarnings = [];
virtualConsole.on('jsdomError', (err) => consoleErrors.push(String(err)));
virtualConsole.on('error', (...args) => consoleErrors.push(args.map(String).join(' ')));
virtualConsole.on('warn', (...args) => consoleWarnings.push(args.map(String).join(' ')));
// forward to real stdout
virtualConsole.sendTo(console, { omitJSDOMErrors: false });

const dom = new JSDOM(
  `<!doctype html><html><head><link rel="stylesheet" href="/${cssAsset}"></head><body><div id="root"></div></body></html>`,
  {
    url: `http://localhost/`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    resources: new LocalLoader(),
    virtualConsole
  }
);

// Inject the bundle script
const jsCode = readFileSync(join(DIST, jsAsset), 'utf8');
const scriptEl = dom.window.document.createElement('script');
scriptEl.type = 'module';
scriptEl.textContent = jsCode;

// Polyfills jsdom may not provide for React 18
dom.window.MessageChannel = class { constructor() { this.port1 = { postMessage: () => {} }; this.port2 = { onmessage: null }; } };
dom.window.matchMedia = dom.window.matchMedia || (() => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }));
dom.window.scrollTo = () => {};

try {
  dom.window.document.body.appendChild(scriptEl);
} catch (e) {
  console.error('Script append error:', e.message);
}

// Wait a moment for React to mount, then inspect DOM
await new Promise(r => setTimeout(r, 1500));

const root = dom.window.document.getElementById('root');
const html = root ? root.innerHTML : '<empty>';

console.log('--- RUNTIME SMOKE TEST ---');
console.log('Root has content:', html.length > 50, `(${html.length} chars)`);
console.log('Console errors:', consoleErrors.length);
if (consoleErrors.length) {
  consoleErrors.forEach(e => console.log('  ERR:', e));
}
console.log('Console warnings:', consoleWarnings.length);
if (consoleWarnings.length) {
  consoleWarnings.forEach(w => console.log('  WARN:', w.slice(0, 200)));
}

// Check for expected content
const checks = [
  { name: 'JobNest branding', regex: /JobNest/i },
  { name: 'Hero heading', regex: /Find a job/i },
  { name: 'Search input', regex: /placeholder="Job title/i }
];
let allOk = true;
for (const c of checks) {
  const ok = c.regex.test(html);
  console.log(`  ${ok ? '✓' : '�'} ${c.name}`);
  if (!ok) allOk = false;
}

process.exit(allOk && consoleErrors.length === 0 ? 0 : 1);
