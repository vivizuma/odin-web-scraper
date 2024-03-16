import puppeteer from "puppeteer";

const url =
  "https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code/";
const getQuestions = async (url) => {
  // await for browser to load
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // open new page
  const page = await browser.newPage();
  //navigate to odin project page
  await page.goto(url, { waitUntil: "domcontentloaded" });
  console.log("page laoded");
  const title = await page.evaluate(() => {
    const titleText = document.querySelector(
      '[data-test-id="lesson-title-header"]'
    ).innerText;
    return { titleText };
  });

  const questionSection = await page.evaluate(() => {
    const list = document.querySelector("#knowledge-check ul");
    const questions = [];

    const listItems = list.querySelectorAll("li");

    //iterate over each li item

    list.querySelectorAll("li").forEach((item) => {
      questions.push(item.innerText);
    });
    console.log(listItems);
    console.log(list);
    questions.push("hello");
    console.log(questions);
    return { questions, list, listItems };
  });
  console.log(`"outside scope:"`);
};

getQuestions(url);
