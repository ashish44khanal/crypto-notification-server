"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.createUserAccount = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_entity_1 = require("../entities/user.entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { full_name, email, password } = req.body;
        // check for duplicate user entry
        const userExist = yield user_entity_1.User.findOne({
            where: { email },
        });
        if (userExist) {
            throw new Error("Err! Account already exist with this email.");
        }
        const hash = yield bcrypt_1.default.hash(password, 10);
        const user = new user_entity_1.User();
        user.full_name = full_name;
        user.email = email;
        user.password = hash;
        user.save();
        return res.status(201).json({
            err: false,
            msg: "User account has been created successfully!",
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.createUserAccount = createUserAccount;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_entity_1.User.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("Error! Account does not exist.");
        }
        const matchedPasswod = yield bcrypt_1.default.compare(password, user.password);
        if (!matchedPasswod) {
            throw new Error("Error! password did not match.");
        }
        //creating json web token
        const jwtPayload = {
            user_id: user.id,
            full_name: user.full_name,
        };
        const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, {
            expiresIn: "24h",
        });
        return res.status(200).json({
            err: false,
            msg: "Logged in successfully!",
            access_token: token,
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.userLogin = userLogin;
