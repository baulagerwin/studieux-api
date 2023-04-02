import { Express } from "express";
import express from "express";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { testing } from "../routes/testing";
import { auth } from "../routes/auth";
import { users } from "../routes/users";
import { notebooks } from "../routes/notebooks";
import { topics } from "../routes/topics";
import { qnas } from "../routes/qnas";
import { review } from "../routes/review";

export default function (app: Express) {
  app.use(express.json());
  app.use("/api/testing", testing);
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/notebooks", notebooks);
  app.use("/api/topics", topics);
  app.use("/api/qnas", qnas);
  app.use("/api/review", review);
  app.use(asyncErrorHandler);
}
