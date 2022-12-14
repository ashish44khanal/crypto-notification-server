import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../auth/Jwt.strategy";
import { Cryptos } from "../entities/cryptos.entity";
import { Watchlist } from "../entities/watchlist.entity";
import { coin_details_scraper } from "../scrapers/coin-details-scraper";

export const addCryptoToWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { coin_id } = req.body;
    const { user_id } = (req as CustomRequest).user;

    const isCoinExistInWatchlist = await Watchlist.createQueryBuilder(
      "watchlist"
    )
      .leftJoinAndSelect("watchlist.coin_id", "coin")
      .leftJoinAndSelect("watchlist.user", "user")
      .select(["watchlist.id", "watchlist.max_price", "watchlist.min_price"])
      .where("user.id=:userID", { userID: user_id })
      .andWhere("coin.id=:coinID", { coinID: coin_id })
      .getOne();

    if (isCoinExistInWatchlist) {
      throw new Error("Error! Coin already exist in your watchlist.");
    }

    const coinDetails = await Cryptos.findOne({
      where: {
        id: coin_id,
      },
    });

    if (!coinDetails) {
      throw new Error("Error! Coin does not exist with this ID.");
    }

    const max_min_price_list = await coin_details_scraper(
      coinDetails.crypto_details_link
    );

    if (!max_min_price_list) {
      throw new Error("Unable to fetch max and min prices for coin");
    }

    const watchlist = new Watchlist();

    watchlist.coin_id = coin_id;
    watchlist.user = user_id as any;
    watchlist.max_price = max_min_price_list?.max_price as string;
    watchlist.min_price = max_min_price_list?.min_price as string;

    await watchlist.save();

    res.status(200).json({
      err: false,
      msg: "Coin has been added to watchlist successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = (req as CustomRequest).user;
    const allData = await Watchlist.createQueryBuilder("watchlist")
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
  } catch (error) {
    next(error);
  }
};

export const removeCryptoFromWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const coinToBeRemoved = await Watchlist.findOne({
      where: {
        id,
      },
    });
    if (coinToBeRemoved) {
      await Watchlist.remove(coinToBeRemoved);
      res.status(200).json({
        err: false,
        msg: "Coin has been removed from watchlist!",
      });
    } else {
      throw new Error("Item couldn't be found");
    }
  } catch (error) {
    next(error);
  }
};
