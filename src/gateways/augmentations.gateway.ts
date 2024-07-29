import { checkEntitiesExistByIds } from "../utils/gateway.utils";
import Augmentation from "../database/models/augmentation";

export const createAugmentationsBatch = async (
  augmentations: Augmentation[]
) => {
  return await Augmentation.bulkCreate(augmentations);
};

export const checkAugmentationsExistByIds = async (ids: number[]) => {
  return await checkEntitiesExistByIds(Augmentation, ids);
};

export const deleteAugmentationsBatch = async (ids: number[]) => {
  await Augmentation.destroy({
    where: { id: ids },
  });
};
