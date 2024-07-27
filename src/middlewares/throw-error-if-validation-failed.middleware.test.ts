import { validationResult } from "express-validator";
import { DatasetTypes } from "../types/dataset-types.enum";
import { throwErrorIfValidationFailed } from "./throw-error-if-validation-failed.middleware";
import { Request, Response } from "express";

describe("throw error if validation failed middleware", () => {
  describe("throwErrorIfValidationFailed", () => {
    it("returns error if validation did not pass", async () => {
      const { req, res, next } = setup();
      //@ts-ignore
      validationResult.mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [{ error: 1 }, { error: 2 }],
      });
      await throwErrorIfValidationFailed(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        errors: [{ error: 1 }, { error: 2 }],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next() if validation did pass", async () => {
      const { req, res, next } = setup();
      await throwErrorIfValidationFailed(req, res, next);
      expect(next).toHaveBeenCalled();
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
  const next = jest.fn();
  return { req, res, next };
}

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: jest.fn(() => []),
  })),
}));
