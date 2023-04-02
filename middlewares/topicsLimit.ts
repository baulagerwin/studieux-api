import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "./auth";
import Topic from "../models/topic";
import TopicDto from "../dtos/TopicDto";
import Notebook from "../models/notebook";

export default async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const topicsLimit = 3;

  const topicDto = req.body as TopicDto;
  const notebook = await Notebook.findById(topicDto.notebookId);

  const topicsCount = await Topic.find({
    "notebook.name": notebook?.name,
    "notebook.belongsTo": user?.username,
  }).count();

  if (topicsCount >= topicsLimit && !user?.isSubscribed)
    return res
      .status(401)
      .send(
        "You have reached the allowable number to proceed. To create more, contact the developer at baulagerwin@gmail.com"
      );

  next();
}
