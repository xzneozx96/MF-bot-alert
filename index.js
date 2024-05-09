import puppeteer from "puppeteer";
import axios from "axios";

let isServerDown = false;

const url =
  "https://bot.api.woztell.com/sendResponses?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJBUEkiLCJhcHAiOiI2MjY3OWEyOWEyNTAyZWJjYjRkMzhkMWYiLCJhY2wiOlsid2hhdHNhcHBNZXNzYWdlVGVtcGxhdGVzOmxpc3QiLCJ3aGF0c2FwcE1lc3NhZ2VUZW1wbGF0ZXM6Z2V0Iiwid2hhdHNhcHBNZXNzYWdlVGVtcGxhdGVzOmRlbGV0ZSIsIndoYXRzYXBwTWVzc2FnZVRlbXBsYXRlczpjcmVhdGUiLCJ3aGF0c2FwcDpnZXRGaWxlIiwidHJpZ2dlcjp1cGRhdGUiLCJ0cmlnZ2VyOnJlYWQiLCJ0cmlnZ2VyOmRlbGV0ZSIsInRyaWdnZXI6Y3JlYXRlIiwidHJlZTp1cGRhdGVUcmVlU2V0dGluZyIsInRyZWU6dXBkYXRlTm9kZXMiLCJ0cmVlOnVwZGF0ZUJhc2ljSW5mbyIsInRyZWU6Z2V0VHJlZVNldHRpbmciLCJ0cmVlOmdldE5vZGVzIiwidHJlZTpnZXRCYXNpY0luZm8iLCJ0cmVlOmRlbGV0ZSIsInRlYW1NZW1iZXI6dXBkYXRlIiwidGVhbU1lbWJlcjpsaXN0IiwidGVhbU1lbWJlcjpkZWxldGUiLCJ0ZWFtTWVtYmVyOmNyZWF0ZSIsInJlc3BvbnNlOnVwZGF0ZSIsInJlc3BvbnNlOnJlYWQiLCJyZXNwb25zZTpkZWxldGUiLCJyZXNwb25zZTpjcmVhdGUiLCJwdXNoOnVwZGF0ZSIsInB1c2g6bGlzdCIsInB1c2g6Z2V0IiwicHVzaDpkZWxldGUiLCJwdXNoOmNyZWF0ZSIsInByaW9yaXR5R3JvdXA6dXBkYXRlIiwicHJpb3JpdHlHcm91cDpsaXN0IiwicHJpb3JpdHlHcm91cDpnZXQiLCJwcmlvcml0eUdyb3VwOmRlbGV0ZSIsInByaW9yaXR5R3JvdXA6Y3JlYXRlIiwibm9kZTp1cGRhdGUiLCJub2RlOnJlYWQiLCJub2RlOmRlbGV0ZSIsIm5vZGU6Y3JlYXRlIiwibWVtYmVyOndyaXRlIiwibWVtYmVyOnVwZGF0ZURldGFpbHMiLCJtZW1iZXI6cmVhZCIsIm1lbWJlcjpsaXN0IiwibWVtYmVyOmltcG9ydCIsIm1lbWJlcjpnZXREZXRhaWxzIiwibWVtYmVyOmdldENvbnZlcnNhdGlvbiIsIm1lbWJlcjpleHBvcnQiLCJtZW1iZXI6ZGVsZXRlIiwibWVtYmVyOmNyZWF0ZSIsIm1lbWJlcjphZG1pbiIsIm1lbWJlcjpUb2dnbGVMaXZlQ2hhdCIsIm1lZGlhTGlicmFyeTp1cGRhdGUiLCJtZWRpYUxpYnJhcnk6bGlzdCIsIm1lZGlhTGlicmFyeTpnZXQiLCJtZWRpYUxpYnJhcnk6ZGVsZXRlIiwibWVkaWFMaWJyYXJ5OmNyZWF0ZSIsImxvZzpsaXN0IiwibG9jYWxlR3JvdXA6cmVhZCIsImludGVncmF0aW9uOndyaXRlIiwiaW50ZWdyYXRpb246dXBkYXRlIiwiaW50ZWdyYXRpb246cmVhZCIsImludGVncmF0aW9uOmxpc3QiLCJpbnRlZ3JhdGlvbjpnZXQiLCJpbnRlZ3JhdGlvbjpkZWxldGUiLCJpbnRlZ3JhdGlvbjpjcmVhdGUiLCJpbnRlZ3JhdGlvbjphZG1pbiIsImZpbGU6d2FHZXQiLCJmaWxlOmFkbWluIiwiZGF0YVNvdXJjZTp1cGRhdGVEb2MiLCJkYXRhU291cmNlOnVwZGF0ZURhdGFzb3VyY2UiLCJkYXRhU291cmNlOmxpc3REb2NzIiwiZGF0YVNvdXJjZTpsaXN0RGF0YXNvdXJjZXMiLCJkYXRhU291cmNlOmltcG9ydERhdGFzb3VyY2UiLCJkYXRhU291cmNlOmdldERvYyIsImRhdGFTb3VyY2U6ZXhwb3J0RGF0YXNvdXJjZSIsImRhdGFTb3VyY2U6ZGVsZXRlRG9jIiwiZGF0YVNvdXJjZTpkZWxldGVEYXRhc291cmNlIiwiZGF0YVNvdXJjZTpjcmVhdGVEb2MiLCJkYXRhU291cmNlOmNyZWF0ZURhdGFzb3VyY2UiLCJkYXNoYm9hcmQ6bGlzdFdoYXRzYXBwQW5hbHl0aWNzIiwiZGFzaGJvYXJkOmxpc3RVc2VycyIsImRhc2hib2FyZDpsaXN0VGlja2V0aW5nIiwiZGFzaGJvYXJkOmxpc3RObHBBbmFseXRpY3MiLCJkYXNoYm9hcmQ6bGlzdENvbW1lbnRSZXBseSIsImRhc2hib2FyZDpsaXN0QXNzaWdubWVudCIsImRhc2hib2FyZDpsaXN0QW5hbHl0aWNzIiwiY29uZGl0aW9uOnVwZGF0ZSIsImRhc2hib2FyZDpsaXN0QWdlbnRzIiwiY29uZGl0aW9uOnJlYWQiLCJjb25kaXRpb246ZGVsZXRlIiwiY29uZGl0aW9uOmNyZWF0ZSIsImNoYW5uZWw6dXBkYXRlVHJlZVNldHRpbmdzIiwiY2hhbm5lbDp1cGRhdGVQbGF0Zm9ybVNldHRpbmdzIiwiY2hhbm5lbDp1cGRhdGVQbGF0Zm9ybUluZm8iLCJjaGFubmVsOnVwZGF0ZUxpdmVDaGF0U2V0dGluZ3MiLCJjaGFubmVsOnVwZGF0ZUJyb2FkY2FzdEdyb3VwU2V0dGluZ3MiLCJjaGFubmVsOnVwZGF0ZUJhc2ljSW5mbyIsImNoYW5uZWw6dXBkYXRlQXZhaWxhYmlsaXRpZXMiLCJjaGFubmVsOmxpc3QiLCJjaGFubmVsOmdldFRyZWVTZXR0aW5ncyIsImNoYW5uZWw6Z2V0UGxhdGZvcm1TZXR0aW5ncyIsImNoYW5uZWw6Z2V0UGxhdGZvcm1JbmZvIiwiY2hhbm5lbDpnZXRMaXZlQ2hhdFNldHRpbmdzIiwiY2hhbm5lbDpnZXREZXRhaWxzIiwiY2hhbm5lbDpnZXRCcm9hZGNhc3RHcm91cFNldHRpbmdzIiwiY2hhbm5lbDpnZXRCYXNpY0luZm8iLCJjaGFubmVsOmdldEF2YWlsYWJpbGl0aWVzIiwiY2hhbm5lbDpkZWxldGVDaGFubmVsIiwiY2hhbm5lbDpjcmVhdGVDaGFubmVsIiwiYm90YnVpbGRlcjpyZWFkIiwiYm90YnVpbGRlcjptYW5hZ2UiLCJib3Q6c2VuZFJlc3BvbnNlcyIsImJvdDpyZWRpcmVjdE1lbWJlclRvTm9kZSIsImJvdDphZG1pbiIsImJpbGxpbmc6dXBkYXRlU3Vic2NyaXB0aW9uIiwiYmlsbGluZzpsaXN0SW52b2ljZXMiLCJiaWxsaW5nOmdldFN1YnNjcmlwdGlvbiIsImJpbGxpbmc6ZGVsZXRlU3Vic2NyaXB0aW9uIiwiYmlsbGluZzpjcmVhdGVTdWJzY3JpcHRpb24iLCJhdWRpdFRyYWlsOmxpc3QiLCJhdWRpZW5jZTp1cGRhdGUiLCJhdWRpZW5jZTpyZWFkIiwiYXVkaWVuY2U6bGlzdCIsImF1ZGllbmNlOmdldCIsImF1ZGllbmNlOmRlbGV0ZSIsImF1ZGllbmNlOmNyZWF0ZSIsImF0dGFjaG1lbnRJZDpsaXN0IiwiYXR0YWNobWVudElkOmNyZWF0ZSIsImFwcFNldHRpbmdzOnVwZGF0ZSIsImFwcFNldHRpbmdzOmdldCIsImFwcEluZm86Z2V0IiwiYXBpOmFkbWluIiwiYWdlbmRhOnVwZGF0ZSIsImFnZW5kYTpyZWFkIiwiYWdlbmRhOmRlbGV0ZSIsImFnZW5kYTpjcmVhdGUiLCJhY3Rpb246dXBkYXRlIiwiYWN0aW9uOnJlYWQiLCJhY3Rpb246ZGVsZXRlIiwiYWN0aW9uOmNyZWF0ZSIsImFjY291bnQ6dXBkYXRlIl0sImp0aSI6IjkzMDIzZDViLWFlZjMtNTQ1Zi04Y2MxLTNiNDA1MmZiMzg1ZCIsImlzcyI6IjYyNjc5OTQwYTI1MDJlNDA0OGQzOGQxZCIsImlhdCI6MTY1MDk1OTA4OTQxM30.KOrJT3GH1H48QgD9iuC5GYFiIwsCm-njmwKt6Qb2vbQ";

