import express from "express";
import request from "supertest";
import augmentationsRouter from "./augmentations.routing";
import Augmentation from "../database/models/augmentation";
import { AugmentationAlgorithms } from "../types/augmentation-algorithm.enum";
import Dataset from "../database/models/dataset";
import { DatasetTypes } from "../types/dataset-types.enum";

let savedAugmentations: Augmentation[] = [];
let dataset: Dataset;
let app: express.Express;

describe("augmentations routing integration", () => {
  beforeAll(setupApp);
  beforeEach(setupDB);
  afterEach(tearDownDB);

  describe("create batch", () => {
    it("creates augmentations", async () => {
      const newObj = {
        algorithm: AugmentationAlgorithms.RANDOM_ROTATION,
        fromPercentage: 0.35,
        toPercentage: 0.56,
        datasetId: dataset.id,
      };
      const response = await request(app)
        .post("/augmentations/batch/")
        .send({ augmentations: [newObj] });
      expect(response.status).toBe(201);
      const saved = await Augmentation.findOne({
        where: { algorithm: AugmentationAlgorithms.RANDOM_ROTATION },
      });
      expect(saved).toMatchObject(newObj);
    });

    it("returns error if fields are missing", async () => {
      const newObj = {
        algorithm: AugmentationAlgorithms.RANDOM_ROTATION,
        fromPercentage: 0.35,
        datasetId: dataset.id,
      };
      const response = await request(app)
        .post("/augmentations/batch/")
        .send({ augmentations: [newObj] });
      expect(response.status).toEqual(400);
    });

    it("returns error if datasetId is invalid", async () => {
      const newObj = {
        algorithm: AugmentationAlgorithms.RANDOM_ROTATION,
        fromPercentage: 0.35,
        toPercentage: 0.56,
        datasetId: -1,
      };
      const response = await request(app)
        .post("/augmentations/batch/")
        .send({ augmentations: [newObj] });
      expect(response.status).toEqual(400);
    });

    it("returns error if percentages are invalid", async () => {
      const newObj = {
        algorithm: AugmentationAlgorithms.RANDOM_ROTATION,
        fromPercentage: 0.35,
        toPercentage: 0.12,
        datasetId: dataset.id,
      };
      const response = await request(app)
        .post("/augmentations/batch/")
        .send({ augmentations: [newObj] });
      expect(response.status).toEqual(400);
    });

    it("returns newly created augmentations", async () => {
      const newObj = {
        algorithm: AugmentationAlgorithms.RANDOM_ROTATION,
        fromPercentage: 0.35,
        toPercentage: 0.56,
        datasetId: dataset.id,
      };
      const response = await request(app)
        .post("/augmentations/batch/")
        .send({ augmentations: [newObj] });
      expect(response.body).toEqual([expect.objectContaining(newObj)]);
    });
  });

  describe("delete batch", () => {
    it("returns error if payload is invalid", async () => {
      const response = await request(app)
        .delete("/augmentations/batch/")
        .send({ ids: [-1, -2] });
      expect(response.status).toEqual(400);
    });

    it("deletes augmentations by ids", async () => {
      const response = await request(app)
        .delete("/augmentations/batch/")
        .send({ ids: [savedAugmentations[0].id, savedAugmentations[1].id] });
      expect(response.status).toEqual(200);
      const remainObjects = await Augmentation.findAll();
      expect(remainObjects).toHaveLength(0);
    });
  });
});

function setupApp() {
  app = express();
  app.use(express.json());
  app.use("/augmentations", augmentationsRouter);
}

async function setupDB() {
  dataset = await Dataset.create({
    name: "ds",
    type: DatasetTypes.CLASSIFICATION,
  });

  const images = await Augmentation.bulkCreate([
    {
      algorithm: AugmentationAlgorithms.CROP,
      fromPercentage: 0.1,
      toPercentage: 0.4,
      datasetId: 4,
    },
    {
      algorithm: AugmentationAlgorithms.NOISE,
      fromPercentage: 0.44,
      toPercentage: 0.9,
      datasetId: 4,
    },
  ]);
  savedAugmentations = images.map((ds) => ds.toJSON());
}

async function tearDownDB() {
  await Augmentation.truncate();
  await Dataset.truncate();
}

jest.mock("uuid", () => ({ v4: jest.fn().mockReturnValue("123-abc") }));
