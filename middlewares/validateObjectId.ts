import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export default function(req: Request, res: Response, next: NextFunction) {
  if(!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid ID.")

  next()
}