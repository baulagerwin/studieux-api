import Joi from "joi";
import mongoose from "mongoose";
import TopicDto from "../dtos/TopicDto";
import { INotebook, notebookSchema } from "./notebook";

export interface ITopic {
  notebook: INotebook;
  name: string;
}

export const topicSchema = new mongoose.Schema<ITopic>({
  notebook: {
    type: notebookSchema,
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 25,
  },
});

const Topic = mongoose.model("Topic", topicSchema);

export function validateTopic(topic: TopicDto) {
  const schema = Joi.object({
    notebookId: Joi.string()
      .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
      .messages({
        "string.pattern.base": "Notebook ID should be a valid object ID.",
      })
      .required(),
    name: Joi.string().min(2).max(25).required().label("Topic name"),
  });

  return schema.validate(topic);
}

export default Topic;
