//entry point file

import puppeteer from "puppeteer";

const getQuotes = async () => {
  // start a puppeteer sesh
  // a visible browser (headless: false)(( easy to debug ))
  // -- no default viewport, so will be full width and height
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // open a new page

  const page = await browser.newPage();
  // open url
  // wait until loaded

  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });
  console.log("opening browser");
  // start scraping
  const quotes = await page.evaluate(() => {
    // fetch first element with css class = "quote"
    const quote = document.querySelector(".quote");

    //fetch the sub elements from the previously fetched quote element

    const text = quote.querySelector(".text").innerText;
    const author = quote.querySelector(".author").innerText;
    console.log(text);
    return { text, author };
  });
  console.log(quotes);
  await browser.close();
};
getQuotes();
