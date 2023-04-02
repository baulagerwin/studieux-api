import mongoose from "mongoose";
import config from "config";

const dbUrl = process.env.DB_URL || (config.get("db") as string);

export default function () {
  mongoose.set("strictQuery", false);
  mongoose.connect(dbUrl).then(() => console.info(`Connected to ${dbUrl}...`));
}
