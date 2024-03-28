import puppeteer from "puppeteer";
import fs from "fs";

// start puppeteer
// navigate to sitemap.xml
// parse to text
// extract urls and add to an array

const url =
  "https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code/";
const getQuestions = async (url) => {
  // await for browser to load
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  // open new page
  const page = await browser.newPage();
  //navigate to odin project page
  await page.goto(url, { waitUntil: "domcontentloaded" });
  console.log("page laoded");

  // get title
  const title = await page.evaluate(() => {
    const titleText = document.querySelector(
      '[data-test-id="lesson-title-header"]'
    ).innerText;
    return { titleText };
  });
  console.log(title.titleText);
  // get questions
  const questionSection = await page.evaluate(() => {
    const list = document.querySelector("#knowledge-check ul");
    const questions = [];

    const listItems = list.querySelectorAll("li");

    //iterate over each li item

    list.querySelectorAll("li").forEach((item) => {
      questions.push(item.innerText);
    });

    return { questions };
  });

  await browser.close();
  const pageData = {
    title: title,
    questions: questionSection,
  };
  return pageData;
};

async function getData() {
  const data = await getQuestions();
  console.log(data);
}

getData();

// get title and questions, return as an object
// store as json in an object or something
// render as html or md
