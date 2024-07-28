import Image from "../database/models/image";

export const createImagesBatch = async (images: Image[]) => {
  return await Image.bulkCreate(images);
};

export const updateImagesBatch = async (images: Image[]) => {
  await Image.bulkCreate(images, { updateOnDuplicate: ["name"] });
};

export const deleteImagesBatch = async (ids: number[]) => {
  await Image.destroy({
    where: { id: ids },
  });
};

/**
 * returns empty array if all ids are correct, if not, invalid ids
 * are in the list
 */
export const checkImagesExistByIds = async (ids: number[]) => {
  const result = await Image.findAll({
    where: { id: ids },
  });
  const resultIds = result.map((i) => i.id);
  return resultIds.filter((id) => !ids.includes(id));
};
