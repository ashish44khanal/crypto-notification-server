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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCryptoFromWatchlist = exports.getAllWatchlist = exports.addCryptoToWatchlist = void 0;
const cryptos_entity_1 = require("../entities/cryptos.entity");
const watchlist_entity_1 = require("../entities/watchlist.entity");
const coin_details_scraper_1 = require("../scrapers/coin-details-scraper");
const addCryptoToWatchlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { coin_id } = req.body;
        const { user_id } = req.user;
        const isCoinExistInWatchlist = yield watchlist_entity_1.Watchlist.createQueryBuilder("watchlist")
            .leftJoinAndSelect("watchlist.coin_id", "coin")
            .leftJoinAndSelect("watchlist.user", "user")
            .select(["watchlist.id", "watchlist.max_price", "watchlist.min_price"])
            .where("user.id=:userID", { userID: user_id })
            .andWhere("coin.id=:coinID", { coinID: coin_id })
            .getOne();
        if (isCoinExistInWatchlist) {
            throw new Error("Error! Coin already exist in your watchlist.");
        }
        const coinDetails = yield cryptos_entity_1.Cryptos.findOne({
            where: {
                id: coin_id,
            },
        });
        if (!coinDetails) {
            throw new Error("Error! Coin does not exist with this ID.");
        }
        const max_min_price_list = yield (0, coin_details_scraper_1.coin_details_scraper)(coinDetails.crypto_details_link);
        if (!max_min_price_list) {
            throw new Error("Unable to fetch max and min prices for coin");
        }
        const watchlist = new watchlist_entity_1.Watchlist();
        watchlist.coin_id = coin_id;
        watchlist.user = user_id;
        watchlist.max_price = max_min_price_list === null || max_min_price_list === void 0 ? void 0 : max_min_price_list.max_price;
        watchlist.min_price = max_min_price_list === null || max_min_price_list === void 0 ? void 0 : max_min_price_list.min_price;
        yield watchlist.save();
        res.status(200).json({
            err: false,
            msg: "Coin has been added to watchlist successfully!",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addCryptoToWatchlist = addCryptoToWatchlist;
const getAllWatchlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.user;
        const allData = yield watchlist_entity_1.Watchlist.createQueryBuilder("watchlist")
            .leftJoinAndSelect("watchlist.coin_id", "coin")
            .leftJoinAndSelect("watchlist.user", "user")
            .select([
            "watchlist.id",
            "watchlist.max_price",
            "watchlist.min_price",
            "coin.id",
            "coin.rank",
            "coin.name",
            "coin.code",
            "coin.image",
            "coin.price",
            "coin.market_cap",
            "coin.changeIn24",
        ])
            .where("user.id=:userID", { userID: user_id })
            .orderBy("coin.rank", "ASC")
            .getMany();
        res.status(200).json({
            err: false,
            watchlist: allData,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllWatchlist = getAllWatchlist;
const removeCryptoFromWatchlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const coinToBeRemoved = yield watchlist_entity_1.Watchlist.findOne({
            where: {
                id,
            },
        });
        if (coinToBeRemoved) {
            yield watchlist_entity_1.Watchlist.remove(coinToBeRemoved);
            res.status(200).json({
                err: false,
                msg: "Coin has been removed from watchlist!",
            });
        }
        else {
            throw new Error("Item couldn't be found");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.removeCryptoFromWatchlist = removeCryptoFromWatchlist;
