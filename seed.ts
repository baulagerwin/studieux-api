import User from "./models/user";
import Notebook from "./models/notebook";
import Topic from "./models/topic";
import QNA from "./models/qna";
import mongoose from "mongoose";
import config from "config";
import bcrypt from "bcrypt";

const run = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.get("db"));

  await User.deleteMany({});
  await Notebook.deleteMany({});
  await Topic.deleteMany({});
  await QNA.deleteMany({});

  const salt = bcrypt.genSaltSync();
  const user = await User.create({
    firstName: "test",
    lastName: "user",
    username: "testuser",
    email: "testuser@test.com",
    password: bcrypt.hashSync("password", salt),
  });

  await Promise.all(
    new Array(12).fill(1).map(async (_, i) => {
      return Notebook.create({
        name: `Notebook #${i + 1}`,
        belongsTo: user.username,
      });
    })
  );

  const notebooks = await Notebook.find({});

  for (let notebook of notebooks)
    await Promise.all(
      new Array(12).fill(1).map(async (_, i) => {
        return Topic.create({
          name: `Topic #${i + 1}`,
          notebook: {
            name: notebook.name,
            belongsTo: user.username,
          },
        });
      })
    );

  const topics = await Topic.find({});

  for (let topic of topics)
    await Promise.all(
      new Array(12).fill(1).map(async (_, i) => {
        return QNA.create({
          question: `Question #${i + 1} on ${topic.name}`,
          answer: `Answer #${i + 1} on ${topic.name}`,
          topic: {
            name: topic.name,
            notebook: topic.notebook,
          },
        });
      })
    );

  mongoose.disconnect();

  console.info("Seeding done!");
};

run();
