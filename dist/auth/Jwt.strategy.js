"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization;
        if (!authHeaders) {
            return next({ code: 401, message: "Auth token is required!" });
        }
        const token = authHeaders.split("Bearer")[1].trim();
        const SECRET = `${process.env.SECRET}`;
        // console.log("token", token);
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next({ code: 401, message: error.mesage || "Invalid token" });
    }
};
exports.auth = auth;
