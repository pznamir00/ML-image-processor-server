import { DataTypes, Model } from "sequelize";
import connection from "../connection";
import { AugmentationAlgorithms } from "types/augmentation-algorithm.enum";
import Dataset from "./dataset";

interface AugmentationAttributes {
  algorithm: AugmentationAlgorithms;
  fromPercentage: number;
  toPercentage: number;
  datasetId: number;
}

class Augmentation
  extends Model<AugmentationAttributes>
  implements AugmentationAttributes
{
  algorithm!: AugmentationAlgorithms;
  fromPercentage!: number;
  toPercentage!: number;
  datasetId!: number;
  readonly id!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

Augmentation.init(
  {
    algorithm: DataTypes.NUMBER,
    fromPercentage: DataTypes.NUMBER,
    toPercentage: DataTypes.NUMBER,
    datasetId: DataTypes.NUMBER,
  },
  {
    sequelize: connection,
    modelName: "Augmentation",
  }
);

export default Augmentation;
