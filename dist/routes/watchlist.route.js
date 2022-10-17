"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchlistRoute = void 0;
const express_1 = require("express");
const Jwt_strategy_1 = require("../auth/Jwt.strategy");
const watchlist_controller_1 = require("../controllers/watchlist.controller");
const fields_validator_1 = require("../validations/fields.validator");
const validator_1 = __importDefault(require("../validations/validator"));
exports.watchlistRoute = (0, express_1.Router)();
exports.watchlistRoute.post("/add", Jwt_strategy_1.auth, fields_validator_1.watchlistValidation, validator_1.default, watchlist_controller_1.addCryptoToWatchlist);
exports.watchlistRoute.get("/all", Jwt_strategy_1.auth, watchlist_controller_1.getAllWatchlist);
exports.watchlistRoute.delete("/remove/:id", Jwt_strategy_1.auth, watchlist_controller_1.removeCryptoFromWatchlist);
