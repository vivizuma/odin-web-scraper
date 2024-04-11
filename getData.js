import puppeteer from "puppeteer";
import fs from "fs";

import axios from "axios";
import xml2js from "xml2js";

let browser;
const sitemapUrl = "https://www.theodinproject.com/sitemap.xml";
// Returns array of lesson urls
async function scrapeUrlsFromSitemapXml(sitemapUrl) {
  //assume sitemap url is valid
  // start puppeteer
  let urlArray = [];
  try {
    const response = await axios.get(sitemapUrl);
    console.log("Status Text:", response.statusText);
    const parsedXml = await xml2js.parseStringPromise(response.data);
    console.log(parsedXml.urlset.url.length);
    // 418 urls
    // loop through
    // if current url is not lesson, continue
    // if it includes lesson .. push to array
    let allUrls = parsedXml.urlset.url;

    for (let i = 0; i < allUrls.length; i++) {
      const currentUrl = parsedXml.urlset.url[i].loc[0];
      if (!currentUrl.includes(".com/lessons/")) {
        continue;
      }
      urlArray.push(currentUrl);
    }
    return urlArray;
  } catch (error) {
    console.log("error fetching sitemap xml:", error);
  }

  // I will use axios instead for a simple fetch request - it will be faster and more efficient than launching
  // a full browser instance
}

async function startPuppeteer() {
  browser = await puppeteer.launch({
    headless: true,
  });
}
async function stopPuppeteer() {
  await browser.close();
}

async function storeDataAsJSON(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync("data.json", jsonData);
}

async function getDataFromCurrentPage(currentPageUrl) {
  const page = await browser.newPage();
  await page.goto(currentPageUrl, {
    waitUntil: "domcontentloaded",
  });

  const title = await page.evaluate(() => {
    const titleSection = document.querySelector(
      '[data-test-id="lesson-title-header"]'
    ).innerText;
    return titleSection;
  });

  const questions = await page.evaluate(() => {
    const questionSection = document.querySelector("#knowledge-check ul");
    if (!questionSection) {
      return null;
    } else {
      const questionsNodeList = questionSection.querySelectorAll("li");
      const questionsArray = Array.from(questionsNodeList);
      const innerTextArray = questionsArray.map((item) => {
        return item.innerText;
      });
      return innerTextArray;
    }
  });
  const currentPageDataObject = {
    title: title,
    questions: questions,
  };
  console.log(currentPageDataObject);
  await page.close();

  // return currentpage object
  return currentPageDataObject;
}

main(sitemapUrl);

async function main(sitemapUrl) {
  try {
    const allDataArray = [];
    //start browser
    await startPuppeteer();
    // get array of urls
    const urls = await scrapeUrlsFromSitemapXml(sitemapUrl);
    // return currentpage
    for (let i = 0; i < urls.length; i++) {
      //send current page to data extractor function
      let currentPage = urls[i];
      console.log(currentPage);
      let currentPageData = await getDataFromCurrentPage(currentPage);

      // push pageData to allDataArray
      allDataArray.push(currentPageData);
      storeDataAsJSON(allDataArray);
      const dataAsJson = convertToJson(allDataArray);
      console.log(dataAsJson);
    }
    console.log("this is the alldata", allDataArray);
    exportJsObjectAsMarkdown(allDataArray);
    urlsToMd(urls);
    await stopPuppeteer();
  } catch (error) {
    console.error("err:", error);
  } finally {
    await stopPuppeteer();
  }
}

function convertToJson(data) {
  const jsonData = JSON.stringify(data, null, 2);
}

function exportJsObjectAsMarkdown(data) {
  data[0].questions;
  //
  let markdown = "# Knowledge Check\n\n";
  for (let i = 0; i < data.length; i++) {
    markdown += `\n\n## ${data[i].title}\n\n`;
    if (data[i].questions === null) {
      console.log("no questions here");
      continue;
    }
    for (let j = 0; j < data[i].questions.length; j++) {
      markdown += `* ${data[i].questions[j]}\n`;
    }
  }
  console.log(markdown);
  // export markdown as md file
  saveStringAsMarkdownFile(markdown);
}

function saveStringAsMarkdownFile(string) {
  const filePath = "knowledge-check.md";
  fs.writeFile(filePath, string, (err) => {
    if (err) {
      console.log("Error writing file:", err);
      return;
    }
    console.log("Knowledge check .md file created");
  });
}

function urlsToMd(urls) {
  let markdown = "";
  const filePath = "url-array.md";
  for (let i = 0; i < urls.length; i++) {
    markdown += `\n${urls[i]}\n`;
  }
  fs.writeFile(filePath, markdown, (err) => {
    if (err) {
      console.log("Error writing file:", err);
      return;
    }
    console.log("array url file created");
  });
}
