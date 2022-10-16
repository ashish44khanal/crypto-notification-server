import { Router } from "express";
import { auth } from "../auth/Jwt.strategy";
import {
  getNotifications,
  saveNotification,
} from "../controllers/watchlist-notification.controller";

export let watchlistNotificationRouter = Router();

watchlistNotificationRouter.get("/watchlist/all", auth, getNotifications);
