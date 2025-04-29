const request = require("supertest");
const express = require("express");
const bodyParser = require("express").json;
const blobController = require("../controllers/blobController");

jest.mock("../models/blobMeta");
jest.mock("../utils/storageService");

const blobModel = require("../models/blobMeta");
const storageService = require("../utils/storageService");

let app;
beforeAll(() => {
  app = express();
  app.use(bodyParser());
  app.post("/v1/blobs", blobController.uploadBlob);
  app.get("/v1/blobs/:id", blobController.getBlob);
});

describe("uploadBlob", () => {
  test("returns 400 when id or data missing", async () => {
    const res = await request(app).post("/v1/blobs").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/id and data are required/);
  });

  test("returns 400 on invalid base64", async () => {
    const res = await request(app)
      .post("/v1/blobs")
      .send({ id: "abc", data: "not-base64" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid base64 data/);
  });

  test("returns 409 when id exists", async () => {
    blobModel.getMetadata.mockResolvedValue({ id: "abc" });
    const buf = Buffer.from("aGVsbG8=", "base64");
    const res = await request(app)
      .post("/v1/blobs")
      .send({ id: "abc", data: buf.toString("base64") });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/);
  });

  test("saves blob and metadata on valid request", async () => {
    blobModel.getMetadata.mockResolvedValue(null);
    blobModel.insertMetadata.mockResolvedValue();
    storageService.save.mockResolvedValue();

    const data = Buffer.from("hello world").toString("base64");
    const res = await request(app)
      .post("/v1/blobs")
      .send({ id: "new-id", data });

    expect(storageService.save).toHaveBeenCalledWith(
      "new-id",
      expect.any(Buffer)
    );
    expect(blobModel.insertMetadata).toHaveBeenCalledWith(
      "new-id",
      expect.any(Number)
    );
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Blob saved/);
  });
});

describe("getBlob", () => {
  test("returns 404 for missing metadata", async () => {
    blobModel.getMetadata.mockResolvedValue(null);
    const res = await request(app).get("/v1/blobs/missing");
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/Blob not found/);
  });

  test("returns blob data on success", async () => {
    const fakeMeta = { id: "x", size: 11, created_at: new Date() };
    const buf = Buffer.from("hello world");
    blobModel.getMetadata.mockResolvedValue(fakeMeta);
    storageService.retrieve.mockResolvedValue(buf);

    const res = await request(app).get("/v1/blobs/x");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "x", size: 11 });
    expect(res.body.data).toEqual(buf.toString("base64"));
  });
});
