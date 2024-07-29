import * as gateway from "../gateways/augmentations.gateway";
import { Request, Response } from "express";
import {
  createAugmentationsBatch,
  deleteAugmentationsBatch,
} from "./augmentations.controller";

describe("augmentations controller", () => {
  describe("createAugmentationsBatch", () => {
    it("calls gateway.createAugmentationsBatch", async () => {
      const { req, res } = setup({ augmentations: [{}, {}] });
      await createAugmentationsBatch(req, res);
      expect(gateway.createAugmentationsBatch).toHaveBeenCalledWith([{}, {}]);
    });

    it("calls status and send", async () => {
      const { req, res } = setup({ augmentations: [] });
      await createAugmentationsBatch(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith([
        { algorithm: 2, fromPercentage: 0.1, toPercentage: 0.35, datasetId: 5 },
        { algorithm: 4, fromPercentage: 0.5, toPercentage: 0.8, datasetId: 5 },
      ]);
    });
  });

  describe("deleteAugmentationsBatch", () => {
    it("calls gateway.deleteAugmentationsBatch", async () => {
      const { req, res } = setup({ ids: [1, 2, 3] });
      await deleteAugmentationsBatch(req, res);
      expect(gateway.deleteAugmentationsBatch).toHaveBeenCalledWith([1, 2, 3]);
    });

    it("calls send", async () => {
      const { req, res } = setup({ ids: [] });
      await deleteAugmentationsBatch(req, res);
      expect(res.send).toHaveBeenCalled();
    });
  });
});

function setup(payload: any) {
  const req = { body: payload } as unknown as Request;
  const res = {} as unknown as Response;
  res.status = jest.fn(() => res);
  res.send = jest.fn();
  return { req, res };
}

jest.mock("../gateways/augmentations.gateway", () => ({
  deleteAugmentationsBatch: jest.fn(),
  createAugmentationsBatch: jest.fn(() => [
    { algorithm: 2, fromPercentage: 0.1, toPercentage: 0.35, datasetId: 5 },
    { algorithm: 4, fromPercentage: 0.5, toPercentage: 0.8, datasetId: 5 },
  ]),
}));
