import puppeteer from "puppeteer";
import fs from "fs";

import axios from "axios";
import xml2js from "xml2js";
const jsDataStorage = [];
const sitemapUrl = "https://www.theodinproject.com/sitemap.xml";

const demoUrl =
  "https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code/";

// get sitemap and create an array of urls
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
    console.log("loc", parsedXml.urlset.url[24].loc);
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

  // I will use axios instead for a simple fetch request - it will be faster and more efficient than launcing
  // a fully fledged browser such as puppeteer
}

async function getDataTitleAndQuestions(urlArray) {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(urlArray, { waitUntil: "domcontentloaded" });
  // get title
  const title = await page.evaluate(() => {
    const titleText = document.querySelector(
      '[data-test-id="lesson-title-header"]'
    ).innerText;
    return titleText;
  });
  const questions = await page.evaluate(() => {
    const questionsArray = [];
    const questionSection = document.querySelector("#knowledge-check ul");
    // this will respond with a node list of the ul elements?
    // we need to go deeper and select all the li elements within, and push them to an array
    // the text content to an array, that is
    const questionsNodeList = questionSection.querySelectorAll("li");
    if (!questionsNodeList) {
      return "no questions found";
    }
    questionsNodeList.forEach((item) => {
      questionsArray.push(item.innerText);
    });
    return questionsArray;
  });
  const dataObject = {
    title: title,
    questions: questions,
  };
  console.log(dataObject.title);
  console.log(dataObject.questions);
  await browser.close();
  return { title, questions };
}

async function main(sitemapUrl) {
  try {
    const urlArray = await scrapeUrlsFromSitemapXml(sitemapUrl);
    const data = await getDataTitleAndQuestions(urlArray);
  } catch (error) {
    console.error("err:", error);
  }
}
async function storeDataAsJSON(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync("data.json", jsonData);
  console.log("data stored as json lol");
}

main(sitemapUrl);

function appendToJsData(arr, dataObject) {
  arr.push(dataObject);
}
