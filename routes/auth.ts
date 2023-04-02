import express, { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import AuthDto from "../dtos/AuthDto";
import User from "../models/user";
import { pick } from "lodash";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  let authDto = req.body as AuthDto;

  const { error } = validate(authDto);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: authDto.username });
  if (!user)
    return res.status(400).send("Bad credentials. Please login again.");

  let isPasswordValid = await bcrypt.compare(authDto.password, user.password);
  if (!isPasswordValid)
    return res.status(400).send("Bad credentials. Please login again.");

  const token = user.generateAuthToken();

  // res
  //   .header("x-auth-token", token)
  //   .header("access-control-expose-headers", "x-auth-token")
  //   .send(pick(user, ["firstName", "lastName", "username", "email"]));
  res.send(token);
});

function validate(usernameAndPassword: AuthDto) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(55).required().label("Username"),
    password: Joi.string().min(2).max(55).required().label("Password"),
  });

  return schema.validate(usernameAndPassword);
}

export const auth = router;
