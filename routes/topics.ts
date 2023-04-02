import express, { Response } from "express";
import TopicDto from "../dtos/TopicDto";
import auth, { AuthRequest } from "../middlewares/auth";
import validateObjectId from "../middlewares/validateObjectId";
import Notebook from "../models/notebook";
import QNA from "../models/qna";
import Topic, { validateTopic } from "../models/topic";
import TopicsQTO from "../qtos/TopicsQto";
import topicsLimit from "../middlewares/topicsLimit";

const router = express.Router();

router.post(
  "/",
  [auth, topicsLimit],
  async (req: AuthRequest, res: Response) => {
    const topicDto = req.body as TopicDto;

    const { error } = validateTopic(topicDto);
    if (error) return res.status(400).send(error.details[0].message);

    const notebook = await Notebook.findById(topicDto.notebookId);
    if (!notebook) return res.status(404).send("Notebook not found.");

    let topic = await Topic.findOne({
      "notebook.name": notebook.name,
      "notebook.belongsTo": notebook.belongsTo,
      name: topicDto.name,
    });

    if (topic) return res.status(400).send("Topic already exists.");

    topic = new Topic({
      notebook: {
        name: notebook.name,
        belongsTo: notebook.belongsTo,
      },
      name: topicDto.name,
    });

    const result = await topic.save();
    res.send(result);
  }
);

router.get("/", auth, async (req: AuthRequest, res: Response) => {
  let queryQto = req.query as unknown;
  let queries = queryQto as TopicsQTO;

  const notebook = await Notebook.findOne({
    _id: queries.notebookId,
  });

  const topics = await Topic.find({
    "notebook.name": notebook?.name,
    "notebook.belongsTo": req.user?.username,
  }).select({ _id: 1, name: 1 });

  res.send(topics);
});

router.get(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).send("Topic not found.");

    res.send(topic);
  }
);

router.put(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    const topicDto = req.body as TopicDto;

    const { error } = validateTopic(topicDto);
    if (error) return res.status(400).send(error.details[0].message);

    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).send("Topic not found.");

    const notebook = await Notebook.findById(topicDto.notebookId);
    if (!notebook) return res.status(404).send("Notebook not found.");

    // Update those qna that has this topic
    await QNA.updateMany(
      {
        "topic.name": topic.name,
        "topic.notebook.name": notebook.name,
        "topic.notebook.belongsTo": req.user?.username,
      },
      {
        $set: {
          "topic.name": topicDto.name,
        },
      }
    );

    topic.set({
      notebook: {
        name: notebook.name,
        belongsTo: notebook.belongsTo,
      },
      name: topicDto.name,
    });

    const result = await topic.save();
    res.send(result);
  }
);

router.delete(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).send("Topic not found.");

    await QNA.deleteMany({
      "topic.name": topic.name,
      "topic.notebook.name": topic.notebook.name,
      "topic.notebook.belongsTo": req.user?.username,
    });

    const result = await Topic.findByIdAndDelete(req.params.id);
    res.send(result);
  }
);

export const topics = router;