const MFContact = ["85949764201", "85949764202"];
const RossContact = ["84949764200"];

// Start a Puppeteer session with:
// - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
// - no default viewport (`defaultViewport: null` - website page will in full width and height)
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  ignoreHTTPSErrors: true,
  args: ["--ignore-certificate-errors"],
});

// Open a new page
const page = await browser.newPage();

// wait until the dom content is loaded (HTML is ready)
await page.goto("https://localhost:4200/", {
  waitUntil: "domcontentloaded",
});

const delay = async (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, milliseconds);
  });
};

const isOfflineMode = () => {
  const now = new Date(); // Get the current date and time
  const currentHour = now.getHours(); // Get the current hour (0-23)

  // Check if current time is after 6 PM today and before 8 AM tomorrow
  if (
    (currentHour >= 18 && currentHour <= 23) || // Between 6 PM and 11:59 PM today
    (currentHour >= 0 && currentHour < 8) // Between 12 AM and 7:59 AM tomorrow
  ) {
    return true; // Current time is within the specified range
  } else {
    return false; // Current time is outside the specified range
  }
};

// Function to send WhatsApp alert
const sendAlert = async (templateName = "mf_bot_alert") => {
  const promises = [];

  const onlyRoss = isOfflineMode();

  // only send message to Ross between 6PM current day till 8AM the next day
  // for other time of the day, send to everyone
  let targets = [];

  if (!!onlyRoss) {
    targets = [...RossContact];
  } else {
    targets = [...RossContact, ...MFContact];
  }

  console.log("targets", targets);

  targets.forEach((number) => {
    const requestBody = {
      recipientId: number,
      channelId: "6352389b1d3f54747ede24a1",
      response: {
        type: "TEMPLATE",
        components: [],
        languagePolicy: "deterministic",
        languageCode: "en",
        elementName: templateName,
      },
    };

    promises.push(axios.post(url, requestBody));
  });

  try {
    const sendResultsResponse = await Promise.all(promises);
    const sendResults = sendResultsResponse.map((res) => res.data);
    console.log("Alert sent successfully:", JSON.stringify(sendResults));
  } catch (error) {
    console.error("Error sending alert:", error);
  }
};

