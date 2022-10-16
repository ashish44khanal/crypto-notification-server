import { check } from "express-validator";

export const userRegisterValidation = [
  check("full_name")
    .not()
    .isEmpty()
    .trim()
    .withMessage("must no be empty.")
    .isString(),
  check("password")
    .isLength({ min: 4 })
    .withMessage("must be at least 5 chars long.")
    .matches(/\d/)
    .withMessage("must contain a number."),
  check("email", "is not valid").isEmail().not().isEmpty(),
];

export const userLoginValidations = [
  check("password").not().isEmpty().withMessage("can not be empty!"),
  check("email", " is not valid").isEmail(),
  check("email", " can not be empty").not().isEmpty(),
];

export const watchlistValidation = [
  check("coin_id").not().isEmpty().trim().withMessage("can not be empty!"),
  check("coin_id").isUUID().trim().withMessage("must be a UUID!"),
];
