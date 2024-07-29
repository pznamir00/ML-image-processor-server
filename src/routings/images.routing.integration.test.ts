import express from "express";
import request from "supertest";
import Image from "../database/models/image";
import imagesRouter from "./images.routing";
import Dataset from "../database/models/dataset";
import { DatasetTypes } from "../types/dataset-types.enum";

let savedImages: Image[] = [];
let dataset: Dataset;
let app: express.Express;

describe("images routing integration", () => {
  beforeAll(setupApp);
  beforeEach(setupDB);
  afterEach(tearDownDB);

  describe("create batch", () => {
    it("returns error if datasetId is invalid", async () => {
      const response = await request(app)
        .post("/images/batch/")
        .send({ images: [{ datasetId: -1 }] });
      expect(response.status).toBe(400);
    });

    it("creates images", async () => {
      const response = await request(app)
        .post("/images/batch/")
        .send({ images: [{ datasetId: dataset.id }] });
      expect(response.status).toBe(201);
      const saved = await Image.findOne({ where: { datasetId: dataset.id } });
      expect(saved).toMatchObject({
        name: "123-abc.jpg",
        url: expect.stringContaining("/images/123-abc.jpg"),
        isUploaded: false,
        metadata: null,
        datasetId: dataset.id,
      });
    });

    it("returns newly created images", async () => {
      const response = await request(app)
        .post("/images/batch/")
        .send({ images: [{ datasetId: dataset.id }] });
      expect(response.body).toEqual([
        expect.objectContaining({
          name: "123-abc.jpg",
          url: expect.stringContaining("/images/123-abc.jpg"),
          isUploaded: false,
          metadata: null,
          datasetId: dataset.id,
        }),
      ]);
    });
  });

  describe("update metadata", () => {
    it("updates metadata if payload is valid", async () => {
      const annotations = [
        { class: "cls1", min: { x: 1, y: 2 }, max: { x: 3, y: 4 } },
      ];
      const response = await request(app)
        .put("/images/metadata/batch/")
        .send({
          images: [
            { ...savedImages[0], metadata: { annotations } },
            { ...savedImages[1], metadata: { annotations } },
          ],
        });
      expect(response.status).toEqual(200);
      const images = await Image.findAll();
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveProperty("metadata", { annotations });
      expect(images[1]).toHaveProperty("metadata", { annotations });
    });

    it("does not update metadata if payload is not valid", async () => {
      const annotations = [{ class: "cls1", min: { x: 1, y: 2 } }];
      const response = await request(app)
        .put("/images/metadata/batch/")
        .send({
          images: [
            { ...savedImages[0], metadata: { annotations } },
            { ...savedImages[1], metadata: { annotations } },
          ],
        });
      expect(response.status).toEqual(400);
      const images = await Image.findAll();
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveProperty("metadata", { class: "cls1" });
      expect(images[1]).toHaveProperty("metadata", { class: "cls2" });
    });
  });

  describe("delete batch", () => {
    it("returns error if payload is invalid", async () => {
      const response = await request(app)
        .delete("/images/batch/")
        .send({ ids: [-1, -2] });
      expect(response.status).toEqual(400);
    });

    it("deletes images by ids", async () => {
      const response = await request(app)
        .delete("/images/batch/")
        .send({ ids: [savedImages[0].id, savedImages[1].id] });
      expect(response.status).toEqual(200);
      const remainObjects = await Image.findAll();
      expect(remainObjects).toHaveLength(0);
    });
  });
});

function setupApp() {
  app = express();
  app.use(express.json());
  app.use("/images", imagesRouter);
}

async function setupDB() {
  dataset = await Dataset.create({
    name: "ds",
    type: DatasetTypes.CLASSIFICATION,
  });
  const images = await Image.bulkCreate([
    {
      name: "img1.jpg",
      url: "bucket/images/img1.jpg",
      datasetId: 5,
      metadata: { class: "cls1" },
      isUploaded: false,
    },
    {
      name: "img2.jpg",
      url: "bucket/images/img2.jpg",
      datasetId: 5,
      metadata: { class: "cls2" },
      isUploaded: false,
    },
  ]);
  savedImages = images.map((ds) => ds.toJSON());
}

async function tearDownDB() {
  await Image.truncate();
  await Dataset.truncate();
}

jest.mock("uuid", () => ({ v4: jest.fn().mockReturnValue("123-abc") }));
