import Augmentation from "../database/models/augmentation";
import { body } from "express-validator";
import { checkAugmentationsExistByIds } from "../gateways/augmentations.gateway";
import { checkDatasetsExistByIds } from "../gateways/datasets.gateway";
import { AugmentationAlgorithms } from "../types/augmentation-algorithm.enum";

export const validateAugmentations = [
  body("augmentations")
    .isArray()
    .withMessage("augmentations field must be array"),
  body("augmentations.*")
    .isObject()
    .withMessage("all augmentations must be objects"),
  body("augmentations.*.algorithm")
    .isIn([
      AugmentationAlgorithms.BLUR,
      AugmentationAlgorithms.CROP,
      AugmentationAlgorithms.GRAYSCALE,
      AugmentationAlgorithms.NOISE,
      AugmentationAlgorithms.RANDOM_ROTATION,
    ])
    .withMessage("augmentation.algorithm must be value of 1 - 5"),
  body("augmentations.*.fromPercentage")
    .isFloat()
    .withMessage("augmentation.fromPercentage must be float"),
  body("augmentations.*.toPercentage")
    .isFloat()
    .withMessage("augmentation.toPercentage must be float"),
  body("augmentations.*").custom((augmentation: Augmentation) => {
    if (augmentation.fromPercentage > augmentation.toPercentage) {
      throw new Error("toPercentage must be greater than fromPercentage");
    }
    return true;
  }),
  body("augmentations.*.datasetId")
    .isInt()
    .withMessage("augmentation.datasetId must be integer"),
  body("augmentations").custom(async (augmentations: Augmentation[]) => {
    const ids = augmentations.map((i) => i.datasetId);
    const invalidIds = await checkDatasetsExistByIds(ids);
    if (invalidIds.length) {
      throw new Error(`Datasets with id ${invalidIds.join(", ")} don't exist`);
    }
    return true;
  }),
];

export const validateAugmentationIds = [
  body("ids").isArray().withMessage("ids must be array"),
  body("ids.*").isInt().withMessage("each id must int"),
  body("ids").custom(async (ids) => {
    const invalidIds = await checkAugmentationsExistByIds(ids);
    if (invalidIds.length) {
      throw new Error(
        `Augmentations with ids ${invalidIds.join(", ")} do not exist`
      );
    }
    return true;
  }),
];
