import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import { JWTPayload } from "../models/user";

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export default function (req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied.");

  try {
    const payload = jwt.verify(
      token,
      config.get("jwtPrivateKey")
    ) as JWTPayload;
    req.user = payload;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}
