import { NextFunction, Request, Response } from "express";
import { Cryptos } from "../entities/cryptos.entity";
import { crypto_coins_scraper } from "../scrapers/crypto-coins-scraper";
import { crypoTypes, User } from "../types/global";
import cron from "node-cron";
import { Watchlist } from "../entities/watchlist.entity";
import jwt from "jsonwebtoken";

// job schedule to run a function every minute
// TODO: uncomment this scheduler
cron.schedule("*/5 * * * *", async () => {
  console.log("first");
  const savedResponse = await saveCryptoLists();
  console.log(savedResponse);
});

export const saveCryptoLists = async () => {
  try {
    const scrapedCryptoData = (await crypto_coins_scraper()) as crypoTypes;

    scrapedCryptoData.forEach(async (cryptoItem, i) => {
      const crypoLists = new Cryptos();

      const existedCrypto = await Cryptos.findOne({
        where: {
          code: cryptoItem.code,
        },
      });

      //   update if crypto data already exists
      if (existedCrypto) {
        existedCrypto.rank = cryptoItem.rank;
        existedCrypto.name = cryptoItem.name;
        existedCrypto.code = cryptoItem.code;
        existedCrypto.image = cryptoItem.image as string;
        existedCrypto.price = cryptoItem.price;
        existedCrypto.market_cap = cryptoItem.market_cap;
        existedCrypto.changeIn24 = cryptoItem.changeIn24;
        existedCrypto.crypto_details_link =
          cryptoItem.crypto_details_link as string;

        await Cryptos.save(existedCrypto);
      }
      //   save new crypto data
      else {
        crypoLists.rank = cryptoItem.rank;
        crypoLists.name = cryptoItem.name;
        crypoLists.code = cryptoItem.code;
        crypoLists.image = cryptoItem.image as string;
        crypoLists.price = cryptoItem.price;
        crypoLists.market_cap = cryptoItem.market_cap;
        crypoLists.changeIn24 = cryptoItem.changeIn24;
        crypoLists.crypto_details_link =
          cryptoItem.crypto_details_link as string;

        await Cryptos.save(crypoLists);
      }
    });
    return `Data Saved Successfully ! at ${new Date()}`;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCryptoLists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, code } = req.query;
    const reqWithToken = req.headers.authorization;

    var user_id: any;
    if (reqWithToken) {
      const user = jwt.decode(reqWithToken.split(" ")[1]) as User;
      user_id = user.user_id;
    }
    console.log("userid", user_id);
    let unresolvedData = Cryptos.createQueryBuilder("cryptos").select([
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

    const allData = await unresolvedData
      .orderBy("cryptos.rank", "ASC")
      .getMany();

    // restructing the response data to findout the favourite
    const restructuredData = await (allData as any).map(async (item: any) => {
      item.recordInWatchlist = false;
      if (user_id) {
        const coinsInUserWatchlist = await Watchlist.createQueryBuilder(
          "watchlist"
        )
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
    });

    const formattedData = await Promise.all(restructuredData);

    res.status(200).send({
      err: false,
      msg: "Records fetched successfully!",
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};
