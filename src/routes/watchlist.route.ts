import { Router } from "express";
import {
  addCryptoToWatchlist,
  getAllWatchlist,
  removeCryptoFromWatchlist,
} from "../controllers/watchlist.controller";

export let watchlistRoute = Router();

watchlistRoute.post("/add", addCryptoToWatchlist);
watchlistRoute.get("/all", getAllWatchlist);
watchlistRoute.delete("/remove/:id", removeCryptoFromWatchlist);
