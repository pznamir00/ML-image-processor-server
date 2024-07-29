import express from "express";
import { throwErrorIfValidationFailed } from "../middlewares/throw-error-if-validation-failed.middleware";
import {
  validateAugmentationIds,
  validateAugmentations,
} from "../validators/augmentations.validator";
import {
  createAugmentationsBatch,
  deleteAugmentationsBatch,
} from "../controllers/augmentations.controller";

const augmentationsRouter = express.Router();

augmentationsRouter.post(
  "/batch/",
  validateAugmentations,
  throwErrorIfValidationFailed,
  createAugmentationsBatch
);

augmentationsRouter.delete(
  "/batch/",
  validateAugmentationIds,
  throwErrorIfValidationFailed,
  deleteAugmentationsBatch
);

export default augmentationsRouter;
