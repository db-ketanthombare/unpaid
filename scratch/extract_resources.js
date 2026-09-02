const fs = require('fs');
const html = fs.readFileSync('unpaid_en.html', 'utf8');

const cssRegex = /href=["']([^"']+\.css[^"']*)["']/g;
const jsRegex = /src=["']([^"']+\.js[^"']*)["']/g;
const imgRegex = /(?:src|poster)=["']([^"']+\.(?:png|jpg|jpeg|svg|webp|gif|mp4)[^"']*)["']/gi;
const videoRegex = /<source[^>]+src=["']([^"']+)["']/gi;

console.log('=== CSS LINKS ===');
let match;
while ((match = cssRegex.exec(html)) !== null) {
  console.log(match[1]);
}

console.log('\n=== JS LINKS ===');
while ((match = jsRegex.exec(html)) !== null) {
  console.log(match[1]);
}

console.log('\n=== MEDIA / IMG LINKS ===');
while ((match = imgRegex.exec(html)) !== null) {
  console.log(match[1]);
}

console.log('\n=== VIDEO SOURCES ===');
while ((match = videoRegex.exec(html)) !== null) {
  console.log(match[1]);
}
