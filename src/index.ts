import { config } from "dotenv";
import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { db_connect } from "./db-config/db-connection";

config();

const PORT: number = Number(process.env.PORT) || 8080;

const app: Application = express();

db_connect();

app.get("/", (req: Request, res: Response, nex: NextFunction) => {
  res.status(200).json({
    msg: "App is running.",
    port: "5000",
  });
});

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
