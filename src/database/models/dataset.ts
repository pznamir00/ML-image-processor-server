import { DataTypes, Model } from "sequelize";
import connection from "../connection";
import { DatasetTypes } from "../../types/dataset-types.enum";
import Augmentation from "./augmentation";
import Image from "./image";

interface DatasetAttributes {
  id?: number;
  name: string;
  type: DatasetTypes;
}

class Dataset extends Model<DatasetAttributes> implements DatasetAttributes {
  name!: string;
  type!: DatasetTypes;
  readonly id!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

Dataset.init(
  {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
  },
  {
    sequelize: connection,
    modelName: "Dataset",
  }
);

Dataset.hasMany(Augmentation, {
  foreignKey: "datasetId",
});

Dataset.hasMany(Image, {
  foreignKey: "datasetId",
});

export default Dataset;
