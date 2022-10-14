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
// import { crypto_coins_scraper } from "./scrapers/crypto-coins-scraper";
import cors from "cors";
import bodyParser from "body-parser";
import { watchlistRoute } from "./routes/watchlist.route";

const app: Application = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // For legacy browser support
  })
);

config();
db_connect();

const PORT: number = Number(process.env.PORT) || 8080;

//routes
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    msg: "App is running.",
    port: process.env.PORT || 8080,
  });
});

app.use("/cryptos", cryptoRoutes);
app.use("/watchlist", watchlistRoute);

// error handling
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
