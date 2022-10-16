import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import jwt from "jsonwebtoken";
export const createUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { full_name, email, password } = req.body;
    // check for duplicate user entry
    const userExist = await User.findOne({
      where: { email },
    });
    if (userExist) {
      throw new Error("Err! Account already exist with this email.");
    }
    const hash = await bcrypt.hash(password, 10);

    const user = new User();
    user.full_name = full_name;
    user.email = email;
    user.password = hash;

    user.save();

    return res.status(201).json({
      err: false,
      msg: "User account has been created successfully!",
    });
  } catch (error) {
    return next(error);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("Error! Account does not exist.");
    }
    const matchedPasswod = await bcrypt.compare(password, user.password);
    if (!matchedPasswod) {
      throw new Error("Error! password did not match.");
    }

    //creating json web token
    const jwtPayload = {
      user_id: user.id,
      full_name: user.full_name,
    };
    const token = jwt.sign(jwtPayload, process.env.SECRET as string, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      err: false,
      msg: "Logged in successfully!",
      access_token: token,
    });
  } catch (error) {
    return next(error);
  }
};
