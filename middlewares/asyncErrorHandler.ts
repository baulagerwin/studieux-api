import { Request, Response, NextFunction } from "express";
import winston from "winston";

export default function (
  error: { message: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  const now = new Date();
  const errorWithTimeStamp = {
    message: error.message,
    timestamp: now,
  };

  winston.error(errorWithTimeStamp);

  res.status(500).send("Something went wrong.");
}
