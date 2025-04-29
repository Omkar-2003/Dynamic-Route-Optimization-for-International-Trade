
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://sea-distances.org"); // Replace with your URL

  const countryFromSelector =
    'select[name="country_id_from"][id="country_id_from"]';
  const portFromSelector = 'select[name="port_id_from"][id="port_id_from"]';
  const countryToSelector = 'select[name="country_id_to"][id="country_id_to"]';
  const portToSelector = 'select[name="port_id_to"][id="port_id_to"]';
  const buttonSelector = 'input.btn.btn-primary.span3[type="button"]';

  const countryFromValue = "0079"; // Code for India
  const portFromValue = "25523"; // Code for Mumbai port
  const countryToValue = "0001"; // Code for Albania
  const portToValue = "228264"; // Code for Vlore port

  // Select origin country
  await page.select(countryFromSelector, countryFromValue);

  // Wait for a few seconds for ports to load
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Attempt to select the origin port, retrying a few times if necessary
  let retryCount = 0;
  let selectedCorrectly = false;
  while (retryCount < 3 && !selectedCorrectly) {
    await page.select(portFromSelector, portFromValue);

    const selectedPortFrom = await page.$eval(
      portFromSelector,
      (el) => el.value
    );
    if (selectedPortFrom === portFromValue) {
      console.log(`Origin port selected correctly: ${portFromValue}`);
      selectedCorrectly = true;
    } else {
      console.log(`Retrying selection of origin port...`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
      retryCount++;
    }
  }

  if (!selectedCorrectly) {
    console.log(
      `Origin port selection is incorrect. Expected: ${portFromValue}, but got: ${selectedPortFrom}`
    );
  }

  // Repeat similar logic for country and port to

  // Select destination country
  await page.select(countryToSelector, countryToValue);

  // Wait for ports to load
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Retry port selection if needed
  retryCount = 0;
  selectedCorrectly = false;
  while (retryCount < 3 && !selectedCorrectly) {
    await page.select(portToSelector, portToValue);

    const selectedPortTo = await page.$eval(portToSelector, (el) => el.value);
    console.log(await page.$eval(portToSelector, (el) => el.innerText));
    if (selectedPortTo === portToValue) {
      console.log(`Destination port selected correctly: ${portToValue}`);
      selectedCorrectly = true;
    } else {
      console.log(`Retrying selection of destination port...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      retryCount++;
    }
  }

  if (!selectedCorrectly) {
    console.log(
      `Destination port selection is incorrect. Expected: ${portToValue}, but got: ${selectedPortTo}`
    );
  }

  // Trigger the calculate button's click event
  await page.evaluate((buttonSelector) => {
    // Find the button using the specified selector
    const button = document.querySelector(buttonSelector);

    // Trigger the click event on the button
    if (button) {
      button.click();
    }
  }, buttonSelector);

  await new Promise((res, rej) => setTimeout(res, 2000));

  // Define the selector for the div with ID 'cont'
  const containerSelector = "#cont";

  // Fetch the content from the tables inside the div
  const content = await page.evaluate((selector) => {
    // Find the div with the specified selector
    const container = document.querySelector(selector);

    if (!container) {
      return null; // Return null if the container is not found
    }

    // Initialize an array to store the content from the tables
    const data = [];

    // Get the list of h4 elements with the class 'way'
    const wayHeaders = container.querySelectorAll("h4.way");

    // Iterate through each h4 element
    wayHeaders.forEach((header) => {
      // Find the next table sibling of the current header
      const table = header.nextElementSibling;

      // Extract the text content from the rows in the table
      const rows = table.querySelectorAll("tr");
      const wayData = {
        way: header.textContent, // Store the header text
        distance: rows[0].querySelector("td:nth-child(2)").textContent,
        speed: rows[1].querySelector("td:nth-child(2)").textContent,
        time: rows[2].querySelector("td:nth-child(2)").textContent,
      };

      // Push the extracted data to the data array
      data.push(wayData);
    });

    return data;
  }, containerSelector);

  // Log the content of the tables to the console
  console.log("Content from the tables:", content);
  // Close the browser
  await browser.close();
})();
