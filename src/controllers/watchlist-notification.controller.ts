import { WatchlistNotification } from "../entities/watchlist-notification.entity";
import { Watchlist } from "../entities/watchlist.entity";
import { coin_details_scraper } from "../scrapers/coin-details-scraper";
import cron from "node-cron";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../auth/Jwt.strategy";

// job schedule to run a function every minute
// TODO: uncomment this scheduler
cron.schedule("*/5 * * * *", async () => {
  const savedResponse = await saveNotification();
  console.log(savedResponse);
});

export const saveNotification = async () => {
  try {
    // steps
    // 1. get all items from watchlist and loop over them
    // 2. get screapped data by passing item.link as a arg to method coin_detail_scraper
    // 3. save new price to watchlist item
    // 4. check for price up and down based on max and min
    // if so save data to notification
    const watchlistRecords = await Watchlist.createQueryBuilder("watchlist")
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
    const notifications_status = await watchlistRecords.map(async (item) => {
      let watchlistCoinData = (await Watchlist.findOne({
        where: { id: item.id },
      })) as Watchlist;

      const scrapped_data = await coin_details_scraper(
        item.coin_id.crypto_details_link
      );

      if (!scrapped_data) {
        throw new Error("Unable to fetch max and min prices for coin");
      }
      console.log("scraped Data", scrapped_data);
      watchlistCoinData.max_price = scrapped_data.max_price;
      watchlistCoinData.min_price = scrapped_data.min_price;
      watchlistCoinData.save();

      const notification = new WatchlistNotification();
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

        notification.coin = item.coin_id.id as any;
        notification.user = item.user.id as any;
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

        notification.coin = item.coin_id.id as any;
        notification.user = item.user.id as any;
        notification.read = false;
        notification.save();
        return "notification saved !";
      }
      return "Latest data saved but notifications did not.";
    });
    const resolvedRes = await Promise.all(notifications_status);
    console.log(resolvedRes);
  } catch (error) {
    console.log(error);
  }
};

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = (req as CustomRequest).user as any;
    const notifications = await WatchlistNotification.createQueryBuilder(
      "notification"
    )
      .leftJoinAndSelect("notification.user", "user")
      .select(["notification.id", "notification.message"])
      .where("user.id=:userID", { userID: user_id })
      .getMany();
    res.status(200).json({
      err: false,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};
