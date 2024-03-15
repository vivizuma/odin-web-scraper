const puppeteer = require("puppeteer");
console.log(1);
console.log(puppeteer);
console.log("2");

(function sayHello() {
  console.log("HELLOOO");
})();

async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");
};
