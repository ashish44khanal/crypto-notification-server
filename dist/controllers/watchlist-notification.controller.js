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
exports.getNotifications = exports.saveNotification = void 0;
const watchlist_notification_entity_1 = require("../entities/watchlist-notification.entity");
const watchlist_entity_1 = require("../entities/watchlist.entity");
const coin_details_scraper_1 = require("../scrapers/coin-details-scraper");
const node_cron_1 = __importDefault(require("node-cron"));
// job schedule to run a function every minute
// TODO: uncomment this scheduler
node_cron_1.default.schedule("*/5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const savedResponse = yield (0, exports.saveNotification)();
    console.log(savedResponse);
}));
const saveNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // steps
        // 1. get all items from watchlist and loop over them
        // 2. get screapped data by passing item.link as a arg to method coin_detail_scraper
        // 3. save new price to watchlist item
        // 4. check for price up and down based on max and min
        // if so save data to notification
        const watchlistRecords = yield watchlist_entity_1.Watchlist.createQueryBuilder("watchlist")
            .leftJoinAndSelect("watchlist.coin_id", "coin")
            .leftJoinAndSelect("watchlist.user", "user")
            .select([
            "watchlist.id",
            "watchlist.max_price",
            "watchlist.min_price",
            "coin.id",
            "coin.code",
            "coin.crypto_details_link",
            "user.id",
        ])
            .getMany();
        const notifications_status = yield watchlistRecords.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let watchlistCoinData = (yield watchlist_entity_1.Watchlist.findOne({
                where: { id: item.id },
            }));
            const scrapped_data = yield (0, coin_details_scraper_1.coin_details_scraper)(item.coin_id.crypto_details_link);
            if (!scrapped_data) {
                throw new Error("Unable to fetch max and min prices for coin");
            }
            console.log("scraped Data", scrapped_data);
            watchlistCoinData.max_price = scrapped_data.max_price;
            watchlistCoinData.min_price = scrapped_data.min_price;
            watchlistCoinData.save();
            const notification = new watchlist_notification_entity_1.WatchlistNotification();
            if (scrapped_data.max_price > watchlistCoinData.max_price) {
                //save notification
                notification.message =
                    item.coin_id.code +
                        " " +
                        "is on move," +
                        " " +
                        "The price is up from" +
                        watchlistCoinData.max_price +
                        " " +
                        "to" +
                        " " +
                        scrapped_data.max_price;
                notification.coin = item.coin_id.id;
                notification.user = item.user.id;
                notification.read = false;
                notification.save();
                return "notification saved !";
            }
            if (scrapped_data.min_price < watchlistCoinData.min_price) {
                // save notification
                notification.message =
                    item.coin_id.code +
                        " " +
                        "is on move," +
                        " " +
                        "The price is down from" +
                        watchlistCoinData.min_price +
                        " " +
                        "to" +
                        " " +
                        scrapped_data.max_price;
                notification.coin = item.coin_id.id;
                notification.user = item.user.id;
                notification.read = false;
                notification.save();
                return "notification saved !";
            }
            return "Latest data saved but notifications did not.";
        }));
        const resolvedRes = yield Promise.all(notifications_status);
        console.log(resolvedRes);
    }
    catch (error) {
        console.log(error);
    }
});
exports.saveNotification = saveNotification;
const getNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.user;
        const notifications = yield watchlist_notification_entity_1.WatchlistNotification.createQueryBuilder("notification")
            .leftJoinAndSelect("notification.user", "user")
            .select(["notification.id", "notification.message"])
            .where("user.id=:userID", { userID: user_id })
            .getMany();
        res.status(200).json({
            err: false,
            notifications,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getNotifications = getNotifications;
