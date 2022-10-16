import { Router } from "express";
import { createUserAccount, userLogin } from "../controllers/user.controller";
import {
  userLoginValidations,
  userRegisterValidation,
} from "../validations/fields.validator";
import validator from "../validations/validator";

export let userRoutes = Router();

userRoutes.post(
  "/register",
  userRegisterValidation,
  validator,
  createUserAccount
);
userRoutes.post("/login", userLoginValidations, validator, userLogin);
