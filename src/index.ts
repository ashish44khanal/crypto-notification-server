import { config } from "dotenv";
import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { db_connect } from "./db-config/db-connection";
import { cryptoRoutes } from "./routes/crypto-lists.route";
import { crypto_coins_scraper } from "./scrapers/crypto-coins-scraper";

const app: Application = express();
config();
db_connect();
const PORT: number = Number(process.env.PORT) || 8080;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    msg: "App is running.",
    port: process.env.PORT || 8080,
  });
});

// app.get(
//   "/crypto-list",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const list = await crypto_coins_scraper();
//       return res.status(200).json(list);
//     } catch (error) {
//       next(error);
//     }
//   }
// );
app.use("/cryptos", cryptoRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    msg: err.message,
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
