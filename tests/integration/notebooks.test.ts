import { Server } from "http";
import request from "supertest";
import app from "../..";
import Notebook, { INotebook } from "../../models/notebook";
import User from "../../models/user";

describe("/api/notebooks", () => {
  let server: Server;
  let port: number = 5050;

  const johnDoe = {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "johndoe@gmail.com",
    password: "1wQ@",
  };

  const testUser = new User(johnDoe);
  const token = testUser.generateAuthToken();

  beforeEach(() => {
    server = app.listen(port, () => {});
  });

  afterEach(async () => {
    server.close();

    await Notebook.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all the notebooks that belongs to the current user", async () => {
      await Notebook.collection.insertMany([
        { name: "notebook1", belongsTo: johnDoe.username },
        { name: "notebook2", belongsTo: johnDoe.username },
        { name: "notebook3", belongsTo: "johndoe2" },
      ]);

      const res = await request(app)
        .get("/api/subjects")
        .set("x-auth-token", token);

      expect(res.statusCode).toBe(200);
      expect(
        res.body.some((s: INotebook) => s.name === "notebook1")
      ).toBeTruthy();
      expect(
        res.body.some((s: INotebook) => s.name === "notebook2")
      ).toBeTruthy();
      expect(
        res.body.some((s: INotebook) => s.name === "notebook3")
      ).toBeFalsy();
    });
  });
});
