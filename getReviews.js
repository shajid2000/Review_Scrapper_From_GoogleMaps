const puppeteer = require('puppeteer');

const getReviews = async (url, output = "json") => {
  try {
    output = output.toLowerCase();
    if (output !== "json" && output !== "object") {
      console.error('INVALID OUTPUT OPTION');
      return;
    }
    console.log('Launching headless chrome...');
    url = url.toString();
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    console.log('Going to URL');
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    console.log(page.url());
    console.log('Waiting for selector');
    await page.waitForSelector('.section-review-text');
    console.log('Element found! Now looping through data...');

    const data = await page.evaluate(() => {
      const reviewAuthorNames = Array.from(document.querySelectorAll('.section-review-title')).map(element => element.innerText);
      const dates = Array.from(document.querySelectorAll('.section-review-publish-date')).map(element => element.innerText);
      const ratings = Array.from(document.querySelectorAll('.section-review-stars')).map(element => element.children.length);
      const reviewsContent = Array.from(document.querySelectorAll('.section-review-text')).map(element => element.innerText);
      return {
        reviewAuthorNames,
        dates,
        ratings,
        reviewsContent
      };
    });

    console.log('Done! Closing the browser...');
    await browser.close();

    return output === "json" ? JSON.stringify(data) : data;
  } catch (error) {
    console.error('An error occurred:', error);
    return { error: "error while scraping data." };
  }
};

module.exports = getReviews;
