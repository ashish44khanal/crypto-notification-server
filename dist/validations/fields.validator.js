"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchlistValidation = exports.userLoginValidations = exports.userRegisterValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userRegisterValidation = [
    (0, express_validator_1.check)("full_name")
        .not()
        .isEmpty()
        .trim()
        .withMessage("must no be empty.")
        .isString(),
    (0, express_validator_1.check)("password")
        .isLength({ min: 4 })
        .withMessage("must be at least 5 chars long.")
        .matches(/\d/)
        .withMessage("must contain a number."),
    (0, express_validator_1.check)("email", "is not valid").isEmail().not().isEmpty(),
];
exports.userLoginValidations = [
    (0, express_validator_1.check)("password").not().isEmpty().withMessage("can not be empty!"),
    (0, express_validator_1.check)("email", " is not valid").isEmail(),
    (0, express_validator_1.check)("email", " can not be empty").not().isEmpty(),
];
exports.watchlistValidation = [
    (0, express_validator_1.check)("coin_id").not().isEmpty().trim().withMessage("can not be empty!"),
    (0, express_validator_1.check)("coin_id").isUUID().trim().withMessage("must be a UUID!"),
];
