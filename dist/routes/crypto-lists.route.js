"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoRoutes = void 0;
const express_1 = require("express");
const crypto_lists_controller_1 = require("../controllers/crypto-lists.controller");
exports.cryptoRoutes = (0, express_1.Router)();
exports.cryptoRoutes.post("/save", crypto_lists_controller_1.saveCryptoLists);
exports.cryptoRoutes.get("/all-list", crypto_lists_controller_1.getAllCryptoLists);
