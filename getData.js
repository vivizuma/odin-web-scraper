import puppeteer from "puppeteer";
import fs from "fs";

import axios from "axios";
import xml2js from "xml2js";
import { CLIENT_RENEG_LIMIT } from "tls";
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

  // I will use axios instead for a simple fetch request - it will be faster and more efficient than launcing
  // a fully fledged browser such as puppeteer
}

async function startPuppeteer() {
  browser = await puppeteer.launch({
    headless: true,
  });
}
async function stopPuppeteer() {
  await browser.close();
}

// Getting info
async function getTitle(browser, pageUrl) {
  const page = browser.newPage();
  await page.goto(pageUrl);
  const title = page.evaluate(() => {
    const titleText = document.querySelector(
      '[data-test-id="lesson-title-header"]'
    ).innerText;
    if (titleText) {
      return titleText;
    } else {
      return "Hey";
    }
  });
  console.log(title);
  return title;
}
async function getQuestions(page) {
  return questionsList;
}
// Returns an object with title and questions
async function getDataTitleAndQuestions(urlArray) {
  const page = await browser.newPage();
  // function to iterate through url list and append all relevant data to an object
  let data = [];
  const getPages = async function () {
    for (let i = 0; i < 5; i++) {
      const currentpage = await page.goto(urlArray[i]);
      try {
        //get title
        const title = await page.evaluate(() => {
          const titleText = document.querySelector(
            '[data-test-id="lesson-title-header"]'
          ).innerText;
          if (!titleText) {
            return "no title found";
          } else {
            return titleText;
          }
        });
        //get questions
        const questions = await page.evaluate(() => {
          const questionsArray = [];
          const questionSection = document.querySelector("#knowledge-check ul");
          const questionsNodeList = questionSection.querySelectorAll("li");
          if (questionsNodeList == null || questionsNodeList.length == 0) {
            return null;
          } else {
            questionsNodeList.forEach((item) => {
              questionsArray.push(item);
            });
            return questionsArray;
          }
        });
      } catch (error) {
        console.error(error);
        continue;
      }
    }
    return data;
  };
}

async function storeDataAsJSON(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync("data.json", jsonData);
  console.log("data stored as json lol");
}

async function getDataFromCurrentPage(currentPageUrl) {
  // start puppeteer

  const page = await browser.newPage();
  await page.goto(currentPageUrl, {
    waitUntil: "domcontentloaded",
  });
  // this works -----
  const title = await page.evaluate(() => {
    const titleSection = document.querySelector(
      '[data-test-id="lesson-title-header"]'
    ).innerText;
    return titleSection;
  });
  /// this works ^^^^
  const questions = await page.evaluate(() => {
    /// YOU STOPPED HERE::::::::::::::::::::

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

function jsonToMarkdown(jsonData) {
  let markdown = "";

  // Add title and description if available
  if (jsonData.title) markdown += `# ${jsonData.title}\n\n`;
  if (jsonData.description) markdown += `${jsonData.description}\n\n`;

  // Iterate over items array and convert to Markdown table
  markdown += "Knowledge Check\n";
  markdown += "\n";
  jsonData.items.forEach((item) => {
    markdown += ` ${item.title}\n`;
    markdown += `${item.questions}`;
  });
  console.log(markdown);
  return markdown;
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
