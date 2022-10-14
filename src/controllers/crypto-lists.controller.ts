import { NextFunction, Request, Response } from "express";
import { Cryptos } from "../entities/cryptos.entity";
import { crypto_coins_scraper } from "../scrapers/crypto-coins-scraper";
import { crypoTypes } from "../types/global";
import cron from "node-cron";

// job schedule to run a function every minute
//TODO: uncomment this to run scheduler and delete rest of below comments on final version
// cron.schedule("*/5 * * * *", async () => {
//   const savedResponse = await saveCryptoLists();
//   console.log(savedResponse);
// });

export const saveCryptoLists = async () =>
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  {
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
      // res.status(201).json({
      //   err: false,
      //   msg: "Records saved successfully!",
      // });
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
    res.status(200).send({
      err: false,
      msg: "Records fetched successfully!",
      data: allData,
    });
  } catch (error) {
    next(error);
  }
};
