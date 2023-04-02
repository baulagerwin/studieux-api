import mongoose from "mongoose";
import config from "config";
import jwt from "jsonwebtoken";
import UserDto from "../dtos/UserDto";
import Joi from "joi";

export interface JWTPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isSubscribed: string;
}

export interface IUserProperties {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  isSubscribed: boolean;
}

interface IUserMethods {
  generateAuthToken: () => string;
}

const userSchema = new mongoose.Schema<IUserProperties & IUserMethods>({
  firstName: {
    type: String,
    required: true,
    maxLength: 55,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 55,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxLength: 55,
  },
  email: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 55,
  },
  password: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 1024,
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const jwtPayload: JWTPayload = {
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    email: this.email,
    isSubscribed: this.isSubscribed,
  };

  return jwt.sign(jwtPayload, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", userSchema);

export function validateUser(user: UserDto) {
  const schema = Joi.object({
    firstName: Joi.string().max(55).required().label("First Name"),
    lastName: Joi.string().max(55).required().label("Last Name"),
    username: Joi.string().min(6).max(55).required().label("Username"),
    email: Joi.string().min(6).max(55).email().required().label("Email"),
    password: Joi.string().min(2).max(55).required().label("Password"),
  });

  return schema.validate(user);
}

export default User;
