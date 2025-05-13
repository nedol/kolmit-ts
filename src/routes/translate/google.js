import puppeteer from 'puppeteer';

async function translate(text, from = 'nl', to = 'ru') {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = `https://translate.google.com/?sl=${from}&tl=${to}&text=${encodeURIComponent(text)}&op=translate`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForSelector('span[jsname="W297wb"]', { timeout: 10000 });

  const result = await page.$eval('span[jsname="W297wb"]', el => el.innerText);

  await browser.close();
  return result;
}

