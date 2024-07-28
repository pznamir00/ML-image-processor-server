import connection from "../database/connection";
import Image from "../database/models/image";

export const createImagesBatch = async (images: Image[]) => {
  return await Image.bulkCreate(images);
};

export const updateImagesBatch = async (images: Image[]) => {
  const transaction = await connection.transaction();
  try {
    for (const image of images) {
      await Image.update(image, { where: { id: image.id }, transaction });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
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
  return ids.filter((id) => !resultIds.includes(id));
};
