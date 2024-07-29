import express from "express";
import datasetsRouter from "./datasets.routing";
import Dataset from "../database/models/dataset";
import { DatasetTypes } from "../types/dataset-types.enum";
import request from "supertest";
import Image from "../database/models/image";
import Augmentation from "../database/models/augmentation";
import { AugmentationAlgorithms } from "../types/augmentation-algorithm.enum";

let savedDatasets: Dataset[] = [];
let app: express.Express;

describe("datasets routing integration", () => {
  beforeAll(setupApp);
  beforeEach(setupDB);
  afterEach(tearDownDB);

  describe("list", () => {
    it("returns datasets list", async () => {
      const response = await request(app).get("/datasets").send();
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          name: "clothing",
          type: "OBJECT_DETECTION",
        }),
        expect.objectContaining({
          name: "cat or dog",
          type: "CLASSIFICATION",
        }),
      ]);
    });
  });

  describe("create", () => {
    it("returns error if payload is not valid", async () => {
      const response = await request(app).post("/datasets").send({
        name: "",
        type: "invalid-type",
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [
          expect.objectContaining({
            msg: "Length should be between 1 - 64",
            path: "name",
          }),
          expect.objectContaining({
            value: "invalid-type",
            msg: "Should be CLASSIFICATION or OBJECT_DETECTION",
          }),
        ],
      });
    });

    it("creates object if payload is valid", async () => {
      const response = await request(app).post("/datasets").send({
        name: "new dataset",
        type: DatasetTypes.OBJECT_DETECTION,
      });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: "new dataset",
          type: DatasetTypes.OBJECT_DETECTION,
        })
      );
    });
  });

  describe("retrieve", () => {
    it("returns error if object does not exist", async () => {
      const response = await request(app).get("/datasets/-1").send();
      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        expect.objectContaining({
          msg: "Dataset with id -1 does not exist",
          path: "id",
        }),
      ]);
    });

    it("returns object if object exists", async () => {
      const response = await request(app)
        .get(`/datasets/${savedDatasets[0].id}`)
        .send();
      expect(response.body).toEqual(
        expect.objectContaining({
          name: savedDatasets[0].name,
          type: savedDatasets[0].type,
          Augmentations: [
            expect.objectContaining({
              algorithm: AugmentationAlgorithms.CROP,
              fromPercentage: 0.1,
              toPercentage: 0.4,
              datasetId: savedDatasets[0].id,
            }),
            expect.objectContaining({
              algorithm: AugmentationAlgorithms.NOISE,
              fromPercentage: 0.44,
              toPercentage: 0.9,
              datasetId: savedDatasets[0].id,
            }),
          ],
          Images: [
            expect.objectContaining({
              name: "img1.jpg",
              url: "bucket/images/img1.jpg",
              datasetId: savedDatasets[0].id,
              metadata: { class: "cls1" },
              isUploaded: false,
            }),
            expect.objectContaining({
              name: "img2.jpg",
              url: "bucket/images/img2.jpg",
              datasetId: savedDatasets[0].id,
              metadata: { class: "cls2" },
              isUploaded: false,
            }),
          ],
        })
      );
      expect(response.status).toBe(200);
    });
  });

  describe("update", () => {
    it("returns error if object does not exist", async () => {
      const response = await request(app).put("/datasets/-1").send({
        name: "name",
        type: DatasetTypes.CLASSIFICATION,
      });
      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        expect.objectContaining({
          msg: "Dataset with id -1 does not exist",
          path: "id",
        }),
      ]);
    });

    it("returns error if payload is not valid", async () => {
      const response = await request(app)
        .put(`/datasets/${savedDatasets[0].id}`)
        .send({
          name: "",
          type: "invalid-type",
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [
          expect.objectContaining({
            msg: "Length should be between 1 - 64",
            path: "name",
          }),
          expect.objectContaining({
            value: "invalid-type",
            msg: "Should be CLASSIFICATION or OBJECT_DETECTION",
          }),
        ],
      });
    });

    it("updates object if payload is valid", async () => {
      const response = await request(app)
        .put(`/datasets/${savedDatasets[0].id}`)
        .send({
          name: "updated",
          type: DatasetTypes.OBJECT_DETECTION,
        });
      expect(response.status).toBe(200);
      const obj = await Dataset.findByPk(savedDatasets[0].id);
      expect(obj?.toJSON().name).toEqual("updated");
    });
  });

  describe("destroy", () => {
    it("returns error if object does not exist", async () => {
      const response = await request(app).delete("/datasets/-1").send();
      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        expect.objectContaining({
          msg: "Dataset with id -1 does not exist",
          path: "id",
        }),
      ]);
    });

    it("deletes object if exists", async () => {
      const response = await request(app)
        .delete(`/datasets/${savedDatasets[0].id}`)
        .send();
      expect(response.status).toBe(200);
      const obj = await Dataset.findByPk(savedDatasets[0].id);
      expect(obj).toBeNull();
    });
  });
});

function setupApp() {
  app = express();
  app.use(express.json());
  app.use("/datasets", datasetsRouter);
}

async function setupDB() {
  const datasets = await Dataset.bulkCreate([
    { name: "clothing", type: DatasetTypes.OBJECT_DETECTION },
    { name: "cat or dog", type: DatasetTypes.CLASSIFICATION },
  ]);
  await Image.bulkCreate([
    {
      name: "img1.jpg",
      url: "bucket/images/img1.jpg",
      datasetId: datasets[0].id,
      metadata: { class: "cls1" },
      isUploaded: false,
    },
    {
      name: "img2.jpg",
      url: "bucket/images/img2.jpg",
      datasetId: datasets[0].id,
      metadata: { class: "cls2" },
      isUploaded: false,
    },
  ]);
  await Augmentation.bulkCreate([
    {
      algorithm: AugmentationAlgorithms.CROP,
      fromPercentage: 0.1,
      toPercentage: 0.4,
      datasetId: datasets[0].id,
    },
    {
      algorithm: AugmentationAlgorithms.NOISE,
      fromPercentage: 0.44,
      toPercentage: 0.9,
      datasetId: datasets[0].id,
    },
  ]);
  savedDatasets = datasets.map((ds) => ds.toJSON());
}

async function tearDownDB() {
  await Dataset.truncate();
  await Image.truncate();
  await Augmentation.truncate();
}
