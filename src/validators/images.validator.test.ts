import express from "express";
import request from "supertest";
import { validationResult } from "express-validator";
import {
  validateCreatingImages,
  validateImageIds,
  validateImagesMetadataBatch,
} from "./images.validator";
import { checkDatasetsExistByIds } from "../gateways/datasets.gateway";
import { checkImagesExistByIds } from "../gateways/images.gateway";

describe("images validator", () => {
  describe("validateCreatingImages", () => {
    it("should return 400 if images is missing", async () => {
      const { app } = setup(validateCreatingImages);
      const response = await request(app).post("/images").send({});
      expect(response.status).toBe(400);
    });

    it("should return 400 if images is not array", async () => {
      const { app } = setup(validateCreatingImages);
      const response = await request(app).post("/images").send({ images: 123 });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any datasetId is invalid", async () => {
      const { app } = setup(validateCreatingImages);
      //@ts-ignore
      checkDatasetsExistByIds.mockReturnValueOnce([-1]);
      const response = await request(app)
        .post("/images")
        .send({ images: [{ datasetId: -1 }, { datasetId: 5 }] });
      expect(response.status).toBe(400);
    });

    it("should return 200 if payload is valid", async () => {
      const { app } = setup(validateCreatingImages);
      const response = await request(app)
        .post("/images")
        .send({ images: [{ datasetId: 1 }, { datasetId: 5 }] });
      expect(response.status).toBe(200);
    });
  });

  describe("validateImageIds", () => {
    it("should return 400 if ids is missing", async () => {
      const { app } = setup(validateImageIds);
      const response = await request(app).post("/images").send({});
      expect(response.status).toBe(400);
    });

    it("should return 400 if images is not array", async () => {
      const { app } = setup(validateImageIds);
      const response = await request(app).post("/images").send({ ids: 123 });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any image id is invalid", async () => {
      const { app } = setup(validateImageIds);
      //@ts-ignore
      checkImagesExistByIds.mockReturnValueOnce([-1]);
      const response = await request(app)
        .post("/images")
        .send({ ids: [-1, 5] });
      expect(response.status).toBe(400);
    });

    it("should return 200 if payload is valid", async () => {
      const { app } = setup(validateImageIds);
      const response = await request(app)
        .post("/images")
        .send({ ids: [1, 5] });
      expect(response.status).toBe(200);
    });
  });

  describe("validateImagesMetadataBatch", () => {
    it("should return 400 if images is missing", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app).post("/images").send({});
      expect(response.status).toBe(400);
    });

    it("should return 400 if images is not array", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app).post("/images").send({ images: 123 });
      expect(response.status).toBe(400);
    });

    it("should return 400 if images is not array of objects", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({ images: [1, 2, 3] });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any image id is not valid", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      //@ts-ignore
      checkImagesExistByIds.mockReturnValueOnce([-1]);
      const response = await request(app)
        .post("/images")
        .send({ images: [{ id: -1 }, { id: 5 }] });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any metadata is missing", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({
          images: [{ id: 1 }, { id: 5, metadata: { class: "" } }],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any metadata is not object", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({
          images: [
            { id: 1, metadata: { class: "" } },
            { id: 5, metadata: 123 },
          ],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any metadata has wrong key", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({
          images: [{ id: 1, metadata: { invalidKey: "" } }],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any metadata.class is not string", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({
          images: [{ id: 1, metadata: { class: 123 } }],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any metadata.annotations is not array", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({
          images: [{ id: 1, metadata: { annotations: 123 } }],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any metadata.annotations item has invalid format", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({
          images: [{ id: 1, metadata: { annotations: [123, {}] } }],
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 if any metadata has both class and annotations", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({
          images: [
            {
              id: 1,
              metadata: {
                annotations: [
                  { class: "", min: { x: 1, y: 2 }, max: { x: 3, y: 4 } },
                ],
                class: "",
              },
            },
          ],
        });
      expect(response.status).toBe(400);
    });

    it("should return 200 if all images has valid metadata", async () => {
      const { app } = setup(validateImagesMetadataBatch);
      const response = await request(app)
        .post("/images")
        .send({
          images: [
            {
              id: 1,
              metadata: {
                annotations: [
                  {
                    class: "class 1",
                    min: { x: 1, y: 2 },
                    max: { x: 3, y: 4 },
                  },
                ],
              },
            },
            {
              id: 2,
              metadata: {
                class: "class 2",
              },
            },
          ],
        });
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
    res.status(200).json({ message: "Payload is valid" });
  };
  app.post("/images", middleware, callback);
  return { app };
}

jest.mock("../gateways/images.gateway", () => ({
  checkImagesExistByIds: jest.fn().mockReturnValue([]),
}));
jest.mock("../gateways/datasets.gateway", () => ({
  checkDatasetsExistByIds: jest.fn().mockReturnValue([]),
}));
