// 1. using callbacks to handle asynchronous code

function sayHello(callback) {
  setTimeout(() => {
    console.log("hello");
    callback();
  }, 2000);
}

sayHello(sayWorld);

function sayWorld() {
  console.log("world");
}

//2. using Promises
//3. using Async / Await

function brushTeeth() {
  setTimeout(() => {
    console.log("brushing for 2 minutes");
  });
}

function morningWalk() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const hasWalked = false;
      if (!hasWalked) {
        reject("Get your early hour activity + sunlight man!");
      }
      resolve("Good job, your body is ready for the day ahead.");
    }, 2000);
  });
}

function deepWork() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const deepWorkDone = true;
      if (!deepWorkDone) {
        reject("Get FOCUSED! No deep work was done today!");
      } else {
        resolve("Good job. A deep work session happened today.");
      }
    }, 4000);
  });
}

function getXml() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const xmlValid = true;
      if (!xmlValid) {
        reject("XML invalid.");
      }
      resolve("XML Valid and received");
    }, 3000);
  });
}

async function morningRoutine() {
  try {
    const deepWorkResult = await deepWork();
    console.log(deepWorkResult);

    const fetchXmlResult = await getXml();
    console.log(fetchXmlResult);

    const morningWalkResult = await morningWalk();
    console.log(morningWalkResult);
  } catch (error) {
    console.log(error);
  }
}

morningRoutine();

try {
  await morningWalk();
} catch (error) {
  console.log(error);
}
