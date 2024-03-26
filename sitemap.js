console.log(helloWorld("Vito"));
/// this will parse the sitemap.xml to a string
// this is a test of the split freestyle keyboard this is super ergonomic

import puppeteer from "puppeteer";
import xml2js from "xml2js";

const xml = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page1</loc>
    <lastmod>2022-03-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/page2</loc>
    <lastmod>2022-03-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
`;
function xmlToUrl(xml) {
  const ans = xml2js.parseString(xml, (err, result) => {
    if (err) {
      console.error("error parsing xml:", err);
      return;
    }
    const urls = result.urlset.url.map((url) => url.loc[0]);
    return urls;
  });
  return ans;
}

xmlToUrl(xml);

const getSitemap = async () => {
  // start puppeteer browser session
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  //open a new page

  const page = await browser.newPage();
  // wait for load
  await page.goto("https://www.theodinproject.com/sitemap.xml", {
    waitUntil: "domcontentloaded",
  });

  const xmlData = await page.content();

  await browser.close();
  // parse string
  console.log(xmlToUrl(xmlData));
  // wait for load
  return sitemap;
};
const sitemapXml = getSitemap();
console.log("here is the sitemap xml:::::::");
console.log(sitemapXml);

function first(callback) {
  console.log(1), callback();
}

function second() {
  console.log(2);
}

first(second);
function helloWorld(name) {
  console.log("hello there");
  return "Hello " + name;
}
