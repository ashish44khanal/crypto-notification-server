import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { User } from "../types/global";

export interface CustomRequest extends Request {
  user: User;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      return next({ code: 401, message: "Auth token is required!" });
    }
    const token = authHeaders.split("Bearer")[1].trim();
    const SECRET: Secret = `${process.env.SECRET}`;
    // console.log("token", token);
    const decoded = jwt.verify(token, SECRET) as User;
    (req as CustomRequest).user = decoded;
    next();
  } catch (error: any) {
    return next({ code: 401, message: error.mesage || "Invalid token" });
  }
};
