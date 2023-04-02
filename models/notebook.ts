import Joi from "joi";
import mongoose from "mongoose";
import NotebookDto from "../dtos/NotebookDto";

export interface INotebook {
  name: string;
  belongsTo: string;
}

export const notebookSchema = new mongoose.Schema<INotebook>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
  },
  belongsTo: {
    type: String,
    required: true,
  },
});

const Notebook = mongoose.model("Notebook", notebookSchema);

export function validateNotebook(notebook: NotebookDto) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required().label("Name"),
  });

  return schema.validate(notebook);
}

export default Notebook;
