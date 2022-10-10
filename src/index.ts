import { config } from "dotenv";
import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { db_connect } from "./db-config/db-connection";
import { crypto_coins_scraper } from "./scrapers/crypto-coins-scraper";

config();

const PORT: number = Number(process.env.PORT) || 8080;

const app: Application = express();

// db_connect();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    msg: "App is running.",
    port: "5000",
  });
});

app.get(
  "/crypto-list",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await crypto_coins_scraper();
      return res.status(200).json(list);
    } catch (error) {
      next(error);
    }
  }
);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 5000).json({
    status: err.status || 5000,
    msg: err.message,
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
