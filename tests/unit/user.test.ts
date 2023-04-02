import User from "../../models/user";
import jwt from "jsonwebtoken";
import config from "config";

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const johnDoe = {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "johndoe@gmail.com",
      password: "johndoe123",
    };

    const user = new User(johnDoe);
    const token = user.generateAuthToken();
    const payload = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(payload).toMatchObject(johnDoe);
  });
});
