import { chromium } from 'playwright';
const OUT = '/tmp/claude-0/-home-user-signal242/24e4df3e-1eeb-5aa0-afc9-4be348e62c0f/scratchpad/shots';
const [, , target, name, scheme = 'dark', clickSel] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, colorScheme: scheme });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
await page.goto(target, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
if (clickSel) { await page.click(clickSel); await page.waitForTimeout(1200); }
const height = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < height; y += 700) { await page.evaluate((o) => window.scrollTo(0, o), y); await page.waitForTimeout(140); }
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/${name}-top.png` });
await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
console.log('ERRORS:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
