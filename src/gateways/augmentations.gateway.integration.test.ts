import { AugmentationAlgorithms } from "../types/augmentation-algorithm.enum";
import Augmentation from "../database/models/augmentation";
import {
  checkAugmentationsExistByIds,
  createAugmentationsBatch,
  deleteAugmentationsBatch,
} from "./augmentations.gateway";

let savedAugmentations: Augmentation[] = [];

describe("augmentations gateway", () => {
  beforeEach(setup);
  afterEach(tearDown);

  describe("createAugmentationsBatch", () => {
    it("creates batch augmentations", async () => {
      const obj = {
        algorithm: AugmentationAlgorithms.GRAYSCALE,
        fromPercentage: 0.04,
        toPercentage: 0.11,
        datasetId: 10,
      };
      await createAugmentationsBatch([obj as any]);
      const latestObj = await Augmentation.findOne({
        order: [["id", "DESC"]],
      });
      expect(latestObj).toMatchObject(obj);
    });

    it("returns augmentations", async () => {
      const obj = {
        algorithm: AugmentationAlgorithms.GRAYSCALE,
        fromPercentage: 0.04,
        toPercentage: 0.11,
        datasetId: 10,
      };
      const resp = await createAugmentationsBatch([obj as any]);
      expect(resp).toEqual([expect.objectContaining(obj)]);
    });
  });

  describe("deleteAugmentationsBatch", () => {
    it("deletes batch augmentations", async () => {
      await deleteAugmentationsBatch(savedAugmentations.map((img) => img.id));
      const remainObjects = await Augmentation.findAll();
      expect(remainObjects).toHaveLength(0);
    });
  });

  describe("checkAugmentationsExistByIds", () => {
    it("returns array of not existing ids", async () => {
      const resp = await checkAugmentationsExistByIds([
        -1,
        -2,
        savedAugmentations[0].id,
      ]);
      expect(resp).toEqual([-1, -2]);
    });
  });
});

async function setup() {
  const augmentations = await Augmentation.bulkCreate([
    {
      algorithm: AugmentationAlgorithms.CROP,
      fromPercentage: 0.1,
      toPercentage: 0.4,
      datasetId: 4,
    },
    {
      algorithm: AugmentationAlgorithms.NOISE,
      fromPercentage: 0.44,
      toPercentage: 0.9,
      datasetId: 4,
    },
  ]);
  savedAugmentations = augmentations.map((a) => a.toJSON());
}

async function tearDown() {
  await Augmentation.truncate();
}
