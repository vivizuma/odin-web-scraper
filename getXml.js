import puppeteer from "puppeteer";
import xml2js from "xml2js";

// get xml from url
// parse xml to string
// parse all urls from xml and push to an array.

async function siteMapToArray(url) {
  function getXmlFromUrl(url) {
    //start puppeteer
  }
}

async function getXmlFromUrl(url) {
  // start puppeteer
  // get xml

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto("https://www.theodinproject.com/sitemap.xml");
  const locs = page.evaluate(() => {
    const loc = document.querySelectorAll();
  });
}
// your dil with you're so raven. thats so raven, it's the future i can see
getXmlFromUrl();

//hello there this is a test of my new mechanical keyboard by keychron
//using this split layout allows my shoulders to spread wide and allows my chest to open up. this wil aid in shoulder posture and a
// help my breathing to engage my parasympathetic nervous system
