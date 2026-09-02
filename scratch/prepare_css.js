const fs = require('fs');

let css = fs.readFileSync('public/assets/css_zGvix2DW-1ntUIWs8srQpjgiYnd51SBPFHNJLJPEBA8.css', 'utf8');

// Replace font URLs with local paths
css = css.replace(/url\(['"]?(?:https:\/\/unpaid\.be)?(?:\/themes\/custom\/epsenkaas_theme\/fonts\/|\/sites\/default\/files\/css\/)?([^'")\?#]+\.(?:woff2|woff|ttf|otf))[^'"]*['"]?\)/gi, (match, filename) => {
  return `url('/assets/${filename}')`;
});

// Replace icon SVG URLs with local paths
css = css.replace(/url\(['"]?(?:https:\/\/unpaid\.be)?(?:\/themes\/custom\/epsenkaas_theme\/images\/icons\/application\/|\/themes\/custom\/epsenkaas_theme\/images\/icons\/social\/|\/themes\/custom\/epsenkaas_theme\/images\/layout-builder\/)?([^'")\?#]+\.(?:svg|png|jpg|jpeg))(#?[^'")]*)['"]?\)/gi, (match, filename, hash) => {
  return `url('/assets/${filename}${hash || ''}')`;
});

fs.writeFileSync('public/assets/main_theme.css', css);
console.log('Created main_theme.css with local asset paths!');
