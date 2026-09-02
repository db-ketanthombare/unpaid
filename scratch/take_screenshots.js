const puppeteer = require('puppeteer');

const viewports = [
  { width: 1440, height: 900, name: '1440' },
  { width: 1024, height: 768, name: '1024' },
  { width: 768, height: 1024, name: '768' },
  { width: 375, height: 812, name: '375' },
  { width: 1920, height: 1080, name: '1920' },
];

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: `scratch/screenshot_${vp.name}.png`, fullPage: false });
    console.log(`Saved screenshot_${vp.name}.png`);
  }

  // Also take full page screenshot at 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: `scratch/screenshot_1440_full.png`, fullPage: true });
  console.log('Saved screenshot_1440_full.png');

  await browser.close();
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
