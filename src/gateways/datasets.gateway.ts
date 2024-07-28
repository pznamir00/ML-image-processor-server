import Augmentation from "../database/models/augmentation";
import Dataset from "../database/models/dataset";

export const findAllDatasets = async () => {
  return await Dataset.findAll({
    include: { model: Augmentation, as: Augmentation.tableName },
  });
};

export const checkDatasetExistsById = async (id: number) => {
  const count = await Dataset.count({ where: { id } });
  return count > 0;
};

/**
 * returns empty array if all ids are correct, if not, invalid ids
 * are in the list
 */
export const checkDatasetsExistByIds = async (ids: number[]) => {
  const result = await Dataset.findAll({
    where: { id: ids },
  });
  const resultIds = result.map((i) => i.id);
  return resultIds.filter((id) => !ids.includes(id));
};

export const findDatasetById = async (id: number) => {
  return await Dataset.findByPk(id, {
    include: { model: Augmentation, as: Augmentation.tableName },
  });
};

export const createDataset = async (data: Dataset) => {
  return await Dataset.create(data);
};

export const updateDatasetById = async (id: number, data: Dataset) => {
  await Dataset.update(data, { where: { id } });
};

export const deleteDatasetById = async (id: number) => {
  await Dataset.destroy({ where: { id } });
};
