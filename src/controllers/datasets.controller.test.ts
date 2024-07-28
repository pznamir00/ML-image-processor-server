import * as gateway from "../gateways/datasets.gateway";
import {
  createDataset,
  deleteDataset,
  listDatasets,
  retrieveDataset,
  updateDataset,
} from "./datasets.controller";
import { Request, Response } from "express";
import { DatasetTypes } from "../types/dataset-types.enum";

describe("datasets controller", () => {
  describe("listDatasets", () => {
    it("calls gateway.findAllDatasets", async () => {
      const { req, res } = setup();
      await listDatasets(req, res);
      expect(gateway.findAllDatasets).toHaveBeenCalled();
    });

    it("calls send", async () => {
      const { req, res } = setup();
      await listDatasets(req, res);
      expect(res.send).toHaveBeenCalledWith([{ dataset: 1 }, { dataset: 2 }]);
    });
  });

  describe("createDataset", () => {
    it("calls gateway.createDataset", async () => {
      const { req, res } = setup();
      await createDataset(req, res);
      expect(gateway.createDataset).toHaveBeenCalledWith(req.body);
    });

    it("calls status", async () => {
      const { req, res } = setup();
      await createDataset(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("calls send", async () => {
      const { req, res } = setup();
      await createDataset(req, res);
      expect(res.send).toHaveBeenCalledWith({ dataset: 3 });
    });
  });

  describe("retrieveDataset", () => {
    it("calls gateway.findDatasetById", async () => {
      const { req, res } = setup();
      await retrieveDataset(req, res);
      expect(gateway.findDatasetById).toHaveBeenCalledWith(5);
    });

    it("calls send", async () => {
      const { req, res } = setup();
      await retrieveDataset(req, res);
      expect(res.send).toHaveBeenCalledWith({ dataset: 4 });
    });
  });

  describe("updateDataset", () => {
    it("calls gateway.updateDatasetById", async () => {
      const { req, res } = setup();
      await updateDataset(req, res);
      expect(gateway.updateDatasetById).toHaveBeenCalledWith(5, req.body);
    });

    it("calls send", async () => {
      const { req, res } = setup();
      await updateDataset(req, res);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  describe("deleteDataset", () => {
    it("calls gateway.deleteDatasetById", async () => {
      const { req, res } = setup();
      await deleteDataset(req, res);
      expect(gateway.deleteDatasetById).toHaveBeenCalledWith(5);
    });

    it("calls send", async () => {
      const { req, res } = setup();
      await deleteDataset(req, res);
      expect(res.send).toHaveBeenCalled();
    });
  });
});

function setup() {
  const req = {
    params: { id: 5 },
    body: {
      name: "new dataset",
      type: DatasetTypes.OBJECT_DETECTION,
    },
  } as unknown as Request;
  const res = {} as unknown as Response;
  res.status = jest.fn(() => res);
  res.send = jest.fn();
  return { req, res };
}

jest.mock("../gateways/datasets.gateway", () => ({
  findAllDatasets: jest.fn(() => [{ dataset: 1 }, { dataset: 2 }]),
  createDataset: jest.fn(() => ({ dataset: 3 })),
  findDatasetById: jest.fn(() => ({ dataset: 4 })),
  updateDatasetById: jest.fn(() => ({ dataset: 5 })),
  deleteDatasetById: jest.fn(),
}));
