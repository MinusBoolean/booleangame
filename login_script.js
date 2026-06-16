const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://reg.7e.ink/login');
  await page.waitForTimeout(2000);
  
  // Click login button
  await page.click('button:has-text("使用七亿账号登录")');
  await page.waitForTimeout(2000);
  
  // Fill in credentials
  await page.fill('input[type="email"]', '3412448941@qq.com');
  await page.fill('input[type="password"]', 'cwh3412448941');
  
  // Check checkbox
  await page.check('input[type="checkbox"]');
  
  // Click login
  await page.click('button:has-text("登录")');
  
  await page.waitForTimeout(5000);
  
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());
  
  await browser.close();
})();
