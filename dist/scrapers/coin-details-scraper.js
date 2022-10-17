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
exports.coin_details_scraper = void 0;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const coin_details_scraper = (coin_details_link) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer_core_1.default.launch({
            userDataDir: "./catche/puppeteer",
        });
        const page = yield browser.newPage();
        yield page.setRequestInterception(true);
        // avoiding images and css to load for web optimization
        page.on("request", (request) => {
            if (request.resourceType() === "image" ||
                request.resourceType() === "stylesheet")
                request.abort();
            else
                request.continue();
        });
        yield page.goto(`https://coinranking.com${coin_details_link}`, {
            timeout: 120000,
        });
        const varyingPriceList = yield page.evaluate(() => {
            const EachPriceStats = document.querySelectorAll(".chart-stats__value");
            let data = [];
            EachPriceStats.forEach((tag, i) => {
                if (i === 1 || i === 2) {
                    data.push(tag.innerHTML.trim());
                }
            });
            return data;
        });
        const requiredData = varyingPriceList;
        yield browser.close();
        return { max_price: requiredData[0], min_price: requiredData[1] };
    }
    catch (error) {
        console.log(error);
    }
});
exports.coin_details_scraper = coin_details_scraper;
