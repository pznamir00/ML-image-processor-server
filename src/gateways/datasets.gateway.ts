import Image from "../database/models/image";
import Augmentation from "../database/models/augmentation";
import Dataset from "../database/models/dataset";
import { checkEntitiesExistByIds } from "../utils/gateway.utils";

export const findAllDatasets = async () => {
  return await Dataset.findAll();
};

export const checkDatasetExistsById = async (id: number) => {
  const count = await Dataset.count({ where: { id } });
  return count > 0;
};

export const checkDatasetsExistByIds = async (ids: number[]) => {
  return await checkEntitiesExistByIds(Dataset, ids);
};

export const findDatasetById = async (id: number) => {
  return await Dataset.findByPk(id, {
    include: [
      { model: Augmentation, as: Augmentation.tableName },
      { model: Image, as: Image.tableName },
    ],
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
