import express from "express";
import { throwErrorIfValidationFailed } from "../middlewares/throw-error-if-validation-failed.middleware";
import {
  createImagesBatch,
  deleteImagesBatch,
  updateImagesBatch,
} from "../controllers/images.controller";
import {
  validateCreatingImages,
  validateImageIds,
  validateImagesMetadataBatch,
} from "../validators/images.validator";

const imagesRouter = express.Router();

imagesRouter.post(
  "/batch/",
  validateCreatingImages,
  throwErrorIfValidationFailed,
  createImagesBatch
);

imagesRouter.put(
  "/metadata/batch/",
  validateImagesMetadataBatch,
  throwErrorIfValidationFailed,
  updateImagesBatch
);

imagesRouter.delete(
  "/batch/",
  validateImageIds,
  throwErrorIfValidationFailed,
  deleteImagesBatch
);

export default imagesRouter;
