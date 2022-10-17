"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const fields_validator_1 = require("../validations/fields.validator");
const validator_1 = __importDefault(require("../validations/validator"));
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.post("/register", fields_validator_1.userRegisterValidation, validator_1.default, user_controller_1.createUserAccount);
exports.userRoutes.post("/login", fields_validator_1.userLoginValidations, validator_1.default, user_controller_1.userLogin);
