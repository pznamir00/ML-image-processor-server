import { Model, ModelStatic } from "sequelize";

/**
 * returns empty array if all ids are correct, if not, invalid ids
 * are in the list
 */
export const checkEntitiesExistByIds = async (
  model: ModelStatic<Model>,
  ids: number[],
) => {
  const result = await model.findAll({
    where: { id: ids },
  });
  const resultIds = result.map((i: any) => i.id);
  return ids.filter((id) => !resultIds.includes(id));
};
