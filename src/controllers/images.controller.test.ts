import * as gateway from "../gateways/images.gateway";
import { Request, Response } from "express";
import {
  createImagesBatch,
  deleteImagesBatch,
  updateImagesBatch,
} from "./images.controller";
import { setDefaultImageProps } from "../utils/images.utils";

describe("datasets controller", () => {
  describe("createImagesBatch", () => {
    it("calls gateway.createImagesBatch", async () => {
      const { req, res } = setup({ images: [{}, {}] });
      await createImagesBatch(req, res);
      expect(gateway.createImagesBatch).toHaveBeenCalled();
    });

    it("calls setDefaultImageProps", async () => {
      const { req, res } = setup({ images: [{ id: 1 }, { id: 2 }] });
      //@ts-ignore
      setDefaultImageProps.mockReset();
      await createImagesBatch(req, res);
      expect(setDefaultImageProps).toHaveBeenCalledTimes(2);
      //@ts-ignore
      expect(setDefaultImageProps.mock.calls[0][0]).toEqual({ id: 1 });
      //@ts-ignore
      expect(setDefaultImageProps.mock.calls[1][0]).toEqual({ id: 2 });
    });

    it("calls send", async () => {
      const { req, res } = setup({ images: [] });
      await createImagesBatch(req, res);
      expect(res.send).toHaveBeenCalledWith([
        { name: "img1.jpg" },
        { name: "img2.jpg" },
      ]);
    });
  });

  describe("updateImagesBatch", () => {
    it("calls gateway.updateImagesBatch", async () => {
      const { req, res } = setup({ images: [{ id: 1 }, { id: 2 }] });
      await updateImagesBatch(req, res);
      expect(gateway.updateImagesBatch).toHaveBeenCalledWith([
        { id: 1 },
        { id: 2 },
      ]);
    });

    it("calls send", async () => {
      const { req, res } = setup({ images: [] });
      await updateImagesBatch(req, res);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe("deleteImagesBatch", () => {
    it("calls gateway.deleteImagesBatch", async () => {
      const { req, res } = setup({ ids: [1, 2, 3] });
      await deleteImagesBatch(req, res);
      expect(gateway.updateImagesBatch).toHaveBeenCalledWith([
        { id: 1 },
        { id: 2 },
      ]);
    });

    it("calls send", async () => {
      const { req, res } = setup({ ids: [] });
      await deleteImagesBatch(req, res);
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

jest.mock("../gateways/images.gateway", () => ({
  createImagesBatch: jest.fn(() => [
    { name: "img1.jpg" },
    { name: "img2.jpg" },
  ]),
  updateImagesBatch: jest.fn(),
  deleteImagesBatch: jest.fn(),
}));
jest.mock("../utils/images.utils", () => ({ setDefaultImageProps: jest.fn() }));
