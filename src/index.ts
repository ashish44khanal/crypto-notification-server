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
import { userRoutes } from "./routes/user.route";

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
app.use("/user", userRoutes);

// error handling
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  if (req.xhr) {
    return res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }

  // cutom msg for duplicate entry
  if (err.message.split("Duplicate")[1]) {
    return res.status(500).json({
      err: "true",
      status: 500,
      message: "Err! Duplicate entry for this record is not allowed.",
    });
  }

  return res.status(err.code || 500).json({
    err: "true",
    status: err.code,
    message: err.message || "Something went wrong !",
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
