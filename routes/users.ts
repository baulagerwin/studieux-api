import bcrypt from "bcrypt";
import { pick } from "lodash";
import express, { Request, Response } from "express";
import UserDto from "../dtos/UserDto";
import User, { validateUser } from "../models/user";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  let userDto = req.body as UserDto;

  const { error } = validateUser(userDto);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("Username already exists");

  user = new User(
    pick(userDto, ["firstName", "lastName", "username", "email", "password"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save();

  const token = user.generateAuthToken();

  // res
  //   .header("x-auth-token", token)
  //   .header("access-control-expose-headers", "x-auth-token")
  //   .send(
  //     pick(user, ["firstName", "lastName", "username", "email", "isSubscribed"])
  //   );
  res.send(token);
});

export const users = router;
