import Augmentation from "../database/models/augmentation";

export const createAugmentationsBatch = async (
  augmentations: Augmentation[]
) => {
  return await Augmentation.bulkCreate(augmentations);
};

/**
 * returns empty array if all ids are correct, if not, invalid ids
 * are in the list
 */
export const checkAugmentationsExistByIds = async (ids: number[]) => {
  const result = await Augmentation.findAll({
    where: { id: ids },
  });
  const resultIds = result.map((i) => i.id);
  return ids.filter((id) => !resultIds.includes(id));
};

export const deleteAugmentationsBatch = async (ids: number[]) => {
  await Augmentation.destroy({
    where: { id: ids },
  });
};
