import axios from "axios";
import { load } from "cheerio";
import { crypoTypes } from "../types/global";

const crypto_data: crypoTypes = [];

export const crypto_coins_scraper = async () => {
  try {
    const response = await axios.get("https://coinranking.com/");
    const $ = load(response.data);
    const cryptos = $("#__layout > div > div.coins > div > table > tbody > tr");

    cryptos.each(function () {
      const rank = Number($(this).find(".profile__rank").text().trim());
      const name = $(this).find(".profile__link").text().trim();
      const code = $(this).find(".profile__subtitle-name").text().trim();
      const image = $(this)
        .find(".profile__logo-background img")
        .attr("src")
        ?.trim();

      const mixedPrice = $(this).find(".valuta--light").text();
      const price = "$" + " " + mixedPrice.split("$")[1]?.trim();
      const market_cap = $(this).find(".table__mobile-subtitle").text().trim();
      const changeIn24 = $(this).find(".change--light").text().trim();
      const crypto_details_link = $(this).find(".profile__link")?.attr("href");

      // since there is one empty row. Data fields become undefined and that row get 0 rank due to Number conversion so avoiding that row
      if (rank > 0) {
        crypto_data?.push({
          rank,
          name,
          code,
          image,
          price: price,
          market_cap,
          changeIn24,
          crypto_details_link,
        });
      }
    });

    return crypto_data;
  } catch (error) {
    console.log(error);
  }
};
