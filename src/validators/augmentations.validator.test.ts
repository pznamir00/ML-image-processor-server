import express from "express";
import request from "supertest";
import { validationResult } from "express-validator";
import { checkDatasetsExistByIds } from "../gateways/datasets.gateway";
import {
  validateAugmentationIds,
  validateAugmentations,
} from "./augmentations.validator";
import { checkAugmentationsExistByIds } from "../gateways/augmentations.gateway";

describe("augmentations validator", () => {
  describe("validateAugmentations", () => {
    it("should return 400 if augmentations is missing", async () => {
      const { app } = setup(validateAugmentations);
      const response = await request(app).post("/augmentations").send({});
      expect(response.status).toBe(400);
    });

    it("should return 400 if any augmentation has wrong algorithm", async () => {
      const { app } = setup(validateAugmentations);
      const response = await request(app)
        .post("/augmentations")
        .send({
          augmentations: [
            getAugmentation(),
            { ...getAugmentation(), algorithm: 17 },
          ],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any augmentation is missing any required field", async () => {
      const { app } = setup(validateAugmentations);
      const response = await request(app)
        .post("/augmentations")
        .send({
          augmentations: [
            getAugmentation(),
            { ...getAugmentation(), toPercentage: undefined },
          ],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any augmentation has not existing datasetId", async () => {
      const { app } = setup(validateAugmentations);
      //@ts-ignore
      checkDatasetsExistByIds.mockReturnValueOnce([-1]);
      const response = await request(app)
        .post("/augmentations")
        .send({
          augmentations: [getAugmentation(), getAugmentation()],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any augmentation has wrong values of from-to percentages", async () => {
      const { app } = setup(validateAugmentations);
      //@ts-ignore
      checkDatasetsExistByIds.mockReturnValueOnce([-1]);
      const response = await request(app)
        .post("/augmentations")
        .send({
          augmentations: [
            getAugmentation(),
            {
              ...getAugmentation(),
              fromPercentage: 0.8,
              toPercentage: 0.5,
            },
          ],
        });
      expect(response.status).toBe(400);
    });

    it("should return 200 if dataset is valid", async () => {
      const { app } = setup(validateAugmentations);
      const response = await request(app)
        .post("/augmentations")
        .send({
          augmentations: [getAugmentation(), getAugmentation()],
        });
      expect(response.status).toBe(200);
    });
  });

  describe("validateAugmentationIds", () => {
    it("should return 400 if ids is missing", async () => {
      const { app } = setup(validateAugmentationIds);
      const response = await request(app).post("/augmentations").send({});
      expect(response.status).toBe(400);
    });

    it("should return 400 if any ids is not array", async () => {
      const { app } = setup(validateAugmentationIds);
      const response = await request(app).post("/augmentations").send({
        ids: 123,
      });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any id is not int", async () => {
      const { app } = setup(validateAugmentationIds);
      const response = await request(app)
        .post("/augmentations")
        .send({ ids: ["a", 2, 3] });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any id is does not exist", async () => {
      const { app } = setup(validateAugmentationIds);
      //@ts-ignore
      checkAugmentationsExistByIds.mockReturnValueOnce([-1]);
      const response = await request(app)
        .post("/augmentations")
        .send({ ids: [-1, 2, 3] });
      expect(response.status).toBe(400);
    });

    it("should return 200 if payload is valid", async () => {
      const { app } = setup(validateAugmentationIds);
      const response = await request(app)
        .post("/augmentations")
        .send({ ids: [1, 2, 3] });
      expect(response.status).toBe(200);
    });
  });
});

function setup(middleware: any) {
  const app = express();
  app.use(express.json());
  //@ts-ignore
  const callback = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).json({ message: "Dataset is valid" });
  };
  app.post("/augmentations", middleware, callback);
  return { app };
}

function getAugmentation() {
  return {
    algorithm: 2,
    fromPercentage: 0.2,
    toPercentage: 0.44,
    datasetId: 5,
  };
}

jest.mock("../gateways/augmentations.gateway", () => ({
  checkAugmentationsExistByIds: jest.fn().mockReturnValue([]),
}));
jest.mock("../gateways/datasets.gateway", () => ({
  checkDatasetsExistByIds: jest.fn().mockReturnValue([]),
}));
