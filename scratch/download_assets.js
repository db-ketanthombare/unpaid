const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const urls = [
  'https://unpaid.be/sites/default/files/css/css_knEnZTtXiNekZ8QWo197cuAqPLCLBu2qau-VB3d25ds.css',
  'https://unpaid.be/sites/default/files/css/css_zGvix2DW-1ntUIWs8srQpjgiYnd51SBPFHNJLJPEBA8.css',
  'https://unpaid.be/sites/default/files/css/css_FTjjvnat0bxn73xblJgLXamZ7j0peHvT0BsMMAtLfnk.css',
  'https://unpaid.be/themes/custom/epsenkaas_theme/logo.svg',
  'https://unpaid.be/sites/default/files/styles/site_width/public/2024-12/unpaid-footer-logos_0.png',
  'https://unpaid.be/sites/default/files/styles/teaser/public/2025-02/unpaid-39_1.jpg',
  'https://unpaid.be/sites/default/files/styles/teaser/public/2025-02/unpaid-realisations-01.jpg',
  'https://unpaid.be/sites/default/files/styles/teaser/public/2025-02/unpaid-realisations-02.png',
  'https://unpaid.be/sites/default/files/styles/teaser/public/unpaid-migrate/blog/36113.png',
  'https://unpaid.be/sites/default/files/styles/teaser/public/2026-06/onbetaalde-factuur-waarschuwingssignalen.png.png',
  'https://unpaid.be/sites/default/files/styles/teaser/public/2026-06/faillisement_0.png',
  'https://unpaid.be/sites/default/files/unpaid-migrate/paragraph_text/3252.png',
  'https://unpaid.be/sites/default/files/unpaid-migrate/paragraph_text/3258.svg',
  'https://unpaid.be/sites/default/files/unpaid-migrate/paragraph_text/3259.png',
  'https://unpaid.be/sites/default/files/2025-10/yuki_business_logo_v_pos_0.png',
  'https://unpaid.be/sites/default/files/2024-12/visma_bouwsoft_logo_pos_transp.png',
  'https://unpaid.be/sites/default/files/unpaid-migrate/paragraph_text/52177.png',
  'https://unpaid.be/sites/default/files/unpaid-migrate/paragraph_text/17324.png',
  'https://unpaid.be/sites/default/files/unpaid-migrate/paragraph_text/30182.png',
  'https://unpaid.be/sites/default/files/unpaid-migrate/paragraph_text/16705.png',
  'https://unpaid.be/sites/default/files/2024-12/logo-eenvoudigfactureren.png',
  'https://unpaid.be/sites/default/files/unpaid-migrate/paragraph_text/16971.png',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/11507.png',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/11505.jpg',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/11506.png',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/11504.jpeg',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/11508.png',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/19931.jpg',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/12251.jpg',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/12705.jpg',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/15321.jpg',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/15698.jpg',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/15974.jpeg',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/58744.png',
  'https://unpaid.be/sites/default/files/styles/square/public/unpaid-migrate/testimonial/11516.jpg',
  'https://unpaid.be/sites/default/files/2025-02/unpaid-hero.mp4'
];

fs.mkdirSync(path.join(__dirname, 'downloaded'), { recursive: true });

for (const u of urls) {
  const parsed = new URL(u);
  const localName = path.basename(parsed.pathname);
  const outPath = path.join(__dirname, 'downloaded', localName);
  console.log(`Downloading: ${u} -> ${localName}`);
  try {
    execSync(`powershell -Command "Invoke-WebRequest -Uri '${u}' -OutFile '${outPath}' -UserAgent 'Mozilla/5.0' -TimeoutSec 30"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to download ${u}:`, err.message);
  }
}
