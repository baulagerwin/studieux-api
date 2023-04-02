import express, { Response } from "express";
import NotebookDto from "../dtos/NotebookDto";
import auth, { AuthRequest } from "../middlewares/auth";
import validateObjectId from "../middlewares/validateObjectId";
import Notebook, { validateNotebook } from "../models/notebook";
import QNA from "../models/qna";
import Topic from "../models/topic";
import User from "../models/user";
import NotebooksQto from "../qtos/NotebooksQto";
import notebookLimit from "../middlewares/notebookLimit";

const router = express.Router();

router.post(
  "/",
  [auth, notebookLimit],
  async (req: AuthRequest, res: Response) => {
    const notebookDto = req.body as NotebookDto;

    const { error } = validateNotebook(notebookDto);
    if (error) return res.status(400).send(error.details[0].message);

    let notebook = await Notebook.findOne({
      name: notebookDto.name,
      belongsTo: req.user?.username,
    });
    if (notebook) return res.status(400).send("Notebook already exists.");

    const user = await User.findOne({ username: req.user?.username });
    if (!user) return res.status(404).send("User not found.");

    notebook = new Notebook({
      name: notebookDto.name,
      belongsTo: user.username,
    });

    const result = await notebook.save();
    res.send(result);
  }
);

router.get("/", auth, async (req: AuthRequest, res: Response) => {
  let notebooks;

  let queryQto = req.query as unknown;
  let queries = queryQto as NotebooksQto;

  notebooks = await Notebook.find({
    name: { $regex: new RegExp(queries.q, "i") },
    belongsTo: req.user?.username,
  }).select({ _id: 1, name: 1 });

  res.send(notebooks);
});

router.get(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    const notebook = await Notebook.findById(req.params.id);
    if (!notebook) return res.status(404).send("Notebook not found.");

    res.send(notebook);
  }
);

router.put(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    const notebookDto = req.body as NotebookDto;

    const { error } = validateNotebook(notebookDto);
    if (error) return res.status(400).send(error.details[0].message);

    let notebook = await Notebook.findOne({
      name: notebookDto.name,
      belongsTo: req.user?.username,
    });
    if (notebook) return res.status(400).send("Notebook already exists.");

    notebook = await Notebook.findById(req.params.id);
    if (!notebook) return res.status(404).send("Notebook not found.");

    // Update topics that have this notebook
    await Topic.updateMany(
      {
        "notebook.name": notebook.name,
        "notebook.belongsTo": req.user?.username,
      },
      {
        $set: {
          "notebook.name": notebookDto.name,
          "notebook.belongsTo": req.user?.username,
        },
      }
    );

    // Update qnas that have this notebook
    await QNA.updateMany(
      {
        "topic.notebook.name": notebook.name,
        "topic.notebook.belongsTo": req.user?.username,
      },
      {
        $set: {
          "topic.notebook.name": notebookDto.name,
          "topic.notebook.belongsTo": req.user?.username,
        },
      }
    );

    notebook.name = notebookDto.name;

    const result = await notebook.save();
    res.send(result);
  }
);

router.delete(
  "/:id",
  [validateObjectId, auth],
  async (req: AuthRequest, res: Response) => {
    const notebook = await Notebook.findById(req.params.id);
    if (!notebook) return res.status(404).send("Notebook not found.");

    // Delete those topics that have this subject
    await Topic.deleteMany({
      "notebook.name": notebook.name,
      "notebook.belongsTo": req.user?.username,
    });

    // Delete those qnas that have this notebook
    await QNA.deleteMany({
      "topic.notebook.name": notebook.name,
      "topic.notebook.belongsTo": req.user?.username,
    });

    const result = await Notebook.findByIdAndDelete(req.params.id);
    res.send(result);
  }
);

export const notebooks = router;
