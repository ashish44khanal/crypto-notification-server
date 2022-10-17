"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchlistNotificationRouter = void 0;
const express_1 = require("express");
const Jwt_strategy_1 = require("../auth/Jwt.strategy");
const watchlist_notification_controller_1 = require("../controllers/watchlist-notification.controller");
exports.watchlistNotificationRouter = (0, express_1.Router)();
exports.watchlistNotificationRouter.get("/watchlist/all", Jwt_strategy_1.auth, watchlist_notification_controller_1.getNotifications);
