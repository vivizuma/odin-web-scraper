import puppeteer from "puppeteer";
const demoUrl =
  "https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code/";

// get title and questions

// this function returns an object

//get data and questions function
// -- this function opens  puppeteer
// waits for new page to load
//
async function getDataTitleAndQuestions(url) {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  // get title
  const title = await page.evaluate(() => {
    const titleText = document.querySelector(
      '[data-test-id="lesson-title-header"]'
    ).innerText;
    return { titleText };
  });
  const questions = await page.evaluate(() => {
    const questionsArray = [];
    const questionSection = document.querySelector("#knowledge-check ul");
    // this will respond with a node list of the ul elements?
    // we need to go deeper and select all the li elements within, and push them to an array
    // the text content to an array, that is
    const questionsNodeList = questionSection.querySelectorAll("li");
    questionsNodeList.forEach((item) => {
      questionsArray.push(item.innerText);
    });
    return { questionsArray };
  });
  const dataObject = {
    title: title,
    questions: questions,
  };
  console.log(dataObject.title);
  console.log(dataObject.questions);
  await browser.close();
  return { dataObject };
}

getDataTitleAndQuestions(demoUrl);
// return as object
// store as json
