import { Router } from "express";
import { auth } from "../auth/Jwt.strategy";
import {
  addCryptoToWatchlist,
  getAllWatchlist,
  removeCryptoFromWatchlist,
} from "../controllers/watchlist.controller";
import { watchlistValidation } from "../validations/fields.validator";
import validator from "../validations/validator";

export let watchlistRoute = Router();

watchlistRoute.post(
  "/add",
  auth,
  watchlistValidation,
  validator,
  addCryptoToWatchlist
);
watchlistRoute.get("/all", auth, getAllWatchlist);
watchlistRoute.delete("/remove/:id", auth, removeCryptoFromWatchlist);
