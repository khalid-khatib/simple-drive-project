const supertest = require("supertest");
const app = require("../server");
const { v4: uuidv4 } = require("uuid");

jest.mock("../middlewares/authMiddleware", () => (req, res, next) => next());

describe("Integration /v1/blobs", () => {
  it("POST and GET flow", async () => {
    const data = Buffer.from("integ test").toString("base64");
    const id = `test-${uuidv4()}`;

    const post = await supertest(app).post("/v1/blobs").send({ id, data });
    expect(post.status).toBe(201);

    const get = await supertest(app).get(`/v1/blobs/${id}`);
    expect(get.status).toBe(200);
    expect(get.body.id).toBe(id);
    expect(get.body.data).toBe(data);
  });
});
