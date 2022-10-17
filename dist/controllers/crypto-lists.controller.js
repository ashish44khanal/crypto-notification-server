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
exports.getAllCryptoLists = exports.saveCryptoLists = void 0;
const cryptos_entity_1 = require("../entities/cryptos.entity");
const crypto_coins_scraper_1 = require("../scrapers/crypto-coins-scraper");
const node_cron_1 = __importDefault(require("node-cron"));
const watchlist_entity_1 = require("../entities/watchlist.entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// job schedule to run a function every minute
// TODO: uncomment this scheduler
node_cron_1.default.schedule("*/5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
    const savedResponse = yield (0, exports.saveCryptoLists)();
    console.log(savedResponse);
}));
const saveCryptoLists = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scrapedCryptoData = (yield (0, crypto_coins_scraper_1.crypto_coins_scraper)());
        scrapedCryptoData.forEach((cryptoItem, i) => __awaiter(void 0, void 0, void 0, function* () {
            const crypoLists = new cryptos_entity_1.Cryptos();
            const existedCrypto = yield cryptos_entity_1.Cryptos.findOne({
                where: {
                    code: cryptoItem.code,
                },
            });
            //   update if crypto data already exists
            if (existedCrypto) {
                existedCrypto.rank = cryptoItem.rank;
                existedCrypto.name = cryptoItem.name;
                existedCrypto.code = cryptoItem.code;
                existedCrypto.image = cryptoItem.image;
                existedCrypto.price = cryptoItem.price;
                existedCrypto.market_cap = cryptoItem.market_cap;
                existedCrypto.changeIn24 = cryptoItem.changeIn24;
                existedCrypto.crypto_details_link =
                    cryptoItem.crypto_details_link;
                yield cryptos_entity_1.Cryptos.save(existedCrypto);
            }
            //   save new crypto data
            else {
                crypoLists.rank = cryptoItem.rank;
                crypoLists.name = cryptoItem.name;
                crypoLists.code = cryptoItem.code;
                crypoLists.image = cryptoItem.image;
                crypoLists.price = cryptoItem.price;
                crypoLists.market_cap = cryptoItem.market_cap;
                crypoLists.changeIn24 = cryptoItem.changeIn24;
                crypoLists.crypto_details_link =
                    cryptoItem.crypto_details_link;
                yield cryptos_entity_1.Cryptos.save(crypoLists);
            }
        }));
        return `Data Saved Successfully ! at ${new Date()}`;
    }
    catch (error) {
        console.log(error);
    }
});
exports.saveCryptoLists = saveCryptoLists;
const getAllCryptoLists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, code } = req.query;
        const reqWithToken = req.headers.authorization;
        var user_id;
        if (reqWithToken) {
            const user = jsonwebtoken_1.default.decode(reqWithToken.split(" ")[1]);
            user_id = user.user_id;
        }
        console.log("userid", user_id);
        let unresolvedData = cryptos_entity_1.Cryptos.createQueryBuilder("cryptos").select([
            "cryptos.id",
            "cryptos.name",
            "cryptos.rank",
            "cryptos.code",
            "cryptos.image",
            "cryptos.price",
            "cryptos.market_cap",
            "cryptos.changeIn24",
            "cryptos.crypto_details_link",
        ]);
        if (name) {
            unresolvedData.where("cryptos.name like :nameQuery", {
                nameQuery: `%${name}%`,
            });
        }
        if (code) {
            unresolvedData.where("cryptos.code like :codeQuery", {
                codeQuery: `%${code}%`,
            });
        }
        const allData = yield unresolvedData
            .orderBy("cryptos.rank", "ASC")
            .getMany();
        // restructing the response data to findout the favourite
        const restructuredData = yield allData.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            item.recordInWatchlist = false;
            if (user_id) {
                const coinsInUserWatchlist = yield watchlist_entity_1.Watchlist.createQueryBuilder("watchlist")
                    .leftJoinAndSelect("watchlist.user", "user")
                    .leftJoinAndSelect("watchlist.coin_id", "coin")
                    .select(["watchlist.id"])
                    .where("user.id=:userID", { userID: user_id })
                    .andWhere("coin.id=:coinID", { coinID: item.id })
                    .getOne();
                if (coinsInUserWatchlist) {
                    item.recordInWatchlist = true;
                }
            }
            return item;
        }));
        const formattedData = yield Promise.all(restructuredData);
        res.status(200).send({
            err: false,
            msg: "Records fetched successfully!",
            data: formattedData,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCryptoLists = getAllCryptoLists;
