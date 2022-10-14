import { NextFunction, Request, Response } from "express";
import { Watchlist } from "../entities/watchlist.entity";
import { coin_details_scraper } from "../scrapers/coin-details-scraper";

export const addCryptoToWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { coin_id, user_id, coin_details_link } = req.body;
    const max_min_price_list = await coin_details_scraper(coin_details_link);

    const watchlist = new Watchlist();

    watchlist.coin_id = coin_id;
    watchlist.user_id = user_id;
    watchlist.coin_details_link = coin_details_link;
    watchlist.max_price = max_min_price_list?.max_price as string;
    watchlist.min_price = max_min_price_list?.min_price as string;

    const savedData = await watchlist.save();

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
    const allData = await Watchlist.find();
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
      res.status(203).json({
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
