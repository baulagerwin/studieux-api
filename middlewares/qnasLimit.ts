import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "./auth";
import QNA from "../models/qna";
import QNADto from "../dtos/QNADto";
import Topic from "../models/topic";

export default async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const qnasLimit = 50;

  const qnaDto = req.body as QNADto;
  const topic = await Topic.findById(qnaDto.topicId);

  const qnasCount = await QNA.find({
    "topic.name": topic?.name,
    "topic.notebook.belongsTo": user?.username,
  }).count();

  if (qnasCount >= qnasLimit && !user?.isSubscribed)
    return res
      .status(401)
      .send(
        "You have reached the allowable number to proceed. To create more, contact the developer at baulagerwin@gmail.com"
      );

  next();
}
