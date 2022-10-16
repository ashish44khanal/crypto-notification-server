import { Router } from "express";
import { auth } from "../auth/Jwt.strategy";
import {
  getAllCryptoLists,
  saveCryptoLists,
} from "../controllers/crypto-lists.controller";

export let cryptoRoutes = Router();

cryptoRoutes.post("/save", saveCryptoLists);
cryptoRoutes.get("/all-list", getAllCryptoLists);
