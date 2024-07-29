import { body, check } from "express-validator";
import { checkImagesExistByIds } from "../gateways/images.gateway";
import Image from "../database/models/image";
import { checkDatasetsExistByIds } from "../gateways/datasets.gateway";

const checkImagesIdsExist = async (ids: number[]) => {
  const invalidIds = await checkImagesExistByIds(ids);
  if (invalidIds.length) {
    throw new Error(`Images with ids ${invalidIds.join(", ")} do not exist`);
  }
  return true;
};

const checkDatasetIdsExist = async (ids: number[]) => {
  const invalidIds = await checkDatasetsExistByIds(ids);
  if (invalidIds.length) {
    throw new Error(`Datasets with ids ${invalidIds.join(", ")} do not exist`);
  }
  return true;
};

export const validateCreatingImages = [
  check("images.*.datasetId").isNumeric(),
  body("images")
    .exists()
    .isArray()
    .custom(async (images: Image[]) => {
      const ids = images.map((img) => img.datasetId);
      return await checkDatasetIdsExist(ids);
    }),
];

export const validateImageIds = body("ids")
  .exists()
  .isArray()
  .custom(checkImagesIdsExist);

export const validateImagesMetadataBatch = [
  body("images")
    .exists()
    .isArray()
    .withMessage("images must be array")
    .bail()
    .custom(async (images: Image[]) => {
      const ids = images.map((img) => img.id);
      return await checkImagesIdsExist(ids);
    }),
  body("images.*").isObject().withMessage("All images must be objects").bail(),
  check("images.*.metadata")
    .exists()
    .isObject()
    .withMessage("All metadata must be objects")
    .bail()
    .custom((metadata: any) => {
      const keys = Object.keys(metadata);
      if (keys.length !== 1) {
        throw new Error(
          'Metadata should have only 1 property: "class" or "annotations"',
        );
      }

      switch (keys[0]) {
        case "class":
          {
            if (typeof metadata.class !== "string") {
              throw new Error("metadata.class must be string");
            }
          }
          break;
        case "annotations":
          {
            if (!Array.isArray(metadata.annotations)) {
              throw new Error("metadata.annotations must be array");
            }

            for (const annotation of metadata.annotations) {
              if (typeof annotation.class !== "string") {
                throw new Error("annotation.class must be string");
              }
              if (typeof annotation.min !== "object") {
                throw new Error("annotation.min must be object");
              }
              if (typeof annotation.max !== "object") {
                throw new Error("annotation.max must be object");
              }
              if (typeof annotation.min.x !== "number") {
                throw new Error("annotation.min.x must be number");
              }
              if (typeof annotation.min.y !== "number") {
                throw new Error("annotation.min.y must be number");
              }
              if (typeof annotation.max.x !== "number") {
                throw new Error("annotation.max.x must be number");
              }
              if (typeof annotation.max.y !== "number") {
                throw new Error("annotation.max.y must be number");
              }
            }
          }
          break;
        default: {
          throw new Error(`Unknown field ${keys[0]}`);
        }
      }
      return true;
    }),
];
