import axios from "axios";
import { load } from "cheerio";
import puppeteer from "puppeteer-core";

export const coin_details_scraper = async (coin_details_link: string) => {
  try {
    const browser = await puppeteer.launch({
      userDataDir: "./catche/puppeteer",
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    // avoiding images and css to load for web optimization
    page.on("request", (request) => {
      if (
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet"
      )
        request.abort();
      else request.continue();
    });

    await page.goto(`https://coinranking.com${coin_details_link}`, {
      timeout: 50000,
    });
    const varyingPriceList = await page.evaluate(() => {
      const EachPriceStats = document.querySelectorAll(".chart-stats__value");
      let data: string[] = [];
      EachPriceStats.forEach((tag, i) => {
        console.log(tag);
        if (i === 1 || i === 2) {
          data.push(tag.innerHTML.trim());
        }
      });
      return data;
    });
    const requiredData = varyingPriceList;

    await browser.close();
    return { max_price: requiredData[0], min_price: requiredData[1] };
  } catch (error) {
    console.log(error);
  }
};
