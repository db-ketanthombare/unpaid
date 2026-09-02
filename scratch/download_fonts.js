const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const css = fs.readFileSync('public/assets/css_zGvix2DW-1ntUIWs8srQpjgiYnd51SBPFHNJLJPEBA8.css', 'utf8');

const fontRegex = /url\((['"]?)([^'")]+?\.(?:woff2|woff|ttf|otf|svg)[^'")]*)\1\)/gi;
const fontUrls = new Set();
let match;
while ((match = fontRegex.exec(css)) !== null) {
  let fontPath = match[2];
  if (fontPath.startsWith('/')) {
    fontUrls.add('https://unpaid.be' + fontPath);
  } else if (fontPath.startsWith('http')) {
    fontUrls.add(fontPath);
  } else {
    // Relative to CSS location: /sites/default/files/css/
    fontUrls.add('https://unpaid.be/sites/default/files/css/' + fontPath);
  }
}

console.log('Found fonts:', Array.from(fontUrls));

for (const f of fontUrls) {
  try {
    const urlObj = new URL(f);
    const fname = path.basename(urlObj.pathname);
    const out = path.join('public/assets', fname);
    console.log(`Downloading font: ${f} -> ${out}`);
    execSync(`powershell -Command "Invoke-WebRequest -Uri '${f}' -OutFile '${out}' -TimeoutSec 30"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed font:', f, e.message);
  }
}
