import Joi from "joi";
import mongoose from "mongoose";
import QNADto from "../dtos/QNADto";
import { ITopic, topicSchema } from "./topic";

interface QNA {
  topic: ITopic;
  question: string;
  answer: string;
}

const qnaSchema = new mongoose.Schema<QNA>({
  topic: {
    type: topicSchema,
    required: true,
  },
  question: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 125,
  },
  answer: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 610,
  },
});

const QNA = mongoose.model("QNA", qnaSchema);

export function validateQNA(qna: QNADto) {
  const schema = Joi.object({
    topicId: Joi.string()
      .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
      .messages({
        "string.pattern.base": "Topic ID should be a valid object ID.",
      })
      .required(),
    question: Joi.string().min(5).max(610).required(),
    answer: Joi.string().min(5).max(610).required(),
  });

  return schema.validate(qna);
}

export default QNA;
