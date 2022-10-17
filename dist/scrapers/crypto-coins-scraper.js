"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crypto_coins_scraper = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const crypto_data = [];
const crypto_coins_scraper = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get("https://coinranking.com/");
        const $ = (0, cheerio_1.load)(response.data);
        const cryptos = $("#__layout > div > div.coins > div > table > tbody > tr");
        cryptos.each(function () {
            var _a, _b, _c;
            const rank = Number($(this).find(".profile__rank").text().trim());
            const name = $(this).find(".profile__link").text().trim();
            const code = $(this).find(".profile__subtitle-name").text().trim();
            const image = (_a = $(this)
                .find(".profile__logo-background img")
                .attr("src")) === null || _a === void 0 ? void 0 : _a.trim();
            const mixedPrice = $(this).find(".valuta--light").text();
            const price = "$" + " " + ((_b = mixedPrice.split("$")[1]) === null || _b === void 0 ? void 0 : _b.trim());
            const market_cap = $(this).find(".table__mobile-subtitle").text().trim();
            const changeIn24 = $(this).find(".change--light").text().trim();
            const crypto_details_link = (_c = $(this).find(".profile__link")) === null || _c === void 0 ? void 0 : _c.attr("href");
            // since there is one empty row. Data fields become undefined and that row get 0 rank due to Number conversion so avoiding that row
            if (rank > 0) {
                crypto_data === null || crypto_data === void 0 ? void 0 : crypto_data.push({
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.crypto_coins_scraper = crypto_coins_scraper;
