import express, { Response } from "express";
import QNADto from "../dtos/QNADto";
import auth, { AuthRequest } from "../middlewares/auth";
import validateObjectId from "../middlewares/validateObjectId";
import Notebook from "../models/notebook";
import QNA, { validateQNA } from "../models/qna";
import Topic from "../models/topic";
import QNASQto from "../qtos/QNASQto";
import qnasLimit from "../middlewares/qnasLimit";

const router = express.Router();

router.post("/", [auth, qnasLimit], async (req: AuthRequest, res: Response) => {
  const qnaDto = req.body as QNADto;

  const { error } = validateQNA(qnaDto);
  if (error) return res.status(400).send(error.details[0].message);

  const topic = await Topic.findById(qnaDto.topicId);
  if (!topic) return res.status(404).send("Topic not found.");

  const qna = new QNA({
    topic: {
      notebook: {
        name: topic.notebook.name,
        belongsTo: topic.notebook.belongsTo,
      },
      name: topic.name,
    },
    question: qnaDto.question,
    answer: qnaDto.answer,
  });

  const result = await qna.save();
  res.send(result);
});

router.get("/", auth, async (req: AuthRequest, res: Response) => {
  let queryQto = req.query as unknown;
  let queries = queryQto as QNASQto;

  const notebook = await Notebook.findOne({
    _id: queries.notebookId,
  });

  const count = await QNA.find({
    "topic.notebook.name": notebook?.name,
    "topic.notebook.belongsTo": req.user?.username,
    "topic.name": { $regex: new RegExp(queries.filterBy, "i") },
    question: { $regex: new RegExp(queries.q, "i") },
  }).count();

  const page = Number(queries.page) - 1;
  const pageSize = Number(queries.pageSize) || 5;
  const skipLength = page * pageSize || 0;

  const results = await QNA.find({
    "topic.notebook.name": notebook?.name,
    "topic.notebook.belongsTo": req.user?.username,
    "topic.name": { $regex: new RegExp(queries.filterBy, "i") },
    question: { $regex: new RegExp(queries.q, "i") },
  })
    .collation({ locale: "en" })
    .sort(getSorter(queries.sortBy))
    .skip(skipLength)
    .limit(pageSize);

  res.send({
    count,
    results,
  });
});

router.get("/:id", auth, async (req: AuthRequest, res: Response) => {
  const qna = await QNA.findById(req.params.id);
  if (!qna) return res.status(404).send("QNA not found.");

  res.send(qna);
});

router.put(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    const qnaDto = req.body as QNADto;

    const { error } = validateQNA(qnaDto);
    if (error) return res.status(400).send(error.details[0].message);

    const qna = await QNA.findById(req.params.id);
    if (!qna) return res.status(404).send("QNA not found.");

    const topic = await Topic.findById(qnaDto.topicId);
    if (!topic) return res.status(404).send("Topic not found.");

    qna.set({
      topic: {
        notebook: {
          name: topic.notebook.name,
          belongsTo: topic.notebook.belongsTo,
        },
        name: topic.name,
      },
      question: qnaDto.question,
      answer: qnaDto.answer,
    });

    const result = await qna.save();
    res.send(result);
  }
);

router.delete(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    const qna = await QNA.findById(req.params.id);
    if (!qna) return res.status(404).send("QNA not found.");

    const result = await QNA.findByIdAndDelete(req.params.id);
    res.send(result);
  }
);

function getSorter(queryString: string): {} {
  if (!queryString) return { question: "asc" };
  if (queryString === "Z - A") return { question: "desc" };
  if (queryString === "Newest") return { _id: "desc" };
  if (queryString === "Oldest") return { _id: "asc" };
  return {};
}

export const qnas = router;
