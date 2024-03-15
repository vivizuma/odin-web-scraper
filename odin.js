import puppeteer from "puppeteer";
const getQuestions = async () => {
  // await for browser to load
  const browser = await puppeteer.launch();

  // open new page
  const page = await browser.newPage();
  //navigate to odin project page
  await page.goto(
    "https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code/",
    { waitUntil: "domcontentloaded" }
  );
  console.log("page laoded");
  const questions = await page.evaluate(() => {
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
    return { questions, list, listItems };
  });
  console.log(questions);
  await browser.close;
};

getQuestions();
