const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => {
    function getDetails(sel) {
      const el = document.querySelector(sel);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
        margin: `${style.marginTop} ${style.marginRight} ${style.marginBottom} ${style.marginLeft}`,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        display: style.display,
        gap: style.gap
      };
    }
    return {
      header: getDetails('header.main-header'),
      container: getDetails('header.main-header .container'),
      logo: getDetails('.site-logo img'),
      menuBlock: getDetails('#block-headermenu'),
      menuWrapper: getDetails('.menu-wrapper'),
      mainMenu: getDetails('.main-menu'),
      mainMenuItems: Array.from(document.querySelectorAll('.main-menu ul.menu li a')).map(a => ({
        text: a.innerText,
        rect: a.getBoundingClientRect(),
        padding: window.getComputedStyle(a).padding,
        margin: window.getComputedStyle(a).margin,
        fontSize: window.getComputedStyle(a).fontSize,
        fontFamily: window.getComputedStyle(a).fontFamily,
        fontWeight: window.getComputedStyle(a).fontWeight
      })),
      accountMenu: getDetails('.account-menu'),
      loginBtn: getDetails('.account-menu a'),
      langSwitcher: getDetails('.language-switcher'),
      langItems: Array.from(document.querySelectorAll('.language-switcher li')).map(li => ({
        text: li.innerText,
        rect: li.getBoundingClientRect(),
        margin: window.getComputedStyle(li).margin,
        fontSize: window.getComputedStyle(li).fontSize,
        fontFamily: window.getComputedStyle(li).fontFamily,
        fontWeight: window.getComputedStyle(li).fontWeight
      }))
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
