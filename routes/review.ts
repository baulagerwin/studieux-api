import express, { Response } from "express";
import validateObjectId from "../middlewares/validateObjectId";
import Notebook from "../models/notebook";
import QNA from "../models/qna";
import Topic from "../models/topic";
import ReviewQto from "../qtos/ReviewQto";
import { auth } from "./auth";
import { AuthRequest } from "../middlewares/auth";

const router = express.Router();

// req.user not working here???
router.get(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    let queryQto = req.query as unknown;
    let queries = queryQto as ReviewQto;

    // Get the notebook
    const notebook = await Notebook.findById(req.params.id);
    if (!notebook) return res.status(404).send("Notebook not found.");

    // Paginate the topics
    const page = Number(queries.page) - 1;
    const pageSize = Number(queries.pageSize) || 3;
    const skipLength = page * pageSize || 0;

    const count = await Topic.find({
      "notebook.name": notebook?.name,
      "notebook.belongsTo": notebook.belongsTo,
      name: { $regex: new RegExp(queries.q, "i") },
    }).count();

    const topics = await Topic.find({
      "notebook.name": notebook?.name,
      "notebook.belongsTo": notebook.belongsTo,
      name: { $regex: new RegExp(queries.q, "i") },
    })
      .sort({ _id: "asc" })
      .skip(skipLength)
      .limit(pageSize)
      .select({ _id: 1, name: 1 });

    // Query the qnas with the paginated topics
    const qnas = await QNA.find().or([
      {
        "topic.notebook.name": notebook?.name,
        "topic.notebook.belongsTo": notebook.belongsTo,
        "topic.name": topics[0]?.name,
      },
      {
        "topic.notebook.name": notebook?.name,
        "topic.notebook.belongsTo": notebook.belongsTo,
        "topic.name": topics[1]?.name,
      },
      {
        "topic.notebook.name": notebook?.name,
        "topic.notebook.belongsTo": notebook.belongsTo,
        "topic.name": topics[2]?.name,
      },
    ]);

    // Embed the qnas with their respective topic
    const results: { topic: string; qnas: QNA[] }[] = [];

    for (let i = 0; i < topics.length; i++) {
      let result: any = {};

      result.topic = topics[i].name;
      result.qnas = [];

      for (let j = 0; j < qnas.length; j++) {
        if (topics[i].name !== qnas[j].topic.name) continue;

        result.qnas.push(qnas[j]);
      }

      results.push(result);
    }

    res.send({
      count,
      results,
    });
  }
);

export const review = router;
