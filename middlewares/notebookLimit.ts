import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "./auth";
import Notebook from "../models/notebook";

export default async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const notebookLimit = 5;

  const notebookCount = await Notebook.find({
    belongsTo: user?.username,
  }).count();

  if (notebookCount >= notebookLimit && !user?.isSubscribed)
    return res
      .status(401)
      .send(
        "You have reached the allowable number to proceed. To create more, contact the developer at baulagerwin@gmail.com"
      );

  next();
}
