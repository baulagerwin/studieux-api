import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("<h1>STUDIEUX API IS RUNNING!</h1>");
});

export const testing = router;
