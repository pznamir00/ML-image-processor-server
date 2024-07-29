import connection from "../../database/connection";
import { DataTypes, Model } from "sequelize";

interface ImageAttributes {
  id?: number;
  name: string;
  url: string | null;
  isUploaded: boolean;
  datasetId: number;
  metadata: object | null;
}

class Image extends Model<ImageAttributes> implements ImageAttributes {
  name!: string;
  url!: string | null;
  isUploaded!: boolean;
  datasetId!: number;
  metadata!: object | null;
  readonly id!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

Image.init(
  {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    isUploaded: DataTypes.BOOLEAN,
    datasetId: DataTypes.NUMBER,
    metadata: DataTypes.JSON,
  },
  {
    sequelize: connection,
    modelName: "Image",
  },
);

export default Image;