const checkPopup = async (page) => {
  // APPROACH 1: Check for popup every 5 second for a total of 20 seconds (4 times)
  // for (let i = 0; i < 4; i++) {
  //   popupExists = await page.evaluate(() => {
  //     return document.querySelector(".system-alert-model") !== null;
  //   });

  //   if (popupExists) {
  //     popupExists = true;
  //     break;
  //   } else {
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //   }
  // }

  // APPROACH 2
  let popupExists = await page.evaluate(() => {
    return document.querySelector(".system-alert-model") !== null;
  });

  return popupExists;
};

// Function to scrape periodically
async function scrape() {
  const popupExists = await checkPopup(page);

  console.log("popup exists", popupExists);

  if (popupExists) {
    // send noti

    if (!!isServerDown) {
      // send alert_reminder template
      console.log("popup exists, on sending reminder");
      sendAlert("mf_bot_alert_reminder");
    } else {
      // send alert template
      console.log("popup persists, on sending Alert");
      sendAlert();
    }

    isServerDown = true;

    // wait for 10 minutes then checks again, if issue persists, send alert_reminder
    await delay(20000);

    // reload the page
    await page.reload();

    // wait for 10 seconds to make sure the the connection checker is ready
    await delay(10000);

    // repeat the process
    scrape();
  } else {
    console.log("platform is working normally");

    if (!!isServerDown) {
      isServerDown = false;

      // send message saying problem solved
      console.log("popup gone, on sending success message");
      sendAlert("mf_bot_issue_resolved");
    }

    // wait for 5 seconds then repeat the process
    await delay(5000);
    scrape();
  }
}

// Start the scraping
scrape();
