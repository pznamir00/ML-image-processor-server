import express from "express";
import request from "supertest";
import { validationResult } from "express-validator";
import { validateDataset, validateDatasetId } from "./datasets.validator";
import { DatasetTypes } from "../types/dataset-types.enum";
import { checkDatasetExistsById } from "../gateways/datasets.gateway";

describe("datasets validator", () => {
  describe("validateDataset", () => {
    it("should return 400 if name is missing", async () => {
      const { app } = setup(validateDataset);
      const response = await request(app)
        .post("/datasets")
        .send({ type: DatasetTypes.CLASSIFICATION });
      expect(response.status).toBe(400);
    });

    it("should return 400 if name length is out of bounds", async () => {
      const { app } = setup(validateDataset);
      const response = await request(app)
        .post("/datasets")
        .send({ name: "", type: DatasetTypes.CLASSIFICATION });
      expect(response.status).toBe(400);
    });

    it("should return 400 if type is invalid", async () => {
      const { app } = setup(validateDataset);
      const response = await request(app)
        .post("/datasets")
        .send({ name: "Valid Name", type: "invalidType" });
      expect(response.status).toBe(400);
    });

    it("should return 201 if dataset is valid", async () => {
      const { app } = setup(validateDataset);
      const response = await request(app)
        .post("/datasets")
        .send({ name: "Valid Name", type: DatasetTypes.CLASSIFICATION });
      expect(response.status).toBe(201);
    });
  });

  describe("validateDatasetId", () => {
    it("should return 400 if id is not numeric", async () => {
      const { app } = setup(validateDatasetId);
      const response = await request(app).get("/datasets/ppp").send();
      expect(response.status).toBe(400);
    });

    it("should return 400 if id does not exist in db", async () => {
      const { app } = setup(validateDatasetId);
      //@ts-ignore
      checkDatasetExistsById.mockReturnValueOnce(false);
      const response = await request(app).get("/datasets/2137").send();
      expect(response.status).toBe(400);
    });

    it("should return 201 if dataset is valid", async () => {
      const { app } = setup(validateDatasetId);
      const response = await request(app).get("/datasets/15").send();
      expect(response.status).toBe(201);
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
    res.status(201).json({ message: "Dataset is valid" });
  };
  app.post("/datasets", middleware, callback);
  app.get("/datasets/:id", middleware, callback);
  return { app };
}

jest.mock("../gateways/datasets.gateway", () => ({
  checkDatasetExistsById: jest.fn().mockReturnValue(true),
}));
