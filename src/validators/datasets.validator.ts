import { body, param } from "express-validator";
import { DatasetTypes as Types } from "../types/dataset-types.enum";
import { checkDatasetExistsById } from "../gateways/datasets.gateway";

export const validateDataset = [
  body("name")
    .trim()
    .isString()
    .withMessage("Must be a string")
    .bail()
    .isLength({ min: 1, max: 64 })
    .withMessage("Length should be between 1 - 64")
    .bail(),
  body("type")
    .isIn([Types.CLASSIFICATION, Types.OBJECT_DETECTION])
    .withMessage(
      `Should be ${Types.CLASSIFICATION} or ${Types.OBJECT_DETECTION}`
    )
    .bail(),
];

export const validateDatasetId = param("id")
  .exists()
  .isNumeric()
  .toInt()
  .custom(async (id: number) => {
    const exists = await checkDatasetExistsById(id);
    if (!exists) {
      throw new Error(`Dataset with id ${id} does not exist`);
    }
  });
