import {
  validateDataset,
  validateDatasetId,
} from "../validators/datasets.validator";
import express from "express";
import {
  createDataset,
  deleteDataset,
  listDatasets,
  retrieveDataset,
  updateDataset,
} from "../controllers/datasets.controller";
import { throwErrorIfValidationFailed } from "../middlewares/throw-error-if-validation-failed.middleware";

const datasetsRouter = express.Router();

datasetsRouter.get("/", listDatasets);

datasetsRouter.post(
  "/",
  validateDataset,
  throwErrorIfValidationFailed,
  createDataset,
);

datasetsRouter.get(
  "/:id",
  validateDatasetId,
  throwErrorIfValidationFailed,
  retrieveDataset,
);

datasetsRouter.put(
  "/:id",
  validateDatasetId,
  validateDataset,
  throwErrorIfValidationFailed,
  updateDataset,
);

datasetsRouter.delete(
  "/:id",
  validateDatasetId,
  throwErrorIfValidationFailed,
  deleteDataset,
);

export default datasetsRouter;
