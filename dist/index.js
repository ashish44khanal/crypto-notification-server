"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const db_connection_1 = require("./db-config/db-connection");
const crypto_lists_route_1 = require("./routes/crypto-lists.route");
// import { crypto_coins_scraper } from "./scrapers/crypto-coins-scraper";
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const watchlist_route_1 = require("./routes/watchlist.route");
const user_route_1 = require("./routes/user.route");
const watchlist_notificatoin_route_1 = require("./routes/watchlist-notificatoin.route");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // For legacy browser support
}));
(0, dotenv_1.config)();
(0, db_connection_1.db_connect)();
const PORT = Number(process.env.PORT) || 8080;
//routes
app.get("/", (req, res, next) => {
    res.status(200).json({
        msg: "App is running.",
        port: process.env.PORT || 8080,
    });
});
app.use("/cryptos", crypto_lists_route_1.cryptoRoutes);
app.use("/watchlist", watchlist_route_1.watchlistRoute);
app.use("/user", user_route_1.userRoutes);
app.use("/notification", watchlist_notificatoin_route_1.watchlistNotificationRouter);
// error handling
const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);
    if (req.xhr) {
        return res.status(500).send({ error: "Something failed!" });
    }
    else {
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
